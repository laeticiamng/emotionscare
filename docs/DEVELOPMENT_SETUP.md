# 🛠️ Guide de Configuration Développement

## Configuration IDE

### VS Code (Recommandé)
Extensions essentielles :
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode", 
    "ms-vscode.vscode-typescript-next",
    "ms-playwright.playwright",
    "vitest.explorer"
  ]
}
```

### Settings VS Code
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Installation complète

### 1. Clonage et dépendances
```bash
git clone <repo-url>
cd emotionscare-platform
npm install --legacy-peer-deps
```

### 2. Configuration Supabase
```bash
# Installation CLI Supabase
npm i -g supabase

# Login et initialisation
supabase login
supabase init
supabase start
```

### 3. Variables d'environnement
```bash
cp .env.example .env.local
```

Configurez dans `.env.local` :
```bash
# Supabase (récupéré depuis Dashboard)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_SUPABASE_PROJECT_ID=xxxxx

# API IA (depuis vos comptes respectifs)
OPENAI_API_KEY=sk-proj-xxxx
HUME_API_KEY=xxxx

# Optionnel
VITE_SENTRY_DSN=https://xxxx@sentry.io/xxxx
```

### 4. Base de données
```bash
# Appliquer les migrations
npm run db:migrate

# Seed des données de test (optionnel)
npm run db:seed
```

## Commandes de développement

### Serveur de développement
```bash
npm run dev              # Port 5173 par défaut
npm run dev -- --port 3000  # Port personnalisé
npm run dev -- --host   # Accessible réseau local
```

### Tests en développement
```bash
npm run test:watch      # Tests en mode watch
npm run test:ui         # Interface graphique tests
npm run test:coverage   # Rapport de couverture
```

### Builds et vérifications
```bash
npm run build           # Build production
npm run build:dev       # Build développement
npm run lint:fix        # Fix automatique ESLint
npm run type-check      # Vérification TypeScript
```

## Structure de développement

### Alias de chemins
```typescript
// Configurés dans vite.config.ts
@ → src/
@/components → src/components
@/hooks → src/hooks
@/lib → src/lib
@/types → src/types
```

### Conventions de nommage
```
# Fichiers
PascalCase.tsx     → Composants React
kebab-case.ts      → Utilitaires et services
camelCase.tsx      → Hooks personnalisés

# Variables
camelCase          → Variables JS/TS
PascalCase         → Composants et types
SCREAMING_SNAKE    → Constants
```

## Base de données locale

### Supabase Local
```bash
# Démarrer services locaux
supabase start

# Accès interfaces
http://localhost:54323  # Studio
http://localhost:54321  # API Gateway
http://localhost:54324  # DB (PostgreSQL)
```

### Migrations
```bash
# Nouvelle migration
supabase migration new nom_migration

# Appliquer migrations
supabase db push

# Reset complet (DANGER)
supabase db reset
```

### Edge Functions
```bash
# Servir les fonctions localement
supabase functions serve

# Deployer une fonction
supabase functions deploy fonction_name

# Logs en temps réel
supabase functions logs --follow
```

## Outils de développement

### Storybook (Composants UI)
```bash
npm run storybook       # Port 6006
npm run build-storybook # Build statique
```

### Debugging
```bash
# Chrome DevTools pour Node
npm run dev:debug

# Tests avec debugger
npm run test:debug

# Analyse bundle
npm run build:analyze
```

### Performance
```bash
# Lighthouse CI
npm run lighthouse

# Bundle analyzer
npm run analyze

# Audit complet
npm run audit:full
```

## Workflow Git

### Branches
```bash
main              # Production
develop           # Développement
feature/xxx       # Nouvelles fonctionnalités
hotfix/xxx        # Corrections urgentes
```

### Commits
Format conventionnel :
```
feat: ajoute authentification Google
fix: corrige bug navigation mobile
docs: met à jour README
style: améliore formatage code
refactor: restructure store utilisateur
test: ajoute tests composant Button
```

### Pre-commit hooks
```bash
# Installation Husky (auto via npm install)
npx husky install

# Hooks configurés :
# - Lint staged files
# - Type check
# - Run tests
```

## Debugging courant

### Erreurs fréquentes

#### 1. Port déjà utilisé
```bash
# Solution
npx kill-port 5173
# ou
npm run dev -- --port 3001
```

#### 2. Modules non trouvés
```bash
# Nettoyage complet
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 3. Types TypeScript
```bash
# Régénérer types Supabase
npm run generate:types
```

#### 4. Base de données
```bash
# Reset Supabase local
supabase stop
supabase start
npm run db:migrate
```

### Logs utiles
```bash
# Logs Supabase
supabase logs

# Logs Edge Functions
supabase functions logs --follow

# Logs application (dans console browser)
localStorage.debug = '*'
```

## Tests spécialisés

### Tests d'accessibilité
```bash
npm run test:a11y       # Tests axe-core
npm run test:lighthouse # Audit Lighthouse
```

### Tests E2E
```bash
npm run test:e2e        # Headless
npm run test:e2e:ui     # Interface graphique
npm run test:e2e:debug  # Mode debug
```

### Tests de performance
```bash
npm run perf:test       # Tests de performance
npm run perf:report     # Rapport détaillé
```

---

## 🆘 Besoin d'aide ?

1. Consultez les [FAQ](./FAQ.md)
2. Vérifiez les [Issues GitHub](../../issues)
3. Rejoignez le Discord de développement
4. Contactez l'équipe : dev@emotionscare.app