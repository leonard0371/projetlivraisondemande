import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random, json, warnings
from faker import Faker
from tqdm import tqdm           # ↰  barre de progression
warnings.filterwarnings('ignore')

class MontrealDeliveryDataGenerator:
    # ------------------------------------------------------------------ #
    # 1. Initialisation : identique (seule la mise en page est condensée) #
    # ------------------------------------------------------------------ #
    def __init__(self):
        self.fake = Faker('fr_CA'); Faker.seed(42)
        random.seed(42); np.random.seed(42)

        self.arrondissements_config = {  # (inchangé)
            'Ville-Marie': {'poids': 0.18, 'lat_center': 45.5017, 'lng_center': -73.5673, 'radius': 0.02},
            'Le Plateau-Mont-Royal': {'poids': 0.15, 'lat_center': 45.5200, 'lng_center': -73.5800, 'radius': 0.015},
            'Côte-des-Neiges-NDG': {'poids': 0.12, 'lat_center': 45.4700, 'lng_center': -73.6300, 'radius': 0.03},
            'Villeray-Saint-Michel': {'poids': 0.10, 'lat_center': 45.5500, 'lng_center': -73.6200, 'radius': 0.025},
            'Rosemont-La Petite-Patrie': {'poids': 0.10, 'lat_center': 45.5400, 'lng_center': -73.6000, 'radius': 0.02},
            'Ahuntsic-Cartierville': {'poids': 0.08, 'lat_center': 45.5600, 'lng_center': -73.6800, 'radius': 0.03},
            'Saint-Laurent': {'poids': 0.07, 'lat_center': 45.5100, 'lng_center': -73.6700, 'radius': 0.025},
            'Mercier-Hochelaga': {'poids': 0.06, 'lat_center': 45.5800, 'lng_center': -73.5200, 'radius': 0.04},
            'Verdun': {'poids': 0.05, 'lat_center': 45.4600, 'lng_center': -73.5700, 'radius': 0.02},
            'Autres': {'poids': 0.09, 'lat_center': 45.5200, 'lng_center': -73.6000, 'radius': 0.05}
        }

        self.produits_config = {  # (inchangé)
            'Produits Laitiers': {'poids': 0.30, 'produits': ['Lait 1L','Lait 2L','Lait 4L','Yogourt grec','Fromage frais','Crème fraîche'],
                                  'duree_vie_range': (72, 168), 'prix_range': (3.50, 15.99), 'stockage': 'Réfrigéré'},
            'Boulangerie': {'poids': 0.25, 'produits': ['Pain artisanal','Croissants','Pâtisseries','Bagels montréalais'],
                            'duree_vie_range': (24, 48), 'prix_range': (2.99, 12.50), 'stockage': 'Ambiant'},
            'Fruits et Légumes': {'poids': 0.20, 'produits': ['Pommes','Bananes','Fraises','Bleuets du Québec','Laitue','Tomates','Concombres','Carottes'],
                                  'duree_vie_range': (48, 120), 'prix_range': (1.99, 8.99), 'stockage': 'Réfrigéré'},
            'Viandes et Charcuteries': {'poids': 0.15, 'produits': ['Poulet frais','Bœuf haché','Saumon','Charcuterie artisanale'],
                                        'duree_vie_range': (24, 72), 'prix_range': (8.99, 35.99), 'stockage': 'Réfrigéré'},
            'Plats Préparés': {'poids': 0.10, 'produits': ['Soupes','Salades composées','Sandwichs','Sushis'],
                               'duree_vie_range': (12, 36), 'prix_range': (6.99, 24.99), 'stockage': 'Réfrigéré'}
        }

        self.poids_horaires_semaine = {  # (inchangé)
            range(0, 7): 0.02, range(7, 9): 0.08, range(9, 11): 0.04,
            range(11, 14): 0.35, range(14, 17): 0.06,
            range(17, 21): 0.45, range(21, 24): 0.08}
        self.poids_horaires_weekend = {
            range(0, 9): 0.05, range(9, 12): 0.25, range(12, 15): 0.30,
            range(15, 17): 0.05, range(17, 20): 0.35, range(20, 24): 0.10}

        self.codes_postaux = {  # (inchangé)
            'Ville-Marie': ['H2X','H2Y','H2Z','H3A','H3B','H3C'],
            'Le Plateau-Mont-Royal': ['H2T','H2W','H3N','H2H'],
            'Côte-des-Neiges-NDG': ['H3S','H4A','H3T','H4B'],
            'Villeray-Saint-Michel': ['H2A','H1Z','H2B'],
            'Rosemont-La Petite-Patrie': ['H1X','H2G','H2S'],
            'Ahuntsic-Cartierville': ['H3L','H4J','H4K'],
            'Saint-Laurent': ['H4L','H4M','H4N'],
            'Mercier-Hochelaga': ['H1K','H1L','H1M'],
            'Verdun': ['H4G','H4H'],
            'Autres': ['H1A','H1B','H1C','H1E']
        }

        self.statuts_commandes = ['En attente', 'Préparée', 'En livraison', 'Livrée']
        self.prefixes_telephone = ['514', '438']

    # ------------------------------------------------------------------ #
    # 2. Méthodes utilitaires : inchangées                                #
    # ------------------------------------------------------------------ #
    def generer_commande_id(self, ts):  # ...
        date_str = ts.strftime('%Y%m%d_%H%M%S')
        return f"CMD_{date_str}_{random.randint(1000, 9999)}"

    def choisir_arrondissement(self):
        arrs = list(self.arrondissements_config); poids=[cfg['poids'] for cfg in self.arrondissements_config.values()]
        return np.random.choice(arrs, p=poids)

    def choisir_categorie_produit(self):
        cats=list(self.produits_config); w=[cfg['poids'] for cfg in self.produits_config.values()]
        return np.random.choice(cats,p=w)

    def generer_coordonnees_gps(self, arr):
        cfg=self.arrondissements_config[arr]
        lat=np.random.normal(cfg['lat_center'], cfg['radius']/3)
        lng=np.random.normal(cfg['lng_center'], cfg['radius']/3)
        return {'lat': round(lat,6), 'lng': round(lng,6)}

    def generer_code_postal(self, arr):
        prefix=random.choice(self.codes_postaux[arr])
        c1=random.randint(0,9); l1=random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
        c2=random.randint(0,9); l2=random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); c3=random.randint(0,9)
        return f"{prefix}{c1}{l1} {c2}{l2}{c3}"

    def generer_heure_commande(self, date_base):
        is_we = date_base.weekday()>=5
        ph = self.poids_horaires_weekend if is_we else self.poids_horaires_semaine
        hours, w = [], []
        for hr_rng, p in ph.items():
            hours.extend(hr_rng); w.extend([p/len(hr_rng)]*len(hr_rng))
        w=np.array(w); w=w/w.sum()
        hr=np.random.choice(hours,p=w)
        return date_base.replace(hour=int(hr), minute=random.randint(0,59), second=random.randint(0,59))

    def calculer_duree_vie_restante(self, h_cmd, dv_init, now):
        heures = (now-h_cmd).total_seconds()/3600
        return int(max(0, dv_init-heures))

    def calculer_priorite_livraison(self,pct):
        return "Critique" if pct<20 else "Élevée" if pct<50 else "Normale"

    def calculer_zone_livraison(self, arr):
        mapping={'Ville-Marie':'Z01','Le Plateau-Mont-Royal':'Z01',
                 'Ahuntsic-Cartierville':'Z02','Villeray-Saint-Michel':'Z02',
                 'Saint-Laurent':'Z02','Mercier-Hochelaga':'Z03',
                 'Côte-des-Neiges-NDG':'Z04','Verdun':'Z04',
                 'Rosemont-La Petite-Patrie':'Z01','Autres':random.choice(['Z01','Z02','Z03','Z04'])}
        return mapping.get(arr,'Z01')

    # ------------------------------------------------------------------ #
    # 3. Génération d'une commande (identique, sans prints)              #
    # ------------------------------------------------------------------ #
    def generer_commande(self, date_base, now):
        h_cmd=self.generer_heure_commande(date_base)
        arr=self.choisir_arrondissement(); cat=self.choisir_categorie_produit()
        cfg_prod=self.produits_config[cat]
        prod=random.choice(cfg_prod['produits'])
        pu=round(random.uniform(*cfg_prod['prix_range']),2)
        qte=random.randint(1,10); prix_total=round(pu*qte*1.14975,2)
        dv_init=random.randint(*cfg_prod['duree_vie_range'])
        dv_rest=self.calculer_duree_vie_restante(h_cmd,dv_init,now)
        pct_fraicheur=(dv_rest/dv_init)*100 if dv_init>0 else 0
        coord=self.generer_coordonnees_gps(arr)
        code_post=self.generer_code_postal(arr)
        tel=f"({random.choice(self.prefixes_telephone)}) {random.randint(100,999)}-{random.randint(1000,9999)}"

        return {
            'commande_id': self.generer_commande_id(h_cmd),
            'client_nom': self.fake.name(),
            'client_telephone': tel,
            'produit_nom': prod,
            'produit_categorie': cat,
            'quantite': qte,
            'prix_unitaire': pu,
            'prix_total': prix_total,
            'adresse_livraison': self.fake.address().replace('\n', ', '),
            'code_postal': code_post,
            'ville': 'Montréal',
            'arrondissement': arr,
            'coordonnees_gps': json.dumps(coord),
            'heure_commande': h_cmd.strftime('%Y-%m-%dT%H:%M:%S-05:00'),
            'duree_vie_initiale': dv_init,
            'duree_vie_restante': dv_rest,
            'pourcentage_fraicheur': round(pct_fraicheur,2),
            'priorite_livraison': self.calculer_priorite_livraison(pct_fraicheur),
            'zone_livraison': self.calculer_zone_livraison(arr),
            'statut_commande': random.choice(self.statuts_commandes)
        }

    # ------------------------------------------------------------------ #
    # 4. Génération vectorisée du dataset + barre tqdm                   #
    # ------------------------------------------------------------------ #
    def generer_dataset(self, nb_jours=150, nb_commandes_par_jour_range=(10,2000), prob_jour_sans_commande=0.02):
        """
        Génère le dataset complet.
        • Plus de prints : une barre tqdm unique 'cmd' avec ETA & vitesse.
        • Vectorisation : on décide en amont du nombre de commandes par jour.
        """
        date_debut = datetime(2024,1,1)
        now = datetime.now()

        # Vectorisation du tirage des jours sans commandes + nb commandes/jour
        no_order_mask = np.random.rand(nb_jours) < prob_jour_sans_commande
        nb_par_jour = np.where(
            no_order_mask,
            0,
            np.random.randint(nb_commandes_par_jour_range[0],
                              nb_commandes_par_jour_range[1]+1,
                              size=nb_jours)
        )
        total_cmds = int(nb_par_jour.sum())

        commandes = []
        pbar = tqdm(total=total_cmds, desc="🛠️  Génération commandes",
                    unit="cmd", dynamic_ncols=True)

        for j, n_cmd in enumerate(nb_par_jour):
            if n_cmd == 0:              # jour sans commande
                continue
            date_cour = date_debut + timedelta(days=int(j))
            for _ in range(int(n_cmd)):
                commandes.append(self.generer_commande(date_cour, now))
                pbar.update(1)
        pbar.close()

        self.jours_sans_commande = int(no_order_mask.sum())
        self.nb_jours = nb_jours
        return pd.DataFrame(commandes)

    # ------------------------------------------------------------------ #
    # 5. Sauvegarde + stats (prints conservés, c'est un résumé final)    #
    # ------------------------------------------------------------------ #
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

