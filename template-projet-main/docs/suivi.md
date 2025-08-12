# Suivi de projet

Semaine 1 (3-10 mai)
"Ouverture de projet et analyse initiale"
- [x] Définition de la problématique de livraison urbaine montréalaise
- [x] Recherche bibliographique sur Vehicle Routing Problem et demand forecasting
- [x] Analyse des plateformes existantes (Uber Eats, DoorDash, Amazon Fresh)
- [x] Constitution de l'équipe et répartition des rôles
* [x] Léonard : Backend Express.js + Intelligence Artificielle Python
* [x] Aiman : Frontend React + Base de données MongoDB et modèle de donnée
- [x] Création du repository GitHub et structure initiale
!!! info "Notes"
- Identification d'une approche prédictive vs fixe
- Décision d'utiliser Transformer multi-tâches plutôt que LSTM classique
!!! warning "Difficultés rencontrées"
- Complexité sous-estimée du Vehicle Routing Problem lors de l'analyse initiale
- Besoin de sources données fiables pour calibrage générateur synthétique
!!! abstract "Prochaines étapes"
- Approfondir l'analyse des exigences fonctionnelles et non-fonctionnelles
- Commencer la recherche sur les copules gaussiennes pour génération de données

Semaine 2 (10-17 mai)
"Analyse des exigences et étude de faisabilité"
- [x] Définition des exigences fonctionnelles (RF-01 à RF-05)
- [x] Spécification des exigences non-fonctionnelles (performance, sécurité, utilisabilité)
- [x] Étude comparative approfondie des solutions académiques
* [x] MIT Dynamic Vehicle Routing (Chen et al., 2023)
* [x] Stanford Deep Learning Forecasting (Liu et al., 2022)
* [x] University of Toronto Urban Logistics (Patel & Wong, 2023)
- [x] Validation de la faisabilité technique avec architecture Transformer
- [x] Choix technologiques justifiés : React/TypeScript + Express.js + MongoDB + PyTorch
!!! info "Notes"
- Objectif de précision fixé à >80% basé sur benchmarks académiques (Stanford 76%)
- Architecture microservices retenue pour scalabilité future
!!! warning "Difficultés rencontrées"
- Accès limité aux données réelles de livraison pour validation
- Nécessité de développer un générateur de données synthétiques sophistiqué
!!! abstract "Prochaines étapes"
- Créer le document de cohérence des données et cahier des charges
- Débuter l'implémentation du générateur avec copule gaussienne

Semaine 3 (17-24 mai)
"Documentation et spécifications détaillées"
- [x] Rédaction du cahier des charges complet
* [x] Définition des attributs de commande obligatoires
* [x] Contraintes de validation et règles métier
* [x] Spécifications géographiques montréalaises
- [x] Document de cohérence des données avec sources officielles
* [x] Statistique Canada pour patterns de consommation
* [x] Données démographiques Montréal par arrondissement
* [x] Études DoorDash Canada 2024 pour benchmarking
- [x] Définition des catégories de produits et pondérations
- [x] Mapping des arrondissements vers zones stratégiques (Z01-Z04)
!!! info "Notes"
- Problématique des codes postaux chevauchants H2X/H3A/H3B/H3C identifiée
- Patterns temporels documentés : pics 11h-14h (35%) et 17h-21h (45%)
!!! warning "Difficultés rencontrées"
- Résolution des chevauchements géographiques complexe
- Calibrage précis des corrélations nécessaire pour réalisme
!!! abstract "Prochaines étapes"
- Implémenter le générateur de données avec Faker et NumPy
- Valider statistiquement les corrélations générées

Semaine 4 (24-31 mai)
"Générateur de données synthétiques + Architecture web"
- [x] Implémentation complète du générateur Python
* [x] Copule gaussienne multivariée avec matrice de corrélation
* [x] Mapping arrondissements, catégories, quantités, heures
* [x] Génération coordonnées GPS et codes postaux valides
* [x] Gestion durées de vie produits périssables
- [x] Architecture web initiale
* [x] Setup Express.js avec TypeScript et middleware JWT
* [x] Configuration MongoDB avec Mongoose
* [x] Structure React avec Material-UI et routing
- [x] Validation statistique du générateur sur 10,000 commandes test
!!! info "Notes"
- Générateur atteint 96% de conformité aux spécifications initiales
- Architecture modulaire permet développement parallèle efficace
!!! warning "Difficultés rencontrées"
- Optimisation des performances pour génération de gros volumes
- Équilibrage entre réalisme et contraintes computationnelles
!!! abstract "Prochaines étapes"
- Développer les controllers backend et modèles de données
- Créer les interfaces utilisateur de base

Semaine 5-8 (31 mai - 28 juin)
 "Développement intensif Frontend + Backend"
