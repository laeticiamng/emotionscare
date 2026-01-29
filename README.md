# 🧠 EmotionsCare — Plateforme de Bien-Être Émotionnel

> **"Prendre soin de celles et ceux qui prennent soin"**  
> Plateforme premium de gestion du bien-être émotionnel pour les professionnels de santé et les étudiants en médecine.

[![Production Ready](https://img.shields.io/badge/status-production--ready-success)](https://emotions-care.lovable.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Edge Functions](https://img.shields.io/badge/Edge%20Functions-217+-purple)](https://supabase.com/edge-functions)
[![Modules](https://img.shields.io/badge/Modules-31-orange)](./src/features)
[![Routes](https://img.shields.io/badge/Routes-223-blue)](./src/routerV2)

---

## 📋 Table des Matières

- [🎯 Vue d'Ensemble](#-vue-densemble)
- [🏥 Public Cible](#-public-cible)
- [✨ Fonctionnalités Principales](#-fonctionnalités-principales)
- [📦 Stack Technique](#-stack-technique)
- [🗂️ Architecture du Projet](#️-architecture-du-projet)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🔐 Sécurité & Conformité](#-sécurité--conformité)
- [♿ Accessibilité](#-accessibilité)
- [📈 Performances](#-performances)
- [🧪 Tests](#-tests)
- [📚 Documentation](#-documentation)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contribution](#-contribution)
- [📞 Support](#-support)

---

## 🎯 Vue d'Ensemble

**EmotionsCare** est une solution SaaS complète de gestion du bien-être émotionnel combinant intelligence artificielle, gamification et expériences immersives. Elle aide les professionnels de santé à réguler leurs émotions pour prévenir le burnout et améliorer leur qualité de soins.

### Proposition de Valeur

| Pour | Bénéfice |
|------|----------|
| **Étudiants en santé** | Développer la résilience émotionnelle dès la formation |
| **Soignants** | Prévenir le burnout et maintenir l'empathie |
| **Établissements** | Analytics RH anonymisés pour améliorer le bien-être collectif |

---

## 🏥 Public Cible

> **Focus vertical : Healthcare**

- 👨‍⚕️ **Médecins** (généralistes, spécialistes)
- 👩‍⚕️ **Infirmiers/Infirmières**
- 🎓 **Étudiants en médecine/soins infirmiers**
- 🏥 **Personnel EHPAD**
- 🏨 **Cliniques et hôpitaux** (B2B)
- 🎓 **Écoles de médecine** (B2B)

---

## ✨ Fonctionnalités Principales

### 🧘 Modules Bien-Être (31 Features)

| Module | Description | Route |
|--------|-------------|-------|
| **📊 Scan Émotionnel** | Analyse faciale IA en temps réel (Hume AI) | `/app/scan` |
| **📓 Journal** | Journaling vocal/texte avec analyse IA | `/app/journal` |
| **🫁 Respiration** | Cohérence cardiaque avec biofeedback | `/app/breath` |
| **🤖 Coach IA Nyvée** | Accompagnement personnalisé OpenAI | `/app/coach` |
| **🎵 Musicothérapie** | Génération musicale IA adaptative (Suno) | `/app/music` |
| **⚡ Flash Glow** | Apaisement instantané en 2 min | `/app/flash-glow` |
| **🎛️ Mood Mixer** | DJ des émotions - mixage sonore | `/app/mood-mixer` |
| **🥽 VR Galaxy** | Exploration immersive 3D | `/app/vr/galaxy` |
| **🌬️ VR Breath** | Respiration guidée en VR | `/app/vr/breath` |
| **🏆 Boss Grit** | Forge de persévérance gamifiée | `/app/boss-grit` |
| **🫧 Bubble Beat** | Défouloir rythmé (bulles) | `/app/bubble-beat` |
| **📖 Story Synth** | Contes thérapeutiques IA | `/app/story-synth` |
| **🖼️ Screen Silk** | Wallpapers apaisants animés | `/app/screen-silk` |
| **🏞️ Parc Émotionnel** | Visualisation spatiale des émotions | `/app/emotional-park` |
| **🔄 Exchange Hub** | Échanges émotionnels communautaires | `/app/exchange` |

### 🏢 Modules B2B

| Module | Description | Route |
|--------|-------------|-------|
| **📈 Dashboard RH** | Analytics bien-être équipe | `/b2b/rh/dashboard` |
| **🗺️ Heatmap Vibes** | Cartographie émotionnelle temps réel | `/b2b/heatmap` |
| **📊 Rapports** | Export PDF/Excel automatisé | `/b2b/reports` |
| **👥 Gestion Équipes** | Invitation, rôles, permissions | `/b2b/teams` |
| **📅 Événements** | Ateliers bien-être, webinaires | `/b2b/events` |
| **🔒 Sécurité** | Audit RGPD, sessions, logs | `/b2b/security` |

### 🎮 Gamification

| Fonctionnalité | Description |
|----------------|-------------|
| **XP & Niveaux** | Progression avec récompenses |
| **🏅 Badges** | 50+ badges à débloquer |
| **🔥 Streaks** | Suivi des séries quotidiennes |
| **🏆 Leaderboard** | Classement avec auras personnalisées |
| **⚔️ Tournois** | Compétitions hebdomadaires |
| **🏰 Guildes** | Équipes avec chat et défis collectifs |
| **🎯 Challenges** | Défis quotidiens générés par IA |

---

## 📦 Stack Technique

### Frontend

```
├── React 18 + TypeScript (strict mode)
├── Vite 5 (bundler ultra-rapide)
├── Tailwind CSS + Design Tokens HSL
├── shadcn/ui (composants accessibles)
├── React Router v6 (routage typé)
├── TanStack Query v5 (state serveur)
├── Zustand (state client)
├── Framer Motion (animations)
├── Three.js + React Three Fiber (3D/VR)
└── i18next (internationalisation FR/EN)
```

### Backend (Supabase)

```
├── PostgreSQL 15 (210+ tables)
├── Row Level Security (RLS) sur toutes les tables
├── 217 Edge Functions (Deno)
├── Realtime subscriptions
├── Storage (avatars, audio, exports)
└── Auth (email, OAuth, magic link)
```

### Intégrations IA

```
├── Hume AI — Analyse émotionnelle faciale/vocale
├── OpenAI GPT-4 — Coach IA, génération de contenu
├── Suno AI — Génération musicale thérapeutique
└── MediaPipe — Détection de landmarks (fallback)
```

### Infrastructure

```
├── Lovable Cloud (hébergement)
├── Vercel/Netlify (alternatives)
├── GitHub Actions (CI/CD)
├── Sentry (monitoring erreurs)
└── Vercel Analytics (performance)
```

---

## 🗂️ Architecture du Projet

```
emotionscare/
├── 📁 src/
│   ├── 📁 features/              # 31 modules métier (feature-first)
│   │   ├── scan/                 # Analyse émotionnelle
│   │   ├── journal/              # Journaling
│   │   ├── breath/               # Respiration
│   │   ├── coach/                # Coach IA
│   │   ├── music/                # Musicothérapie
│   │   ├── gamification/         # XP, badges, streaks
│   │   ├── challenges/           # Défis quotidiens
│   │   ├── tournaments/          # Tournois
│   │   ├── guilds/               # Guildes
│   │   ├── leaderboard/          # Classements
│   │   ├── community/            # Social
│   │   ├── vr/                   # Expériences VR
│   │   ├── flash-glow/           # Apaisement rapide
│   │   ├── mood-mixer/           # Mixage émotionnel
│   │   ├── b2b/                  # Fonctionnalités entreprise
│   │   └── ...
│   │
│   ├── 📁 pages/                 # 180+ pages routées
│   │   ├── app/                  # Routes /app/*
│   │   ├── b2b/                  # Routes /b2b/*
│   │   ├── b2c/                  # Routes /b2c/*
│   │   ├── settings/             # Routes /settings/*
│   │   ├── admin/                # Routes /admin/*
│   │   ├── legal/                # Routes /legal/*
│   │   └── errors/               # Pages 401, 403, 404, 503
│   │
│   ├── 📁 routerV2/              # Système de routage v2
│   │   ├── registry.ts           # 223 routes enregistrées
│   │   ├── aliases.tsx           # Redirections canoniques
│   │   ├── guards.tsx            # Protection des routes
│   │   └── router.tsx            # Configuration React Router
│   │
│   ├── 📁 components/            # Composants réutilisables
│   │   ├── ui/                   # shadcn/ui customisés
│   │   ├── layout/               # Header, Sidebar, Footer
│   │   ├── modals/               # Dialogues et sheets
│   │   └── ...
│   │
│   ├── 📁 hooks/                 # 50+ custom hooks
│   ├── 📁 contexts/              # Providers React
│   ├── 📁 services/              # Clients API
│   ├── 📁 lib/                   # Utilitaires
│   ├── 📁 types/                 # Types TypeScript
│   └── 📁 integrations/          # Supabase, Sentry
│
├── 📁 supabase/
│   ├── 📁 functions/             # 217 Edge Functions
│   │   ├── mood-camera/          # Analyse faciale
│   │   ├── assess-submit/        # Évaluations cliniques
│   │   ├── ai-coach/             # Coach IA
│   │   ├── generate-music/       # Génération Suno
│   │   ├── journal/              # Sauvegarde journal
│   │   ├── gdpr-*/               # Conformité RGPD
│   │   ├── b2b-*/                # APIs entreprise
│   │   └── ...
│   │
│   └── 📁 migrations/            # Migrations SQL
│
├── 📁 docs/                      # 400+ fichiers documentation
├── 📁 tests/                     # Tests E2E et unitaires
├── 📁 reports/                   # Audits accessibilité/sécurité
└── 📁 packages/
    └── contracts/                # Schémas Zod partagés
```

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** ≥ 20
- **npm** ≥ 10 (pas bun - incompatibilité @vitest/browser)
- Compte **Supabase** (fourni avec le projet)

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/emotionscare/emotionscare.git
cd emotionscare

# 2. Installer les dépendances
npm ci --legacy-peer-deps

# 3. Copier les variables d'environnement
cp .env.example .env.local

# 4. Lancer le serveur de développement
npm run dev
```

### Variables d'Environnement

```env
# Supabase (obligatoire)
VITE_SUPABASE_URL=https://yaincoxihiqdksxgrsrk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...

# APIs externes (optionnelles, configurées côté Supabase)
# OPENAI_API_KEY, HUME_API_KEY, SUNO_API_KEY → Secrets Supabase
```

### Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm run preview      # Prévisualiser le build
npm run lint         # ESLint
npm run format       # Prettier
npm run type-check   # TypeScript
npm run test         # Tests Vitest
npm run test:e2e     # Tests Playwright
```

---

## 🔐 Sécurité & Conformité

### RGPD

| Fonctionnalité | Statut |
|----------------|--------|
| Chiffrement AES-256-GCM | ✅ |
| Consentement explicite (opt-in clinique) | ✅ |
| Droit à l'oubli (suppression données) | ✅ |
| Export données (JSON/CSV) | ✅ |
| Anonymisation statistiques B2B | ✅ |
| Pseudonymisation | ✅ |
| Politique de rétention | ✅ |
| DPO contact | ✅ |

### Sécurité Backend

| Mesure | Statut |
|--------|--------|
| Row Level Security (RLS) sur 210+ tables | ✅ |
| JWT validation dans Edge Functions | ✅ |
| Rate limiting API | ✅ |
| Secrets management (Supabase Vault) | ✅ |
| Audit logs | ✅ |
| CSP Headers | ✅ |

---

## ♿ Accessibilité

### Conformité WCAG 2.1 AA

| Critère | Implémentation |
|---------|----------------|
| **Navigation clavier** | Tab, Enter, Escape sur tous les éléments |
| **Skip links** | Présents sur toutes les pages |
| **Focus visible** | Ring focus personnalisé |
| **ARIA** | Labels, rôles, descriptions |
| **Contraste** | Minimum 4.5:1 (AA) |
| **Reduced motion** | Respect `prefers-reduced-motion` |
| **High contrast** | Support mode contraste élevé |
| **Screen readers** | Compatible NVDA, VoiceOver |
| **Semantic HTML** | `<main>`, `<nav>`, `<header>`, etc. |

### Outils d'Audit

```bash
# Audit Axe dans Playwright
npm run test:e2e -- accessibility.e2e.ts

# Extension navigateur
# - axe DevTools (Chrome)
# - WAVE Evaluation Tool
```

---

## 📈 Performances

### Core Web Vitals

| Métrique | Valeur | Cible | Statut |
|----------|--------|-------|--------|
| **FCP** (First Contentful Paint) | 1.2s | < 1.8s | ✅ |
| **LCP** (Largest Contentful Paint) | 2.1s | < 2.5s | ✅ |
| **CLS** (Cumulative Layout Shift) | 0.05 | < 0.1 | ✅ |
| **TTI** (Time to Interactive) | 2.8s | < 3.8s | ✅ |
| **FID** (First Input Delay) | 50ms | < 100ms | ✅ |

### Optimisations

- ⚡ Code splitting + lazy loading routes
- 🖼️ Images AVIF/WebP optimisées
- 🗄️ React Query cache intelligent
- 📦 Tree shaking Vite
- 🔄 Prefetching des routes critiques

---

## 🧪 Tests

### Structure des Tests

```
tests/
├── e2e/                    # Tests Playwright (46+ specs)
│   ├── journal-flow.e2e.ts
│   ├── breath-flow.e2e.ts
│   ├── scan-flow.e2e.ts
│   └── accessibility.e2e.ts
│
├── unit/                   # Tests Vitest
│   └── components/
│
└── edge-functions/         # Tests Edge Functions
    ├── mood-camera.test.ts
    └── assess-submit.test.ts
```

### Commandes

```bash
# Tests unitaires
npm test

# Tests E2E (headless)
npm run test:e2e

# Tests E2E (UI mode)
npm run test:e2e:ui

# Couverture
npm test -- --coverage
```

### Couverture Cible

| Type | Objectif |
|------|----------|
| Lignes | ≥ 90% |
| Branches | ≥ 85% |
| Edge Functions | 100% endpoints critiques |

---

## 📚 Documentation

### Guides Utilisateur

| Document | Description |
|----------|-------------|
| [Guide B2C](docs/GUIDE_UTILISATEUR_B2C.md) | Utilisateurs individuels |
| [Guide B2B Collaborateur](docs/GUIDE_UTILISATEUR_B2B_COLLAB.md) | Employés en entreprise |
| [Guide Admin RH](docs/GUIDE_ADMIN_B2B_RH.md) | Administrateurs RH |
| [FAQ](docs/FAQ_TROUBLESHOOTING.md) | Questions fréquentes |

### Documentation Technique

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | Vue d'ensemble technique |
| [RouterV2](docs/ROUTERV2_INDEX.md) | Système de routage |
| [Edge Functions](docs/EDGE_FUNCTIONS_DOCUMENTATION.md) | APIs serverless |
| [Design Tokens](docs/DESIGN_TOKENS.md) | Système de design |
| [Accessibilité](docs/ACCESSIBILITY_GUIDE.md) | Guide WCAG |
| [Sécurité](docs/SECURITY_PRIVACY.md) | RGPD et sécurité |

### Index Complet

📂 **[docs/](./docs/)** — 400+ fichiers de documentation incluant :
- Audits quotidiens (JOUR_1 à JOUR_68)
- Rapports de phases (PHASE_1 à PHASE_6)
- Guides d'intégration modules
- Changelogs détaillés

---

## 🗺️ Roadmap

### ✅ Q1-Q2 2025 — Fondations

- [x] MVP complet avec 31 modules
- [x] 217 Edge Functions déployées
- [x] 223 routes enregistrées
- [x] Accessibilité WCAG 2.1 AA
- [x] Gamification complète (XP, badges, streaks)
- [x] Intégrations IA (Hume, OpenAI, Suno)
- [x] Dashboard B2B avec analytics

### 🔄 Q3-Q4 2025 — Scale

- [ ] Apps mobiles natives (React Native)
- [ ] SSO entreprise (Okta, Azure AD)
- [ ] Intégrations SIRH (Workday, BambooHR)
- [ ] API publique documentée
- [ ] Wearables (Apple Watch, Fitbit)

### 🚀 2026 — Innovation

- [ ] IA prédictive burnout
- [ ] VR avancée (Quest 3)
- [ ] Marketplace modules
- [ ] Multi-tenant SaaS

---

## 🤝 Contribution

### Workflow Git

```bash
# 1. Fork le projet
# 2. Créer une branche
git checkout -b feature/ma-feature

# 3. Commiter (Conventional Commits)
git commit -m "feat(journal): add voice transcription"

# 4. Push
git push origin feature/ma-feature

# 5. Ouvrir une Pull Request
```

### Conventions

| Aspect | Standard |
|--------|----------|
| **Commits** | [Conventional Commits](https://www.conventionalcommits.org/) |
| **Code** | ESLint + Prettier + TypeScript strict |
| **Tests** | Couverture ≥ 90% lignes |
| **Accessibilité** | WCAG 2.1 AA obligatoire |
| **Documentation** | JSDoc sur exports publics |

### Checklist PR

- [ ] Tests passent (`npm test`)
- [ ] Lint OK (`npm run lint`)
- [ ] Types OK (`npm run type-check`)
- [ ] Accessibilité vérifiée (axe DevTools)
- [ ] Documentation mise à jour
- [ ] Changelog entry ajouté

---

## 📊 Métriques du Projet

| Indicateur | Valeur |
|------------|--------|
| **Modules (features/)** | 31 |
| **Pages** | 180+ |
| **Routes** | 223 |
| **Edge Functions** | 217 |
| **Tables Supabase** | 210+ |
| **Composants React** | 500+ |
| **Custom Hooks** | 50+ |
| **Documentation (docs/)** | 400+ fichiers |
| **Score Accessibilité** | 97% WCAG AA |
| **Performance FCP** | 1.2s |

---

## 📞 Support

| Canal | Contact |
|-------|---------|
| 📧 Email | support@emotionscare.app |
| 🐛 Issues | [GitHub Issues](https://github.com/emotionscare/emotionscare/issues) |
| 📚 Docs | [docs.emotionscare.app](https://docs.emotionscare.app) |
| 💬 Discord | [Communauté EmotionsCare](https://discord.gg/emotionscare) |

---

## 📄 Licence

**Propriétaire** — © 2025-2026 EmotionsCare. Tous droits réservés.

Voir [LICENSE](./LICENSE) pour plus de détails.

---

<p align="center">
  <img src="public/logo.svg" alt="EmotionsCare Logo" width="80" />
  <br><br>
  <strong>Fait avec ❤️ par l'équipe EmotionsCare</strong><br>
  <em>"Prendre soin de celles et ceux qui prennent soin"</em>
</p>

---

## 🔗 Liens Utiles

- 🌐 **Production** : [emotions-care.lovable.app](https://emotions-care.lovable.app)
- 📖 **Storybook** : À venir
- 📊 **Status Page** : À venir
- 🔒 **Security Policy** : [SECURITY.md](./SECURITY.md)
