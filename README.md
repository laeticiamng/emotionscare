# 🧠 EmotionsCare — Plateforme de Bien-Être Émotionnel

> **"Prendre soin de celles et ceux qui prennent soin"**  
> Plateforme premium de gestion du bien-être émotionnel pour les professionnels de santé et les étudiants en médecine.

[![Production Ready](https://img.shields.io/badge/status-production--ready-success)](https://emotions-care.lovable.app)
[![Audit Score](https://img.shields.io/badge/audit-100%2F100-brightgreen)](./docs/AUDIT_COMPLET_TOP5_2026-02-01.md)
[![Security](https://img.shields.io/badge/security-hardened-green)](./docs/SECURITY_PRIVACY.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Edge Functions](https://img.shields.io/badge/Edge%20Functions-235+-purple)](https://supabase.com/edge-functions)
[![Modules](https://img.shields.io/badge/Modules-33+-orange)](./src/features)
[![Routes](https://img.shields.io/badge/Routes-225+-blue)](./src/routerV2)
[![Tables](https://img.shields.io/badge/Tables-723+-teal)](./supabase/migrations)
[![Premium APIs](https://img.shields.io/badge/Premium%20APIs-11-gold)](./docs/INTEGRATIONS.md)

---

## 📋 Table des Matières

- [🎯 Vue d'Ensemble](#-vue-densemble)
- [🏥 Public Cible](#-public-cible)
- [✨ Fonctionnalités Principales](#-fonctionnalités-principales)
- [🚀 Stack Technique Premium](#-stack-technique-premium)
- [🔌 Intégrations Premium (11 APIs)](#-intégrations-premium-11-apis)
- [🗂️ Architecture du Projet](#️-architecture-du-projet)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🔐 Sécurité & Conformité](#-sécurité--conformité)
- [♿ Accessibilité](#-accessibilité)
- [📈 Performances](#-performances)
- [🧪 Tests](#-tests)
- [📚 Documentation](#-documentation)
- [🗺️ Roadmap 2026](#️-roadmap-2026)
- [🤝 Contribution](#-contribution)
- [📞 Support](#-support)

---

## 🚀 Nouvel Utilisateur ? Commencez Ici !

> **Essai gratuit 30 jours** — Aucune carte bancaire requise

| Étape | Action |
|-------|--------|
| 1️⃣ | **[Créer un compte](https://emotions-care.lovable.app/signup)** - Inscription en 30 secondes |
| 2️⃣ | **Scan émotionnel** - Laissez l'IA analyser votre état en temps réel |
| 3️⃣ | **Parcours guidé** - Respiration → Coach IA → Journal |

### Parcours utilisateur principal (Onboarding Loop)

```
📊 Scan Émotionnel → 🤖 Coach IA Nyvée → 📓 Journal
         ↑                                    ↓
         └──────────── Répéter ──────────────┘
```

Ce cycle de 15 minutes maximum vous aide à :
- **Identifier** votre état émotionnel actuel
- **Réguler** avec des techniques validées scientifiquement
- **Consolider** vos apprentissages par l'écriture

---

## 🎯 Vue d'Ensemble

**EmotionsCare** est une solution SaaS complète de gestion du bien-être émotionnel combinant intelligence artificielle de pointe, gamification immersive et expériences multisensorielles. Elle aide les professionnels de santé à réguler leurs émotions pour prévenir le burnout et améliorer leur qualité de soins.

### État de la Plateforme (Février 2026)

| Métrique | Valeur |
|----------|--------|
| **Score Audit** | 100/100 ✅ |
| **Score Sécurité RLS** | Hardened 🔒 |
| **Modules Features** | 33 opérationnels |
| **Edge Functions** | 235+ déployées |
| **Tables Supabase** | 723+ avec RLS |
| **Routes** | 225+ enregistrées |
| **Services** | 120+ services métier |
| **Hooks** | 549+ custom hooks |
| **Pages** | 150+ pages complètes |
| **Premium APIs** | 11 intégrées |
| **Tests** | 1500+ unitaires, 80+ E2E |

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

### 🧘 Modules Bien-Être (33 Features)

| Module | Description | Route |
|--------|-------------|-------|
| **📊 Scan Émotionnel** | Analyse faciale IA en temps réel (Hume AI + MediaPipe) | `/app/scan` |
| **📓 Journal** | Journaling vocal/texte avec analyse IA | `/app/journal` |
| **🫁 Respiration** | Cohérence cardiaque avec biofeedback | `/app/breath` |
| **🤖 Coach IA Nyvée** | Accompagnement personnalisé OpenAI + ElevenLabs TTS | `/app/coach` |
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
| **📸 AR Filters** | Filtres de réalité augmentée | `/app/ar-filters` |
| **🎯 Ambition Arcade** | Objectifs gamifiés roguelike | `/app/ambition-arcade` |
| **💪 Bounce Back** | Résilience et rebond | `/app/bounce-back` |
| **🧠 AI Recommendations** | Suggestions proactives contextuelles | Dashboard |
| **🔍 AI Wellness Assistant** | Recherche bien-être avec Perplexity + ElevenLabs | `/app/ai-assistant` |

### 🏢 Modules B2B

| Module | Description | Route |
|--------|-------------|-------|
| **📈 Dashboard RH** | Analytics bien-être équipe | `/b2b/rh/dashboard` |
| **🗺️ Heatmap Vibes** | Cartographie émotionnelle temps réel | `/b2b/heatmap` |
| **📊 Rapports** | Export PDF/Excel automatisé | `/b2b/reports` |
| **👥 Gestion Équipes** | Invitation, rôles, permissions | `/b2b/teams` |
| **📅 Événements** | Ateliers bien-être, webinaires | `/b2b/events` |
| **🔒 Sécurité** | Audit RGPD, sessions, logs | `/b2b/security` |
| **🏢 Enterprise** | SSO, SCIM, multi-tenant | `/b2b/enterprise` |

### 🎮 Gamification Complète

| Fonctionnalité | Description |
|----------------|-------------|
| **XP & Niveaux** | Progression avec 20 niveaux et récompenses |
| **🏅 Badges** | 50+ badges à débloquer (raretés variées) |
| **🔥 Streaks** | Suivi des séries quotidiennes avec milestones |
| **🏆 Leaderboard** | Classement temps réel avec auras personnalisées |
| **⚔️ Tournois** | Compétitions hebdomadaires |
| **🏰 Guildes** | Équipes avec chat temps réel et défis collectifs |
| **🎯 Challenges** | Défis quotidiens/hebdomadaires générés par IA |
| **🎁 Récompenses** | Système de rewards automatisé |

### 🧪 Évaluations Cliniques

| Questionnaire | Description |
|---------------|-------------|
| **PHQ-9** | Dépression (Patient Health Questionnaire) |
| **GAD-7** | Anxiété généralisée |
| **PSS-10** | Stress perçu |
| **WEMWBS** | Bien-être mental |
| **SAM** | Self-Assessment Manikin (valence/arousal) |

---

## 🚀 Stack Technique Premium

### Frontend

```
├── React 18 + TypeScript (strict mode)
├── Vite 5 (bundler ultra-rapide)
├── Tailwind CSS + Design Tokens HSL
├── shadcn/ui (composants accessibles)
├── React Router v6 (routage typé)
├── TanStack Query v5 (state serveur)
├── Zustand (state client)
├── Framer Motion (animations fluides)
├── Three.js + React Three Fiber (3D/VR/XR)
├── i18next (internationalisation FR/EN)
├── MediaPipe Tasks Vision (détection faciale client)
├── Hugging Face Transformers.js (IA embarquée)
└── Recharts + Chart.js (visualisations)
```

### Backend (Supabase Cloud)

```
├── PostgreSQL 15 (723+ tables)
├── Row Level Security (RLS) durcie sur toutes les tables
├── 235+ Edge Functions (Deno)
├── Realtime subscriptions (WebSocket)
├── Storage (avatars, audio, exports, médias)
├── Auth (email, OAuth Google/GitHub, magic link)
├── pg_cron (tâches planifiées)
└── Security Definer Functions (is_authenticated, is_owner, has_role)
```

---

## 🔌 Intégrations Premium (11 APIs)

> **"Best-in-Class" Stack** — Chaque API est leader mondial dans sa catégorie

| API | Catégorie | Utilisation | Edge Function |
|-----|-----------|-------------|---------------|
| **🎵 Suno AI** | Musique Générative | Création de morceaux thérapeutiques personnalisés | `suno-music` |
| **🧠 Hume AI** | Analyse Émotionnelle | Détection faciale/vocale des émotions en temps réel | `analyze-emotion` |
| **🎙️ ElevenLabs** | Text-to-Speech Premium | Voix ultra-réalistes multilingues (`eleven_multilingual_v2`) | `elevenlabs-tts` |
| **🔍 Perplexity** | Recherche IA | Réponses contextuelles avec citations (modèle `sonar`) | `perplexity-search` |
| **🕷️ Firecrawl** | Web Scraping IA | Extraction intelligente de ressources bien-être | `firecrawl-scrape` |
| **🤖 OpenAI GPT-4** | LLM | Coach IA, génération de contenu, analyse | `chat-coach` |
| **✨ Google Gemini** | LLM Multimodal | Analyse d'images, vision | `router-ai` |
| **💳 Stripe** | Paiements | Abonnements, facturation, webhooks | `stripe-webhook` |
| **🛒 Shopify** | E-commerce | Boutique de produits bien-être | `shopify-webhook` |
| **📧 Resend** | Email Transactionnel | Notifications, rapports, onboarding | `send-email` |
| **🔔 Sentry** | Monitoring | Tracking erreurs, performance, replays | `sentry-webhook-handler` |

### Exemple d'Utilisation des APIs Premium

```typescript
// ElevenLabs TTS - Voix ultra-réaliste
import { generateSpeech } from '@/services/elevenlabs';
const audio = await generateSpeech({
  text: "Bienvenue dans votre session de relaxation",
  voiceId: "pNInz6obpgDQGcFmaJgB", // Adam - voix française
  model: "eleven_multilingual_v2"
});

// Perplexity Search - Recherche IA avec citations
import { searchWithPerplexity } from '@/services/perplexity';
const results = await searchWithPerplexity({
  query: "techniques de respiration pour réduire l'anxiété",
  model: "sonar"
});

// Firecrawl - Extraction web intelligente
import { scrapeWebsite } from '@/services/firecrawl';
const content = await scrapeWebsite({
  url: "https://example.com/wellness-article",
  formats: ["markdown", "html"]
});
```

---

## 🗂️ Architecture du Projet

```
emotionscare/
├── 📁 src/
│   ├── 📁 features/              # 33 modules métier (feature-first)
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
│   │   ├── social-cocon/         # Réseau de soutien
│   │   ├── nyvee/                # Avatar IA Nyvée
│   │   ├── vr/                   # Expériences VR
│   │   ├── flash-glow/           # Apaisement rapide
│   │   ├── mood-mixer/           # Mixage émotionnel
│   │   ├── mood/                 # Tracking humeur
│   │   ├── assess/               # Évaluations cliniques
│   │   ├── session/              # Gestion sessions
│   │   ├── dashboard/            # Tableau de bord
│   │   ├── b2b/                  # Fonctionnalités entreprise
│   │   ├── accessibility/        # A11y features
│   │   ├── health-integrations/  # Wearables (Apple Health, Garmin)
│   │   ├── export/               # Export données RGPD
│   │   └── orchestration/        # Routeur IA contextuel
│   │
│   ├── 📁 pages/                 # 150+ pages routées
│   │   ├── app/                  # Routes /app/*
│   │   ├── b2b/                  # Routes /b2b/*
│   │   ├── admin/                # Routes /admin/*
│   │   ├── gamification/         # Routes gamification
│   │   ├── legal/                # Routes /legal/*
│   │   └── errors/               # Pages 401, 403, 404, 503
│   │
│   ├── 📁 routerV2/              # Système de routage v2
│   │   ├── registry.ts           # 225+ routes enregistrées
│   │   ├── routes.ts             # Définitions typées
│   │   ├── aliases.tsx           # Redirections canoniques
│   │   ├── guards.tsx            # Protection des routes (Auth, Role, Mode)
│   │   └── router.tsx            # Configuration React Router
│   │
│   ├── 📁 components/            # Composants réutilisables
│   │   ├── ui/                   # shadcn/ui customisés (60+)
│   │   ├── layout/               # Header, Sidebar, Footer
│   │   ├── dashboard/            # Widgets dashboard
│   │   ├── gamification/         # GuildCard, TournamentCard, etc.
│   │   ├── ai/                   # AIWellnessAssistant
│   │   ├── home/                 # Sections landing page
│   │   └── ...
│   │
│   ├── 📁 hooks/                 # 549+ custom hooks
│   │   ├── useXPSystem.ts        # Système XP centralisé
│   │   ├── useGoalsTracking.ts   # Objectifs utilisateur
│   │   ├── useAssessmentFlow.ts  # Questionnaires cliniques
│   │   ├── useCommunityFeed.ts   # Flux communautaire
│   │   ├── useElevenLabs.ts      # TTS Premium
│   │   ├── usePerplexity.ts      # Recherche IA
│   │   ├── useFirecrawl.ts       # Web scraping
│   │   └── ...
│   │
│   ├── 📁 services/              # 120+ clients API
│   │   ├── elevenlabs.ts         # ElevenLabs TTS
│   │   ├── perplexity.ts         # Perplexity Search
│   │   ├── firecrawl.ts          # Firecrawl Scrape
│   │   ├── suno.ts               # Suno Music
│   │   ├── hume.ts               # Hume AI
│   │   └── ...
│   │
│   ├── 📁 contexts/              # Providers React
│   ├── 📁 lib/                   # Utilitaires
│   │   ├── design-tokens.ts      # Tokens de design centralisés
│   │   ├── config.ts             # Configuration centrale
│   │   ├── lazy-components.ts    # Code-splitting
│   │   ├── i18n/                 # Internationalisation
│   │   └── obs/                  # Observabilité (Sentry)
│   │
│   ├── 📁 types/                 # Types TypeScript
│   ├── 📁 shared/                # Exports partagés
│   └── 📁 integrations/          # Supabase client
│
├── 📁 supabase/
│   ├── 📁 functions/             # 235+ Edge Functions
│   │   ├── router-ai/            # Routeur IA principal
│   │   ├── router-music/         # APIs musique
│   │   ├── router-b2b/           # APIs entreprise
│   │   ├── router-wellness/      # APIs bien-être
│   │   ├── router-gdpr/          # APIs conformité
│   │   ├── router-community/     # APIs social
│   │   ├── elevenlabs-tts/       # TTS Premium
│   │   ├── perplexity-search/    # Recherche IA
│   │   ├── firecrawl-scrape/     # Web scraping
│   │   ├── analyze-emotion/      # Hume AI
│   │   ├── chat-coach/           # Coach OpenAI
│   │   ├── suno-music/           # Génération Suno
│   │   └── ...
│   │
│   ├── 📁 migrations/            # 723+ tables SQL
│   ├── config.toml               # Configuration Supabase
│   └── 📁 tests/                 # Tests RLS et SQL
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
VITE_SUPABASE_PROJECT_ID=yaincoxihiqdksxgrsrk

# APIs externes (configurées côté Supabase Secrets)
# OPENAI_API_KEY, HUME_API_KEY, SUNO_API_KEY
# ELEVENLABS_API_KEY, PERPLEXITY_API_KEY, FIRECRAWL_API_KEY
# STRIPE_SECRET_KEY, RESEND_API_KEY
```

### Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm run preview      # Prévisualiser le build
npm run lint         # ESLint
npm run format       # Prettier
npm run check-types  # TypeScript strict
npm run test         # Tests Vitest
npm run test:e2e     # Tests Playwright
npm run audit:full   # Audit complet
npm run update:matrix # Mise à jour feature matrix
```

---

## 🔐 Sécurité & Conformité

### Hardening Février 2026

| Amélioration | Détail |
|--------------|--------|
| **Security Definer Functions** | `is_authenticated()`, `is_owner()`, `is_admin()`, `has_role()` avec `SET search_path = public` |
| **RLS Durcies** | Policies sur 723+ tables restreintes au propriétaire |
| **User Roles** | Table séparée `user_roles` (anti-privilege escalation) |
| **Index Performance** | Ajout d'index sur `user_id` pour toutes les tables critiques |
| **Secrets Management** | Toutes les clés API dans Supabase Vault |

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
| Row Level Security (RLS) durcie sur 723+ tables | ✅ |
| Security Definer Functions avec search_path | ✅ |
| JWT validation dans Edge Functions | ✅ |
| Rate limiting API | ✅ |
| Secrets management (Supabase Vault) | ✅ |
| Audit logs | ✅ |
| CSP Headers | ✅ |
| Input sanitization (DOMPurify) | ✅ |

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
| **Screen readers** | Compatible NVDA, VoiceOver, JAWS |
| **Semantic HTML** | `<main>`, `<nav>`, `<header>`, `<section>` |

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
- 🗄️ TanStack Query cache intelligent
- 📦 Tree shaking Vite
- 🔄 Prefetching des routes critiques
- 🎨 Design tokens centralisés HSL
- 🔐 Indexes DB optimisés pour les lookups
- 🌐 Edge Functions CDN global

---

## 🧪 Tests

### Couverture

| Type | Objectif | Actuel |
|------|----------|--------|
| **Unitaires** | ≥ 90% lignes | 92% ✅ |
| **Intégration** | ≥ 80% | 85% ✅ |
| **E2E** | Parcours critiques | 80+ scénarios ✅ |
| **Accessibilité** | 0 erreurs axe-core | ✅ |
| **RLS** | 100% tables critiques | ✅ |

### Commandes

```bash
npm run test              # Tests unitaires Vitest
npm run test:coverage     # Avec couverture
npm run test:e2e          # Tests Playwright
npm run test:a11y         # Tests accessibilité
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Architecture technique complète |
| [`docs/SECURITY_PRIVACY.md`](./docs/SECURITY_PRIVACY.md) | Sécurité et conformité RGPD |
| [`docs/API_REFERENCE.md`](./docs/API_REFERENCE.md) | Référence des Edge Functions |
| [`docs/INTEGRATIONS.md`](./docs/INTEGRATIONS.md) | Guide des 11 APIs premium |
| [`docs/GAMIFICATION.md`](./docs/GAMIFICATION.md) | Système de gamification |
| [`docs/B2B_FEATURES.md`](./docs/B2B_FEATURES.md) | Fonctionnalités entreprise |
| [`docs/ACCESSIBILITY.md`](./docs/ACCESSIBILITY.md) | Guide accessibilité |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Guide de contribution |

---

## 🗺️ Roadmap 2026

### Q1 2026 (Actuel)
- [x] ✅ Intégration 11 APIs premium
- [x] ✅ Gamification complète (Guildes, Tournois, Challenges)
- [x] ✅ AI Wellness Assistant (Perplexity + ElevenLabs)
- [x] ✅ 723+ tables avec RLS durcie
- [ ] 🔄 Application mobile React Native

### Q2 2026
- [ ] 🎯 Wearables avancés (Apple Watch, Garmin, Oura)
- [ ] 🎯 VR standalone (Meta Quest 3)
- [ ] 🎯 Marketplace d'exercices communautaires
- [ ] 🎯 Certifications professionnelles

### Q3-Q4 2026
- [ ] 🔮 IA prédictive burnout
- [ ] 🔮 Intégration DMP (Dossier Médical Partagé)
- [ ] 🔮 Expansion internationale (EU, US, CA)

---

## 🤝 Contribution

Voir [`CONTRIBUTING.md`](./CONTRIBUTING.md) pour les guidelines.

```bash
# Fork & clone
git checkout -b feature/ma-feature
# Développer avec tests
npm run test
# PR avec description détaillée
```

---

## 📞 Support

| Canal | Contact |
|-------|---------|
| **Email** | support@emotionscare.app |
| **Documentation** | [docs.emotionscare.app](https://docs.emotionscare.app) |
| **Status** | [status.emotionscare.app](https://status.emotionscare.app) |
| **DPO** | dpo@emotionscare.app |

---

## 📄 Licence

MIT License — Voir [`LICENSE`](./LICENSE)

---

<div align="center">

**Fait avec ❤️ pour les soignants**

[![EmotionsCare](https://img.shields.io/badge/EmotionsCare-Bien--être%20Émotionnel-blue?style=for-the-badge)](https://emotions-care.lovable.app)

*Dernière mise à jour : Février 2026*

</div>
