# 🔍 VÉRIFICATION ROUTE PAR ROUTE - Guide d'utilisation

## 🎯 Objectif

Ce script vérifie **chaque route** du registry et sa page correspondante **une par une** de manière exhaustive.

## 📋 Ce qui est vérifié pour chaque route

Pour chaque route dans `src/routerV2/registry.ts`, le script vérifie:

1. **Existence du fichier**
   - Recherche dans `src/pages/`
   - Recherche dans sous-dossiers
   - Plusieurs patterns de nommage testés

2. **Qualité du contenu**
   - Nombre de lignes
   - Présence de `data-testid="page-root"`
   - Présence d'un titre (`<h1>`, `<title>`, `document.title`)
   - Contenu substantiel (composants, sections)
   - Détection de stubs/placeholders

3. **Classification**
   - ✅ **OK**: Page complète et fonctionnelle
   - ⚠️ **Warning**: Page basique, à améliorer
   - ❌ **Error**: Fichier introuvable ou illisible

## 🚀 Exécution

```bash
# Vérification complète
npx tsx scripts/verify-all-routes-pages.ts

# Ou via npm script (à ajouter dans package.json)
npm run verify:routes
```

## 📊 Sortie du script

### 1. Pages avec Erreurs
```
❌ PAGES AVEC ERREURS (Fichier introuvable ou illisible)

1. /some/path
   Composant: SomeComponent
   Segment: consumer
   ❌ FICHIER INTROUVABLE
```

### 2. Pages avec Avertissements
```
⚠️  PAGES AVEC AVERTISSEMENTS (Contenu à améliorer)

1. /another/path
   Composant: AnotherComponent
   Fichier: AnotherComponent.tsx
   Lignes: 45
   Segment: public
   ⚠️ Manque data-testid="page-root"
   📏 Trop court (45 lignes)
```

### 3. Pages Complètes
```
✅ PAGES COMPLÈTES ET FONCTIONNELLES

82 pages sont en bon état (68%)

Échantillon des pages complètes:
  1. /                            (HomePage, 245 lignes)
  2. /about                       (AboutPage, 466 lignes)
  3. /contact                     (ContactPage, 344 lignes)
  ...
```

### 4. Résumé Final
```
📊 RÉSUMÉ FINAL

Total routes:           120
✅ Pages OK:            82 (68%)
⚠️  Pages à améliorer:   28 (23%)
❌ Pages en erreur:     10 (8%)
```

### 5. Statistiques par Segment
```
📈 STATISTIQUES PAR SEGMENT:

public          - Total:  25
                  OK:  20 | ⚠️ :   4 | ❌:   1

consumer        - Total:  52
                  OK:  38 | ⚠️ :  10 | ❌:   4

employee        - Total:   8
                  OK:   5 | ⚠️ :   2 | ❌:   1
...
```

## 📄 Rapport JSON

Un rapport détaillé est généré dans `scripts/routes/VERIFICATION_REPORT.json`:

```json
{
  "date": "2025-10-03T16:30:00.000Z",
  "totalRoutes": 120,
  "ok": 82,
  "warnings": 28,
  "errors": 10,
  "routes": [
    {
      "name": "home",
      "path": "/",
      "component": "HomePage",
      "segment": "public",
      "status": "ok",
      "fileFound": true,
      "lineCount": 245,
      "issues": []
    },
    ...
  ]
}
```

## 🔧 Actions Recommandées

### Priorité 1: Corriger Erreurs (❌)
Pages avec fichier introuvable - **URGENT**

```bash
# Pour chaque page en erreur:
1. Vérifier que le composant existe
2. Créer le fichier si manquant
3. Mettre à jour componentMap dans router.tsx
```

### Priorité 2: Améliorer Warnings (⚠️)
Pages existantes mais incomplètes

```bash
# Pour chaque page avec warning:
1. Ajouter data-testid="page-root"
2. Enrichir le contenu (min 80 lignes)
3. Ajouter titre et navigation
4. Remplacer stubs par contenu réel
```

### Priorité 3: Maintenir OK (✅)
Pages complètes - continuer à optimiser

```bash
# Améliorations continues:
1. Tests E2E
2. Optimisations UX
3. Accessibilité WCAG
4. Performance
```

## 📋 Checklist Correction Page

Pour corriger une page en erreur ou warning:

- [ ] Fichier existe dans `src/pages/`
- [ ] Exporté correctement (default export)
- [ ] `data-testid="page-root"` sur élément racine
- [ ] Titre présent (`<h1>` ou `document.title`)
- [ ] Minimum 80 lignes de code utile
- [ ] Utilise composants UI (Card, Button, etc.)
- [ ] Navigation présente (back button, breadcrumb)
- [ ] Pas de TODO/Placeholder/Coming soon
- [ ] Responsive (mobile-first)
- [ ] Accessible (ARIA, keyboard)

## 🎨 Templates Disponibles

Utiliser ces pages comme référence pour corriger:

### Page Marketing (public)
```typescript
// Référence: src/pages/AboutPage.tsx (466 lignes, score 98%)
- Hero section avec gradient
- Stats grid
- Features sections
- Team/testimonials
- CTA finale
```

### Page Application (consumer)
```typescript
// Référence: src/pages/NavigationPage.tsx (413 lignes, score 75%)
- Header avec navigation
- Filtres et recherche
- Grid/List toggle
- Cards interactives
```

### Page Formulaire
```typescript
// Référence: src/pages/ContactPage.tsx (344 lignes, score 96%)
- Validation complète
- États loading/success/error
- Intégration backend
- Accessibilité exemplaire
```

## 🔄 Workflow Recommandé

### 1. Exécuter vérification
```bash
npx tsx scripts/verify-all-routes-pages.ts > audit-routes.txt
```

### 2. Analyser résultats
```bash
# Filtrer par segment
grep "consumer" audit-routes.txt

# Compter erreurs
grep "❌" audit-routes.txt | wc -l
```

### 3. Prioriser corrections
```
1. Erreurs segment public (visible tous)
2. Erreurs segment consumer (utilisateurs actifs)
3. Warnings segment public
4. Warnings autres segments
```

### 4. Corriger et re-tester
```bash
# Après chaque correction
npx tsx scripts/verify-all-routes-pages.ts

# Vérifier amélioration
diff audit-routes-avant.txt audit-routes-apres.txt
```

## 💡 Astuces

### Recherche rapide fichier manquant
```bash
# Trouver où devrait être le fichier
find src/pages -name "*ComponentName*"

# Lister tous les fichiers pages
find src/pages -name "*.tsx" | sort
```

### Corriger en masse data-testid
```bash
# Rechercher pages sans page-root
grep -L 'data-testid="page-root"' src/pages/**/*.tsx
```

### Identifier stubs rapidement
```bash
# Rechercher TODO/Placeholder
grep -r "TODO\|Coming soon\|Placeholder" src/pages/
```

## 🎯 Objectif Final

**Target: 100% pages OK ✅**

- 0 erreur (100% fichiers trouvés)
- < 10% warnings (90%+ pages complètes)
- Tests E2E sur toutes routes critiques
- Score moyen > 85%

---

**Prochaine étape:** Exécuter le script et commencer corrections par priorité!