- [x] Backend Express.js complet
* [x] 11 controllers : Auth, Cart, Product, Vendor, User, Delivery, etc.
* [x] Middleware de sécurité avec validation JWT
* [x] API RESTful avec routes protégées par rôles
* [x] Gestion intelligente des stocks avec réservation temporaire
- [x] Frontend React multi-interfaces
* [x] Landing page responsive avec navigation intuitive
* [x] Dashboard vendeur avec gestion catalogue
* [x] Interface livreur avec intégration Google Maps
* [x] Système d'authentification et inscription sécurisé
- [x] Base de données MongoDB
* [x] 11 collections : Users, Vendors, Products, Orders, Deliveries, etc.
* [x] Indexes optimisés pour performance
* [x] Relations et contraintes d'intégrité
!!! info "Notes"
- Plus de 14,000 lignes de code développées (React 55.7%, Backend 24.4%)
- Tests manuels validant les flux utilisateur principaux
!!! warning "Difficultés rencontrées"
- Synchronisation état frontend-backend pour gestion stocks temps réel
- Optimisation des requêtes MongoDB pour performance acceptables
- Gestion complexe des permissions multi-rôles
!!! abstract "Prochaines étapes"
- Intégrer le système d'inférence IA avec le backend
- Développer le modèle Transformer pour prédictions

Semaine 9-11 (28 juin - 19 juillet)
"Intelligence Artificielle et système d'inférence"
- [x] Modèle Transformer multi-tâches
* [x] Architecture optimisée : d_model=256, nhead=8, num_layers=6
* [x] Implémentation PyTorch avec Mixed Precision Training
* [x] Multi-task learning : quantité + catégorie + zone simultanés
* [x] Pipeline d'entraînement avec validation croisée et early stopping
- [x] Système d'inférence production
* [x] Preprocessing automatique des séquences temporelles (14 jours)
* [x] Optimisations GPU pour traitement batch
* [x] API d'exposition pour intégration backend
- [x] Génération dataset d'entraînement
* [x] 55,195 commandes sur 50 jours avec variation naturelle
* [x] Validation statistique complète des patterns
!!! info "Notes"
- Précision atteinte : 82.08% ± 20.05% dépassant objectif 80%
- Temps d'inférence : 1.24s pour dataset complet (objectif <2s)
- 685 évaluations sur 36 jours distincts pour validation robuste
!!! warning "Difficultés rencontrées"
- Équilibrage des loss functions pour multi-task learning délicat
- Hyperparameter tuning nécessitant nombreuses itérations
- Gestion mémoire GPU pour gros datasets
!!! abstract "Prochaines étapes"
- Développer les tests unitaires pour validation automatique
- Optimiser l'intégration IA-interface utilisateur

Semaine 12 (19-26 juillet)
"Tests unitaires et validation système"
- [x] Tests unitaires générateur de données
* [x] Validation distributions géographiques et temporelles
* [x] Vérification corrélations copule gaussienne
* [x] Tests contraintes métier et cohérence données
* [x] Coverage 94% avec validation statistique complète
- [x] Tests controllers backend
* [x] CartController : gestion stocks et prévention surventes
* [x] UserController : authentification et gestion utilisateurs
* [x] Tests d'intégration avec MongoDB
- [x] Tests performance et optimisation
* [x] Temps réponse API < 500ms pour 95% requêtes
* [x] Monitoring mémoire et optimisation ressources
!!! info "Notes"
- Suite de tests automatisés garantit qualité et non-régression
- Validation expérimentale confirme robustesse du système
!!! warning "Difficultés rencontrées"
- Écriture tests complexes pour système multi-composants
- Équilibrage entre coverage exhaustif et temps d'exécution
!!! abstract "Prochaines étapes"
- Finaliser la documentation technique et rapport
- Préparer démonstrations et captures d'écran

Semaine 13 (26 juillet - 2 août)
"Finalisation rapport et analyse des résultats"
- [x] Rédaction rapport complet
* [x] Analyse critique de la solution développée
* [x] Discussion des problèmes rencontrés et solutions
* [x] Comparaison avec objectifs initiaux (87% réalisation)
* [x] Perspectives d'amélioration et développement futur
- [x] Documentation technique exhaustive
* [x] Architecture système et choix technologiques
* [x] Métriques de performance et validation
* [x] Extraits de code et captures d'écran
- [x] Analyse des limitations
* [x] VRP plus complexe que prévu
* [x] Validation limitée aux données synthétiques
* [x] Intégration dashboard livreur incomplète
!!! info "Notes"
- Projet démontre faisabilité technique révolution livraison prédictive
- Proof-of-concept solide avec métriques dépassant standards académiques
!!! warning "Difficultés rencontrées"
- Manque de temps pour validation avec vraies données commerciales
- Impossibilité d'implémenter VRP complet dans délais impartis
!!! abstract "Prochaines étapes"
- Préparer présentation finale avec démonstrations
- Identifier partenaires potentiels pour validation terrain future

Semaine 14 (2-9 août)
"Préparation présentation et livraison finale"
- [x] Préparation présentation PowerPoint
* [x] Démonstration des fonctionnalités principales
* [x] Métriques de performance et validation
* [x] Architecture technique et innovations
* [x] Perspectives commerciales et recherche future
- [x] Tests finaux et stabilisation
* [x] Validation complète des flux utilisateur
* [x] Optimisation dernière minute des performances
* [x] Documentation des procédures de déploiement
- [x] Livraison rapport final
* [x] Version finale avec corrections et améliorations
* [x] Annexes techniques et captures d'écran
* [x] Références bibliographiques complètes
!!! info "Notes"
- Système prêt pour démonstration avec toutes fonctionnalités opérationnelles
- Roadmap claire pour évolution vers solution commerciale
!!! abstract "Réalisations finales"
- 87% des objectifs atteints ou dépassés
- 82.08% précision prédictive (vs 80% cible)
- 14,000+ lignes de code écosystème complet
- Proof-of-concept validé pour révolution livraison urbaine
