import os, json, pickle, warnings
import numpy as np, pandas as pd
from tqdm import tqdm
import torch, torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torch.cuda.amp import autocast
from sklearn.preprocessing import StandardScaler, LabelEncoder
warnings.filterwarnings("ignore")

CONFIG_FILE = "config.json"
CKPT_FILE   = "encoders/best_transformer_mtl.pth"
ENC_PROD    = "encoders/product_encoder.pkl"
ENC_ZONE    = "encoders/zone_encoder.pkl"
SCALER_FILE = "encoders/scaler.pkl"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🖥️  Device: {DEVICE} ({torch.cuda.get_device_name(0) if DEVICE.type=='cuda' else 'CPU'})")

# ---------------------------------------------------------------------------------
# 1. ------------------------------ UTIL ------------------------------------------------
def load_pickle(path): return pickle.load(open(path,"rb")) if os.path.exists(path) else None
def save_pickle(obj, path): pickle.dump(obj, open(path,"wb"))

# ---------------------------------------------------------------------------------
# 2. ------------------------------ DATA -----------------------------------------------
class DemandDataset(Dataset):
    def __init__(self, X,yq,yc,yz):
        self.X=torch.tensor(X,dtype=torch.float32)
        self.yq=torch.tensor(yq,dtype=torch.float32)
        self.yc=torch.tensor(yc,dtype=torch.long)
        self.yz=torch.tensor(yz,dtype=torch.long)
    def __len__(self): return len(self.X)
    def __getitem__(self,i): return self.X[i],self.yq[i],self.yc[i],self.yz[i]

