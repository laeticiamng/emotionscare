# 📤 Guide d'Export des Rapports de Performance

## Vue d'ensemble

Le système d'export permet de générer des **rapports professionnels** des performances de monitoring (tests A/B, métriques d'escalade, prédictions ML) aux formats **Excel** et **PDF** avec logo EmotionsCare, données détaillées et recommandations ML automatiques.

## 🎯 Formats d'Export

### 📊 Format Excel (.xlsx)
**Contenu** :
- ✅ Feuille "Résumé" : Métadonnées du rapport
- ✅ Feuille "Données" : Toutes les données tabulaires
- ✅ Feuille "Recommandations ML" : Top recommandations prioritaires
- ✅ Colonnes auto-dimensionnées pour lisibilité optimale

**Cas d'usage** :
- Analyse de données approfondie
- Pivot tables et graphiques personnalisés
- Partage avec équipes data/analytics
- Archivage long terme

### 📄 Format PDF (via impression)
**Contenu** :
- ✅ En-tête avec logo EmotionsCare
- ✅ Titre et sous-titre du rapport
- ✅ Timestamp de génération
- ✅ Tables formatées avec alternance de couleurs
- ✅ Recommandations ML encadrées
- ✅ Footer EmotionsCare

**Cas d'usage** :
- Présentations exécutives
- Rapports clients/partenaires
- Documentation d'incidents
- Conformité/Audit

## 🚀 Utilisation

### Depuis Dashboard de Monitoring

1. **Ouvrir le Dashboard** :
   ```
   /admin/escalation-monitoring
   ```

2. **Naviguer vers onglet** :
   - "Vue d'Ensemble" ou "Graphiques Performance"

3. **Cliquer sur bouton "Export"** (icône FileDown)

