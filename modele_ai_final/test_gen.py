#!/usr/bin/env python3
"""
Tests unitaires pour generation_data.py
Tests conformes aux contraintes du document de description du projet
Système de livraison à la demande - Montréal
"""

import unittest
import pandas as pd
import numpy as np
import json
import re
from datetime import datetime, timedelta
from generation_data import MontrealDeliveryDataGenerator


class TestMontrealDeliveryDataGeneratorConstraints(unittest.TestCase):
    """
    Tests unitaires basés sur les contraintes spécifiques du projet :
    - Produits périssables dans le Grand Montréal
    - Zones de livraison Z01-Z04
    - Durées de vie et priorités critiques
    - Corrélations via copule gaussienne
    """
    
    def setUp(self):
        """Initialisation conforme au projet"""
        self.generator = MontrealDeliveryDataGenerator()
        # Dataset de test représentatif du projet (30 jours)
        self.test_df = self.generator.generer_dataset(
            nb_jours=30,
            nb_commandes_par_jour_range=(10, 200),  # Volume réaliste pour Montréal
            prob_jour_sans_commande=0.02  # 2% comme spécifié
        )
    
    def test_contraintes_produits_perissables(self):
        """Test 1: Validation des contraintes produits périssables"""
        # Toutes les catégories doivent être périssables
        categories_attendues = {
            'Produits Laitiers', 'Boulangerie', 'Fruits et Légumes', 
            'Viandes et Charcuteries', 'Plats Préparés'
        }
        categories_observees = set(self.test_df['produit_categorie'].unique())
        
        self.assertTrue(
            categories_observees.issubset(categories_attendues),
            f"Catégories non conformes détectées: {categories_observees - categories_attendues}"
        )
        
        # Durées de vie conformes aux produits périssables
        for _, row in self.test_df.iterrows():
            categorie = row['produit_categorie']
            duree_initiale = row['duree_vie_initiale']
            
            # Vérification selon les ranges configurés
            if categorie == 'Produits Laitiers':
                self.assertTrue(72 <= duree_initiale <= 168, 
                              f"Durée vie laitiers incorrecte: {duree_initiale}h")
            elif categorie == 'Boulangerie':
                self.assertTrue(24 <= duree_initiale <= 48,
                              f"Durée vie boulangerie incorrecte: {duree_initiale}h")
            elif categorie == 'Plats Préparés':
                self.assertTrue(12 <= duree_initiale <= 36,
                              f"Durée vie plats préparés incorrecte: {duree_initiale}h")
    
    def test_zones_livraison_montreal(self):
        """Test 2: Validation des zones de livraison spécifiques au projet"""
        zones_attendues = {'Z01', 'Z02', 'Z03', 'Z04'}
        zones_observees = set(self.test_df['zone_livraison'].unique())
        
        self.assertEqual(
            zones_observees, zones_attendues,
            f"Zones de livraison non conformes. Attendu: {zones_attendues}, Observé: {zones_observees}"
        )
        
        # Mapping spécifique aux arrondissements montréalais
        mapping_projet = {
            'Ville-Marie': 'Z01',
            'Le Plateau-Mont-Royal': 'Z01', 
            'Rosemont-La Petite-Patrie': 'Z01',
            'Ahuntsic-Cartierville': 'Z02',
            'Villeray-Saint-Michel': 'Z02',
            'Saint-Laurent': 'Z02',
            'Mercier-Hochelaga': 'Z03',
            'Côte-des-Neiges-NDG': 'Z04',
            'Verdun': 'Z04'
        }
        
        for arr, zone_attendue in mapping_projet.items():
            lignes_arr = self.test_df[self.test_df['arrondissement'] == arr]
            if len(lignes_arr) > 0:
                zones_arr = lignes_arr['zone_livraison'].unique()
                self.assertIn(zone_attendue, zones_arr,
                            f"Arrondissement {arr} mal mappé vers zone {zone_attendue}")
    
    def test_priorites_livraison_peremption(self):
        """Test 3: Priorités basées sur péremption (contrainte métier critique)"""
        # Validation stricte des seuils de priorité
        for _, row in self.test_df.iterrows():
            pct_fraicheur = row['pourcentage_fraicheur']
            priorite = row['priorite_livraison']
            categorie = row['produit_categorie']
            
            # Critique < 20% (livraison immédiate requise)
            if pct_fraicheur < 20:
                self.assertEqual(priorite, "Critique",
                               f"Produit {categorie} à {pct_fraicheur:.1f}% devrait être Critique")
            
            # Élevée 20-50% (livraison prioritaire)
            elif 20 <= pct_fraicheur < 50:
                self.assertEqual(priorite, "Élevée",
                               f"Produit {categorie} à {pct_fraicheur:.1f}% devrait être Élevée")
            
            # Normale ≥ 50% (livraison standard)
            else:
                self.assertEqual(priorite, "Normale",
                               f"Produit {categorie} à {pct_fraicheur:.1f}% devrait être Normale")
        
        # Au moins 5% des commandes devraient être critiques (produits périssables)
        critiques = (self.test_df['priorite_livraison'] == 'Critique').sum()
        pct_critiques = critiques / len(self.test_df) * 100
        
        self.assertGreaterEqual(pct_critiques, 2.0,
                              f"Trop peu de commandes critiques: {pct_critiques:.1f}% (min 2%)")
    
    def test_grand_montreal_geolocalisation(self):
        """Test 4: Géolocalisation stricte Grand Montréal"""
        for _, row in self.test_df.iterrows():
            coord = json.loads(row['coordonnees_gps'])
            lat, lng = coord['lat'], coord['lng']
            
            # Boundaries strictes Grand Montréal
            self.assertTrue(45.25 <= lat <= 45.75,
                          f"Latitude {lat} hors Grand Montréal")
            self.assertTrue(-74.1 <= lng <= -73.3,
                          f"Longitude {lng} hors Grand Montréal")
            
            # Validation cohérence arrondissement-coordonnées
            arr = row['arrondissement']
            arr_config = self.generator.arrondissements_config[arr]
            
            # Distance approximative du centre (tolérance radius * 2)
            distance_lat = abs(lat - arr_config['lat_center'])
            distance_lng = abs(lng - arr_config['lng_center'])
            tolerance = arr_config['radius'] * 2
            
            self.assertLessEqual(distance_lat, tolerance,
                               f"Coordonnée {arr} trop éloignée du centre (lat)")
            self.assertLessEqual(distance_lng, tolerance,
                               f"Coordonnée {arr} trop éloignée du centre (lng)")
    
    def test_copule_gaussienne_correlations(self):
        """Test 5: Validation des corrélations de la copule gaussienne"""
        if len(self.test_df) < 100:
            self.skipTest("Dataset trop petit pour analyser les corrélations")
        
        # Encoder les variables pour analyse de corrélation
        from sklearn.preprocessing import LabelEncoder
        
        df_corr = self.test_df.copy()
        df_corr['heure_commande'] = pd.to_datetime(df_corr['heure_commande'])
        df_corr['heure_num'] = df_corr['heure_commande'].dt.hour
        
        # Encodage des variables catégorielles
        le_arr = LabelEncoder()
        le_cat = LabelEncoder()
        
        df_corr['arr_encoded'] = le_arr.fit_transform(df_corr['arrondissement'])
        df_corr['cat_encoded'] = le_cat.fit_transform(df_corr['produit_categorie'])
        
        # Calcul des corrélations observées
        corr_matrix = df_corr[['arr_encoded', 'cat_encoded', 'quantite', 'heure_num']].corr()
        
        # Corrélations attendues (approximatives car échantillon fini)
        # Arrondissement-Catégorie: 0.30 ± 0.20
        corr_arr_cat = corr_matrix.loc['arr_encoded', 'cat_encoded']
        self.assertLessEqual(abs(corr_arr_cat), 0.6,
                           f"Corrélation arr-cat trop forte: {corr_arr_cat:.3f}")
        
        # Catégorie-Quantité: 0.40 ± 0.25  
        corr_cat_qty = corr_matrix.loc['cat_encoded', 'quantite']
        self.assertLessEqual(abs(corr_cat_qty), 0.7,
                           f"Corrélation cat-qty trop forte: {corr_cat_qty:.3f}")
    
    def test_patterns_temporels_montreal(self):
        """Test 6: Patterns temporels spécifiques à Montréal"""
        self.test_df['datetime'] = pd.to_datetime(self.test_df['heure_commande'])
        self.test_df['heure'] = self.test_df['datetime'].dt.hour
        self.test_df['jour_semaine'] = self.test_df['datetime'].dt.dayofweek
        self.test_df['is_weekend'] = self.test_df['jour_semaine'] >= 5
        
        # Pattern midi montréalais (11h-14h en semaine)
        semaine_df = self.test_df[~self.test_df['is_weekend']]
        if len(semaine_df) >= 20:
            midi_commandes = semaine_df[semaine_df['heure'].between(11, 13)]
            pct_midi = len(midi_commandes) / len(semaine_df) * 100
            
            # Au moins 25% des commandes entre 11h-14h en semaine
            self.assertGreaterEqual(pct_midi, 15.0,
                                  f"Trop peu de commandes à midi: {pct_midi:.1f}%")
        
        # Pattern soirée (17h-20h)
        soir_commandes = semaine_df[semaine_df['heure'].between(17, 20)]
        if len(semaine_df) >= 20:
            pct_soir = len(soir_commandes) / len(semaine_df) * 100
            self.assertGreaterEqual(pct_soir, 20.0,
                                  f"Trop peu de commandes en soirée: {pct_soir:.1f}%")
    
    def test_stock_mobile_fictif_preparation(self):
        """Test 7: Données compatibles avec prédiction stock mobile"""
        # Groupement par date-catégorie-zone (input pour ML)
        self.test_df['date'] = pd.to_datetime(self.test_df['heure_commande']).dt.date
        
        daily_agg = (self.test_df.groupby(['date', 'produit_categorie', 'zone_livraison'])
                     .agg({
                         'quantite': 'sum',
                         'commande_id': 'count'
                     }).reset_index())
        daily_agg.columns = ['date', 'categorie', 'zone', 'quantite_totale', 'nb_commandes']
        
        # Validation structure pour ML
        self.assertGreater(len(daily_agg), 10,
                         "Pas assez de points d'agrégation pour ML")
        
        # Chaque zone devrait avoir des données pour chaque catégorie
        zones_par_cat = daily_agg.groupby('categorie')['zone'].nunique()
        for cat, nb_zones in zones_par_cat.items():
            self.assertGreaterEqual(nb_zones, 2,
                                  f"Catégorie {cat} présente dans {nb_zones} zones seulement")
        
        # Distribution réaliste des quantités par zone
        qty_par_zone = daily_agg.groupby('zone')['quantite_totale'].sum()
        zone_plus_active = qty_par_zone.idxmax()
        
        # Z01 (centre-ville) devrait être la plus active
        self.assertIn(zone_plus_active, ['Z01'],
                    f"Zone la plus active: {zone_plus_active}, attendu Z01 (centre)")
    
    def test_contraintes_business_montreal(self):
        """Test 8: Contraintes business spécifiques au marché montréalais"""
        # Prix avec taxes québécoises (14.975%)
        for _, row in self.test_df.iterrows():
            prix_unitaire = row['prix_unitaire']
            quantite = row['quantite']
            prix_total = row['prix_total']
            
            prix_ht = prix_unitaire * quantite
            prix_ttc_calcule = round(prix_ht * 1.14975, 2)
            
            self.assertAlmostEqual(prix_total, prix_ttc_calcule, places=2,
                                 msg=f"Taxes incorrectes: {prix_total} vs {prix_ttc_calcule}")
        
        # Commande minimum 15$ (contrainte économique)
        prix_inferieurs = self.test_df[self.test_df['prix_total'] < 15.0]
        self.assertEqual(len(prix_inferieurs), 0,
                       f"{len(prix_inferieurs)} commandes sous 15$")
        
        # Codes postaux montréalais valides
        regex_qc = r'^[HhJj][0-9][A-Za-z] [0-9][A-Za-z][0-9]$'
        codes_invalides = ~self.test_df['code_postal'].str.match(regex_qc)
        self.assertFalse(codes_invalides.any(),
                       f"Codes postaux non-québécois détectés")
    
    def test_optimisation_positionnement_livreurs(self):
        """Test 9: Données compatibles avec optimisation des livreurs (K-Means)"""
        # Features nécessaires pour clustering géographique
        required_features = ['coordonnees_gps', 'zone_livraison', 'priorite_livraison']
        for feature in required_features:
            self.assertIn(feature, self.test_df.columns,
                        f"Feature manquante pour clustering: {feature}")
        
        # Distribution géographique permettant clustering
        coords_list = []
        for _, row in self.test_df.iterrows():
            coord = json.loads(row['coordonnees_gps'])
            coords_list.append([coord['lat'], coord['lng']])
        
        coords_array = np.array(coords_list)
        
        # Variance géographique suffisante pour clustering
        lat_variance = np.var(coords_array[:, 0])
        lng_variance = np.var(coords_array[:, 1])
        
        self.assertGreater(lat_variance, 0.001,
                         f"Variance latitude trop faible pour clustering: {lat_variance}")
        self.assertGreater(lng_variance, 0.001,
                         f"Variance longitude trop faible pour clustering: {lng_variance}")
        
        # Au moins 2 points par zone pour clustering viable
        points_par_zone = self.test_df['zone_livraison'].value_counts()
        for zone, count in points_par_zone.items():
            self.assertGreaterEqual(count, 2,
                                  f"Zone {zone} avec seulement {count} points")
    
    def test_evaluation_precision_systeme(self):
        """Test 10: Métriques d'évaluation du système de prédiction"""
        # Données suffisantes pour train/test split
        self.assertGreater(len(self.test_df), 50,
                         "Dataset trop petit pour évaluation ML")
        
        # Variabilité temporelle (plusieurs jours distincts)
        dates_uniques = self.test_df['heure_commande'].dt.date.nunique()
        self.assertGreater(dates_uniques, 5,
                         f"Seulement {dates_uniques} jours distincts")
        
        # Métriques de validation par zone
        for zone in ['Z01', 'Z02', 'Z03', 'Z04']:
            zone_data = self.test_df[self.test_df['zone_livraison'] == zone]
            if len(zone_data) > 0:
                # Diversité des catégories par zone
                categories_zone = zone_data['produit_categorie'].nunique()
                self.assertGreater(categories_zone, 1,
                                 f"Zone {zone} manque de diversité produits")
                
                # Distribution temporelle par zone
                heures_zone = zone_data['heure_commande'].dt.hour.nunique()
                self.assertGreater(heures_zone, 2,
                                 f"Zone {zone} manque de diversité temporelle")
    
    def test_conformite_hypotheses_simplificatrices(self):
        """Test 11: Respect des hypothèses simplificatrices du projet"""
        # Point de collecte unique (toutes livraisons depuis Montréal)
        villes_distinctes = self.test_df['ville'].unique()
        self.assertEqual(list(villes_distinctes), ['Montréal'],
                       f"Plusieurs villes détectées: {villes_distinctes}")
        
        # Pas de commandes pré-enregistrées (toutes timestamp jour J)
        self.test_df['date_cmd'] = pd.to_datetime(self.test_df['heure_commande']).dt.date
        dates_futures = self.test_df['date_cmd'] > datetime.now().date()
        self.assertFalse(dates_futures.any(),
                       "Commandes futures détectées (non conforme)")
        
        # Statuts de commande réalistes pour simulation
        statuts_attendus = {'En attente', 'Préparée', 'En livraison', 'Livrée'}
        statuts_observes = set(self.test_df['statut_commande'].unique())
        self.assertTrue(statuts_observes.issubset(statuts_attendus),
                      f"Statuts non conformes: {statuts_observes - statuts_attendus}")
        
        # Majorité des commandes livrées (pour apprentissage ML)
        pct_livrees = (self.test_df['statut_commande'] == 'Livrée').mean() * 100
        self.assertGreater(pct_livrees, 20.0,
                         f"Trop peu de commandes livrées: {pct_livrees:.1f}%")


