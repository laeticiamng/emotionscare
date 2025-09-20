# 🧩 Modules EmotionsCare

Ce référentiel couvre l'état courant des modules métiers et les services partagés qui les alimentent.
Pour chacun : entrées, routes, dépendances clefs (assessments Edge, sessions, favoris, journal) et couverture QA.

## 🔗 Socles partagés

### Assessments (Edge `/assess/*`)
- **Fonctions** : `assess-start`, `assess-submit`, `assess-aggregate` (cf. `supabase/functions/assess-*`).
- **Flux** :
  1. `POST /assess/start` renvoie le catalogue (questions + métadonnées) selon l'instrument & la locale.
  2. `POST /assess/submit` persiste un hash utilisateur, sérialise les réponses anonymisées, calcule les scores (`summarizeAssessment`).
  3. `POST /assess/aggregate` expose les agrégats B2B (`org_assess_rollups`) avec contrainte `min_n ≥ 5` (policy `org_rollups_min_n`).
- **Sécurité** : authentification Supabase obligatoire, rate-limit (10/min), CORS restreint, hash utilisateur Web Crypto (`_shared/hash_user.ts`).
- **Flags** : instruments activés via `clinical_feature_flags` (flags `FF_ASSESS_*`, opt-in, rollout par instrument).

### Sessions API (`src/services/sessions/sessionsApi.ts`)
- `createSession` / `listMySessions` / `logAndJournal` centralisent la persistance Supabase (`sessions`) et l'écriture dans `journal_entries`.
- Nettoie durées et `mood_delta`, limite [-10, +10], ajoute breadcrumbs Sentry `session:*` et `journal:auto:insert`.
- Utilisé par Flash Glow, Breath Constellation, VR Galaxy, Screen Silk, etc. => toujours importer ce service (pas d'insert SQL direct).

### Favorites Adaptive Music (`src/hooks/useMusicFavorites.ts`)
- Hook React Query (`QUERY_KEY = ['adaptive-music','favorites']`).
- Services : `src/services/music/favoritesService.ts` (REST `/favorites`).
- Fournit `favorites`, `isFavorite`, `toggleFavorite`, `isToggling`. Utilisé sur Dashboard (tuile musique) + page Adaptive Music.

### Journal Service (`src/services/journal/journalApi.ts`)
- Routines `listEntries`, `createEntry`, `sanitizeContent` + redaction DOMPurify.
- `logAndJournal` s'appuie dessus pour créer les notes automatique post-session.
- Tests : `journalApi.spec.ts`, e2e `journal-feed.spec.ts` & `security.xss-journal.spec.ts`.

## 🎯 Modules B2C – Coaching & auto-soin

### 🧠 Emotion Scan — 🟢 Livré
- **Entrée** : `src/modules/emotion-scan/EmotionScanPage.tsx` (route `/app/scan`).
- **Dépendances** :
  - `invokeEmotionScan` + `getEmotionScanHistory` (`src/services/emotionScan.service.ts`).
  - Assessments Edge (`instrument = PANAS`, flag `FF_ASSESS_PANAS`).
  - `useSessionClock` (pour transitions) et `useFlags` (feature toggles).
- **Persistance** : table `public.emotion_scans` + historique local fallback.
- **Tests** : e2e `emotion-scan-dashboard.spec.ts`, unitaires `emotionScan.service.test.ts`.

### 🎵 Adaptive Music — 🟢 Livré
- **Entrée** : `src/modules/adaptive-music/AdaptiveMusicPage.tsx` sur `/app/music`.
- **Services** : `src/services/moodPlaylist.service.ts`, `src/hooks/useMusicControls.ts`.
- **Fonctionnalités clés** :
  - Builder de requête mood→playlist (mood, intensité, durée, préférences instrumentales & contexte).  
  - Normalisation stricte de la réponse (tracks, energyProfile, guidance) avec message d'erreur en cas de payload invalide.  
  - Gestion locale des favoris (persistés en `localStorage`) et reprise de lecture (`playback snapshot`).
  - Export/partage guidé avec synthèse de la playlist et recommandations.
  - ✅ QA 06/2025 : scénario e2e `adaptive-music-favorites.spec.ts` + tests `requestMoodPlaylist` (3 cas) sur la normalisation client.

### 📊 Scores & vibes — 🟢 Livré
- **Entrées** : `src/pages/ScoresPage.tsx`, `src/app/modules/scores/ScoresV2Panel.tsx`, `src/services/scores/dataApi.ts`, `src/features/scores/*`.
- **Données Supabase** : `emotion_scans.payload` (valence, arousal, labels) et `sessions` (type, created_at) sous RLS owner-only (aucune donnée textuelle du journal).
- **Fonctionnalités clés** :
  - Agrégation React Query (cache 60s) + lissage (moving average) pour les courbes valence/arousal sur 30 jours.
  - Barres hebdomadaires empilées (8 semaines glissantes) + heatmap SVG personnalisée des vibes dominantes (calm/focus/bright/reset).
  - Respect accessibility : aria-label/role="img", texte de synthèse pour lecteurs d'écran, animation désactivée si `prefers-reduced-motion`.
  - Export PNG fiable via bouton dédié (html2canvas-free) + breadcrumbs Sentry `scores:fetch:*` & `scores:export:png`.
  - ✅ QA 06/2025 : tests unitaires `src/services/scores/__tests__/dataApi.test.ts` (mappers/agrégations) + e2e `tests/e2e/scores-heatmap-dashboard.spec.ts` (chargement, interactions, export).

### 🩺 Observabilité — Endpoint `/health`
- **Entrée** : service Fastify `services/api/server.ts` exposant `/health`, `/healthz` et `/api/healthz`.
- **Vérifications effectuées** :
  - Supabase (ping léger REST + latence) avec statut (`ok|degraded|down`).
  - Fonctions critiques (par défaut `ai-emotion-analysis`, `ai-coach`) pingées en `HEAD`.
  - Stockage public (URL configurable) via requête `HEAD`.
- **Réponse JSON** : `{ status, version, runtime: { node, platform, environment }, uptime: { seconds, since }, timestamp, checks: { supabase, functions[], storage }, signature }`.
  - `signature` = SHA-256 du payload + `HEALTH_SIGNING_SECRET` pour détecter toute altération.
  - Heartbeat Sentry optionnel via `SENTRY_HEARTBEAT_URL`/`SENTRY_CRON_HEARTBEAT_URL` après chaque succès.
  - Exposition contrôlée par CORS (`HEALTH_ALLOWED_ORIGINS`) et rate-limit mémoire (60 req/min/IP par défaut).
- **Tests** : `services/api/tests/health.test.ts` simule succès + fonction en panne, vérifie latences et signature.

## Modules en bêta ou prototypes
- **B2C fun-first hérités** (`src/pages/modules/*`) : conservés pour démos gamifiées (Story Synth, Bubble Beat…).
- **Admin & outils** (`src/modules/admin`, `src/modules/screen-silk`) : fonctions internes, statut 🟠.

> _Mettez à jour ce fichier dès qu'un module change de statut ou qu'un nouveau service partagé est introduit._
- **Entrée** : `src/modules/adaptive-music/AdaptiveMusicPage.tsx` (`/app/music`, `/app/music-premium`).
- **Dépendances** :
  - Favorites hook (`useMusicFavorites`).
  - Services `moodPlaylist.service.ts`, `adaptiveMusicService` (IA + pré-écoute), `useMusicControls`.
  - Feature flag `FF_PREMIUM_SUNO` pour Suno.
- **Persistance** : favoris local → Supabase (`favorites`), presets via `mood_presets`.
- **Tests** : e2e `adaptive-music-favorites.spec.ts`, unitaires normalisation (`requestMoodPlaylist.test.ts`).

### 🤖 Coach IA — 🟢 Livré
- **Entrée** : `src/pages/B2CAICoachPage.tsx` (`/app/coach` & `/app/coach-micro`).
- **Dépendances** :
  - Edge `supabase/functions/ai-coach*` (SSE, modération).
  - `src/lib/hash.ts` (hash Web Crypto, interdit `node:crypto`).
  - Feature flag `FF_COACH`.
- **Sécurité** : consentement explicite, redaction Sentry (`src/lib/sentry-config.ts`), logs anonymisés `coach_logs`.
- **Tests** : `coach.smoke.spec.ts`, unitaires hash & prompts.

### 📝 Journal — 🟢 Livré
- **Entrée** : `src/pages/journal/JournalView.tsx` (`/app/journal`, `/journal/new`).
- **Dépendances** : journal service, `useJournalComposer`, `logAndJournal` (auto-brouillon), Auth Supabase.
- **Sécurité** : sanitisation DOMPurify + `sanitize-html`, interdiction PII Sentry.
- **Tests** : `journalApi.spec.ts`, e2e `journal-feed.spec.ts`.

### 🌈 Mood Mixer — 🟢 Livré
- **Entrée** : `src/pages/B2CMoodMixerPage.tsx` (`/app/mood-mixer`).
- **Dépendances** : presets service (`moodPresetsService`), Adaptive Music API, favorites hook.
- **Persistance** : `mood_presets` (RLS owner-only).
- **Tests** : e2e `mood-mixer-crud.spec.ts`, unitaires `useMoodMixerStore`.

### ⚡ Flash Glow & Ultra — 🟢 Livré
- **Entrées** : `src/modules/flash-glow/useFlashGlowMachine.ts`, `src/modules/flash-glow-ultra/FlashGlowUltraPage.tsx` (`/app/flash-glow*`).
- **Dépendances** : `useSessionClock`, Sessions API (`createSession`, `logAndJournal`), `computeMoodDelta`, `useGlowStore` (persist immuable).
- **Tests** : e2e `flash-glow-ultra-session.spec.ts`, unitaires `useSessionClock`, `useFlashPhases`.

### 🌌 Breath Constellation — 🟢 Livré
- **Entrée** : `src/modules/breath-constellation/BreathConstellationPage.tsx` (`/app/breath`).
- **Dépendances** : Sessions API (`type = 'breath'`), `useBreathPattern`, `useSound`.
- **Tests** : e2e `breath-constellation-session.spec.ts`, unitaires `breathProtocols.test.ts`.

### 🪞 Screen Silk Break — 🟢 Livré
- **Entrée** : `src/modules/screen-silk/ScreenSilkBreakPage.tsx` (`/app/screen-silk`).
- **Dépendances** : Sessions API (log micro-pauses), `useScreenSilkStore` (persist, immuable), `usePerformanceGuard`.
- **Tests** : smoke QA (dev dashboard), assertions store `screenSilk.store.test.ts`.

### 🧩 Prototypes fun-first — 🟠
- Boss Level Grit (`/app/boss-grit`), Bounce Back (`/app/bounce-back`), Story Synth (`/app/story-synth`), Ambition Arcade (`/app/ambition-arcade`), Bubble Beat (`/app/bubble-beat`), Face AR (`/app/face-ar`).
- Conservés pour R&D, dépendances limitées (mock data, analytics off).

## 🪐 VR & sécurité immersion

### VR Galaxy / VR Hub — 🟢
- **Entrée** : `src/pages/B2CVRGalaxyPage.tsx` (`/app/vr`, `/app/vr-galaxy`).
- **Dépendances** :
  - Store sécurité VR (`src/store/vrSafety.store.ts` – persist, selectors).
  - Sessions API (`type = 'vr_galaxy'`).
  - Assessments opt-in (`FF_ASSESS_SSQ`, `FF_ASSESS_POMS`) pour hints de sécurité.
  - `useVRPerformanceGuard` (downgrade vers 2D).
- **Tests** : unitaires store (`vrSafety.store.test.ts`), QA manuelle VR, logs Sentry `vr:*`.

### VR Breath Guide & VR Breath — 🟢
- **Entrées** : `src/pages/B2CVRBreathGuidePage.tsx`, `src/pages/VRBreathPage.tsx`.
- **Dépendances** : Sessions API (`vr_breath`), store sécurité VR, `useSessionClock`, `useSound`.
- **Tests** : scenarios QA VR, check `FF_VR` gating.

## 🤝 Social & communauté

### Community Feed — 🟢
- **Entrée** : `src/pages/B2CCommunautePage.tsx` (`/app/community`, `/app/communaute`).
- **Dépendances** :
  - Signalement doux (`community:auto-flag` via Sentry).
  - Feature flag `FF_COMMUNITY`.
  - `useFlags` + `useError` (alias `useErrorHandler`) pour toasts.
- **Tests** : QA manuelle (liste / report). Security doc `docs/COMMUNITY_SAFETY.md`.

### Social Cocon B2C — 🟢
- **Entrée** : `src/pages/B2CSocialCoconPage.tsx` (`/app/social-cocon`).
- **Dépendances** : animations framer-motion, RouterV2 guards, guidelines sécurité `docs/SOCIAL_ROOMS.md`.
- **Tests** : QA ciblée (modes privacy, animation d'entrée).

### Activity / Scores / Leaderboard — 🟢
- **Entrées** : `src/pages/B2CActivitePage.tsx`, `src/pages/ScoresPage.tsx`, `src/pages/LeaderboardPage.tsx`.
- **Dépendances** :
  - Supabase `sessions`, `emotion_scans`, vues agrégées `org_assess_rollups` (min_n ≥ 5).
  - Hooks `useOrgWeekly`, `useLeaderboard`, `useScoresData` (React Query + Sentry tags `min_n_pass`).
- **Tests** : e2e `scores-heatmap-dashboard.spec.ts`, `activity-timeline.spec.ts` (QA).

## 🏢 Modules B2B

### Dashboard collaborateur & Social B2B — 🟡
- **Entrées** : `src/pages/B2BCollabDashboard.tsx`, `src/pages/B2BSocialCoconPage.tsx` (`/app/collab`, `/app/social`).
- **Dépendances** :
  - API Supabase `team_activities`, `wellness_programs` (mock data en dev).
  - Feature flag `FF_MANAGER_DASH` & `FF_COMMUNITY` (mode B2B).
- **Tests** : snapshots visuels, QA manuelle (en attente d'e2e).

### Suite Manager (Reports, Events, Optimization, Security, Accessibility) — 🟡
- **Entrées** : `src/pages/B2BReportsPage.tsx`, `src/pages/B2BReportDetailPage.tsx`, `src/pages/B2BEventsPage.tsx`, `src/pages/B2BOptimisationPage.tsx`, `src/pages/B2BSecurityPage.tsx`, `src/pages/B2BAccessibilityPage.tsx`.
- **Dépendances** :
  - Edge `/assess/aggregate` pour agrégats anonymisés.
  - Services `reportsApi`, `orgWeekly` (`min_n` enforcement, Sentry tag `min_n_pass`).
  - Export CSV Edge (`org-dashboard-export`).
- **Tests** : unitaires `reportsApi.test.ts`, QA (tableur, export CSV).

## ✅ Checklist mise à jour
- [x] Chaque module indique ses entrées, routes et dépendances partagées (assessments, sessions, favorites, journal).
- [x] Les statuts correspondent aux routes RouterV2 actuelles.
- [x] Les tests/références QA sont explicitement listés pour l'onboarding (<15 min).

> _Mettre à jour ce document dès qu'un module change de statut ou qu'un nouveau service partagé est introduit. Vérifier également les flags dans `src/core/flags.ts` pour tout nouveau module._
