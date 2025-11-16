# EmotionsCare - Architecture Documentation

> **Documentation mise à jour suite à la refonte architecturale de novembre 2025**

## 🎯 Vue d'ensemble

EmotionsCare est une plateforme de bien-être émotionnel qui combine plusieurs approches thérapeutiques :
- 📝 **Journal émotionnel** avec feedback IA
- 🎵 **Thérapie musicale** générée par IA (Suno)
- 📊 **Évaluations psychométriques** standardisées
- 🥽 **Thérapie VR** immersive
- 🫁 **Exercices de respiration** guidés

## 🏗️ Architecture

### Stack Technique

**Frontend**
- ⚛️ React 18 + TypeScript
- ⚡ Vite
- 🎨 TailwindCSS + Radix UI
- 🔄 React Query (TanStack)
- 🧪 Vitest + Playwright

**Backend**
- 🚀 Fastify
- 🗄️ Supabase (PostgreSQL + Auth + Edge Functions)
- 🔐 JWT Authentication
- ✅ Zod validation

**Infrastructure**
- 📦 Monorépo avec workspaces
- 🔒 Helmet + CORS pour la sécurité
- 🚦 Rate limiting
- 📊 Sentry monitoring

### Structure du Projet

```
emotionscare/
├── packages/
│   └── contracts/              # 📜 Types et schémas partagés
│       ├── schemas/            # Schémas Zod (journal, music, assess)
│       └── types/              # Types communs (API, pagination)
│
├── services/
│   ├── api/                    # 🔌 API Fastify
│   │   └── routes/v1/          # Routes organisées par domaine
│   │       ├── journal/        # CRUD journal
│   │       ├── music/          # Génération musicale
│   │       └── health/         # Health checks
│   └── lib/
│       ├── plugins/            # Plugins Fastify
│       │   ├── env.ts          # Validation environnement
│       │   ├── security.ts     # Helmet + CORS
│       │   ├── rateLimit.ts    # Rate limiting
│       │   ├── auth.ts         # JWT auth
│       │   └── error.ts        # Error handling
│       └── server.ts           # Configuration serveur
│
├── src/
│   ├── features/               # 🎨 Features organisées par domaine
│   │   ├── journal/            # Feature journal
│   │   │   ├── components/
│   │   │   ├── hooks/          # useJournalEntries, etc.
│   │   │   └── services/       # journalApi
│   │   └── music/              # Feature musique
│   │       ├── components/
│   │       ├── hooks/          # useMusicSessions, useCreateMusic
│   │       └── services/       # musicApi
│   │
│   ├── shared/                 # Composants partagés
│   ├── pages/                  # Pages Next.js / React Router
│   └── types/                  # Types spécifiques frontend
│
├── sql/                        # Migrations SQL
├── supabase/                   # Supabase config
│   ├── migrations/
│   ├── functions/              # Edge functions
│   └── seeds/
│
└── tests/                      # Tests E2E et intégration
```

## 🚀 Démarrage Rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration

Copiez `.env.example` vers `.env` et configurez :

```env
# Supabase (requis)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Sécurité (requis pour l'API)
JWT_SECRETS=<générez avec: openssl rand -base64 64>
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Rate Limiting (optionnel)
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

### 3. Développement

```bash
# Frontend
npm run dev

# API
npm run dev:api

# Tests
npm run test
npm run test:api
npm run e2e
```

## 📚 Documentation Détaillée

- **[ARCHITECTURE_IMPROVED.md](./ARCHITECTURE_IMPROVED.md)** - Architecture complète et améliorations
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Guide de migration feature-based
- **[packages/contracts/](./packages/contracts/)** - Documentation des contrats

## 🔐 Sécurité

### Implémenté

✅ **Validation d'environnement** - Zod schema au démarrage
✅ **Headers sécurisés** - Helmet (XSS, clickjacking, etc.)
✅ **CORS** - Origines autorisées configurables
✅ **Rate limiting** - 100 req/15min par IP ou user
✅ **JWT Authentication** - Rotation de secrets supportée
✅ **Input validation** - Zod sur tous les endpoints

### À venir

⏳ Rotation automatique des secrets JWT
⏳ 2FA pour les comptes admin
⏳ Audit logs
⏳ CSP strict

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests API (plugins de sécurité)
npm run test:api

# Tests E2E
npm run e2e

# Coverage
npm run test -- --coverage
```

**Coverage actuel** :
- Plugins de sécurité : 13 tests (env, security, rate limit)
- Routes API : placeholders (TODO)

## 📦 Packages & Contracts

Le package `@emotionscare/contracts` centralise les types et schémas Zod :

