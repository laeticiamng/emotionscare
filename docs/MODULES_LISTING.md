# 🧩 Modules EmotionsCare

## 🗂️ Légende des statuts
- **🟢 Livré** : expérience complète branchée (données Supabase/Edge Functions, analytics optionnels).
- **🟡 Bêta** : parcours opérationnel mais encore en validation (UX ou intégrations tierces en cours).
- **🟠 Prototype** : module conservé pour la R&D ou les démonstrations internes.

## Modules livrés

### 🧠 Emotion Scan — 🟢 Livré
- **Entrée** : `src/modules/emotion-scan/EmotionScanPage.tsx` routé via `/app/scan`.
- **Services** : `invokeEmotionScan`, `getEmotionScanHistory` dans `src/services/emotionScan.service.ts`.
- **Persistance Supabase** : table `public.emotion_scans` (payload JSONB + `mood_score`), RLS stricte (policies owner-only), indexes `user_id` + `created_at desc`.
- **Fonctionnalités clés** :
  - Questionnaire I-PANAS-SF complet avec calcul immédiat du score et libellé d'équilibre.
  - Mutation React Query vers la fonction edge Supabase (historique distant) et fallback local (`localStorage`) hors ligne.
  - Rafraîchissement automatique des widgets « recent-scans » et enregistrement analytics optionnels via `recordEvent`.
  - ✅ QA 06/2025 : scénario e2e `emotion-scan-dashboard.spec.ts` (parcours scan → historique) + suite unitaire `useMoodStore` (7 tests).

### 🎚️ Mood Mixer — 🟢 Livré
- **Entrée** : `src/pages/B2CMoodMixerPage.tsx` sur `/app/mood-mixer`.
- **Services** : `src/services/moodPresetsService.ts`, `src/services/moodPlaylist.service.ts` et `adaptiveMusicService`.
- **Persistance Supabase** : table `public.mood_presets` (nom + sliders JSONB) avec RLS owner-only, indexes `user_id` + `created_at desc`.
- **Fonctionnalités clés** :
  - Chargement/sauvegarde des presets `mood_presets` (Supabase) avec clamp des ratios et synchronisation utilisateur.  
  - Génération de noms de vibes dynamiques et édition en temps réel des curseurs douceur/clarté.  
  - Pré-écoute Adaptive Music : appel API pour récupérer une piste, contrôle lecture/pause et bascule mock/API suivant la disponibilité.
  - Gestion accessibilité (particles conditionnels sur `prefers-reduced-motion`).
  - ✅ QA 06/2025 : scénario e2e `mood-mixer-crud.spec.ts` (CRUD complet) + tests `useMoodMixerStore` (7 cas) et `useJournalStore` (4 cas) pour l'enrichissement historique.

### ⚡ Flash Glow & Ultra — 🟢 Livré
- **Entrées** : `src/modules/flash-glow/useFlashGlowMachine.ts`, `src/modules/flash-glow/journal.ts`, `src/modules/flash-glow-ultra/FlashGlowUltraPage.tsx`.
- **Services** : `src/modules/flash-glow/flash-glowService.ts`, intégration journal via `createFlashGlowJournalEntry`, moteur partagé `src/services/sessions/sessionsApi.ts`.
- **Persistance Supabase** : table `public.sessions` (type, durée, `mood_delta`, `meta` JSONB) avec indexes sur `user_id`, `created_at desc`, `type` + RLS owner-only.
- **Fonctionnalités clés** :
  - Machine d'état asynchrone couplée au hook commun `useSessionClock` (start/pause/resume/complete) avec breadcrumbs Sentry `session:*`.
  - Suivi des humeurs (`moodBaseline`, `moodAfter`) et calcul directionnel via `computeMoodDelta` sérialisé dans `meta`.
  - Journalisation automatique Supabase via `logAndJournal` (insert `sessions` + entrée `journal_entries` bienveillante) et fallback local.
  - Interface Flash Glow Ultra migrée sur le moteur partagé (`useSessionClock`) avec région `aria-live`, focus conservé et auto-journal `logAndJournal` (couverture `flashGlowUltraSession.test.tsx`).
  - Statistiques locales (nombre/temps moyen) et toasts en cas d'interruption.
  - ✅ QA 06/2025 : scénario e2e `flash-glow-ultra-session.spec.ts` + tests `useGlowStore` (5 cas) couvrant start/pause/resume/reset.
