# 🎯 Dashboard Unifié - Guide Complet

## Vue d'ensemble

Le **Dashboard Unifié** (`/admin/unified`) est la plateforme de monitoring consolidée qui combine trois dashboards clés en une seule interface :
- 📊 **Executive Dashboard** : Métriques business et ROI
- 🏥 **System Health** : Santé système et performance
- 🚨 **Incident Reports** : Gestion des incidents avec analyse ML

## 🌟 Fonctionnalités Clés

### 1. Score de Santé Global (0-100)

Le score est calculé automatiquement en combinant :
- **30%** Uptime système
- **20%** Taux d'erreur (inversé)
- **20%** Incidents ouverts (inversé)
- **30%** ROI financier

**Interprétation** :
- 🟢 **80-100** : Excellent - Tout fonctionne parfaitement
- 🟡 **60-79** : Bon - Quelques points d'attention
- 🔴 **0-59** : Attention - Action requise immédiatement

### 2. KPIs Unifiés en Temps Réel

#### Performance Financière
- **Coût total escalades** : Somme des coûts sur 3 derniers mois
- **Valeur sauvée** : Économies générées par optimisations
- **Bénéfice net** : Valeur sauvée - Coûts
- **ROI %** : Pourcentage de retour sur investissement

#### Santé Système
- **Uptime** : Disponibilité système en %
- **Taux d'erreur** : Pourcentage d'erreurs
- **Score santé** : Indicateur composite 0-100

#### Gestion Incidents
- **Incidents ouverts** : Nombre d'incidents actifs
- **Critiques** : Incidents de sévérité critique
- **Résolution moyenne** : Temps moyen en minutes
- **Escalades actives** : Nombre d'escalades en cours

### 3. Métriques Croisées

Le dashboard affiche des **métriques croisées** qui corrèlent différents aspects :

```
Performance Financière ↔️ Santé Système
• ROI élevé + Uptime élevé = ✅ Excellent
• ROI bas + Erreurs élevées = ⚠️ Investigation requise

Incidents ↔️ Escalades
• Incidents critiques + Escalades élevées = 🚨 Alerte
• Peu d'incidents + Résolution rapide = ✅ Bon état
```

## 📊 Onglets de Navigation

### Onglet "Vue d'ensemble"

Affiche :
- **Incidents Critiques Récents** (5 derniers)
  - Sévérité, statut, timestamp
  - Confiance ML de l'analyse root cause
- **Escalades Actives** (5 dernières)
  - Niveau d'escalade (1-5)
  - Durée active
  - Statut

### Onglet "Business"

Dashboard exécutif complet :
- Graphiques ROI 3/6/12 mois
- Coûts vs Valeur sauvée
- Temps économisé
- Tests A/B gagnants
- Export Excel/PDF

### Onglet "Santé Système"

Monitoring système détaillé :
- KPIs en temps réel (CPU, Mémoire, Latence)
- Graphiques historiques 7/30/90 jours
- Seuils configurables
- Alerting automatique

### Onglet "Incidents"

Gestion complète des incidents :
- Liste tous les incidents
- Détails avec analyse ML
- Timeline événements
- Actions correctives recommandées
- Post-mortem automatique
- Export rapports PDF/Excel

## 🔄 Rafraîchissement Automatique

| Donnée | Intervalle |
|--------|-----------|
| Score de santé global | 10 secondes |
| Métriques système | 10 secondes |
| Incidents | 30 secondes |
| Métriques business | 60 secondes |
| Escalades actives | 5 secondes |

## 🚀 Cas d'Usage

### 1. Monitoring Quotidien (Morning Standup)

**Routine** :
1. Ouvrir `/admin/unified`
2. Vérifier Score de Santé Global
3. Si < 80 : investiguer la section rouge
4. Vérifier incidents critiques ouverts
5. Examiner escalades actives niveau 3+

**Temps estimé** : 2-3 minutes

### 2. Revue Hebdomadaire avec Direction

**Processus** :
1. Onglet "Business" → Export PDF
2. Présenter ROI et valeur sauvée
3. Montrer tendances 3 mois
4. Discuter top incidents de la semaine
5. Partager recommandations ML

**Temps estimé** : 15-20 minutes

### 3. Investigation d'Incident

**Workflow** :
1. Alerte → Ouvrir Dashboard Unifié
2. Section "Incidents Critiques" → Cliquer incident
3. Lire analyse ML root cause
4. Appliquer actions correctives recommandées
5. Monitorer métriques système en parallèle
6. Marquer incident comme résolu

**Temps estimé** : 30-60 minutes selon complexité

### 4. Optimisation Proactive

**Stratégie** :
1. Analyser graphiques tendance (onglet Health)
2. Identifier patterns récurrents
3. Consulter recommandations ML (onglet Incidents)
4. Implémenter mesures préventives
5. Monitorer impact sur Score Global

**Temps estimé** : 1-2 heures/semaine

## 🎨 Interface Utilisateur

### Codes Couleurs

```css
🟢 Vert : Bon état, objectifs atteints
🟡 Jaune : Attention, à surveiller
🔴 Rouge : Critique, action immédiate requise
⚪ Gris : Neutre, informations contextuelles
```

### Badges

- **Excellent** : Score > 80, tout va bien
- **Bon** : Score 60-79, quelques optimisations possibles
- **Attention** : Score < 60, actions correctives nécessaires

### Icônes Clés

| Icône | Signification |
|-------|---------------|
| 🎯 Activity | Score de santé, monitoring actif |
| 💰 DollarSign | Métriques financières, coûts |
| ⚡ Zap | Performance, automation, rapidité |
| 🚨 AlertTriangle | Incidents, alertes, problèmes |
| ✅ CheckCircle2 | Résolu, validé, OK |
| 🧠 Brain | Analyse ML, IA, recommandations |
| 📈 TrendingUp | Amélioration, croissance |
| 📉 TrendingDown | Dégradation, décroissance |