# ---------------------------------------------------------------------------------
# 3. ------------------------------ MODEL ---------------------------------------------
class MultiTaskTransformer(nn.Module):
    def __init__(self, n_cat, n_zone, cfg):
        super().__init__()
        d_model=cfg["d_model"]
        self.seq_len=cfg["seq_len"]
        self.in_proj=nn.Linear(len(cfg["features"]),d_model)
        self.pos_emb=nn.Parameter(torch.randn(self.seq_len,d_model)*0.02)
        self.cat_emb=nn.Embedding(n_cat,d_model)
        self.zone_emb=nn.Embedding(n_zone,d_model)
        enc_layer=nn.TransformerEncoderLayer(d_model,cfg["nhead"],
                                             4*d_model,0.1,
                                             batch_first=True,
                                             norm_first=True)
        self.encoder=nn.TransformerEncoder(enc_layer,cfg["num_layers"])
        self.head_q=nn.Sequential(nn.Linear(d_model,d_model//2),nn.ReLU(),
                                  nn.Linear(d_model//2,1))
        self.head_c=nn.Linear(d_model,n_cat)
        self.head_z=nn.Linear(d_model,n_zone)
    def forward(self,x,cat_id,zone_id):
        h=self.in_proj(x)+self.pos_emb[:x.size(1)]
        h=self.encoder(h)[:, -1]
        h=h+self.cat_emb(cat_id)+self.zone_emb(zone_id)
        return (self.head_q(h).squeeze(1),
                self.head_c(h),
                self.head_z(h))

# ---------------------------------------------------------------------------------
# 4. ------------------------------ PREP SEQUENCES ---------------------------------
def prepare_sequences(csv_path,cfg,prod_enc,zone_enc,scaler):
    df=pd.read_csv(csv_path,parse_dates=["heure_commande"])
    df=df[df.statut_commande=="Livrée"].copy()
    df["date"]=df.heure_commande.dt.date
    daily=(df.groupby(["date","produit_categorie","zone_livraison"])
             .agg(quantite_totale=("quantite","sum"),
                  nb_commandes=("commande_id","count"))
             .reset_index())

    # encoders --------------------------------------------------
    if prod_enc is None or zone_enc is None:
        print("ℹ️  Encoders manquants – refit")
        prod_enc=LabelEncoder().fit(daily.produit_categorie)
        zone_enc=LabelEncoder().fit(daily.zone_livraison)
        save_pickle(prod_enc,ENC_PROD); save_pickle(zone_enc,ENC_ZONE)

    # nouvelles classes ? -> refit
    if set(daily.produit_categorie.unique())-set(prod_enc.classes_) \
       or set(daily.zone_livraison.unique())-set(zone_enc.classes_):
        print("ℹ️  Nouvelles catégories détectées – refit encoders")
        prod_enc=LabelEncoder().fit(daily.produit_categorie)
        zone_enc=LabelEncoder().fit(daily.zone_livraison)
        save_pickle(prod_enc,ENC_PROD); save_pickle(zone_enc,ENC_ZONE)

    daily["prod_id"]=prod_enc.transform(daily.produit_categorie)
    daily["zone_id"]=zone_enc.transform(daily.zone_livraison)

    # features temporelles
    daily["dow"]=pd.to_datetime(daily.date).dt.dayofweek
    daily["mois"]=pd.to_datetime(daily.date).dt.month
    daily["is_weekend"]=(daily.dow>=5).astype(int)

    # scaler ----------------------------------------------------
    if scaler is None or getattr(scaler,"n_features_in_",0)!=len(cfg["features"]):
        print("ℹ️  Scaler manquant/incompatible – refit")
        scaler=StandardScaler().fit(daily[cfg["features"]])
        save_pickle(scaler,SCALER_FILE)
    try:
        daily[cfg["features"]]=scaler.transform(daily[cfg["features"]])
    except ValueError:
        print("ℹ️  Scaler incompatible – refit")
        scaler=StandardScaler().fit(daily[cfg["features"]])
        save_pickle(scaler,SCALER_FILE)
        daily[cfg["features"]]=scaler.transform(daily[cfg["features"]])

    # séquences
    X,yq,yc,yz=[],[],[],[]
    S=cfg["seq_len"]
    for (cat,zone),grp in daily.groupby(["prod_id","zone_id"]):
        grp=grp.sort_values("date").reset_index(drop=True)
        for i in range(len(grp)-S):
            X.append(grp.iloc[i:i+S][cfg["features"]].values)
            tgt=grp.iloc[i+S]
            yq.append(tgt.quantite_totale)
            yc.append(tgt.prod_id); yz.append(tgt.zone_id)
    return np.array(X),np.array(yq),np.array(yc),np.array(yz)

# ---------------------------------------------------------------------------------
# 5. ------------------------------ INFERENCE LOOP ---------------------------------
def inference(csv_path):
    # Load config + preproc objets
    assert os.path.exists(CONFIG_FILE),"config.json manquant"
    cfg=json.load(open(CONFIG_FILE))
    prod_enc=load_pickle(ENC_PROD)
    zone_enc=load_pickle(ENC_ZONE)
    scaler  =load_pickle(SCALER_FILE)

    X,yq,yc,yz=prepare_sequences(csv_path,cfg,prod_enc,zone_enc,scaler)
    dl=DataLoader(DemandDataset(X,yq,yc,yz),batch_size=cfg["batch_size"])
    model=MultiTaskTransformer(len(load_pickle(ENC_PROD).classes_),
                               len(load_pickle(ENC_ZONE).classes_), cfg).to(DEVICE)
    model.load_state_dict(torch.load(CKPT_FILE,map_location=DEVICE))
    model.eval()

    lw_q,lw_c=cfg["loss_weights"]["quant"],cfg["loss_weights"]["class"]
    thresh   =cfg["reward_thresh"]

    success=tot=0
    pbar=tqdm(dl,unit="batch",dynamic_ncols=True,desc="🔍 Inférence")
    with torch.no_grad():
        for xb,yqb,ycb,yzb in pbar:
            xb,yqb,ycb,yzb=(t.to(DEVICE) for t in (xb,yqb,ycb,yzb))
            with autocast(enabled=DEVICE.type=="cuda"):
                qp,cp,zp=model(xb,ycb,yzb)
            reward =(lw_q*(1-(qp-yqb).abs()/(yqb+1e-3)>0.3) +
                     lw_c*(cp.argmax(1)==ycb) +
                     lw_c*(zp.argmax(1)==yzb))
            success += (reward>thresh).sum().item()
            tot     += xb.size(0)
            rate=pbar.format_dict.get("rate")
            pbar.set_postfix({
                "it/s": f"{rate:.1f}" if rate else "–",
                "succès%": f"{100*success/tot:5.2f}"
            })
    print(f"\n🎯 Score global de réussite : {100*success/tot:.2f}%")

# ---------------------------------------------------------------------------------
# 6. ------------------------------ MAIN -------------------------------------------
if __name__=="__main__":
    import argparse
    p=argparse.ArgumentParser()
    p.add_argument("--csv",default="data.csv",help="Fichier de données à inférer")
    args=p.parse_args()
    inference(args.csv)
