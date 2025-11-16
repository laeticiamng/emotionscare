# 🤝 Guide de Contribution - EmotionsCare

Merci de votre intérêt pour contribuer à EmotionsCare ! Ce guide vous aidera à contribuer efficacement au projet.

## 📋 Table des matières

1. [Code de conduite](#code-de-conduite)
2. [Comment contribuer](#comment-contribuer)
3. [Configuration développement](#configuration-développement)
4. [Standards de code](#standards-de-code)
5. [Process de révision](#process-de-révision)
6. [Types de contributions](#types-de-contributions)

## 📜 Code de conduite

En participant à ce projet, vous acceptez de respecter notre [Code de Conduite](CODE_OF_CONDUCT.md).

### Principes fondamentaux :
- ✨ **Respect** : Soyez respectueux envers tous les contributeurs
- 🤝 **Collaboration** : Travaillez ensemble pour améliorer le projet
- 📚 **Apprentissage** : Partagez vos connaissances et apprenez des autres
- 🎯 **Qualité** : Maintenez des standards élevés de code et documentation

## 🚀 Comment contribuer

### 1. Fork et configuration
```bash
# Fork le repository sur GitHub puis :
git clone https://github.com/VOTRE_USERNAME/emotionscare-platform.git
cd emotionscare-platform

# Configuration upstream
git remote add upstream https://github.com/emotionscare/platform.git

# Installation
npm install
cp .env.example .env.local
# Configurer .env.local avec vos clés
```

### 2. Créer une branche
```bash
git checkout -b type/description-courte

# Exemples :
git checkout -b feature/ai-emotion-detection
git checkout -b fix/dashboard-loading-issue
git checkout -b docs/api-documentation
```

### 3. Développer
- Suivez les [standards de code](#standards-de-code)
- Ajoutez des tests pour vos modifications
- Vérifiez l'accessibilité (WCAG 2.1 AA)
- Testez localement :
  - `npm run lint`
  - `npm run test`
  - `npm run preview` (ou `npm run build` + `npm run preview`)

### 4. Commit
Utilisez le format [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
git commit -m "type(scope): description"

# Types principaux :
feat:     # Nouvelle fonctionnalité
fix:      # Correction de bug
docs:     # Documentation
style:    # Formatage code (sans impact logique)
refactor: # Refactorisation
test:     # Ajout/modification tests
chore:    # Maintenance/outils
```

#### Exemples de commits :
```bash
feat(auth): ajoute authentification Google OAuth
fix(dashboard): corrige bug affichage données utilisateur
docs(readme): met à jour instructions installation
test(components): ajoute tests Button component
refactor(hooks): simplifie logique useEmotionAnalysis
chore(deps): met à jour dépendances sécurité
```

### 5. Pull Request
```bash
git push origin votre-branche
```

Avant de créer la PR, vérifiez :
- `npm run lint`
- `npm run test`
- `npm run preview`

Dans la PR GitHub :
- **Titre clair** : `type(scope): Description`
- **Description détaillée** : Que fait votre changement ? Pourquoi ?
- **Screenshots** : Pour les changements visuels
- **Tests** : Résumé des commandes exécutées (lint/test/preview)
- **Breaking changes** : Y a-t-il des changements cassants ?

## ⚙️ Configuration développement

### Prérequis
- Node.js 20+ et npm 10+
- Compte Supabase configuré
- Clés API (OpenAI, Hume) pour tests

### Environnement local
```bash
# Variables requises dans .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
HUME_API_KEY=your_hume_key
```

### Commandes utiles
```bash
npm run dev              # Serveur développement
npm run test             # Tests unitaires
npm run test:e2e         # Tests end-to-end
npm run lint             # Vérification code
npm run build            # Build production
npm run storybook        # Interface composants
```

## 🎯 Standards de code

### TypeScript
- **Mode strict** activé
- **Types explicites** pour exports publics
- **Pas de `any`** sauf cas exceptionnels documentés
- **Interfaces** préférées aux types pour objets

### React
- **Composants fonctionnels** uniquement
- **Hooks** pour la logique state
- **Props typées** avec TypeScript
- **Memo** pour optimisations si besoin

### Modules & exports
- Chaque dossier applicatif dispose d'un `index.ts` (ou `index.tsx`) qui ré-exporte l'API publique du domaine.
- Exposez les composants UI partagés dans `src/components/ui/**/*` **et** dans le registre global `src/COMPONENTS.reg.ts` (UI pur uniquement).
- Exécutez `npm run generate:ui-registry` après toute modification du registre afin de mettre à jour `docs/UI_COMPONENTS_REGISTRY.md`.
- Les barrels métier (`index.ts`) ne doivent pas ré-exporter de secrets (service-role, clés) ni de stores privés.

### Imports Node & bundling
- **Interdiction d'utiliser les imports `node:*`** côté front : privilégier les APIs Web (`crypto.subtle`, `File`, `Blob`, etc.).
- Les scripts Node conservent l'import classique (`import fs from 'fs'`) pour compatibilité tooling.
- Tout import non tree-shaké doit être justifié dans la PR (bundle size).

#### 🚫 Interdiction `node:*` côté client (ECC-SEC-01)
- Tout fichier client sous `src/**` ne peut plus importer `node:*`. Le lint (`pnpm lint`) et la CI bloquent immédiatement si la règle est violée.
- Préférez les APIs Web : `crypto.subtle`, `fetch`, `FileReader`, `Blob`, `URL`, etc. Un utilitaire `sha256Hex` basé sur `crypto.subtle` est déjà disponible dans `src/lib/hash.ts`.
- Les seuls dossiers autorisés à utiliser `node:*` sont les services strictement serveur (`/services/**`) et les fonctions Supabase (`/supabase/functions/**`).

```ts
// ❌ Bloqué : crash en build/runtime côté navigateur
import { createHash } from 'node:crypto';

// ✅ Correct : API Web compatible bundle client
const encoder = new TextEncoder();
const data = encoder.encode(message);
const digest = await crypto.subtle.digest('SHA-256', data);
```

- Si vous avez besoin d'une fonctionnalité Node, créez un service côté serveur (API, edge function) et exposez une API HTTP/Fetch pour le client.

### Stores Zustand & sélecteurs
- Centraliser les stores dans `src/store` et exposer des sélecteurs nommés (`export const selectX = (state) => state.x`).
- Éviter d'accéder directement à `useStore.getState()` dans les composants : préférer `useStore(selectX)` pour profiter de la comparaison par référence.
- Chaque ajout de logique store doit s'accompagner d'une suite de tests unitaires ciblant actions et sélecteurs.
- Pour les sélecteurs qui retournent plusieurs clés ou des objets, utiliser `useAppStore(selector, shallow)` afin d'éviter les rerenders inutiles.
- Les actions doivent rester pures et immuables : pas de mutation in-place ni d'effets secondaires implicites.
- Utiliser `subscribeWithSelector` pour les écoutes sans rerender (analytics, logging) et garder `devtools` activé uniquement en développement.
- Documenter toute nouvelle branche persistée et l'ajouter au `partialize` associé afin de conserver une hydratation minimale.

### Styling
- **Tailwind CSS** pour tout le styling
- **Design system** défini dans index.css
- **Composants shadcn/ui** comme base
- **Pas de CSS inline** ou styles custom

### Terminologie & contenu UI
- Interdiction des termes cliniques explicites en UI (`dépression`, `diagnostic`, etc.) → utiliser un vocabulaire bien-être.
- Pas de scores chiffrés dans les pages B2C (scans, communauté, social). Préférer des messages qualitatifs.
- Respecter `docs/COMMUNITY_SAFETY.md`, `docs/SOCIAL_ROOMS.md`, `docs/VR_SAFETY.md` pour tout nouveau contenu sensible.

### Accessibilité
- **WCAG 2.1 AA** minimum requis
- **ARIA labels** appropriés
- **Navigation clavier** fonctionnelle
- **Contrastes** respectés
- **Screen readers** testés

### Tests
- **Coverage** > 80% pour nouveaux composants
- **Tests unitaires** avec Vitest + Testing Library
- **Tests E2E** avec Playwright pour workflows critiques
- **Tests a11y** avec axe-core

### Performance
- **Lazy loading** pour pages
- **Code splitting** approprié
- **Images optimisées** (WebP/AVIF)
- **Bundle size** monitoring

## 🔍 Process de révision

### Checklist PR
Avant de soumettre, vérifiez :

#### ✅ Code
- [ ] Code lint sans erreurs (`npm run lint`)
- [ ] Types TypeScript valides (`npm run type-check`)
- [ ] Tests passent (`npm run test`)
- [ ] Build réussit (`npm run build`)

#### ✅ Accessibilité
- [ ] Navigation clavier fonctionnelle
- [ ] ARIA labels appropriés
- [ ] Contrastes respectés
- [ ] Tests axe-core passent

#### ✅ Documentation
- [ ] Code commenté si logique complexe
- [ ] README mis à jour si nécessaire
- [ ] CHANGELOG.md mis à jour pour features/fixes

#### ✅ Tests
- [ ] Tests unitaires pour nouvelle logique
- [ ] Tests E2E pour nouveaux workflows
- [ ] Edge cases considérés

#### ✅ Performance & QA
- [ ] `npm run preview` vérifié (no console error)
- [ ] Audit Lighthouse ou Web Vitals (si changement UI majeur)
- [ ] Axe-core / outils a11y passés sur les pages modifiées
- [ ] Temps de chargement / bundle monitoré (`npm run build` + analyse si besoin)

### Révision automatique
Notre CI vérifie automatiquement :
- ✅ Linting et formatage
- ✅ Tests unitaires et E2E
- ✅ Build de production
- ✅ Audits de sécurité
- ✅ Performance (Lighthouse)
- ✅ Accessibilité (axe)

### Révision manuelle
L'équipe vérifie :
- 🧠 Logique métier correcte
- 🎨 Cohérence UI/UX
- 📱 Responsivité mobile
- 🔒 Sécurité et privacy
- 📚 Qualité documentation

## 📝 Types de contributions

### 🐛 Bug fixes
1. **Reproduisez** le bug localement
2. **Créez un test** qui échoue 
3. **Corrigez** le problème
4. **Vérifiez** que le test passe
5. **Documentez** la correction si nécessaire

### ✨ Nouvelles fonctionnalités  
1. **Discutez** d'abord via Issue ou Discussion
2. **Concevez** l'interface et l'API
3. **Implémentez** avec tests complets
4. **Documentez** utilisation et exemples
5. **Testez** accessibilité et performance

### 📚 Documentation
- **README** : Instructions installation/usage
- **Code comments** : Logique complexe
- **Storybook** : Composants UI
- **Architecture docs** : Décisions techniques

### 🧪 Tests
- **Tests manquants** : Ajoutez pour code existant
- **Tests E2E** : Workflows utilisateur critiques
- **Tests performance** : Benchmarks et optimisations

### 🔧 Outils et configuration
- **Scripts npm** : Amélioration workflow dev
- **CI/CD** : Optimisation pipeline
- **Linting** : Nouvelles règles qualité
- **Monitoring** : Observabilité production

## 🆘 Besoin d'aide ?

### Où poser des questions
- 🐛 **Bugs** : [GitHub Issues](../../issues)
- 💬 **Questions générales** : [GitHub Discussions](../../discussions)  
- 💡 **Idées de fonctionnalités** : [GitHub Discussions](../../discussions)
- 📧 **Contact direct** : contribute@emotionscare.dev

### Ressources utiles
- [Documentation technique](./docs/)
- [Guide d'architecture](./docs/ARCHITECTURE.md)
- [Configuration développement](./docs/DEVELOPMENT_SETUP.md)
- [FAQ développeurs](./docs/FAQ.md)

---

## 🙏 Remerciements

Merci à tous nos contributeurs qui rendent EmotionsCare meilleur chaque jour !

[![Contributors](https://contrib.rocks/image?repo=emotionscare/platform)](https://github.com/emotionscare/platform/graphs/contributors)

Votre contribution, qu'elle soit code, documentation, tests ou feedback, est précieuse pour la communauté ! 💙