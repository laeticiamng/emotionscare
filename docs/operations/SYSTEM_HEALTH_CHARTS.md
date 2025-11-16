# 📊 Graphiques d'Historique Système

## Vue d'ensemble

Le tableau de bord de santé système inclut maintenant des **graphiques d'historique avancés** permettant de visualiser l'évolution des métriques de performance sur différentes périodes (7, 30 ou 90 jours) avec des **comparaisons automatiques** et des **analyses de tendance**.

## 🎯 Fonctionnalités

### 1. Sélection de Période
- **7 jours** : Vue hebdomadaire pour le monitoring court terme
- **30 jours** : Vue mensuelle pour identifier les patterns
- **90 jours** : Vue trimestrielle pour l'analyse stratégique

### 2. Cartes de Comparaison
Chaque métrique clé affiche automatiquement :
- **Tendance** : ↗️ Hausse, ↘️ Baisse, ou Stable
- **Variation (%)** : Pourcentage de changement entre première et seconde moitié de période
- **Statut visuel** : 
  - 🟢 Vert = amélioration
  - 🔴 Rouge = dégradation
  - ⚪ Gris = stable

### 3. Graphiques Interactifs

#### 📈 Disponibilité & Performance
- **Type** : Graphique en aires (Area Chart)
- **Métriques** :
  - Uptime (%) - Axe gauche
  - Latence moyenne (ms) - Axe droite
- **Éléments visuels** :
  - Lignes de référence pour les seuils configurés
  - Dégradés de couleur pour meilleure lisibilité
  - Tooltip avec détails au survol

#### 📊 Erreurs & Alertes
- **Type** : Graphique en barres (Bar Chart)
- **Métriques** :
  - Taux d'erreur (%) - Axe gauche
  - Alertes par heure - Axe droite
- **Éléments visuels** :
  - Barres arrondies pour esthétique moderne
  - Seuils critiques en lignes pointillées
  - Codage couleur : Rouge (erreurs), Orange (alertes)

#### 💻 Ressources Système
- **Type** : Graphique linéaire (Line Chart)
- **Métriques** :
  - CPU (%)
  - Mémoire (%)
- **Éléments visuels** :
  - Seuils d'attention (80%) et critique (90%)
  - Points de données cliquables
  - Courbes lissées pour meilleure lecture

## 📊 Calcul des Comparaisons

Les comparaisons sont calculées automatiquement selon cette formule :

```typescript
changement (%) = ((Moyenne 2e moitié - Moyenne 1ère moitié) / Moyenne 1ère moitié) × 100
```

**Exemples** :
- Uptime : Augmentation = 🟢 BON
- Latence : Diminution = 🟢 BON
- Erreurs : Diminution = 🟢 BON
- Alertes : Diminution = 🟢 BON

## 🎨 Palette de Couleurs

Utilise le **système de design sémantique** EmotionsCare :

```css
--primary: Courbes principales (Uptime, CPU)
--accent: Courbes secondaires (Latence, Mémoire)
--destructive: Erreurs et seuils critiques
--warning: Alertes et seuils d'attention
--border: Grilles et bordures
--muted-foreground: Textes et légendes
```

## 🔄 Rafraîchissement

- **Intervalle** : 30 secondes
- **Méthode** : Polling automatique via React Query
- **Cache** : Données mises en cache pour performance optimale

## 📱 Responsive Design

Les graphiques s'adaptent automatiquement :
- **Desktop** : Pleine largeur avec tous les détails
- **Tablet** : Ajustement de la taille des labels
- **Mobile** : Orientation paysage recommandée pour graphiques

## 🚀 Utilisation

### Accès
1. Naviguer vers `/admin/system-health`
2. Sélectionner la période d'analyse (7/30/90 jours)
3. Observer les tendances et comparaisons automatiques

### Analyse des Tendances

**Indicateurs de Performance** :
- ✅ **Bon** : Uptime > 99%, Latence < 200ms, Erreurs < 1%
- ⚠️ **Attention** : Uptime 95-99%, Latence 200-500ms, Erreurs 1-5%
- 🔴 **Critique** : Uptime < 95%, Latence > 500ms, Erreurs > 5%

**Patterns à surveiller** :
- 📈 **Dégradation progressive** : Latence qui augmente sur 7+ jours
- ⚡ **Pics récurrents** : Erreurs à heures fixes (charge, maintenance)
- 🔄 **Cycles hebdomadaires** : Variations régulières jour/nuit
- 📉 **Chutes soudaines** : Incidents ou déploiements problématiques

## 🎓 Cas d'Usage

### 1. Analyse Post-Déploiement
Comparer les métriques sur 7 jours avant/après un déploiement :
```
1. Sélectionner "7 jours"
2. Observer les cartes de comparaison
3. Vérifier si tendances positives (vert) ou négatives (rouge)
```

### 2. Planning Capacité
Utiliser vue 30/90 jours pour anticiper besoins :
```
1. Sélectionner "30 jours" ou "90 jours"
2. Analyser graphique CPU/Mémoire
3. Projeter croissance future
4. Planifier upgrades infrastructure
```

### 3. Investigation d'Incident
Identifier patterns avant incident :
```
1. Sélectionner période incluant l'incident
2. Corréler pics d'erreurs avec autres métriques
3. Identifier cause racine (CPU, latence, etc.)
```

### 4. Reporting Exécutif
Générer insights pour direction :
```
1. Vue 30 ou 90 jours pour tendances long terme
2. Capturer cartes de comparaison (screenshots)
3. Mettre en évidence améliorations (vert) ou dégradations (rouge)
```

## 🔧 Configuration Avancée

### Personnaliser les Seuils
Les seuils sont configurables via le dialogue "Configurer les Seuils" :
- **Seuil d'Alerte** : Déclenche warning
- **Seuil Critique** : Déclenche alerte critique + notification

### Exporter les Données
Les graphiques peuvent être exportés via le bouton "Export" :
- **Format Excel** : Toutes les données brutes + graphiques
- **Format PDF** : Rendu visuel pour présentations

## 🤝 Intégration

### Avec Système de Notifications
Les seuils configurés dans les graphiques déclenchent automatiquement :
- 🔔 **Notifications push** navigateur
- 📧 **Emails** hebdomadaires automatiques
- 🎫 **Tickets** auto-créés pour incidents critiques

### Avec Tests A/B
Corrélation possible entre :
- Performance système ↔️ Résultats tests A/B
- Charges système ↔️ Comportement utilisateurs
- Incidents ↔️ Métriques business

## 📝 Notes Techniques

- **Bibliothèque** : Recharts (React + D3)
- **Base de données** : Table `system_health_metrics`
- **Agrégation** : Moyennes journalières calculées côté client
- **Format dates** : `date-fns` avec locale FR

## 🆘 Troubleshooting

### Graphiques vides
**Cause** : Pas de données collectées
**Solution** : Vérifier cron job `collect-system-metrics` (voir `SYSTEM_HEALTH_SETUP.md`)

### Performances lentes
**Cause** : Trop de données chargées
**Solution** : Réduire période à 7 ou 30 jours au lieu de 90

### Comparaisons incohérentes
**Cause** : Données manquantes dans période
**Solution** : Attendre collecte complète sur toute la période

---

**Dernière mise à jour** : 2025-11-13  
**Version** : 1.0  
**Auteur** : EmotionsCare DevOps Team