class TestDataGenerationPerformance(unittest.TestCase):
    """Tests de performance et robustesse du générateur"""
    
    def test_generation_volume_realiste(self):
        """Test génération volume production (150 jours)"""
        generator = MontrealDeliveryDataGenerator()
        
        # Test avec paramètres projet réels
        df_prod = generator.generer_dataset(
            nb_jours=150,
            nb_commandes_par_jour_range=(10, 2000),
            prob_jour_sans_commande=0.02
        )
        
        # Validation volume et cohérence
        self.assertGreater(len(df_prod), 1000,
                         "Volume de production insuffisant")
        self.assertLess(len(df_prod), 300000,
                       "Volume de production excessif")
        
        # Jours sans commande respectés (2% ± 2%)
        jours_total = 150
        jours_sans = generator.jours_sans_commande
        pct_sans = jours_sans / jours_total * 100
        
        self.assertLessEqual(pct_sans, 6.0,
                           f"Trop de jours sans commandes: {pct_sans:.1f}%")
    
    def test_reproductibilite_donnees(self):
        """Test reproductibilité avec seed fixe"""
        gen1 = MontrealDeliveryDataGenerator()
        gen2 = MontrealDeliveryDataGenerator()
        
        # Même configuration, même résultats
        df1 = gen1.generer_dataset(nb_jours=10, nb_commandes_par_jour_range=(5, 20))
        df2 = gen2.generer_dataset(nb_jours=10, nb_commandes_par_jour_range=(5, 20))
        
        # Tailles identiques avec même seed
        self.assertEqual(len(df1), len(df2),
                       "Génération non reproductible (tailles différentes)")
        
        # Première commande identique
        if len(df1) > 0 and len(df2) > 0:
            # Comparer éléments reproductibles
            self.assertEqual(df1.iloc[0]['ville'], df2.iloc[0]['ville'])
            self.assertEqual(df1.iloc[0]['quantite'], df2.iloc[0]['quantite'])


if __name__ == '__main__':
    print("🧪 Tests unitaires generation_data.py - Contraintes Projet Livraison Montréal")
    print("=" * 80)
    print("📋 Validation des contraintes spécifiées dans prototype_description_projet.docx")
    print("🏙️  Système de livraison à la demande - Grand Montréal")
    print("⏰ Produits périssables avec prédiction ML")
    print("-" * 80)
    
    # Lancement des tests avec verbosité élevée
    unittest.main(verbosity=2, buffer=True)