## 📱 Accès & Permissions

### Rôles Autorisés

- ✅ **admin** : Accès complet, toutes fonctionnalités
- ✅ **b2b-admin** : Accès complet pour clients B2B
- ❌ **consumer** : Pas d'accès
- ❌ **b2c** : Pas d'accès

### Navigation

**URL** : `/admin/unified`

**Menu** :
1. Sidebar admin → "Dashboard Unifié"
2. Ou : `/admin/executive` → Lien vers vue unifiée
3. Ou : `/admin/system-health` → Lien vers vue unifiée

## 🔧 Configuration

### Personnaliser les Poids du Score Global

Modifier dans `UnifiedAdminDashboard.tsx` :

```typescript
healthScore: Math.round(
  (uptimePercentage * 0.3) +        // 30% uptime
  ((100 - errorRate) * 0.2) +       // 20% erreurs
  ((openIncidents === 0 ? 100 : Math.max(0, 100 - (openIncidents * 10))) * 0.2) + // 20% incidents
  ((roiPercentage > 0 ? Math.min(100, roiPercentage) : 0) * 0.3) // 30% ROI
)
```

**Recommandations selon contexte** :
- **Startup** : ROI 40%, Uptime 30%, Incidents 20%, Erreurs 10%
- **Enterprise** : Uptime 40%, Erreurs 30%, Incidents 20%, ROI 10%
- **SaaS** : Uptime 35%, Incidents 25%, ROI 25%, Erreurs 15%

### Ajuster Intervalles de Rafraîchissement

Pour économiser API calls :

```typescript
// Réduire fréquence (moins de calls)
refetchInterval: 30000, // 30s au lieu de 10s

// Augmenter réactivité (plus de calls)
refetchInterval: 5000, // 5s au lieu de 10s
```

## 🧪 Tests & Validation

### Checklist Qualité

- [ ] Score de santé s'affiche correctement
- [ ] KPIs chargent en < 2 secondes
- [ ] Rafraîchissement auto fonctionne
- [ ] Navigation entre onglets fluide
- [ ] Exports Excel/PDF fonctionnent
- [ ] Responsive design (mobile/tablet)
- [ ] Pas d'erreurs console
- [ ] Données cohérentes entre onglets

### Scénarios de Test

**Test 1: Score Santé**
```
1. Simuler incident critique → Score doit baisser
2. Résoudre incident → Score doit remonter
3. Vérifier calcul : (uptime*0.3 + (100-errors)*0.2 + ...)
```

**Test 2: Temps Réel**
```
1. Ouvrir dashboard
2. Déclencher alerte via edge function
3. Vérifier apparition dans <30s
4. Cliquer notification → Redirection correcte
```

**Test 3: Exports**
```
1. Onglet Business → Export PDF
2. Vérifier contenu complet (graphiques, données, reco ML)
3. Onglet Incidents → Export Excel
4. Ouvrir fichier → Vérifier sheets et colonnes
```

## 🆘 Dépannage

### Score de Santé à 0

**Cause** : Pas de données collectées  
**Solution** :
```sql
-- Vérifier données existent
SELECT COUNT(*) FROM executive_business_metrics;
SELECT COUNT(*) FROM system_health_metrics;
SELECT COUNT(*) FROM incident_reports;
```

### KPIs ne chargent pas

**Cause** : Erreur réseau ou DB  
**Solution** :
1. Ouvrir DevTools Console
2. Chercher erreurs React Query
3. Vérifier RLS policies Supabase
4. Tester requête SQL directement

### Rafraîchissement ne fonctionne pas

**Cause** : React Query cache désactivé  
**Solution** :
```typescript
// Vérifier refetchInterval présent
const { data } = useQuery({
  queryKey: ['key'],
  queryFn: async () => {...},
  refetchInterval: 10000, // IMPORTANT
});
```

### Données incohérentes entre onglets

**Cause** : Queries avec keys différentes  
**Solution** :
```typescript
// Invalider toutes les queries liées
queryClient.invalidateQueries({ queryKey: ['executive'] });
queryClient.invalidateQueries({ queryKey: ['health'] });
queryClient.invalidateQueries({ queryKey: ['incidents'] });
```

## 📈 Métriques de Succès

**Adoption** :
- Utilisé quotidiennement par > 80% admins
- Temps moyen session : 5-10 minutes
- Actions prises suite aux alertes : > 90%

**Performance** :
- Chargement initial < 3 secondes
- Score de santé toujours visible
- Pas de lag sur navigation onglets

**Business** :
- Réduction temps résolution incidents : -40%
- ROI positif maintenu > 3 mois
- Downtime réduit < 0.1%

## 🔮 Évolutions Futures

### Court Terme (1-2 mois)
- [ ] Alertes push navigateur pour Score < 60
- [ ] Prédictions ML tendances 7 jours
- [ ] Widgets personnalisables (drag & drop)
- [ ] Mode sombre

### Moyen Terme (3-6 mois)
- [ ] Intégration Slack/Teams pour notifications
- [ ] Dashboard mobile natif (React Native)
- [ ] Historique comparatif mois par mois
- [ ] Benchmarking industrie

### Long Terme (6-12 mois)
- [ ] IA générative pour recommandations personnalisées
- [ ] Prédiction proactive pannes système
- [ ] Auto-healing automatique incidents mineurs
- [ ] Intégration complète avec CI/CD

---

**Dernière mise à jour** : 2025-11-13  
**Version** : 1.0.0  
**Auteur** : EmotionsCare DevOps Team  
**Contact** : support@emotionscare.com
