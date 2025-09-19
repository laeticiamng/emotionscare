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
- Testez localement avec `npm run test` et `npm run build`

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

Puis créez la PR sur GitHub avec :
- **Titre clair** : `type(scope): Description`
- **Description détaillée** : Que fait votre changement ? Pourquoi ?
- **Screenshots** : Pour les changements visuels
- **Tests** : Comment avez-vous testé ?
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
- Les nouveaux composants UI partagés doivent être exposés via les barrels existants (`src/components/ui` et `src/COMPONENTS.reg.tsx`).
- `COMPONENTS.reg.tsx` reste limité à des wrappers providers & composants purement UI (pas de stores, hooks métier ou accès réseau).

### Imports Node & bundling
- **Interdiction d'utiliser les imports `node:*`** côté front : privilégier les modules standards (`fs`, `path`…) lorsqu'ils sont bundlés côté Node/scripts.
- Les scripts Node conservent l'import classique (`import fs from 'fs'`) pour compatibilité tooling.
- Tout import non tree-shaké doit être justifié dans la PR (bundle size).

### Stores Zustand & sélecteurs
- Centraliser les stores dans `src/store` et exposer des sélecteurs nommés (`export const selectX = (state) => state.x`).
- Éviter d'accéder directement à `useStore.getState()` dans les composants : préférer `useStore(selectX)` pour profiter de la comparaison par référence.
- Chaque ajout de logique store doit s'accompagner d'une suite de tests unitaires ciblant actions et sélecteurs.

### Styling
- **Tailwind CSS** pour tout le styling
- **Design system** défini dans index.css
- **Composants shadcn/ui** comme base
- **Pas de CSS inline** ou styles custom

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