# ---------------------------------------------------------------------- #
# 6. Script principal                                                    #
# ---------------------------------------------------------------------- #
if __name__ == "__main__":
    gen = MontrealDeliveryDataGenerator()
    jours = int(input("Entrez le nombre de jours à générer : "))
    df = gen.generer_dataset(nb_jours=jours,
                             nb_commandes_par_jour_range=(10, 2000),
                             prob_jour_sans_commande=0.02)
    a = str(input("Donnez le nom sous lequel sauvegarder les commandes:"))
    gen.sauvegarder_dataset(df, a)

    # Validation rapide (les prints ici restent utiles/finaux)
    print("\n✅ VALIDATION DES CONTRAINTES :")
    print(f"- Prix min respecté        : {(df['prix_total'] >= 15.0).all()}")
    regex_cp = r"[A-Z][0-9][A-Z] [0-9][A-Z][0-9]"
    print(f"- Codes postaux valides    : {df['code_postal'].str.match(regex_cp).all()}")
    print(f"- Ville toujours Montréal  : {(df['ville']=='Montréal').all()}")
    print(f"- Quantités entre 1 et 10  : {((df['quantite']>=1)&(df['quantite']<=10)).all()}")
    print(f"- Durées de vie positives  : {(df['duree_vie_restante']>=0).all()}")