- **Entrées** : `src/pages/flash-glow/index.tsx` (parcours SESS-01 sur `/app/flash-glow`) & `src/modules/flash-glow-ultra/FlashGlowUltraPage.tsx`.
- **Services** : `src/hooks/useSessionClock.ts`, `src/modules/flash/useFlashPhases.ts`, `src/modules/flash/sessionService.ts` (`logAndJournal`).
- **Persistance Supabase** : tables `public.user_activity_sessions` + `public.journal_entries` (RLS owner-only, indexes `user_id`/`created_at`).
- **Fonctionnalités clés** :
  - Horloge robuste (tick 1 s, pause sur `visibilitychange`) via `useSessionClock` + phases `warmup → glow → settle` (`useFlashPhases`).
  - `computeMoodDelta` calcule le delta valence/arousal silencieux, `logAndJournal` enregistre activité + entrée journal par défaut bienveillante.
  - UI accessible (`aria-live`, CTA contextuel Start/Pause/Reprendre/Relancer, variante `prefers-reduced-motion` sans flash).
  - Breadcrumbs Sentry `session:*`, `flash:phase_change`, `journal:auto:insert` + toasts succès/erreur.
  - ✅ QA 06/2025 : e2e `flash-glow-session.spec.ts` (start → pause → reprise → completion) + tests unitaires `useSessionClock` & `useFlashPhases`.

### 🌌 Breath Constellation — 🟢 Livré
- **Entrée** : `src/modules/breath-constellation/BreathConstellationPage.tsx` via `/app/breath`.
- **Services** : `src/services/breathworkSessions.service.ts`, moteur partagé `src/services/sessions/sessionsApi.ts`, hook `@/ui/hooks/useBreathPattern`.
- **Persistance Supabase** : mutualise `public.sessions` (log des séances Breath/FlashGlow) sous RLS owner-only, indexes `user_id`, `created_at`, `type`.
- **Fonctionnalités clés** :

- Protocoles nommés (cohérence, sommeil profond, carré, triangle) avec cadence calculée et bénéfices contextualisés.
  - Horloge partagée `useSessionClock` respectant `prefers-reduced-motion` (aria-live, focus conservé, pause/reprise instrumentées Sentry).
  - Options audio/haptique via `useSound`, enregistrement Supabase (`logBreathworkSession`) + insertion automatique journal via `logAndJournal`.

- Protocoles nommés (cohérence 5-5, 4-7-8, box, triangle) avec cadence calculée et bénéfices contextualisés.
  - Support `prefers-reduced-motion` : désactive animations complexes et affiche instructions textuelles.
  - Options audio/haptique via `useSound` + enregistrement Supabase des sessions (gestion erreurs auth/persistance).
  - Émissions d'events analytics facultatifs (`recordEvent`).
  - ✅ Tests accessibilité : `BreathConstellationStatus.test.tsx` (annonces `aria-live`) en complément du smoke e2e.
  - ✅ QA 06/2025 : régression manuelle post build, couverture e2e générale `breath-constellation-session.spec.ts`.

### 🌬️ Breath Guidance — 🟢 Livré
- **Entrée** : `src/pages/breath/index.tsx` routé via `/breath`.
- **Modules partagés** : `src/modules/breath/protocols.ts`, `src/modules/breath/useSessionClock.ts`, composants `BreathCircle` & `BreathProgress`, journalisation `src/modules/breath/logging.ts`.
- **Persistance Supabase** : table `public.sessions` (type `breath`, durée, `mood_delta`, `meta` JSONB) + journal local via `journalService`.
- **Fonctionnalités clés** :
  - Protocoles 4-7-8 et cohérence cardiaque (variant 4,5/5,5) avec cadence auto et séquence générée jusqu'à la durée choisie (3–10 min).
  - Session clock accessible (`useSessionClock`) avec raccourci clavier Espace (start/pause/resume), aria-live, focus management, Sentry breadcrumbs `breath:protocol:*` et `session:*`.
  - Motion-safe : bascule automatique vers barre de progression si `prefers-reduced-motion` actif, animation cercle sinon ; audio cue opt-in via `useSound`.
  - Mesure silencieuse STAI-6 opt-in (feature flag `FF_ASSESS_STAI6`) avec appels `POST /assess/start|submit`, aucun score affiché, réponses utilisées pour recommandations.
  - Fin de séance : `logAndJournal` enregistre la session Supabase + note auto (delta d’humeur calculé, notes utilisateur), toasts doux en cas d'échec Supabase.
  - ✅ QA 06/2025 : tests unitaires `src/modules/breath/__tests__/*` (protocoles, session clock, mood utils) + e2e `tests/e2e/breath-guided-session.spec.ts` (4-7-8 + cohérence, pause/resume, zéro warning console).

