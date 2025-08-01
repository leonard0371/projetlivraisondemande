import os, json, pickle, warnings
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from sklearn.preprocessing import LabelEncoder, StandardScaler
from torch.utils.data import Dataset, DataLoader
from torch.cuda.amp import autocast

warnings.filterwarnings("ignore")

# -------------------- Config & fichiers --------------------
CONFIG_FILE = "config.json"
CKPT_FILE   = "encoders/best_transformer_mtl.pth"
ENC_PROD    = "encoders/product_encoder.pkl"
ENC_ZONE    = "encoders/zone_encoder.pkl"
SCALER_FILE = "encoders/scaler.pkl"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🖥️  Device: {DEVICE} ({torch.cuda.get_device_name(0) if DEVICE.type == 'cuda' else 'CPU'})")

# -------------------- Utils --------------------
def load_pickle(path): return pickle.load(open(path, "rb")) if os.path.exists(path) else None
def save_pickle(obj, path): pickle.dump(obj, open(path, "wb"))

# -------------------- Dataset --------------------
class DemandDataset(Dataset):
    def __init__(self, X, yq, yc, yz):
        self.X  = torch.tensor(X, dtype=torch.float32)
        self.yq = torch.tensor(yq, dtype=torch.float32)
        self.yc = torch.tensor(yc, dtype=torch.long)
        self.yz = torch.tensor(yz, dtype=torch.long)
    def __len__(self): return len(self.X)
    def __getitem__(self, i): return self.X[i], self.yq[i], self.yc[i], self.yz[i]