4. **Configurer les options** :
   - ☑️ Inclure les graphiques (capture d'écran)
   - ☑️ Inclure les recommandations ML
   
5. **Sélectionner format** :
   - 📊 "Télécharger Excel" → génère fichier .xlsx
   - 📄 "Générer PDF" → ouvre dialogue d'impression

### Options d'Export

#### Inclure les Graphiques
- **Activé** : Capture d'écran des graphiques intégrée dans l'export
- **Désactivé** : Export uniquement des données tabulaires
- **Note** : Pour Excel, les graphiques sont capturés mais non intégrés (limitation technique)

#### Inclure les Recommandations ML
- **Activé** : Analyse automatique + top 10 recommandations
- **Désactivé** : Données brutes uniquement
- **Recommandé** : Toujours activé pour insights actionnables

## 🤖 Génération Automatique des Recommandations ML

Le système analyse automatiquement :

### 1. Tests A/B
```typescript
✅ Tests significatifs → "Déployer variants gagnants"
⚠️ Tests en cours → "Surveiller régulièrement"
```

### 2. Métriques d'Escalade
```typescript
✅ Précision > 90% → "Documenter best practices"
⚠️ Précision < 70% → "Optimiser règles d'escalade"
🔴 Temps résolution > 60min → "Augmenter ressources"
```

### 3. Prédictions ML
```typescript
Intègre les recommandations des prédicteurs ML récents
```

### 4. Patterns d'Erreurs
```typescript
Recommandations basées sur historique des erreurs
```

## 📊 Structure des Fichiers Excel

### Feuille "Résumé"
| Métrique | Valeur |
|----------|--------|
| Titre du rapport | Performance Tests A/B |
| Date de génération | 13/11/2025 21:35:42 |
| Nombre d'entrées | 47 |
| Recommandations ML | 8 |

### Feuille "Données"
Colonnes dynamiques basées sur le type de données :
- Tests A/B : `nom`, `statut`, `variant_control`, `variant_test`, `confidence`, `date_debut`, `date_fin`
- Métriques : `date`, `escalations_total`, `precision`, `temps_resolution`, `tickets_auto`

### Feuille "Recommandations ML"
| # | Recommandation | Priorité | Statut |
|---|----------------|----------|--------|
| 1 | Déployer variant gagnant test_checkout_v2 | Haute | À implémenter |
| 2 | Optimiser règles d'escalade pour améliorer précision | Haute | À implémenter |
| ... | ... | ... | ... |

## 📄 Génération PDF

### Méthode Native
Le système utilise la **fonctionnalité d'impression native du navigateur** pour générer des PDF :

**Avantages** :
- ✅ Aucune dépendance lourde (jspdf non requis)
- ✅ Rendu haute qualité
- ✅ Support multi-pages automatique
- ✅ Compatible tous navigateurs modernes

**Processus** :
1. Ouverture d'une nouvelle fenêtre
2. Injection du contenu formaté avec styles print
3. Ouverture dialogue d'impression
4. L'utilisateur choisit "Enregistrer en PDF"

### Styles d'Impression

```css
@media print {
  /* En-tête centré avec logo */
  .header { text-align: center; margin-bottom: 30px; }
  
  /* Tables professionnelles */
  table { border-collapse: collapse; }
  th { background-color: #667eea; color: white; }
  tr:nth-child(even) { background-color: #f9fafb; }
  
  /* Éviter coupures */
  .recommendation { page-break-inside: avoid; }
}
```

## 🎨 Personnalisation

### Logo EmotionsCare
- **Emplacement** : En-tête du PDF
- **Dimensions** : Max 150px largeur
- **Format** : PNG/SVG recommandé

### Couleurs de Marque
```css
--primary-color: #667eea   /* EmotionsCare Purple */
--secondary-color: #764ba2 /* EmotionsCare Violet */
--text-color: #333        /* Dark Gray */
--muted-color: #666       /* Medium Gray */
```

### Titres et Descriptions
Personnalisables via les props du composant :
```typescript
<ExportPerformanceReport
  testData={abTests}
  metricsData={metrics}
  mlPredictions={predictions}
  chartsContainerRef={chartsRef}
/>
```

## 📁 Nomenclature des Fichiers

### Excel
```
performance-monitoring-YYYY-MM-DD-HHmmss.xlsx
```
Exemple : `performance-monitoring-2025-11-13-213542.xlsx`

### PDF
```
Rapport_Performance_EmotionsCare_YYYY-MM-DD.pdf
```
Exemple : `Rapport_Performance_EmotionsCare_2025-11-13.pdf`

## 🔄 Automatisation

### Exports Programmés
Intégration possible avec cron jobs pour exports automatiques :

```sql
-- Exemple : Export hebdomadaire automatique
SELECT cron.schedule(
  'weekly-performance-export',
  '0 9 * * 1', -- Tous les lundis à 9h
  $$
  SELECT net.http_post(
    url:='https://votre-projet.supabase.co/functions/v1/export-performance',
    headers:='{"Authorization": "Bearer YOUR_KEY"}'::jsonb
  );
  $$
);
```

### Email avec Pièce Jointe
Combinaison avec `send-weekly-monitoring-report` pour envoyer exports par email.

## 📊 Cas d'Usage Avancés

### 1. Rapport Exécutif Mensuel
```
Période : 30 derniers jours
Format : PDF
Contenu : Métriques agrégées + Top 5 recommandations
Distribution : Direction + Stakeholders
```

### 2. Analyse Post-Incident
```
Période : Avant/Pendant/Après incident
Format : Excel
Contenu : Données détaillées + Timeline
Usage : Root Cause Analysis
```

### 3. Audit de Conformité
```
Période : Trimestre
Format : PDF + Excel
Contenu : Tous les tests A/B + Résolutions
Archivage : 7 ans (RGPD)
```

### 4. Revue de Performance Équipe
```
Période : Sprint (2 semaines)
Format : PDF
Contenu : Métriques d'escalade + Recommandations
Distribution : Équipe support
```

## 🔧 Dépannage

### Export Excel ne se télécharge pas
**Cause** : Bloqueur de popups ou erreur XLSX
**Solution** :
1. Autoriser popups pour le site
2. Vérifier console navigateur pour erreurs
3. Tester avec moins de données

### PDF mal formaté
**Cause** : CSS print non chargé
**Solution** :
1. Attendre 250ms avant impression (setTimeout)
2. Vérifier styles @media print
3. Tester sur navigateur différent

### Graphiques manquants dans export
**Cause** : `chartsContainerRef` non fourni
**Solution** :
```typescript
const chartsRef = useRef<HTMLDivElement>(null);
// ...
<div ref={chartsRef}>
  {/* Vos graphiques ici */}
</div>
```

### Recommandations ML vides
**Cause** : Pas assez de données pour analyse
**Solution** :
1. Attendre collecte de plus de métriques
2. Lancer au moins 1 test A/B
3. Vérifier prédictions ML actives

## 🔒 Sécurité & Confidentialité

### Données Sensibles
- ❌ Jamais d'informations personnelles (PII)
- ❌ Pas de secrets/tokens dans exports
- ✅ Uniquement métriques agrégées
- ✅ Anonymisation automatique

### Contrôle d'Accès
- Exports limités aux rôles **admin** et **b2b-admin**
- Authentification requise via Supabase
- Logs d'audit pour traçabilité

### Archivage
- **Recommandation** : Chiffrer exports avant stockage long terme
- **Rétention** : Supprimer exports après période légale
- **Compliance** : Respecter RGPD/CCPA selon juridiction

## 📚 Références

- [exportUtils.ts](./src/lib/exportUtils.ts) - Logique d'export
- [ExportPerformanceReport.tsx](./src/components/monitoring/ExportPerformanceReport.tsx) - Composant UI
- [XLSX Documentation](https://docs.sheetjs.com/) - Bibliothèque Excel

---

**Dernière mise à jour** : 2025-11-13  
**Version** : 1.0  
**Auteur** : EmotionsCare DevOps Team
