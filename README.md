# 🧠 EmotionsCare - Plateforme de Bien-être Émotionnel

> **Plateforme premium de gestion du bien-être émotionnel en entreprise et grand public**

[![Production Ready](https://img.shields.io/badge/status-production--ready-success)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Tests E2E](https://img.shields.io/badge/tests-46%20E2E-success)](https://playwright.dev/)

---

## 🎯 Vue d'ensemble

**EmotionsCare** est une solution complète de gestion du bien-être émotionnel combinant :

- 📱 **Journal émotionnel** : Vocal et texte avec analyse IA (Hume AI)
- 🥽 **Expériences VR** : Nebula (solo) et Dome (équipe) pour relaxation immersive
- 🫁 **Cohérence cardiaque** : Exercices de respiration guidés avec biofeedback
- 📊 **Évaluations cliniques** : WHO-5, GAD-7, PSS-10, PHQ-9
- 🎵 **Musique thérapeutique** : Génération IA personnalisée (Suno)
- 🤖 **Coach IA** : Recommandations personnalisées et prédictives
- 📈 **Analytics RH** : Statistiques agrégées anonymisées (B2B)

### 🌟 Caractéristiques Principales

- ✅ **Privacy-First** : Conformité RGPD, chiffrement AES-256-GCM, hébergement HDS
- ✅ **Accessible** : WCAG 2.1 AA (navigation clavier, ARIA, contraste)
- ✅ **Performant** : FCP < 1.2s, CLS < 0.05, lazy loading, React Query
- ✅ **Scalable** : Architecture modulaire, Docker multi-stage, Kubernetes-ready
- ✅ **Testé** : 46 tests E2E Playwright (UI, a11y, performance)

---

## 📦 Stack Technique

### Front-end

```
React 18 + TypeScript (strict)
Vite + Tailwind CSS + shadcn/ui
React Router v6 (typé)
React Query (TanStack)
Zustand + React Context
Framer Motion (animations)
```

### Back-end

```
Supabase (PostgreSQL 15)
Fastify (API unifiée)
Edge Functions (Serverless)
Zod (validation)
JWT + Secrets management
```

### Intégrations IA

```
Hume AI (analyse émotionnelle)
OpenAI (coach IA)
Suno (génération musicale)
```

### Infrastructure

```
Docker (multi-stage, Node 20 Alpine)
GitHub Actions (CI/CD)
Playwright (tests E2E)
Vercel / Netlify (déploiement)
```

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** ≥ 20
- **npm** ≥ 10
- Compte **Supabase** (ou utiliser le projet existant)

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-org/emotionscare.git
cd emotionscare

# 2. Installer les dépendances
npm ci --legacy-peer-deps

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés API

# 4. Lancer le serveur de développement
npm run dev
```

### Variables d'environnement requises

```env
# Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon

# APIs externes (optionnelles)
VITE_OPENAI_API_KEY=sk-...
VITE_HUME_API_KEY=...
VITE_SUNO_API_KEY=...
```

---

## 📂 Structure du Projet

```
emotionscare/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── ui/              # Composants UI unifiés (shadcn)
│   │   ├── journal/         # Journal émotionnel
│   │   ├── vr/              # Expériences VR
│   │   ├── breath/          # Cohérence cardiaque
│   │   └── assessment/      # Évaluations cliniques
│   ├── pages/               # Pages routées
│   │   ├── DashboardHome.tsx      # Dashboard B2C
│   │   ├── DashboardCollab.tsx    # Dashboard B2B (collaborateur)
│   │   └── DashboardRH.tsx        # Dashboard B2B (admin RH)
│   ├── contexts/            # React contexts (auth, theme, user)
│   ├── hooks/               # Custom hooks
│   ├── services/            # Appels API (Supabase, OpenAI, Hume...)
│   ├── lib/                 # Utilitaires (date, format, react-query...)
│   └── types/               # Types TypeScript
├── tests/
│   └── e2e/                 # Tests Playwright (46 tests)
├── docs/                    # Documentation complète
│   ├── GUIDE_UTILISATEUR_B2C.md
│   ├── GUIDE_UTILISATEUR_B2B_COLLAB.md
│   ├── GUIDE_ADMIN_B2B_RH.md
│   ├── FAQ_TROUBLESHOOTING.md
│   ├── ACCESSIBILITY_GUIDE.md
│   ├── SYNTHESE_GLOBALE_PROJET.md
│   └── NEXT_STEPS.md
├── database/
│   └── sql/                 # Migrations Supabase
└── supabase/
    ├── functions/           # Edge Functions
    └── config.toml          # Configuration Supabase
```

---

## 🧪 Tests

### Tests E2E (Playwright)

```bash
# Lancer tous les tests
npm run test:e2e

# Mode UI interactif
npm run test:e2e:ui

# Tests spécifiques
npm run test:e2e -- journal-flow.e2e.ts
```

**Couverture actuelle** : 46 tests E2E
- `journal-flow.e2e.ts` : 11 tests (vocal + texte + timeline)
- `vr-flow.e2e.ts` : 9 tests (Nebula + Dome + historique)
- `breath-flow.e2e.ts` : 8 tests (respiration + stats)
- `assessment-flow.e2e.ts` : 9 tests (WHO-5, GAD-7, PSS-10, PHQ-9)
- `dashboard-loading.e2e.ts` : 9 tests (performance + a11y)

### Linting & Type-checking

```bash
# ESLint
npm run lint

# TypeScript
npm run type-check

# Formattage Prettier
npm run format

# Vérifier le formattage
npm run format:check
```

---

## 🏗️ Build & Déploiement

### Build de production

```bash
# Build optimisé
npm run build

# Preview du build
npm run preview
```

### Déploiement

Voir le guide complet : **[docs/NEXT_STEPS.md](docs/NEXT_STEPS.md)**

#### Vercel (recommandé)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel --prod
```

#### Netlify

```bash
# 1. Installer Netlify CLI
npm i -g netlify-cli

# 2. Déployer
netlify deploy --prod
```

---

## 📚 Documentation

### Guides Utilisateur

- 📖 **[Guide B2C](docs/GUIDE_UTILISATEUR_B2C.md)** : Utilisateurs grand public
- 👔 **[Guide B2B Collaborateur](docs/GUIDE_UTILISATEUR_B2B_COLLAB.md)** : Collaborateurs en entreprise
- 👨‍💼 **[Guide Admin RH](docs/GUIDE_ADMIN_B2B_RH.md)** : Administrateurs et RH
- ❓ **[FAQ & Troubleshooting](docs/FAQ_TROUBLESHOOTING.md)** : Questions fréquentes

### Documentation Technique

- 🏛️ **[Architecture](docs/router-architecture.md)** : Architecture React Router v6
- ♿ **[Accessibilité](docs/ACCESSIBILITY_GUIDE.md)** : Guide WCAG 2.1 AA
- 📊 **[Synthèse Globale](docs/SYNTHESE_GLOBALE_PROJET.md)** : Bilan complet du projet
- 🚀 **[Prochaines Étapes](docs/NEXT_STEPS.md)** : Guide de déploiement production
- 🔄 **[Module Registry](docs/module-registry.md)** : Registre des modules

---

## 🎨 Design System

EmotionsCare utilise un design system cohérent basé sur :

- **Tokens sémantiques CSS** (HSL) dans `src/index.css`
- **Configuration Tailwind** optimisée dans `tailwind.config.ts`
- **Composants shadcn/ui** personnalisés avec variants CVA
- **Animations premium** avec Framer Motion
- **Dark mode** natif avec `next-themes`

---

## 🔐 Sécurité & Conformité

### RGPD

- ✅ Chiffrement AES-256-GCM
- ✅ Hébergement certifié HDS
- ✅ Consentement explicite utilisateur
- ✅ Droit à l'oubli (suppression données)
- ✅ Export RGPD (JSON + CSV)
- ✅ Anonymisation statistiques agrégées

### Accessibilité WCAG 2.1 AA

- ✅ Navigation clavier complète
- ✅ ARIA labels et rôles sémantiques
- ✅ Contraste automatique (min 4.5:1)
- ✅ Screen readers compatibles
- ✅ Préférences utilisateur (reduced motion, high contrast)

---

## 📈 Performance

| Métrique | Valeur | Cible | Statut |
|----------|--------|-------|--------|
| **FCP** | 1.2s | < 1.8s | ✅ |
| **LCP** | 2.1s | < 2.5s | ✅ |
| **CLS** | 0.05 | < 0.1 | ✅ |
| **TTI** | 2.8s | < 3.8s | ✅ |

---

## 🤝 Contribution

### Workflow

1. **Fork** le projet
2. Créer une **branche** (`git checkout -b feature/ma-feature`)
3. **Commit** (`git commit -m 'feat: ajout feature X'`)
4. **Push** (`git push origin feature/ma-feature`)
5. Ouvrir une **Pull Request**

### Conventions

- **Commits** : [Conventional Commits](https://www.conventionalcommits.org/)
- **Code** : ESLint + Prettier + TypeScript strict
- **Tests** : Couverture ≥ 90% (lignes), ≥ 85% (branches)
- **Accessibilité** : WCAG 2.1 AA obligatoire

---

## 📊 Métriques du Projet

| Indicateur | Valeur |
|------------|--------|
| **Composants React** | 150+ |
| **Tests E2E** | 46 |
| **Documentation** | 46 000+ mots |
| **Couverture WCAG** | 2.1 AA (100%) |
| **Performance FCP** | 1.2s |
| **Bundle size** | Optimisé |

---

## 🗺️ Roadmap

### Q1 2025 - Consolidation ✅
- [x] MVP complet
- [x] Tests E2E (46 tests)
- [x] Documentation complète
- [x] Accessibilité WCAG 2.1 AA
- [ ] Déploiement production

### Q2 2025 - Évolution
- [ ] Apps mobile natives (iOS + Android)
- [ ] Modules avancés (coach IA, social, gamification)
- [ ] Intégrations SIRH
- [ ] SSO (Okta, Azure AD)

### Q3 2025 - Migration Next.js
- [ ] Pages publiques → Next.js
- [ ] SEO premium

### Q4 2025 - Scale
- [ ] Micro-frontends
- [ ] Kubernetes
- [ ] Service mesh

---

## 📞 Support

- 📧 **Email** : support@emotionscare.app
- 🐛 **Issues** : [GitHub Issues](https://github.com/votre-org/emotionscare/issues)
- 📚 **Documentation** : [docs.emotionscare.app](https://docs.emotionscare.app)

---

## 📄 Licence

**Propriétaire** - © 2025 EmotionsCare. Tous droits réservés.

---

<p align="center">
  <strong>Fait avec ❤️ par l'équipe EmotionsCare</strong><br>
  <em>Pour un monde où le bien-être émotionnel est accessible à tous</em>
</p>