# -------------------- Modèle --------------------
class MultiTaskTransformer(nn.Module):
    def __init__(self, n_cat, n_zone, cfg):
        super().__init__()
        d_model = cfg["d_model"]
        self.seq_len = cfg["seq_len"]
        self.in_proj = nn.Linear(len(cfg["features"]), d_model)
        self.pos_emb = nn.Parameter(torch.randn(self.seq_len, d_model) * 0.02)
        self.cat_emb = nn.Embedding(n_cat, d_model)
        self.zone_emb = nn.Embedding(n_zone, d_model)

        enc_layer = nn.TransformerEncoderLayer(
            d_model, cfg["nhead"], 4*d_model, 0.1,
            batch_first=True, norm_first=True
        )
        self.encoder = nn.TransformerEncoder(enc_layer, cfg["num_layers"])
        self.head_q  = nn.Sequential(nn.Linear(d_model, d_model//2), nn.ReLU(), nn.Linear(d_model//2, 1))
        self.head_c  = nn.Linear(d_model, n_cat)
        self.head_z  = nn.Linear(d_model, n_zone)

    def forward(self, x, cat_id, zone_id):
        h = self.in_proj(x) + self.pos_emb[:x.size(1)]
        h = self.encoder(h)[:, -1]
        h = h + self.cat_emb(cat_id) + self.zone_emb(zone_id)
        return self.head_q(h).squeeze(1), self.head_c(h), self.head_z(h)

# -------------------- Préparation des séquences --------------------
def prepare_sequences(csv_path, cfg, prod_enc, zone_enc, scaler):
    df = pd.read_csv(csv_path, parse_dates=["heure_commande"])
    df = df[df.statut_commande == "Livrée"].copy()
    df["date"] = df.heure_commande.dt.date

    daily = (df.groupby(["date", "produit_categorie", "zone_livraison"])
               .agg(quantite_totale=("quantite", "sum"),
                    nb_commandes=("commande_id", "count"))
               .reset_index())

    if prod_enc is None or zone_enc is None:
        prod_enc = LabelEncoder().fit(daily.produit_categorie)
        zone_enc = LabelEncoder().fit(daily.zone_livraison)
        save_pickle(prod_enc, ENC_PROD)
        save_pickle(zone_enc, ENC_ZONE)

    if set(daily.produit_categorie.unique()) - set(prod_enc.classes_) \
       or set(daily.zone_livraison.unique()) - set(zone_enc.classes_):
        prod_enc = LabelEncoder().fit(daily.produit_categorie)
        zone_enc = LabelEncoder().fit(daily.zone_livraison)
        save_pickle(prod_enc, ENC_PROD)
        save_pickle(zone_enc, ENC_ZONE)

    daily["prod_id"] = prod_enc.transform(daily.produit_categorie)
    daily["zone_id"] = zone_enc.transform(daily.zone_livraison)

    daily["dow"] = pd.to_datetime(daily.date).dt.dayofweek
    daily["mois"] = pd.to_datetime(daily.date).dt.month
    daily["is_weekend"] = (daily.dow >= 5).astype(int)

    if scaler is None or getattr(scaler, "n_features_in_", 0) != len(cfg["features"]):
        scaler = StandardScaler().fit(daily[cfg["features"]])
        save_pickle(scaler, SCALER_FILE)

    try:
        daily[cfg["features"]] = scaler.transform(daily[cfg["features"]])
    except ValueError:
        scaler = StandardScaler().fit(daily[cfg["features"]])
        save_pickle(scaler, SCALER_FILE)
        daily[cfg["features"]] = scaler.transform(daily[cfg["features"]])

    X, yq, yc, yz, yd = [], [], [], [], []
    S = cfg["seq_len"]
    for (cat, zone), grp in daily.groupby(["prod_id", "zone_id"]):
        grp = grp.sort_values("date").reset_index(drop=True)
        for i in range(len(grp) - S):
            X.append(grp.iloc[i:i+S][cfg["features"]].values)
            tgt = grp.iloc[i+S]
            yq.append(tgt.quantite_totale)
            yc.append(tgt.prod_id)
            yz.append(tgt.zone_id)
            yd.append(tgt.date)  # 🎯 vrai jour cible

    return np.array(X), np.array(yq), np.array(yc), np.array(yz), np.array(yd)

# -------------------- Inference GPU Optimisée --------------------
def inference(csv_path):
    assert os.path.exists(CONFIG_FILE), "config.json manquant"
    cfg = json.load(open(CONFIG_FILE))

    prod_enc = load_pickle(ENC_PROD)
    zone_enc = load_pickle(ENC_ZONE)
    scaler   = load_pickle(SCALER_FILE)

    X, yq, yc, yz, yd = prepare_sequences(csv_path, cfg, prod_enc, zone_enc, scaler)

    dl = DataLoader(
        DemandDataset(X, yq, yc, yz),
        batch_size=64,
        shuffle=False,
        num_workers=2,
        pin_memory=True
    )

    model = MultiTaskTransformer(
        len(prod_enc.classes_),
        len(zone_enc.classes_),
        cfg
    ).to(DEVICE)
    model.load_state_dict(torch.load(CKPT_FILE, map_location=DEVICE))
    model.eval()

    lw_q = cfg["loss_weights"]["quant"]
    lw_c = cfg["loss_weights"]["class"]
    thresh = cfg["reward_thresh"]

    success_rates = []
    idx = 0
    evaluations = []

    with torch.no_grad():
        for xb, yqb, ycb, yzb in dl:
            xb  = xb.to(DEVICE, non_blocking=True)
            yqb = yqb.to(DEVICE, non_blocking=True)
            ycb = ycb.to(DEVICE, non_blocking=True)
            yzb = yzb.to(DEVICE, non_blocking=True)

            with autocast(enabled=(DEVICE.type == "cuda")):
                qp, cp, zp = model(xb, ycb, yzb)

            quant_ok = (1 - (qp - yqb).abs() / (yqb + 1e-3)) > 0.3
            cat_ok   = (cp.argmax(1) == ycb)
            zone_ok  = (zp.argmax(1) == yzb)
            rewards  = lw_q * quant_ok + lw_c * cat_ok + lw_c * zone_ok

            batch_precisions = ((quant_ok.float() + cat_ok.float() + zone_ok.float()) / 3 * 100).tolist()

            for b in range(xb.size(0)):
                date_str = str(yd[idx]) if idx < len(yd) else "N/A"
                prod_label = prod_enc.inverse_transform([ycb[b].cpu().item()])[0]
                zone_label = zone_enc.inverse_transform([yzb[b].cpu().item()])[0]
                precision = batch_precisions[b]

                print(f"📅 {date_str} | {prod_label}, {zone_label} | 🎯 Précision : {precision:5.1f}%")

                success_rates.append(precision)
                evaluations.append({
                    "date": date_str,
                    "categorie": prod_label,
                    "zone": zone_label,
                    "precision_%": round(precision, 2)
                })

                idx += 1

    mean_score = np.mean(success_rates)
    std_score  = np.std(success_rates)
    n_unique_days = len(set(yd))


    print("\n" + "-"*60)
    print(f"📊 SCORE FINAL : {mean_score:5.2f}% de réussite moyenne")
    print(f"📉 Écart-type  : ±{std_score:5.2f}%")
    print(f"🧮 Évaluations : {len(success_rates)} jours prédits")
    print(f"📆 Jours distincts     : {n_unique_days}")

    # 💾 Export CSV des prédictions
    df_out = pd.DataFrame(evaluations)
    df_out.to_csv("resultats_inference.csv", index=False)
    print("📁 Résultats exportés dans : resultats_inference.csv")

# -------------------- Main --------------------
if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--csv", default="data.csv", help="Fichier de données à inférer")
    args = p.parse_args()
    inference(args.csv)