### 📝 Journal — 🟢 Livré
- **Entrée** : `src/pages/B2CJournalPage.tsx` → `JournalView` (`src/pages/journal/JournalView.tsx`).
- **Services** : `src/services/journal/journalApi.ts`, hook `src/modules/journal/useJournalComposer.ts`.
- **Persistance Supabase** : table `public.journal_entries` (texte + tags, mode `text|voice`, résumé IA) + `coach_conversations`/`coach_messages` pour le brouillon.
- **Fonctionnalités clés** :
  - Composer accessible (textarea + dictée Web Speech API, fallback upload audio) avec sanitisation stricte (DOMPurify côté rendu, `sanitize-html` côté service).
  - Feed paginé (`useInfiniteQuery`) avec recherche plein texte, filtres multi-tags, action « Envoyer au coach » (brouillon sans PII) et carte Dashboard synchronisée.
  - Breadcrumbs Sentry (`journal:insert_text|insert_voice|list|coach_draft`) avec redaction (longueur/tags uniquement) et validation Zod (`NoteSchema`, `FeedQuerySchema`).
  - ✅ QA 2025-03 : tests unitaires `journalApi.spec.ts` (sanitisation, validation, mappers) + e2e Playwright `journal-feed.spec.ts` & `security.xss-journal.spec.ts` (dictée mockée, recherche, tags, dashboard).

### 🧭 Coach IA — 🟢 Livré
- **Entrée** : `src/pages/B2CAICoachPage.tsx` (`/app/coach`) rendu via `CoachView`.
- **Services** : `src/services/coach/coachApi.ts` (SSE + fallback) et fonction edge `supabase/functions/ai-coach/index.ts`.
- **Persistance Supabase** : table `public.coach_logs` (résumé ≤ 280 caractères, `thread_id`, `mode`) avec RLS owner-only + indexes `user_id`, `thread_id`.
- **Fonctionnalités clés** :
  - Consentement explicite (modal opt-in, stockage local + `user_metadata`) avant tout envoi.
  - Hash utilisateur Web Crypto (SHA-256) pour tagger les sessions sans exposer l’UUID.
  - Edge sécurisée (JWT obligatoire, CORS restreint, rate-limit 30 req/min, modération + désescalade) et réponses streamées SSE.
  - UI conversation accessible (`aria-live`, envoi Ctrl+Entrée, actions rapides respiration/journal/musique, badge B2B).
  - Observabilité safe : breadcrumbs Sentry redacts, logs anonymisés `coach_logs`, refus crise/self-harm avec messages ressources.
  - ✅ QA 07/2025 : tests unitaires (`hash`, prompts, redaction), Deno guardrails, Playwright `coach.smoke.spec.ts` (consentement → réponse stub).

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
  - Supabase (`auth` + requête REST légère) avec latence et statut (`ok|degraded|down`).
  - Fonctions critiques (par défaut `ai-emotion-analysis`, `ai-coach`) pingées en `HEAD`.
  - Stockage public (URL configurable) via requête `HEAD`.
- **Réponse JSON minifiée** : `{ status, timestamp, checks: { supabase, functions[], storage }, signature }`.
  - `signature` = SHA-256 du payload + `HEALTH_SIGNING_SECRET` pour détecter toute altération.
  - Exposition contrôlée par CORS (`HEALTH_ALLOWED_ORIGINS`) et rate-limit mémoire (60 req/min/IP par défaut).
- **Tests** : `services/api/tests/health.test.ts` simule succès + fonction en panne, vérifie latences et signature.

## Modules en bêta ou prototypes
- **B2C fun-first hérités** (`src/pages/modules/*`) : conservés pour démos gamifiées (Story Synth, Bubble Beat…).
- **Admin & outils** (`src/modules/admin`, `src/modules/screen-silk`) : fonctions internes, statut 🟠.

> _Mettez à jour ce fichier dès qu'un module change de statut ou qu'un nouveau service partagé est introduit._
