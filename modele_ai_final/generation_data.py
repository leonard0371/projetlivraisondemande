#!/usr/bin/env python3
# ================================================================
#  GENERATEUR DE COMMANDES – MONTRÉAL (copule gaussienne complète)
#  Tous les tirages (jours, volumes, arrondissement, catégorie,
#  quantité, heure) proviennent d’une même loi normale multivariée.
# ================================================================
import pandas as pd
import numpy  as np
import random, json, warnings
from math import sqrt
from bisect import bisect_left
from datetime import datetime, timedelta
from faker import Faker
from scipy.special import erf

warnings.filterwarnings("ignore")

# --------- OUTIL GÉNÉRAL : Φ, la CDF de N(0,1) -------------------
def phi(x):
    """ Φ(x) = ½[1+erf(x/√2)] – accepte scalaire ou array NumPy. """
    return 0.5 * (1.0 + erf(x / sqrt(2.0)))

# =================================================================
class MontrealDeliveryDataGenerator:
    def __init__(self):
        self.fake = Faker('fr_CA');  Faker.seed(42)
        random.seed(42);             np.random.seed(42)

        # ---------------- CONFIG ARRONDISSEMENTS ------------------
        self.arrondissements_config = {
            'Ville-Marie'               : {'poids': 0.18,'lat_center':45.5017,'lng_center':-73.5673,'radius':0.02},
            'Le Plateau-Mont-Royal'     : {'poids': 0.15,'lat_center':45.5200,'lng_center':-73.5800,'radius':0.015},
            'Côte-des-Neiges-NDG'       : {'poids': 0.12,'lat_center':45.4700,'lng_center':-73.6300,'radius':0.03},
            'Villeray-Saint-Michel'     : {'poids': 0.10,'lat_center':45.5500,'lng_center':-73.6200,'radius':0.025},
            'Rosemont-La Petite-Patrie' : {'poids': 0.10,'lat_center':45.5400,'lng_center':-73.6000,'radius':0.02},
            'Ahuntsic-Cartierville'     : {'poids': 0.08,'lat_center':45.5600,'lng_center':-73.6800,'radius':0.03},
            'Saint-Laurent'             : {'poids': 0.07,'lat_center':45.5100,'lng_center':-73.6700,'radius':0.025},
            'Mercier-Hochelaga'         : {'poids': 0.06,'lat_center':45.5800,'lng_center':-73.5200,'radius':0.04},
            'Verdun'                    : {'poids': 0.05,'lat_center':45.4600,'lng_center':-73.5700,'radius':0.02},
            'Autres'                    : {'poids': 0.09,'lat_center':45.5200,'lng_center':-73.6000,'radius':0.05}
        }

        # ------------------- CONFIG PRODUITS -----------------------
        self.produits_config = {
            'Produits Laitiers': {'poids':0.30,'produits':['Lait 1L','Lait 2L','Lait 4L','Yogourt grec','Fromage frais','Crème fraîche'],
                                  'duree_vie_range':(72,168),'prix_range':(3.50,15.99),'stockage':'Réfrigéré'},
            'Boulangerie': {'poids':0.25,'produits':['Pain artisanal','Croissants','Pâtisseries','Bagels montréalais'],
                            'duree_vie_range':(24,48),'prix_range':(2.99,12.50),'stockage':'Ambiant'},
            'Fruits et Légumes': {'poids':0.20,'produits':['Pommes','Bananes','Fraises','Bleuets du Québec','Laitue','Tomates','Concombres','Carottes'],
                                  'duree_vie_range':(48,120),'prix_range':(1.99,8.99),'stockage':'Réfrigéré'},
            'Viandes et Charcuteries': {'poids':0.15,'produits':['Poulet frais','Bœuf haché','Saumon','Charcuterie artisanale'],
                                        'duree_vie_range':(24,72),'prix_range':(8.99,35.99),'stockage':'Réfrigéré'},
            'Plats Préparés': {'poids':0.10,'produits':['Soupes','Salades composées','Sandwichs','Sushis'],
                               'duree_vie_range':(12,36),'prix_range':(6.99,24.99),'stockage':'Réfrigéré'}
        }

        # ----------------- HOURLY WEIGHTS --------------------------
        self.poids_horaires_semaine = {
            range(0,7):0.02, range(7,9):0.08, range(9,11):0.04,
            range(11,14):0.35, range(14,17):0.06,
            range(17,21):0.45, range(21,24):0.08}
        self.poids_horaires_weekend = {
            range(0,9):0.05, range(9,12):0.25, range(12,15):0.30,
            range(15,17):0.05, range(17,20):0.35, range(20,24):0.10}

        # ---------------- CODES POSTAUX ----------------------------
        self.codes_postaux = {
            'Ville-Marie':['H2X','H2Y','H2Z','H3A','H3B','H3C'],
            'Le Plateau-Mont-Royal':['H2T','H2W','H3N','H2H'],
            'Côte-des-Neiges-NDG':['H3S','H4A','H3T','H4B'],
            'Villeray-Saint-Michel':['H2A','H1Z','H2B'],
            'Rosemont-La Petite-Patrie':['H1X','H2G','H2S'],
            'Ahuntsic-Cartierville':['H3L','H4J','H4K'],
            'Saint-Laurent':['H4L','H4M','H4N'],
            'Mercier-Hochelaga':['H1K','H1L','H1M'],
            'Verdun':['H4G','H4H'],
            'Autres':['H1A','H1B','H1C','H1E']
        }

        # ---------------- AUTRES LISTES ----------------------------
        self.statuts_commandes  = ['En attente','Préparée','En livraison','Livrée']
        self.prefixes_telephone = ['514','438']

        # ===== PRE-CALCULS POUR LA COPULE GAUSSIENNE ===============
        self.arr_liste = list(self.arrondissements_config.keys())
        self.arr_cum   = np.cumsum([cfg['poids'] for cfg in self.arrondissements_config.values()])

        self.cat_liste = list(self.produits_config.keys())
        self.cat_cum   = np.cumsum([cfg['poids'] for cfg in self.produits_config.values()])

        # Vecteur latent (arrondissement, catégorie, quantité, heure)
        self.mu_order  = np.zeros(4)
        self.cov_order = np.array([[ 1.00,  0.30,  0.20, -0.10],
                                   [ 0.30,  1.00,  0.40,  0.05],
                                   [ 0.20,  0.40,  1.00,  0.10],
                                   [-0.10,  0.05,  0.10,  1.00]])

    # ==============================================================
    # --------------------- MÉTHODES UTILITAIRES -------------------
    def generer_commande_id(self, ts):
        return f"CMD_{ts.strftime('%Y%m%d_%H%M%S')}_{random.randint(1000,9999)}"

    def generer_coordonnees_gps(self, arr):
        cfg = self.arrondissements_config[arr]
        lat = np.random.normal(cfg['lat_center'], cfg['radius']/3)
        lng = np.random.normal(cfg['lng_center'], cfg['radius']/3)
        return {'lat':round(lat,6), 'lng':round(lng,6)}

    def generer_code_postal(self, arr):
        prefix = random.choice(self.codes_postaux[arr])
        c1 = random.randint(0,9); l1 = random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
        c2 = random.randint(0,9); l2 = random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); c3 = random.randint(0,9)
        return f"{prefix}{c1}{l1} {c2}{l2}{c3}"

    def generer_heure_commande(self, date_base, u=None):
        """Tirage horaire pondéré – utilisable avec un quantile u∈(0,1)."""
        is_we = date_base.weekday() >= 5
        ph    = self.poids_horaires_weekend if is_we else self.poids_horaires_semaine
        hours, w = [], []
        for hr_rng, p in ph.items():
            hours.extend(hr_rng)
            w.extend([p/len(hr_rng)]*len(hr_rng))
        w   = np.array(w)/np.sum(w)
        cdf = np.cumsum(w)
        hr  = hours[bisect_left(cdf, u)] if u is not None else np.random.choice(hours, p=w)
        return date_base.replace(hour=int(hr),
                                 minute=random.randint(0,59),
                                 second=random.randint(0,59))

    def calculer_duree_vie_restante(self, h_cmd, dv_init, now):
        heures = (now - h_cmd).total_seconds()/3600
        return int(max(0, dv_init - heures))

    def calculer_priorite_livraison(self, pct):
        return "Critique" if pct < 20 else "Élevée" if pct < 50 else "Normale"

    def calculer_zone_livraison(self, arr):
        mapping = {'Ville-Marie':'Z01','Le Plateau-Mont-Royal':'Z01',
                   'Ahuntsic-Cartierville':'Z02','Villeray-Saint-Michel':'Z02',
                   'Saint-Laurent':'Z02','Mercier-Hochelaga':'Z03',
                   'Côte-des-Neiges-NDG':'Z04','Verdun':'Z04',
                   'Rosemont-La Petite-Patrie':'Z01',
                   'Autres':random.choice(['Z01','Z02','Z03','Z04'])}
        return mapping.get(arr,'Z01')

    # ==============================================================
    # ------------------ GÉNÉRER 1 COMMANDE ------------------------
    def generer_commande(self, date_base, now):
        # 1) Vecteur latent Z ~ N(0, Σ) puis U = Φ(Z)
        z  = np.random.multivariate_normal(self.mu_order, self.cov_order)
        u  = phi(z)

        # 2) Arrondissement
        arr = self.arr_liste[bisect_left(self.arr_cum, u[0])]

        # 3) Catégorie produit
        cat = self.cat_liste[bisect_left(self.cat_cum, u[1])]

        # 4) Quantité (1-10)
        qte = int(min(10, max(1, 1 + np.floor(u[2]*10))))

        # 5) Heure de la commande
        h_cmd = self.generer_heure_commande(date_base, u[3])

        # --- Attributs dépendant de la catégorie ------------------
        cfg_prod  = self.produits_config[cat]
        prod      = random.choice(cfg_prod['produits'])
        pu        = round(random.uniform(*cfg_prod['prix_range']), 2)
        prix_tot  = round(pu * qte * 1.14975, 2)   # taxes

        dv_init   = random.randint(*cfg_prod['duree_vie_range'])
        dv_rest   = self.calculer_duree_vie_restante(h_cmd, dv_init, now)
        pct       = (dv_rest / dv_init)*100 if dv_init>0 else 0

        coord     = self.generer_coordonnees_gps(arr)
        code_post = self.generer_code_postal(arr)
        tel       = f"({random.choice(self.prefixes_telephone)}) {random.randint(100,999)}-{random.randint(1000,9999)}"

        return {
            'commande_id'        : self.generer_commande_id(h_cmd),
            'client_nom'         : self.fake.name(),
            'client_telephone'   : tel,
            'produit_nom'        : prod,
            'produit_categorie'  : cat,
            'quantite'           : qte,
            'prix_unitaire'      : pu,
            'prix_total'         : prix_tot,
            'adresse_livraison'  : self.fake.address().replace('\n', ', '),
            'code_postal'        : code_post,
            'ville'              : 'Montréal',
            'arrondissement'     : arr,
            'coordonnees_gps'    : json.dumps(coord),
            'heure_commande'     : h_cmd.strftime('%Y-%m-%dT%H:%M:%S-05:00'),
            'duree_vie_initiale' : dv_init,
            'duree_vie_restante' : dv_rest,
            'pourcentage_fraicheur': round(pct,2),
            'priorite_livraison' : self.calculer_priorite_livraison(pct),
            'zone_livraison'     : self.calculer_zone_livraison(arr),
            'statut_commande'    : random.choice(self.statuts_commandes)
        }

    # ==============================================================
    # ----------- GÉNÉRATION DU DATASET COMPLET --------------------
    def generer_dataset(self,
                        nb_jours=150,
                        nb_commandes_par_jour_range=(10, 2000),
                        prob_jour_sans_commande=0.02,
                        cov_days=np.array([[1.0, 0.4],
                                           [0.4, 1.0]]),
                        moy_days=np.array([0.0, 0.0])):

        date_debut = datetime(2024,1,1)
        now        = datetime.now()
        min_cmd, max_cmd = nb_commandes_par_jour_range

        # --- 1) Vector latent pour chaque jour (volume + outage) ---
        Z_day = np.random.multivariate_normal(mean=moy_days,
                                              cov=cov_days,
                                              size=nb_jours)
        U_day = phi(Z_day)

        nb_cmds = (min_cmd + (max_cmd - min_cmd)*U_day[:,0]).astype(int)
        zero_day_mask = U_day[:,1] < prob_jour_sans_commande
        nb_cmds[zero_day_mask] = 0

        # --- 2) Boucle de création --------------------------------
        commandes = []
        for j, n in enumerate(nb_cmds):
            date_cour = date_debut + timedelta(days=int(j))
            if n == 0:
                print(f"Jour {date_cour.date()} : 0 commande générée")
                continue
            for _ in range(int(n)):
                commandes.append(self.generer_commande(date_cour, now))
            print(f"Jour {date_cour.date()} : {n} commandes générées")

        self.jours_sans_commande = int((nb_cmds==0).sum())
        self.nb_jours            = nb_jours
        return pd.DataFrame(commandes)

    # ==============================================================
    # ---------------------- SAUVEGARDE ----------------------------
    def sauvegarder_dataset(self, df, nom_fichier="data.csv"):
        df.to_csv(nom_fichier, index=False, encoding='utf-8')
        print(f"\n💾 Dataset sauvegardé dans {nom_fichier}")
        print("📊 STATISTIQUES DU DATASET :")
        print(f"- Nombre de commandes : {len(df)}")
        print(f"- Jours sans commande : {self.jours_sans_commande}/{self.nb_jours}"
              f" ({self.jours_sans_commande/self.nb_jours*100:.1f}%)")
        print(f"- Période couverte   : {df['heure_commande'].min()} → {df['heure_commande'].max()}")

        df_tmp = df.copy()
        df_tmp['date'] = pd.to_datetime(df_tmp['heure_commande']).dt.date
        stats = df_tmp.groupby('date').size()
        print(f"- Cmds/jour (min–max–moy) : {stats.min()} – {stats.max()} – {stats.mean():.0f}")

        print("\nArrondissements les + fréquents :")
        print(df['arrondissement'].value_counts().head())
        print("\nCatégories :")
        print(df['produit_categorie'].value_counts())
        print("\nPriorités :")
        print(df['priorite_livraison'].value_counts())

# =================================================================
if __name__ == "__main__":
    gen   = MontrealDeliveryDataGenerator()
    jours = int(input("Entrez le nombre de jours à générer : "))
    df = gen.generer_dataset(nb_jours=jours,
                             nb_commandes_par_jour_range=(10, 2000),
                             prob_jour_sans_commande=0.02)
    nom_fic = str(input("Donnez le nom sous lequel sauvegarder les commandes : "))
    gen.sauvegarder_dataset(df, nom_fic)

    print("\n✅ VALIDATION DES CONTRAINTES :")
    print(f"- Prix min respecté        : {(df['prix_total'] >= 15.0).all()}")
    regex_cp = r"[A-Z][0-9][A-Z] [0-9][A-Z][0-9]"
    print(f"- Codes postaux valides    : {df['code_postal'].str.match(regex_cp).all()}")
    print(f"- Ville toujours Montréal  : {(df['ville']=='Montréal').all()}")
    print(f"- Quantités entre 1 et 10  : {((df['quantite']>=1)&(df['quantite']<=10)).all()}")
    print(f"- Durées de vie positives  : {(df['duree_vie_restante']>=0).all()}")