# 🔧 Installation du Système de Détection des Dépendances Circulaires

## Scripts Créés

Le système de détection a été installé avec succès. Voici les fichiers créés :

### Scripts Node.js
- ✅ `scripts/detect-circular-deps.js` - Détection automatique des cycles
- ✅ `scripts/check-imports-health.js` - Vérification de la santé des imports
- ✅ `scripts/pre-build-checks.sh` - Script de vérification pré-build

### Configuration
- ✅ `.circulardepsrc.json` - Configuration des modules critiques
- ✅ `docs/CIRCULAR_DEPS_GUIDE.md` - Guide complet de prévention

## Commandes Disponibles

### Détection des cycles
```bash
node scripts/detect-circular-deps.js
```

Analyse les modules critiques et détecte les dépendances circulaires.

**Sortie exemple:**
```
═══════════════════════════════════════════════════════════
🔍 DÉTECTION DES DÉPENDANCES CIRCULAIRES - EmotionsCare
═══════════════════════════════════════════════════════════

🔍 Construction du graphe de dépendances...
📊 Graphe construit: 42 modules analysés

🔄 Détection des cycles...

✅ Aucune dépendance circulaire détectée dans les modules critiques!
```

### Vérification de la santé des imports
```bash
node scripts/check-imports-health.js
```

Vérifie les règles de bonnes pratiques :
- Pas de logger dans les fichiers d'init
- Pas d'import direct de Sentry
- Pas de chemins relatifs profonds
- Pas de console.log en prod

**Sortie exemple:**
```
═══════════════════════════════════════════════════════════
🏥 VÉRIFICATION DE LA SANTÉ DES IMPORTS - EmotionsCare
═══════════════════════════════════════════════════════════

🔍 Vérification: No Logger in Init Files...
🔍 Vérification: No Direct Sentry Import...
🔍 Vérification: Deep Relative Imports...

📊 RÉSULTATS:

⚠️  2 AVERTISSEMENT(S):

   src/features/some/Component.tsx:15
   └─ Utiliser @/lib/errors/sentry-compat au lieu de @sentry/react
```

### Vérifications complètes
```bash
bash scripts/pre-build-checks.sh
```

Exécute toutes les vérifications en séquence :
1. Dépendances circulaires
2. Santé des imports
3. Variables d'environnement

## Installation dans package.json

### Option 1: Ajout Manuel (Recommandé)

Demandez à ajouter ces scripts dans `package.json` :

```json
{
  "scripts": {
    "check:circular-deps": "node scripts/detect-circular-deps.js",
    "check:imports-health": "node scripts/check-imports-health.js",
    "check:all": "bash scripts/pre-build-checks.sh",
    "prebuild": "npm run check:all"
  }
}
```

### Option 2: Exécution Manuelle

Vous pouvez exécuter les scripts directement :

```bash
# Avant chaque build
node scripts/detect-circular-deps.js
node scripts/check-imports-health.js

# Ou tous ensemble
bash scripts/pre-build-checks.sh
```

## Intégration CI/CD

### GitHub Actions

Ajoutez dans `.github/workflows/ci.yml` :

```yaml
name: CI

on: [push, pull_request]

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Check Circular Dependencies
        run: node scripts/detect-circular-deps.js
        
      - name: Check Import Health
        run: node scripts/check-imports-health.js
        
      - name: TypeScript Check
        run: npm run type-check
```

### Husky (Pre-commit Hook)

Si vous utilisez Husky :

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Vérifie les cycles avant chaque commit
node scripts/detect-circular-deps.js || exit 1
```

## Configuration Avancée

### Personnaliser les Modules Critiques

Éditez `.circulardepsrc.json` :

```json
{
  "criticalModules": [
    "src/lib/env.ts",
    "src/lib/logger/index.ts",
    "src/votre/nouveau/module.ts"
  ],
  "ignorePatterns": [
    "**/*.test.ts",
    "**/*.stories.tsx"
  ]
}
```

### Ajouter des Règles Personnalisées

Dans `scripts/check-imports-health.js`, ajoutez une règle :

```javascript
const RULES = {
  // Règle personnalisée
  noDirectSupabaseImport: {
    name: 'No Direct Supabase Import',
    pattern: /import.*from.*['"]@supabase\/supabase-js['"]/,
    files: 'src/features/**/*.{ts,tsx}',
    severity: 'warning',
    message: 'Utiliser @/integrations/supabase/client',
  },
  // ... autres règles
};
```

## Utilisation Quotidienne

### Workflow Développeur

1. **Avant de coder** :
   ```bash
   node scripts/detect-circular-deps.js
   ```
   
2. **Après avoir ajouté des imports** :
   ```bash
   node scripts/check-imports-health.js
   ```
   
3. **Avant de committer** :
   ```bash
   bash scripts/pre-build-checks.sh
   ```

### Résolution d'un Cycle Détecté

Si un cycle est détecté :

```bash
$ node scripts/detect-circular-deps.js

❌ 1 dépendance(s) circulaire(s) détectée(s):

🔴 Cycle 1:
   → src/lib/env.ts
   → src/lib/logger/index.ts
   ↩️ src/lib/env.ts

💡 Solutions suggérées:
   1. Utiliser console.log au lieu de logger dans les fichiers d'initialisation
   2. Créer des modules utilitaires sans dépendances
```

**Action** : Suivez les solutions suggérées et consultez `docs/CIRCULAR_DEPS_GUIDE.md`

## Monitoring

### Dashboard de Santé du Code

Les scripts génèrent des métriques utiles :

```bash
# Nombre de modules analysés
📊 Graphe construit: 42 modules analysés

# Nombre de cycles détectés
❌ 2 dépendance(s) circulaire(s) détectée(s)

# Problèmes par sévérité
❌ 3 ERREUR(S)
⚠️  5 AVERTISSEMENT(S)
ℹ️  12 INFO(S)
```

## Dépannage

### Script ne trouve pas les fichiers

Vérifiez que vous êtes à la racine du projet :
```bash
pwd  # Doit afficher le dossier racine
node scripts/detect-circular-deps.js
```

### Erreur "glob not found"

Installez la dépendance :
```bash
npm install --save-dev glob
```

### Permission denied sur pre-build-checks.sh

Rendez le script exécutable :
```bash
chmod +x scripts/pre-build-checks.sh
```

## Support

- 📖 Guide complet : `docs/CIRCULAR_DEPS_GUIDE.md`
- 🔧 Configuration : `.circulardepsrc.json`
- 💬 Questions : Ouvrez une issue dans le projet

## Prochaines Étapes

1. ✅ Lire `docs/CIRCULAR_DEPS_GUIDE.md`
2. ✅ Exécuter `node scripts/detect-circular-deps.js`
3. ✅ Corriger les cycles détectés
4. ✅ Intégrer les scripts dans package.json
5. ✅ Ajouter aux hooks de CI/CD
