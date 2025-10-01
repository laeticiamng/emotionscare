# 🌟 EmotionsCare - Plateforme de Bien-être Émotionnel

Plateforme complète de gestion du bien-être émotionnel en entreprise, offrant des outils d'analyse émotionnelle, de coaching IA, et de suivi de santé mentale.

## 📋 Vue d'ensemble

EmotionsCare est une plateforme B2B/B2C de bien-être émotionnel en entreprise intégrant:
- Analyse émotionnelle en temps réel
- Coaching IA personnalisé (GPT-4.1/GPT-5)
- Exercices de respiration guidée
- Dashboards analytics individuels et équipe
- Journal émotionnel et suivi de tendances

## 🚀 Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **IA**: OpenAI GPT-4.1 + GPT-5
- **State**: Zustand + TanStack Query
- **Analytics**: Recharts + Custom dashboards

## 🛠️ Installation & Développement

### Prérequis
- Node.js 20.x
- npm (⚠️ pas de bun.lockb - incompatibilité @vitest/browser)
- Compte Supabase

### Installation
```bash
npm install
```

### Variables d'environnement
Voir `.env.example` pour la configuration complète.

### Développement
```bash
npm run dev           # Démarre le serveur dev
npm run build         # Build production
npm run preview       # Preview build
npm test              # Tests (couverture ≥90%)
npm run lint          # Linting
npm run format        # Formatting
```

## 📁 Structure du Projet

```
src/
├── components/        # Composants UI réutilisables
│   ├── breath/       # Exercices de respiration
│   ├── emotion/      # Sélection et tracking émotions
│   ├── layout/       # Layouts et navigation
│   └── scan/         # Scan émotionnel et analyse
├── hooks/            # Custom React hooks
├── services/         # Services business logic
├── pages/            # Pages de l'application
└── lib/              # Utilitaires et helpers

supabase/
├── functions/        # Edge Functions Supabase (26 fonctions)
└── migrations/       # Migrations base de données
```

## 🎯 Modules Principaux

### 1. **Analyse Émotionnelle** (`src/components/emotion/`)
- Sélection d'émotions multi-dimensionnelle
- Tracking d'humeur quotidien
- Historique et tendances émotionnelles

### 2. **Coaching IA** (`src/components/chat/`)
- Coach IA conversationnel (GPT-4.1)
- Suggestions personnalisées
- Exercices de bien-être adaptatifs

### 3. **Exercices de Respiration** (`src/components/breath/`)
- Techniques guidées (Box Breathing, 4-7-8, etc.)
- Animations visuelles
- Tracking de progression

### 4. **Dashboards** (`src/pages/dashboard/`)
- Analytics personnels (B2C)
- Analytics équipe (B2B)
- Métriques de bien-être

## 🔐 Authentification & Sécurité

- **Auth Supabase**: Email + Google OAuth
- **RLS Policies**: Sécurité au niveau base de données
- **Roles**: `b2c`, `b2b_user`, `b2b_admin`, `admin`
- **Edge Functions**: Middleware d'autorisation

## 📊 Edge Functions

Voir [supabase/functions/README.md](./supabase/functions/README.md) pour la documentation complète des 26 edge functions.

### Catégories principales:
- **IA & OpenAI** (10 fonctions): Chat, TTS, transcription, modération
- **Analytics** (4 fonctions): Métriques, rapports, dashboards
- **Auth & Users** (5 fonctions): Gestion utilisateurs, invitations
- **Notifications** (3 fonctions): Push, email, webhooks

## 📖 Documentation Détaillée

- [Architecture](./docs/ARCHITECTURE.md)
- [Composants](./src/components/README.md)
- [Hooks](./src/hooks/README.md)
- [Edge Functions](./supabase/functions/README.md)
- [Base de Données](./docs/DATABASE.md)
- [Guides d'API](./docs/API_GUIDES.md)

## 🧪 Tests & Qualité

- **Couverture minimale**: 90% lignes / 85% branches
- **Framework**: Vitest + Testing Library
- **A11y**: WCAG 2.1 niveau AA
- **Linting**: ESLint strict + TypeScript strict

## 📝 Conventions de Code

### TypeScript
- Mode strict activé
- Props 100% typées
- Pas de `any` (sauf cas exceptionnels documentés)

### React
- Composants fonctions fléchées
- `React.memo` pour optimisations
- Hooks customs préfixés `use`

### CSS
- Tailwind classes utilitaires uniquement
- Design system via `index.css`
- Pas de styles inline custom

### Fichiers
- Composants: `PascalCase.tsx`
- Utilitaires: `kebab-case.ts`
- Max 7 fichiers par dossier

## 🚀 Déploiement

### Production
```bash
npm run build
```

Le build est automatiquement déployé via Netlify/Vercel sur chaque push vers `main`.

### Edge Functions
Les edge functions sont automatiquement déployées avec le code Supabase.

## 🤝 Contribution

1. Créer une branche feature (`feature/ma-fonctionnalite`)
2. Commit avec messages clairs
3. Tests + linting passent
4. PR avec description détaillée

## 📄 Licence

Propriétaire - EmotionsCare © 2025

## 🆘 Support

- **Documentation**: [docs.emotionscare.com](https://docs.emotionscare.com)
- **Email**: support@emotionscare.com
- **Discord**: [discord.gg/emotionscare](https://discord.gg/emotionscare)

---

**Version**: 2.0.0  
**Dernière mise à jour**: 2025-01-20