```typescript
// Utilisation
import {
  JournalEntry,
  createJournalEntrySchema,
  ApiResponse,
} from '@emotionscare/contracts';

// Validation côté client
const validated = createJournalEntrySchema.parse(input);

// Validation côté serveur
app.post('/v1/journal', async (req) => {
  const input = createJournalEntrySchema.parse(req.body);
  // ...
});
```

## 🎨 Features

### Journal Émotionnel

**Frontend** : `src/features/journal/`
- Hook `useJournalEntries()` avec React Query
- API client type-safe avec validation Zod
- Composants (TODO)

**Backend** : `/v1/journal`
- `GET /` - Liste avec filtres
- `POST /` - Création
- `GET /:id` - Récupération
- `PATCH /:id` - Mise à jour
- `DELETE /:id` - Suppression
- `GET /stats` - Statistiques

### Génération Musicale

**Frontend** : `src/features/music/`
- Hook `useMusicSessions()` pour lister
- Hook `useCreateMusic()` pour générer
- Polling automatique avec React Query

**Backend** : `/v1/music`
- `POST /` - Créer une génération
- `GET /:id` - Status avec polling
- `POST /:id/cancel` - Annuler
- `POST /webhook/suno` - Webhook Suno

**Intégration Suno AI** :
- Modèles V3.5 à V5
- Mode custom ou instrumental
- Mapping émotion → style musical

## 🔧 Configuration API

### Plugins Fastify

Les plugins sont enregistrés dans cet ordre :
1. `envValidation` - Validation des variables d'environnement
2. `logging` - Logging structuré
3. `errorHandler` - Gestion d'erreurs centralisée
4. `security` - Helmet + CORS
5. `auth` - JWT authentication
6. `rateLimit` - Limitation de débit (optionnel)

### Variables d'Environnement

**Requises** :
- `JWT_SECRETS` - Secrets JWT (séparés par virgules)
- `ALLOWED_ORIGINS` - Origines CORS autorisées
- `VITE_SUPABASE_URL` - URL Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Clé publique Supabase

**Optionnelles** :
- `RATE_LIMIT_MAX` - Max requêtes (défaut: 100)
- `RATE_LIMIT_WINDOW` - Fenêtre temporelle (défaut: 900000ms)
- `VITE_SENTRY_DSN` - Monitoring Sentry
- `SUPABASE_SERVICE_ROLE_KEY` - Clé admin Supabase (backend only)

## 🚦 CI/CD

**Scripts disponibles** :
```bash
npm run lint              # ESLint
npm run type-check        # TypeScript
npm run test:quick        # Lint + tests
npm run build             # Production build
npm run preview           # Preview build
```

**GitHub Actions** (TODO) :
- Tests automatiques sur PR
- Security audit
- Lighthouse CI
- Deploy preview

## 📊 Monitoring

**Sentry** :
- Error tracking frontend + backend
- Performance monitoring
- Release tracking

**Métriques** :
- Health checks : `/v1/health` et `/v1/healthz`
- Rate limiting : headers `X-RateLimit-*`
- Logs structurés (Pino via Fastify)

## 🤝 Contribution

### Workflow

1. Créer une branche depuis `main`
2. Implémenter + tests
3. Lancer `npm run test:quick`
4. Créer une PR
5. Review + CI
6. Merge

### Conventions

**Commits** : Conventional Commits
```
feat(journal): add emotion tags
fix(api): handle empty journal entries
docs(arch): update migration guide
```

**Code** :
- ESLint + Prettier
- TypeScript strict mode
- Tests obligatoires pour nouveaux endpoints

## 📝 Roadmap

### Phase 1 ✅ (Complétée)
- [x] Package contracts avec schémas Zod
- [x] Plugins de sécurité (env, security, rate limit)
- [x] Routes API v1 (journal, music, health)
- [x] Structure feature-based (journal, music)
- [x] Tests plugins (13 tests)
- [x] Documentation complète

### Phase 2 🚧 (En cours)
- [ ] Implémenter la logique métier dans les routes
- [ ] Services de base de données (JournalService, MusicService)
- [ ] Migrer features existantes vers `src/features/`
- [ ] Tests d'intégration API

### Phase 3 📅 (Planifié)
- [ ] tRPC ou GraphQL pour type-safety end-to-end
- [ ] Rotation automatique JWT
- [ ] WebSockets pour temps réel
- [ ] Notifications push

## 🔗 Liens Utiles

- **Documentation** : Voir dossier `docs/`
- **API Reference** : `/v1/` endpoints (Swagger TODO)
- **Supabase Dashboard** : https://app.supabase.com
- **Sentry** : https://sentry.io

---

**Version** : 1.2.0
**Dernière mise à jour** : Novembre 2025
**Auteur** : Équipe EmotionsCare
**Licence** : UNLICENSED (privé)
