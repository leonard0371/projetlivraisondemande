#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
train.py – Entraînement Transformer multi-tâches + export config.json
"""

import os, json, argparse, random, pickle, warnings
from pathlib import Path
import numpy as np, pandas as pd
from tqdm import tqdm
import torch, torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torch.cuda.amp import GradScaler, autocast
from sklearn.preprocessing import StandardScaler, LabelEncoder
warnings.filterwarnings("ignore")

# 0----- CONSTS ------------------------------------------------------------
CONFIG_FILE = "config.json"
CKPT_FILE   = "encoders/best_transformer_mtl.pth"
ENC_PROD    = "encoders/product_encoder.pkl"
ENC_ZONE    = "encoders/zone_encoder.pkl"
SCALER_FILE = "encoders/scaler.pkl"

DEFAULT_CONFIG = {
    "csv_path"   : "data.csv",
    "seq_len"    : 14,
    "features"   : ["quantite_totale","nb_commandes","dow","mois","is_weekend"],

    "d_model"    : 256,
    "nhead"      : 8,
    "num_layers" : 6,

    "batch_size" : 512,
    "epochs"     : 100,
    "lr"         : 2e-4,
    "max_lr"     : 1e-3,
    "patience"   : 10,

    "loss_weights": {"quant":0.6, "class":0.2},
    "reward_thresh": 0.7
}

SEED = 42
torch.manual_seed(SEED); random.seed(SEED); np.random.seed(SEED)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🖥️  Device: {DEVICE} ({torch.cuda.get_device_name(0) if DEVICE.type=='cuda' else 'CPU'})")

# -------------------------------------------------------------------------
# utilitaires pickle
def save_pkl(obj, path): pickle.dump(obj, open(path,"wb"))
# -------------------------------------------------------------------------
# Dataset
class DemandDataset(Dataset):
    def __init__(self, X,yq,yc,yz):
        self.X  = torch.tensor(X ,dtype=torch.float32)
        self.yq = torch.tensor(yq,dtype=torch.float32)
        self.yc = torch.tensor(yc,dtype=torch.long)
        self.yz = torch.tensor(yz,dtype=torch.long)
    def __len__(self): return len(self.X)
    def __getitem__(self,i): return self.X[i],self.yq[i],self.yc[i],self.yz[i]

# -------------------------------------------------------------------------
# Modèle
class MultiTaskTransformer(nn.Module):
    def __init__(self,n_cat,n_zone,cfg):
        super().__init__()
        d=cfg["d_model"]; S=cfg["seq_len"]; f=len(cfg["features"])
        self.in_proj = nn.Linear(f,d)
        self.pos_emb = nn.Parameter(torch.randn(S,d)*0.02)
        self.cat_emb  = nn.Embedding(n_cat,d)
        self.zone_emb = nn.Embedding(n_zone,d)
        enc_layer = nn.TransformerEncoderLayer(d,cfg["nhead"],4*d,0.1,
                                               batch_first=True,norm_first=True)
        self.encoder = nn.TransformerEncoder(enc_layer,cfg["num_layers"])
        self.head_q = nn.Sequential(nn.Linear(d,d//2),nn.ReLU(),nn.Linear(d//2,1))
        self.head_c = nn.Linear(d,n_cat)
        self.head_z = nn.Linear(d,n_zone)
    def forward(self,x,cat_id,zone_id):
        h=self.in_proj(x)+self.pos_emb[:x.size(1)]
        h=self.encoder(h)[:,-1]
        h=h+self.cat_emb(cat_id)+self.zone_emb(zone_id)
        return (self.head_q(h).squeeze(1), self.head_c(h), self.head_z(h))

# -------------------------------------------------------------------------
def build_datasets(cfg):
    df = pd.read_csv(cfg["csv_path"], parse_dates=["heure_commande"])
    df = df[df.statut_commande=="Livrée"].copy()
    df["date"] = df.heure_commande.dt.date

    daily = (df.groupby(["date","produit_categorie","zone_livraison"])
               .agg(quantite_totale=("quantite","sum"),
                    nb_commandes=("commande_id","count"))
               .reset_index())

    # encoders & scaler
    prod_enc = LabelEncoder().fit(daily.produit_categorie)
    zone_enc = LabelEncoder().fit(daily.zone_livraison)
    scaler   = StandardScaler()

    # features temporelles
    daily["dow"]        = pd.to_datetime(daily.date).dt.dayofweek
    daily["mois"]       = pd.to_datetime(daily.date).dt.month
    daily["is_weekend"] = (daily.dow>=5).astype(int)

    daily[cfg["features"]] = scaler.fit_transform(daily[cfg["features"]])

    daily["prod_id"] = prod_enc.transform(daily.produit_categorie)
    daily["zone_id"] = zone_enc.transform(daily.zone_livraison)

    # séquences
    X,yq,yc,yz=[],[],[],[]
    S=cfg["seq_len"]
    for (cat,zone),grp in daily.groupby(["prod_id","zone_id"]):
        grp=grp.sort_values("date").reset_index(drop=True)
        for i in range(len(grp)-S):
            X.append(grp.iloc[i:i+S][cfg["features"]].values)
            t=grp.iloc[i+S]
            yq.append(t.quantite_totale); yc.append(t.prod_id); yz.append(t.zone_id)
    X,yq,yc,yz = map(np.array,(X,yq,yc,yz))

    # splits
    s1,s2 = int(0.7*len(X)), int(0.85*len(X))
    datasets = {
        "train": DemandDataset(X[:s1],    yq[:s1],    yc[:s1],    yz[:s1]),
        "val"  : DemandDataset(X[s1:s2],  yq[s1:s2],  yc[s1:s2],  yz[s1:s2]),
        "test" : DemandDataset(X[s2:],    yq[s2:],    yc[s2:],    yz[s2:])
    }
    return datasets, prod_enc, zone_enc, scaler

# -------------------------------------------------------------------------
def train(cfg):
    data, prod_enc, zone_enc, scaler = build_datasets(cfg)
    dl_train = DataLoader(data["train"], batch_size=cfg["batch_size"], shuffle=True)
    dl_val   = DataLoader(data["val"], batch_size=cfg["batch_size"]*2)

    model = MultiTaskTransformer(len(prod_enc.classes_), len(zone_enc.classes_), cfg).to(DEVICE)
    opt   = torch.optim.AdamW(model.parameters(), lr=cfg["lr"], weight_decay=1e-4)
    steps_per_epoch = max(1, len(dl_train))
    sched = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=cfg["max_lr"],
                                                steps_per_epoch=steps_per_epoch,
                                                epochs=cfg["epochs"])
    huber = nn.HuberLoss(); ce = nn.CrossEntropyLoss()
    scaler_amp = GradScaler()
    best, patience = 0, 0
    lw_q,lw_c = cfg["loss_weights"]["quant"], cfg["loss_weights"]["class"]

    for epoch in range(1,cfg["epochs"]+1):
        model.train(); epoch_losses=[]
        for xb,yq,yc,yz in dl_train:
            xb,yq,yc,yz = (t.to(DEVICE) for t in (xb,yq,yc,yz))
            opt.zero_grad()
            with autocast():
                qp,cp,zp = model(xb,yc,yz)
                loss = (lw_q*huber(qp,yq) +
                        lw_c*ce(cp,yc) +
                        lw_c*ce(zp,yz))
            scaler_amp.scale(loss).backward()
            scaler_amp.unscale_(opt)
            torch.nn.utils.clip_grad_norm_(model.parameters(),1.)
            scaler_amp.step(opt); scaler_amp.update(); sched.step()
            epoch_losses.append(loss.item())

        # validation
        model.eval(); success=tot=0
        with torch.no_grad():
            for xb,yq,yc,yz in dl_val:
                xb,yq,yc,yz = (t.to(DEVICE) for t in (xb,yq,yc,yz))
                qp,cp,zp = model(xb,yc,yz)
                reward = (lw_q*(1-(qp-yq).abs()/(yq+1e-3) > 0.3) +
                          lw_c*(cp.argmax(1)==yc) +
                          lw_c*(zp.argmax(1)==yz))
                success += (reward>cfg["reward_thresh"]).sum().item()
                tot     += xb.size(0)
        val_score = 100*success/tot
        print(f"Epoch {epoch:03d} | loss {np.mean(epoch_losses):.4f} | val {val_score:.2f}%")

        if val_score>best:
            best=val_score; patience=0
            torch.save(model.state_dict(), CKPT_FILE)
            print(f"  💾 checkpoint sauvegardé ({best:.2f}%)")
        else:
            patience+=1
            if patience>=cfg["patience"]:
                print("⏹️  Early stop"); break

    # save preprocessing + config
    save_pkl(prod_enc, ENC_PROD); save_pkl(zone_enc, ENC_ZONE); save_pkl(scaler, SCALER_FILE)
    json.dump(cfg, open(CONFIG_FILE,"w"), indent=2)
    print("✅ Entraînement terminé – fichiers sauvegardés")

# -------------------------------------------------------------------------
if __name__=="__main__":
    p=argparse.ArgumentParser()
    p.add_argument("--override",nargs="*",default=[],help="key=value pour écraser un paramètre")
    args=p.parse_args()
    cfg = DEFAULT_CONFIG.copy()
    for kv in args.override:
        k,v = kv.split("=")
        if v.isdigit(): v=int(v)
        elif v.replace(".","",1).isdigit(): v=float(v)
        elif v.lower() in {"true","false"}: v = v.lower()=="true"
        cfg[k]=v
    train(cfg)
