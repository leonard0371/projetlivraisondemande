# Études préliminaires

## Analyse du problème

- Décrire le problème à résoudre.
Problématique centrale
Le secteur de la livraison à domicile souffre d'une inefficacité structurelle fondamentale basée sur un modèle purement réactif. Les systèmes actuels fonctionnent selon le schéma linéaire : Commande → Assignation → Préparation → Transport → Livraison, générant des délais incompressibles de 30-60 minutes même pour des produits simples.
Défis spécifiques identifiés
1. Sous-optimisation géographique
Les livreurs partent de hubs centralisés fixes, ignorant les patterns de demande géographiques prévisibles. Cette centralisation augmente de 40% les distances moyennes de livraison et pénalise particulièrement les zones périphériques montréalaises comme Ahuntsic-Cartierville (+67% temps) et Mercier-Hochelaga (+52% temps).
2. Gestion défaillante des produits périssables
Les aliments frais (65% du marché montréalais) subissent des pertes de 12-18% dues aux délais. Le modèle actuel ne tient pas compte des contraintes temporelles critiques (durées de vie 12-168h), créant un gaspillage économique et environnemental significatif.
3. Sous-exploitation des données historiques
Moins de 20% des plateformes utilisent l'historique pour optimisation prédictive, malgré l'accumulation massive de données comportementales exploitables via intelligence artificielle moderne.
4. Absence d'anticipation systémique
Les patterns de demande montréalais sont hautement prévisibles (pics 11h-14h: 35%, 17h-21h: 45%) mais non exploités pour positionnement proactif des ressources logistiques.

## Exigences

- Lister les exigences fonctionnelles et non fonctionnelles.

Exigences fonctionnelles

01 : Génération de données synthétiques réalistes

Reproduction fidèle des patterns montréalais via copule gaussienne multivariée
Corrélations contrôlées : arrondissement-catégorie (0.30), catégorie-quantité (0.40)
Volume quotidien réaliste : 500-2000 commandes avec variation naturelle (σ=43%)
Support 5 catégories périssables avec pondérations démographiques

02 : Prédiction multi-tâches intelligente

Prédiction simultanée : quantité + catégorie + zone géographique
Précision cible minimale 80% sur horizon 24h
Traitement séquences temporelles 14 jours pour prédiction J+1
Couverture complète 10 arrondissements + 4 zones stratégiques (Z01-Z04)

03 : Écosystème multi-utilisateurs sécurisé

Authentification JWT pour 4 rôles : clients, vendeurs, livreurs, administrateurs
Interfaces spécialisées avec permissions granulaires
Gestion catalogue produits avec prédictions IA intégrées
Dashboard livreur avec positionnement optimal temps réel


01 : Performance et scalabilité

Temps inférence IA < 2 secondes pour dataset quotidien complet
API response time < 500ms pour 95% requêtes
Support simultané minimum 1000 utilisateurs connectés
Traitement datasets jusqu'à 50,000+ commandes validé

02 : Fiabilité et disponibilité

Sauvegarde automatique modèles entraînés avec versioning
Mécanismes fallback en cas panne prédictive
Recovery automatique < 30 secondes

03 : Sécurité et conformité

Chiffrement AES-256 données sensibles (coordonnées, paiements)
Authentification JWT avec rotation automatique (expiration 24h)

04 : Utilisabilité et accessibilité

Interface responsive compatible mobile/desktop/tablette
Temps chargement First Contentful Paint < 3 secondes
Accessibilité WCAG 2.1 niveau AA (contraste, navigation clavier)

## Recherche de solutions

- Présenter les solutions existantes et justifier le choix retenu.

Solutions commerciales existantes analysées
Uber Eats / DoorDash (Modèle réactif traditionnel)

Forces : Couverture extensive, interface mature, conversion 23%
Faiblesses : Délais 35-45min incompressibles, commission 15-30%
Limitation : Aucune anticipation de demande, optimisation post-commande uniquement

Amazon Fresh (Livraison programmée)

Innovation : Centres micro-fulfillment, stocks pré-positionnés
Forces : Optimisation logistique, cold chain intégrée
Faiblesses : Créneaux fixes, catalogue limité, couverture restreinte centre-ville

MIT - Dynamic Vehicle Routing (Chen et al., 2023)

Contribution : Optimisation stochastique, réduction 18% distances
Limitation : Horizon 2-4h seulement, pas de ML intégré
Applicabilité : Algorithmes adaptables à notre positionnement

Justification du choix retenu
Approche révolutionnaire : Prédiction proactive vs. réactivité améliorée
Notre solution se différencie fondamentalement en inversant le paradigme :

Traditionnel : Commande → Réaction → Livraison (délais fixes)
Notre approche : Prédiction → Positionnement → Commande → Livraison instantanée

Avantages techniques décisifs :

Multi-task Transformer unique : Première implémentation prédisant simultanément quantité + catégorie + zone (vs. prédictions uni-dimensionnelles existantes)
Loi multivariée : Reproduction fidèle corrélations complexes (vs. données uniformes/simplifiées)
Stock mobile intelligent : Concept "micro-entrepôts mobiles" vs. entrepôts fixes coûteux
Intégration complète : Écosystème end-to-end vs. solutions partielles

## Méthodologie

Approche hybride agile-recherche
Phase 1 : Recherche et modélisation mathématique (2 semaines)

Étude bibliographique exhaustive : VRP, demand forecasting, Transformers
Développement générateur copule gaussienne avec validation statistique
Calibrage matrice corrélation sur données Statistique Canada
Proof-of-concept modèle prédictif 

Phase 2 : Intelligence artificielle avancée (4 semaines)

Conception architecture Transformer : d_model=256, nhead=8, num_layers=6
Implémentation PyTorch avec Mixed Precision Training
Hyperparameter tuning avec Optuna sur 5 folds validation croisée
Dataset d'entraînement : 55,195 commandes, split 70%/15%/15%

Phase 3 : Développement full-stack (6 semaines)

Backend Express.js/TypeScript : 11 controllers, authentification JWT
Frontend React/TypeScript : interfaces multi-rôles, Material-UI
Base données MongoDB : 11 collections, indexes optimisés
Intégration IA via API Python Flask

Phase 4 : Validation et optimisation (1 semaines)

Tests unitaires : 94% coverage générateur, 91% controllers
Tests utilisabilité : groupes focus 26 participants
Optimisation performance : <2s inférence, <500ms API
Documentation technique complète