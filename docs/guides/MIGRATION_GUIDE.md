# Guide de Migration - Architecture Améliorée

Ce guide vous accompagne dans la migration progressive de votre code vers la nouvelle architecture feature-based d'EmotionsCare.

## Table des matières

1. [Avant de commencer](#avant-de-commencer)
2. [Migration Frontend](#migration-frontend)
3. [Migration Backend](#migration-backend)
4. [Migration des Types](#migration-des-types)
5. [Checklist par Feature](#checklist-par-feature)
6. [Résolution de problèmes](#résolution-de-problèmes)

---

## Avant de commencer

### 1. Installer les dépendances

```bash
npm install
```

### 2. Mettre à jour les variables d'environnement

Copiez les nouvelles variables de `.env.example` vers votre `.env` :

```bash
# Nouvelles variables requises
JWT_SECRETS=<générez avec: openssl rand -base64 64>
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Nouvelles variables optionnelles
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_ALLOWLIST=127.0.0.1,::1
```

### 3. Comprendre la nouvelle structure

**Avant (par type)** :
```
src/
├── components/
├── hooks/
├── pages/
└── services/
```

**Après (par domaine)** :
```
src/
├── features/
│   ├── journal/
│   ├── music/
│   └── assessments/
└── shared/
    ├── components/
    └── hooks/
```

---

## Migration Frontend

### Étape 1 : Identifier une feature à migrer

Commencez par une feature simple, par exemple **journal** :

**Fichiers concernés** :
- `src/components/Journal*.tsx`
- `src/hooks/useJournal*.ts`
- `src/pages/journal/`
- `src/services/journalService.ts`

### Étape 2 : Créer la structure de la feature

```bash
mkdir -p src/features/journal/{components,hooks,services,types}
```

### Étape 3 : Déplacer les fichiers

#### Composants

```bash
# Avant
src/components/JournalEditor.tsx
src/components/JournalList.tsx
src/components/JournalCard.tsx

# Après
src/features/journal/components/JournalEditor.tsx
src/features/journal/components/JournalList.tsx
src/features/journal/components/JournalCard.tsx
```

#### Hooks

```bash
# Avant
src/hooks/useJournalEntries.ts
src/hooks/useCreateEntry.ts

# Après
src/features/journal/hooks/useJournalEntries.ts
src/features/journal/hooks/useCreateEntry.ts
```

#### Services

```bash
# Avant
src/services/journalService.ts

# Après
src/features/journal/services/journalApi.ts
```

### Étape 4 : Mettre à jour les imports

**Avant** :
```typescript
import { JournalEditor } from '@/components/JournalEditor';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { journalService } from '@/services/journalService';
```

**Après** :
```typescript
import { JournalEditor, useJournalEntries } from '@/features/journal';
// Ou imports spécifiques
import { JournalEditor } from '@/features/journal/components';
import { useJournalEntries } from '@/features/journal/hooks';
```

### Étape 5 : Créer l'index.ts de la feature

```typescript
// src/features/journal/index.ts
export { JournalEditor, JournalList, JournalCard } from './components';
export { useJournalEntries, useCreateEntry } from './hooks';
export { journalApi } from './services';
```

### Étape 6 : Utiliser les types de @emotionscare/contracts

**Avant** :
```typescript
import { JournalEntry } from '@/types/journal';
```

**Après** :
```typescript
import { JournalEntry, createJournalEntrySchema } from '@emotionscare/contracts';
```

### Étape 7 : Mettre à jour les API clients

**Avant** :
```typescript
// src/services/journalService.ts
export async function createEntry(data: any) {
  const response = await fetch('/api/journal', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}
```

**Après** :
```typescript
// src/features/journal/services/journalApi.ts
import { createJournalEntrySchema } from '@emotionscare/contracts';

async create(input: CreateJournalEntryInput): Promise<JournalEntry> {
  // Validation côté client avec Zod
  const validated = createJournalEntrySchema.parse(input);

  const response = await this.request<{ data: JournalEntry }>(`/v1/journal`, {
    method: 'POST',
    body: JSON.stringify(validated),
  });
  return response.data;
}
```

---

## Migration Backend

### Étape 1 : Créer les routes v1

```bash
mkdir -p services/api/routes/v1/journal
```

### Étape 2 : Déplacer la logique des routes

**Avant** :
```typescript
// services/api/index.ts
app.post('/api/journal', async (req, reply) => {
  // Logique inline
});
```

**Après** :
```typescript
// services/api/routes/v1/journal/index.ts
import { FastifyPluginAsync } from 'fastify';
import { createJournalEntrySchema } from '@emotionscare/contracts';

export const journalRoutes: FastifyPluginAsync = async app => {
  app.post('/', async (req, reply) => {
    const input = createJournalEntrySchema.parse(req.body);
    const userId = req.user.id;

    const entry = await journalService.create(userId, input);

    return { ok: true, data: entry };
  });
};
```

### Étape 3 : Enregistrer les routes dans v1/index.ts

```typescript
// services/api/routes/v1/index.ts
import journalRoutes from './journal';

export const v1Routes: FastifyPluginAsync = async app => {
  await app.register(journalRoutes, { prefix: '/journal' });
};
```

### Étape 4 : Mettre à jour les URLs dans le serveur principal

**Avant** :
```typescript
// Routes sous /api
app.get('/api/journal', ...)
```

**Après** :
```typescript
// Routes sous /v1
import { v1Routes } from './routes/v1';
app.register(v1Routes, { prefix: '/v1' });
```

---

## Migration des Types

### Étape 1 : Identifier les types partagés

Types qui doivent être dans `@emotionscare/contracts` :
- ✅ Types d'entités (JournalEntry, MusicSession, etc.)
- ✅ Types de requêtes API (CreateEntryInput, ListEntriesInput, etc.)
- ✅ Schémas de validation Zod
- ❌ Types de composants React (props, state)
- ❌ Types internes à une feature

### Étape 2 : Créer les schémas Zod dans contracts

```typescript
// packages/contracts/schemas/journal.ts
import { z } from 'zod';

export const journalEntrySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  // ...
});

export const createJournalEntrySchema = journalEntrySchema
  .omit({ id: true })
  .extend({
    // Validations spécifiques à la création
  });

export type JournalEntry = z.infer<typeof journalEntrySchema>;
export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
```

### Étape 3 : Exporter depuis contracts

```typescript
// packages/contracts/schemas/index.ts
export * from './journal';
export * from './music';
export * from './assess';
```

### Étape 4 : Utiliser dans le code

```typescript
// Frontend
import { JournalEntry, createJournalEntrySchema } from '@emotionscare/contracts';

// Backend
import { createJournalEntrySchema } from '@emotionscare/contracts';
const validated = createJournalEntrySchema.parse(req.body);
```

---

## Checklist par Feature

Utilisez cette checklist pour chaque feature que vous migrez :

### Frontend

- [ ] Créer `src/features/<nom>/`
- [ ] Déplacer les composants vers `components/`
- [ ] Déplacer les hooks vers `hooks/`
- [ ] Déplacer les services vers `services/`
- [ ] Créer `index.ts` avec exports publics
- [ ] Mettre à jour tous les imports dans l'application
- [ ] Utiliser les types de `@emotionscare/contracts`
- [ ] Valider avec Zod côté client
- [ ] Tester que tout fonctionne

### Backend

- [ ] Créer `services/api/routes/v1/<nom>/`
- [ ] Créer `index.ts` avec les routes Fastify
- [ ] Utiliser les schémas Zod de `@emotionscare/contracts`
- [ ] Retourner des réponses cohérentes (`ApiResponse<T>`)
- [ ] Logger les erreurs avec `app.log.error`
- [ ] Enregistrer dans `v1/index.ts`
- [ ] Mettre à jour les URLs côté client (`/v1/<nom>`)
- [ ] Tester avec Postman ou curl
- [ ] Ajouter des tests unitaires

### Schemas & Types

- [ ] Créer le schéma Zod dans `packages/contracts/schemas/<nom>.ts`
- [ ] Exporter les types TypeScript via `z.infer`
- [ ] Exporter depuis `packages/contracts/schemas/index.ts`
- [ ] Supprimer les anciens types de `src/types/`
- [ ] Mettre à jour les imports partout

---

## Résolution de problèmes

### Erreur : "Cannot find module '@emotionscare/contracts'"

**Solution** :
```bash
# Installer les dépendances du package contracts
cd packages/contracts
npm install
cd ../..

# Ou configurer workspace dans package.json racine
{
  "workspaces": ["packages/*"]
}
```

### Erreur : "Environment validation failed"

**Solution** :
Vérifiez que toutes les variables requises sont dans `.env` :
```bash
# Minimum requis
JWT_SECRETS=<votre-secret-32-chars-minimum>
ALLOWED_ORIGINS=http://localhost:5173
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

### Imports circulaires entre features

**Solution** :
Ne jamais importer directement d'une feature à une autre. Utilisez `src/shared/` :

```typescript
// ❌ Mauvais
import { JournalCard } from '@/features/journal';

// ✅ Bon - déplacer JournalCard vers shared si utilisé ailleurs
import { JournalCard } from '@/shared/components';
```

### Routes API 404

**Solution** :
Vérifiez que :
1. Les routes sont enregistrées dans `v1/index.ts`
2. Le préfixe `/v1` est utilisé côté client
3. L'authentification est gérée (Bearer token)

```typescript
// Vérifier dans services/api/index.ts
app.register(v1Routes, { prefix: '/v1' });

// Vérifier dans le client
const API_BASE = '/v1'; // ou process.env.VITE_API_URL
```

### Tests qui échouent après migration

**Solution** :
Mettez à jour les mocks et imports dans les tests :

```typescript
// Avant
vi.mock('@/services/journalService');

// Après
vi.mock('@/features/journal/services/journalApi');
```

---

## Ordre de migration recommandé

1. **Journal** (simple, bien défini)
2. **Music** (plus complexe, API externe)
3. **Assessments** (interactions base de données)
4. **VR** (intégrations multiples)
5. **Autres features** (au fur et à mesure)

Pour chaque feature, suivez le cycle :
1. Frontend (components, hooks, services)
2. Types (contracts)
3. Backend (routes API)
4. Tests
5. Documentation

---

## Support

Pour toute question :
- Consultez `ARCHITECTURE_IMPROVED.md`
- Voir les exemples dans `src/features/journal/`
- Ouvrir une issue sur GitHub

Bon courage ! 🚀
