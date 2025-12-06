# 🏗️ Architecture EmotionsCare

## 📐 Vue d'ensemble

EmotionsCare suit une architecture **client-serveur moderne** avec séparation claire frontend/backend.

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Pages   │  │Components│  │  Hooks   │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │             │              │                    │
│       └─────────────┴──────────────┘                    │
│                     │                                    │
│            ┌────────▼────────┐                          │
│            │  Supabase SDK   │                          │
│            └────────┬────────┘                          │
└─────────────────────┼─────────────────────────────────┘
                      │ HTTPS/WSS
┌─────────────────────▼─────────────────────────────────┐
│              BACKEND (Supabase)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │PostgreSQL│  │Edge Funcs│  │  Storage │            │
│  │  + RLS   │  │  (Deno)  │  │  Buckets │            │
│  └────┬─────┘  └────┬─────┘  └──────────┘            │
│       │             │                                   │
│       └─────────────┴───────────┐                      │
│                                  │                      │
│                    ┌─────────────▼──────────┐          │
│                    │  OpenAI API (externe)  │          │
│                    └────────────────────────┘          │
└──────────────────────────────────────────────────────┘
```

---

## 🎯 Principes Architecturaux

### 1. **Séparation des responsabilités**
- **Frontend**: UI/UX, state management local, interactions utilisateur
- **Backend**: Logique métier, authentification, persistance, API externes

### 2. **Server-side security**
- Authentification via Supabase Auth
- RLS (Row Level Security) sur toutes les tables
- Edge functions pour appels API externes sécurisés

### 3. **Type-safety**
- TypeScript strict côté frontend
- Interfaces partagées via `@/integrations/supabase/types`
- Validation runtime des données API

### 4. **Scalabilité**
- Edge functions serverless (auto-scaling)
- CDN pour assets statiques
- Lazy loading et code splitting

---

## 📦 Stack Technologique

### Frontend
```
React 18.2
├── TypeScript 5.x (strict mode)
├── Vite 5.x (build tool)
├── TailwindCSS 3.x (styling)
│   └── shadcn/ui (component library)
├── TanStack Query (server state)
├── Zustand (client state)
└── React Router 6 (routing)
```

### Backend
```
Supabase
├── PostgreSQL 15 (database)
│   └── Row Level Security
├── Edge Functions (Deno runtime)
│   └── OpenAI SDK
├── Auth (JWT-based)
└── Storage (S3-compatible)
```

---

## 🗄️ Architecture Base de Données

### Schéma principal

```sql
-- Users & Auth
profiles (id, email, role, created_at, ...)
org_memberships (user_id, org_id, role, ...)

-- Emotions & Wellbeing
emotion_logs (id, user_id, emotion_type, intensity, ...)
journal_entries (id, user_id, content, mood, ...)
breathing_sessions (id, user_id, technique, duration, ...)

-- Analytics
team_emotion_summary (date, org_id, emotion_type, ...)
user_metrics (user_id, metric_type, value, date, ...)

-- Content
music_tracks (id, title, emotion, audio_url, ...)
```

### RLS Policies

Toutes les tables ont des RLS policies strictes:

```sql
-- Exemple: emotion_logs
CREATE POLICY "Users can view own emotions"
  ON emotion_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can view team emotions"
  ON emotion_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE user_id = auth.uid()
      AND role IN ('manager', 'admin')
    )
  );
```

---

## 🔄 Flux de Données

### 1. Authentification

```
User → Login Form
  ↓
Supabase Auth (JWT)
  ↓
JWT stored in localStorage
  ↓
Subsequent requests include JWT
  ↓
Backend validates JWT + RLS
```

### 2. Emotion Check-in

```
User → EmotionSelector Component
  ↓
Submit emotion + note
  ↓
Hook: useEmotions.addEmotion()
  ↓
Edge Function: analyze-emotion-text
  ↓ (si note textuelle)
OpenAI GPT-4.1 analysis
  ↓
Store in emotion_logs table (RLS protected)
  ↓
Real-time update via Supabase subscriptions
```

### 3. Coach IA

```
User → Chat Input
  ↓
Hook: useChatWithAI.sendMessage()
  ↓
Edge Function: chat-with-ai
  ↓
OpenAI GPT-5 (system prompt + context)
  ↓
Response streamed back
  ↓
