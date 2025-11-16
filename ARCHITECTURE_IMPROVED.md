# Architecture Améliorée - EmotionsCare

Ce document propose une architecture améliorée pour le projet EmotionsCare, basée sur un audit complet du code et des meilleures pratiques de développement.

> **État d'implémentation** : ✅ Phase 1 et 2 complétées (Sécurité, Contracts, Routes API, Tests)

## Table des matières

1. [État d'implémentation](#état-dimplémentation)
2. [Vision générale](#vision-générale)
3. [Structure proposée](#structure-proposée)
4. [Améliorations de sécurité](#améliorations-de-sécurité)
5. [Organisation du code](#organisation-du-code)
6. [Recommandations par couche](#recommandations-par-couche)
7. [Migration progressive](#migration-progressive)
8. [Fichiers créés](#fichiers-créés)

---

## État d'implémentation

### ✅ Complété

#### Sécurité
- [x] Plugin de validation d'environnement (`services/lib/plugins/env.ts`)
  - Validation Zod de toutes les variables critiques
  - Warnings en production si variables optionnelles manquantes
  - Export `getEnv()` pour accès type-safe aux variables validées
- [x] Plugin de sécurité (`services/lib/plugins/security.ts`)
  - Helmet configuré pour headers HTTP sécurisés
  - CORS configuré via `ALLOWED_ORIGINS`
- [x] Plugin de rate limiting (`services/lib/plugins/rateLimit.ts`)
  - Limite configurable par IP ou user ID
  - Allow-list pour IPs internes
  - Support Redis optionnel

#### Contracts Package
- [x] Structure complète du package `packages/contracts/`
  - Schemas Zod pour journal, music, assessments
  - Types API communs (ApiResponse, PaginatedResponse, etc.)
  - Configuration TypeScript et package.json

#### Routes API
- [x] Structure v1 des routes (`services/api/routes/v1/`)
  - Routes journal avec validation Zod
  - Health check endpoints
  - Documentation et exemples

#### Tests
- [x] Tests unitaires pour plugins de sécurité
  - `env.test.ts` : 7 test cases
  - `security.test.ts` : 6 test cases

#### Frontend
- [x] Structure exemple feature-based (`src/features/journal/`)
  - Hooks (useJournalEntries)
  - Services (journalApi)
  - Documentation

### 🔜 À faire

- [ ] Implémenter la logique métier dans les routes (actuellement placeholders)
- [ ] Créer les services de base de données (JournalService, MusicService, etc.)
- [ ] Migrer progressivement les features existantes vers `src/features/`
- [ ] Configurer tRPC ou GraphQL pour type-safety end-to-end
- [ ] Ajouter tests d'intégration pour les routes API
- [ ] Configurer CI/CD avec les nouveaux tests

---

## Vision générale

Le projet EmotionsCare est une application monorépo TypeScript/React construite avec :
- **Frontend** : Vite, React, TailwindCSS, Radix UI
- **Backend** : Fastify, Supabase
- **Testing** : Vitest, Playwright
- **Intégrations** : OpenAI, Sentry, Firebase, Spotify, Apple Music, etc.

### Objectifs de l'architecture améliorée

1. **Sécurité renforcée** : Protection contre XSS, CSRF, injection, et autres vulnérabilités OWASP
2. **Maintenabilité** : Code organisé par domaine métier plutôt que par type technique
3. **Type-safety** : Contrats partagés entre frontend et backend
4. **Scalabilité** : Séparation claire des responsabilités
5. **Observabilité** : Logging, monitoring et error tracking améliorés

---

## Structure proposée

### Structure actuelle vs proposée

#### Actuelle (par type de fichier)
```
src/
├── components/
├── hooks/
├── pages/
├── services/
└── utils/
```

#### Proposée (par domaine métier)
```
src/
├── features/
│   ├── journal/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── music/
│   ├── assessments/
│   ├── vr/
│   └── breath/
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── core/
    ├── auth/
    ├── api/
    └── config/
```

### Structure backend proposée

```
services/
├── api/
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── journal/
│   │   │   ├── music/
│   │   │   ├── assessments/
│   │   │   └── health/
│   │   └── index.ts
│   └── index.ts
├── lib/
│   ├── plugins/
│   │   ├── auth.ts
│   │   ├── env.ts ✅ (nouveau)
│   │   ├── error.ts
│   │   ├── logging.ts
│   │   ├── security.ts ✅ (nouveau)
│   │   └── rateLimit.ts (recommandé)
│   ├── server.ts
│   └── jwt.ts
└── shared/
    └── utils/
```

### Package contracts partagé

```
packages/
└── contracts/
    ├── schemas/
    │   ├── journal.ts
    │   ├── music.ts
    │   └── assessments.ts
    ├── types/
    │   └── api.ts
    └── index.ts
```

---

## Améliorations de sécurité

### ✅ Implémentées

#### 1. Validation d'environnement (services/lib/plugins/env.ts)

Valide les variables d'environnement critiques au démarrage avec Zod :

```typescript
const envSchema = z.object({
  JWT_SECRETS: z.string().min(1),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  // Ajouter d'autres variables selon les besoins
});
```

**Avantages** :
- Fail-fast au démarrage si configuration invalide
- Typage des variables d'environnement
- Documentation implicite des variables requises

#### 2. Plugin de sécurité (services/lib/plugins/security.ts)

Intègre Helmet et CORS :

```typescript
// Helmet pour les headers de sécurité
await app.register(helmet, {
  contentSecurityPolicy: { ... }
});

// CORS configuré via ALLOWED_ORIGINS
await app.register(cors, {
  origin: allowedOrigins,
  credentials: true,
});
```

**Protection contre** :
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME sniffing
- Accès non autorisés cross-origin

### 🔜 Recommandations futures

#### 3. Rate limiting global

Ajouter un plugin de rate limiting :

```typescript
// services/lib/plugins/rateLimit.ts
import rateLimit from '@fastify/rate-limit';

export const rateLimitPlugin: FastifyPluginAsync = async app => {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
    cache: 10000,
    allowList: ['127.0.0.1'],
    redis: process.env.REDIS_URL, // optionnel
  });
};
```

**Dépendances** : `npm install @fastify/rate-limit`

#### 4. Rotation des secrets JWT

Implémenter une rotation périodique des secrets JWT :

```typescript
// services/lib/jwt.ts
const JWT_SECRETS = process.env.JWT_SECRETS!.split(',');
const CURRENT_SECRET = JWT_SECRETS[0];
const OLD_SECRETS = JWT_SECRETS.slice(1);

export async function verifyJwt(token: string): Promise<TokenPayload> {
  try {
    return await jwtVerify(token, CURRENT_SECRET);
  } catch (err) {
    // Tenter avec les anciens secrets
    for (const secret of OLD_SECRETS) {
      try {
        return await jwtVerify(token, secret);
      } catch {}
    }
    throw err;
  }
}
```

#### 5. Validation des inputs avec Zod

Utiliser Zod pour valider tous les inputs d'API :

```typescript
// packages/contracts/schemas/journal.ts
export const createJournalEntrySchema = z.object({
  content: z.string().min(1).max(10000),
  mood: z.number().min(1).max(10),
  tags: z.array(z.string()).max(10),
});

// Dans la route API
app.post('/journal', async (req, reply) => {
  const validated = createJournalEntrySchema.parse(req.body);
  // ...
});
```

#### 6. Gestion des secrets Supabase

**⚠️ Critique** : Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` côté client !

```typescript
// ❌ Mauvais
const supabase = createClient(url, SERVICE_ROLE_KEY); // côté client

// ✅ Bon
const supabase = createClient(url, PUBLISHABLE_KEY); // côté client
const supabaseAdmin = createClient(url, SERVICE_ROLE_KEY); // côté serveur uniquement
```

---

## Organisation du code

### Principe : Domain-Driven Design (DDD)

Organiser le code par **domaines métier** plutôt que par type technique.

#### Exemple : Feature "Journal"

```
src/features/journal/
├── components/
│   ├── JournalEditor.tsx
│   ├── JournalList.tsx
│   └── JournalCard.tsx
├── hooks/
│   ├── useJournalEntries.ts
│   ├── useCreateEntry.ts
│   └── useDeleteEntry.ts
├── services/
│   └── journalService.ts
├── types.ts
└── index.ts
```

**Avantages** :
- Cohésion : tout ce qui concerne le journal est au même endroit
- Facilite les tests : chaque feature est testable indépendamment
- Réduit les imports circulaires
- Simplifie l'onboarding des nouveaux développeurs

### Packages contracts

Créer un package partagé pour les types et schémas :

```
packages/contracts/
├── package.json
├── tsconfig.json
├── schemas/
│   ├── journal.ts
│   ├── music.ts
│   └── index.ts
├── types/
│   ├── api.ts
│   └── index.ts
└── index.ts
```

**Usage** :

```typescript
// Backend
import { createJournalEntrySchema } from '@emotionscare/contracts';
const validated = createJournalEntrySchema.parse(req.body);

// Frontend
import { JournalEntry } from '@emotionscare/contracts';
const entry: JournalEntry = { ... };
```

---

## Recommandations par couche

### Frontend

#### 1. Gestion d'état

**Actuel** : Mix de Recoil, Zustand, React Query

**Recommandation** :
- **Server state** : React Query (déjà utilisé)
- **Client state** : Zustand (plus léger que Recoil)
- Éviter de mélanger les deux

#### 2. Routing

Ajouter un préfixe `/app` pour les routes authentifiées :

```typescript
// src/router.tsx
const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  {
    path: '/app',
    element: <AuthLayout />,
    children: [
      { path: 'journal', element: <Journal /> },
      { path: 'music', element: <Music /> },
      // ...
    ],
  },
]);
```

#### 3. API Client type-safe

Considérer **tRPC** ou **GraphQL** pour un client API type-safe :

```typescript
// avec tRPC
const entries = await trpc.journal.list.query({ limit: 10 });
// ✅ Type-safe, auto-completion, erreurs à la compilation
```

### Backend

#### 1. Versioning d'API

Ajouter un préfixe `/v1` à toutes les routes :

```typescript
// services/api/routes/index.ts
export const registerRoutes = (app: FastifyInstance) => {
  app.register(journalRoutes, { prefix: '/v1/journal' });
  app.register(musicRoutes, { prefix: '/v1/music' });
  // ...
};
```

#### 2. Pattern Service/Controller

Séparer la logique métier des routes :

```typescript
// services/api/services/journalService.ts
export class JournalService {
  constructor(private db: Database) {}

  async createEntry(userId: string, data: CreateEntryInput) {
    // Logique métier
    return this.db.insert(...);
  }
}

// services/api/routes/v1/journal/index.ts
export const journalRoutes: FastifyPluginAsync = async app => {
  const journalService = new JournalService(app.db);

  app.post('/', async (req, reply) => {
    const entry = await journalService.createEntry(req.user.id, req.body);
    return { ok: true, data: entry };
  });
};
```

#### 3. Tests

Ajouter des tests pour les plugins :

```typescript
// services/lib/plugins/env.test.ts
describe('envValidationPlugin', () => {
  it('should throw if JWT_SECRETS is missing', async () => {
    delete process.env.JWT_SECRETS;
    await expect(createServer(...)).rejects.toThrow();
  });
});
```

---

## Migration progressive

### Phase 1 : Sécurité (✅ Complétée)

- [x] Plugin de validation d'environnement
- [x] Plugin de sécurité (Helmet + CORS)
- [x] Mise à jour de `server.ts`

### Phase 2 : Dépendances (En cours)

- [ ] Installer `@fastify/helmet`
- [ ] Installer `@fastify/cors`
- [ ] Installer `@fastify/rate-limit`
- [ ] Mettre à jour `.env.example` avec `ALLOWED_ORIGINS`

### Phase 3 : Documentation

- [ ] Créer `packages/contracts`
- [ ] Migrer les types partagés
- [ ] Documenter l'API avec OpenAPI/Swagger

### Phase 4 : Refactoring frontend

- [ ] Créer `src/features/` avec un domaine pilote (ex: journal)
- [ ] Migrer progressivement les autres domaines
- [ ] Supprimer les anciens dossiers `src/components`, `src/hooks`

### Phase 5 : Refactoring backend

- [ ] Créer `services/api/routes/v1/`
- [ ] Migrer les routes existantes avec préfixe `/v1`
- [ ] Introduire le pattern Service/Controller

### Phase 6 : Type-safety

- [ ] Évaluer tRPC vs GraphQL
- [ ] Implémenter un POC
- [ ] Migrer les endpoints critiques

---

## Outils et automatisation

### Scripts recommandés

```json
{
  "scripts": {
    "lint:security": "eslint --plugin security",
    "audit:deps": "npm audit --audit-level=moderate",
    "audit:licenses": "license-checker --summary",
    "db:backup": "pg_dump $DATABASE_URL > backup.sql",
    "docker:test": "docker-compose -f docker-compose.test.yml up --abort-on-container-exit"
  }
}
```

### CI/CD

Ajouter des checks de sécurité dans le CI :

```yaml
# .github/workflows/security.yml
name: Security Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit --audit-level=moderate
      - run: npm run lint:security
```

---

## Observabilité

### Logging structuré

Utiliser Pino (déjà intégré avec Fastify) avec des logs structurés :

```typescript
app.log.info({ userId, action: 'create_entry' }, 'Journal entry created');
// => {"userId":"123","action":"create_entry","msg":"Journal entry created"}
```

### Monitoring

Intégrer des métriques avec Sentry (déjà configuré) :

```typescript
import * as Sentry from '@sentry/node';

// Capturer les métriques métier
Sentry.metrics.increment('journal.entry.created', 1, {
  tags: { mood: entry.mood },
});
```

### Health checks

Le healthcheck existant est bon, mais pourrait inclure :

```typescript
app.get('/health', async () => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    supabase: await checkSupabase(),
  };
  const healthy = Object.values(checks).every(c => c.ok);
  return { ok: healthy, checks };
});
```

---

## Ressources

- [Fastify Best Practices](https://www.fastify.io/docs/latest/Guides/Getting-Started/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Zod Documentation](https://zod.dev/)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)

---

## Fichiers créés

Cette section liste tous les fichiers créés ou modifiés lors de l'implémentation de cette architecture.

### Plugins de sécurité

```
services/lib/plugins/
├── env.ts                    # ✅ Validation d'environnement avec Zod
├── env.test.ts              # ✅ Tests unitaires (7 tests)
├── security.ts              # ✅ Helmet + CORS
├── security.test.ts         # ✅ Tests unitaires (6 tests)
└── rateLimit.ts             # ✅ Rate limiting configurable
```

### Package Contracts

```
packages/contracts/
├── package.json             # ✅ Configuration du package
├── tsconfig.json            # ✅ Configuration TypeScript
├── index.ts                 # ✅ Export principal
├── schemas/
│   ├── index.ts            # ✅ Export de tous les schémas
│   ├── assess.ts           # ✅ Schémas d'évaluation (existant, déplacé)
│   ├── journal.ts          # ✅ Schémas journal (nouveau)
│   └── music.ts            # ✅ Schémas musique (nouveau)
└── types/
    ├── index.ts            # ✅ Export de tous les types
    └── api.ts              # ✅ Types API communs (nouveau)
```

### Routes API v1

```
services/api/routes/
├── README.md                # ✅ Documentation des routes
└── v1/
    ├── index.ts            # ✅ Agrégateur de routes v1
    ├── journal/
    │   └── index.ts        # ✅ Routes journal
    └── health/
        └── index.ts        # ✅ Health checks
```

### Feature Journal (exemple)

```
src/features/journal/
├── README.md                # ✅ Documentation de la feature
├── index.ts                 # ✅ Exports publics
├── hooks/
│   └── useJournalEntries.ts # ✅ Hook React Query
└── services/
    └── journalApi.ts        # ✅ Client API
```

### Fichiers modifiés

```
services/lib/server.ts       # ✅ Enregistrement des nouveaux plugins
package.json                 # ✅ Ajout de @fastify/helmet, @fastify/cors, @fastify/rate-limit
.env.example                 # ✅ Variables ALLOWED_ORIGINS, RATE_LIMIT_*, etc.
ARCHITECTURE_IMPROVED.md     # ✅ Ce document
```

---

## Conclusion

Cette architecture améliorée vise à renforcer la **sécurité**, **maintenabilité** et **scalabilité** du projet EmotionsCare. La migration peut se faire **progressivement** sans bloquer le développement actuel.

### ✅ Déjà fait
1. ~~Installer les dépendances manquantes (`@fastify/helmet`, `@fastify/cors`)~~
2. ~~Ajouter `ALLOWED_ORIGINS` à `.env.example`~~
3. ~~Créer le package `contracts`~~
4. ~~Commencer la migration d'un domaine pilote (ex: journal)~~

### 🔜 Prochaines étapes
1. Installer les dépendances : `npm install`
2. Mettre à jour `.env` avec les nouvelles variables (voir `.env.example`)
3. Lancer les tests : `npm run test:api`
4. Implémenter la logique métier dans les routes API
5. Migrer progressivement les autres features vers `src/features/`

Pour toute question ou discussion, n'hésitez pas à ouvrir une issue ou contacter l'équipe architecture.