Display with typing animation
```

---

## 🎨 Architecture Frontend

### Structure de composants

```
src/
├── pages/              # Route-level components
│   ├── Dashboard.tsx   # Lazy loaded
│   ├── Journal.tsx
│   └── ...
├── components/
│   ├── emotion/        # Feature: Emotions
│   │   ├── EmotionSelector.tsx
│   │   └── MoodTracker.tsx
│   ├── breath/         # Feature: Breathing
│   └── ui/             # Shared UI (shadcn)
├── hooks/              # Business logic
│   ├── useAuth.ts
│   ├── useEmotions.ts
│   └── ...
└── lib/                # Pure utilities
    ├── utils.ts
    └── supabase.ts
```

### State Management

```typescript
// Server state: TanStack Query
const { data: emotions } = useQuery({
  queryKey: ['emotions', userId],
  queryFn: () => fetchEmotions(userId)
});

// Client state: Zustand
const useAppStore = create((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme })
}));
```

### Routing

```typescript
// Lazy loading pour performances
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Journal = lazy(() => import('@/pages/Journal'));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/team" element={<TeamDashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
```

---

## ⚡ Architecture Backend

### Edge Functions

```
supabase/functions/
├── _shared/
│   ├── auth-middleware.ts    # Auth logic
│   └── types.ts              # Shared types
├── openai-chat/
│   └── index.ts              # OpenAI integration
└── analyze-emotion-text/
    └── index.ts
```

### Pattern standard

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authorizeRole } from '../_shared/auth-middleware.ts';

serve(async (req) => {
  // 1. CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 2. Auth
  const { user, status } = await authorizeRole(req, ['b2c']);
  if (!user) return unauthorizedResponse(status);

  // 3. Business Logic
  try {
    const { data } = await req.json();
    const result = await processData(data);
    return successResponse(result);
  } catch (error: unknown) {
    return errorResponse(error);
  }
});
```

---

## 🔒 Sécurité

### 1. Authentication Flow

```
1. User submits credentials
2. Supabase Auth validates
3. JWT issued (expires 1h)
4. Refresh token stored (httpOnly cookie)
5. Frontend includes JWT in requests
6. Backend validates JWT signature
7. RLS policies check user permissions
```

### 2. RLS Strategy

- **Default deny**: Toutes les tables ont RLS activé
- **User isolation**: `auth.uid()` vérifié sur chaque query
- **Role-based**: Managers peuvent voir leur équipe uniquement

### 3. API Keys

- **OpenAI Key**: Stockée dans Supabase Secrets (jamais exposée au client)
- **Supabase Anon Key**: Public, mais RLS protège les données
- **Service Role Key**: Utilisée UNIQUEMENT dans les edge functions

---

## 📊 Monitoring & Observabilité

### Logs

```typescript
// Structured logging dans edge functions
console.log('Emotion analysis', {
  userId: user.id,
  emotionType: emotion,
  timestamp: new Date().toISOString(),
  duration: Date.now() - startTime
});
```

### Métriques

- **Frontend**: Web Vitals (CLS, LCP, FID)
- **Backend**: Edge function latency (p50, p95, p99)
- **Database**: Query performance (EXPLAIN ANALYZE)

### Alertes

- Taux d'erreur edge functions > 5%
- Latence p95 > 2s
- RLS policy violations

---

## 🚀 Déploiement

### Frontend

```
1. Build: npm run build
2. Assets optimisés (minification, compression)
3. Deploy sur Netlify/Vercel
4. CDN distribution automatique
```

### Backend

```
1. Push vers main branch
2. Supabase CLI détecte changements
3. Edge functions déployées automatiquement
4. Migrations DB appliquées si nouvelles
```

---

## 🔮 Évolutions Futures

### Phase 2 (Q2 2025)
- [ ] Analyse vocale en temps réel
- [ ] Recommandations ML personnalisées
- [ ] Intégration wearables (Apple Health, Fitbit)

### Phase 3 (Q3 2025)
- [ ] Mode offline (PWA + Service Workers)
- [ ] Peer support (chat utilisateurs anonyme)
- [ ] API publique pour partenaires

---

## 📚 Références Techniques

- [React Best Practices](https://react.dev/learn)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Mis à jour**: ${new Date().toISOString().split('T')[0]}
