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
- **Services** : `src/modules/flash-glow/flash-glowService.ts`, intégration journal via `createFlashGlowJournalEntry`.
- **Persistance Supabase** : table `public.sessions` (type, durée, `mood_delta`, `meta` JSONB) avec indexes sur `user_id`, `created_at desc`, `type` + RLS owner-only.
- **Fonctionnalités clés** :
  - Machine d'état asynchrone (idle → active → ending) gérant timers, extensions et haptique.  
  - Suivi des humeurs (`moodBaseline`, `moodAfter`, `moodDelta`) avec clamp et calcul auto.  
  - Journalisation automatique en fin de session (contenu enrichi, tags, sauvegarde Supabase + toast de feedback).  
  - Statistiques locales (nombre/temps moyen) et toasts en cas d'interruption.
  - ✅ QA 06/2025 : scénario e2e `flash-glow-ultra-session.spec.ts` + tests `useGlowStore` (5 cas) couvrant start/pause/resume/reset.

### 🌌 Breath Constellation — 🟢 Livré
- **Entrée** : `src/modules/breath-constellation/BreathConstellationPage.tsx` via `/app/breath`.
- **Services** : `src/services/breathworkSessions.service.ts` (persistance) et `@/ui/hooks/useBreathPattern`.
- **Persistance Supabase** : mutualise `public.sessions` (log des séances Breath/FlashGlow) sous RLS owner-only, indexes `user_id`, `created_at`, `type`.
- **Fonctionnalités clés** :
  - Protocoles nommés (cohérence 5-5, 4-7-8, box, triangle) avec cadence calculée et bénéfices contextualisés.  
  - Support `prefers-reduced-motion` : désactive animations complexes et affiche instructions textuelles.  
  - Options audio/haptique via `useSound` + enregistrement Supabase des sessions (gestion erreurs auth/persistance).  
  - Émissions d'events analytics facultatifs (`recordEvent`).
  - ✅ QA 06/2025 : régression manuelle post build, couverture e2e générale `breath-constellation-session.spec.ts`.

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
- **Entrée** : `src/pages/B2CAICoachPage.tsx` (`/app/coach`).
- **Services** : `src/modules/coach/coachService.ts`, edge function `supabase/functions/ai-coach/index.ts`.
- **Fonctionnalités clés** :
  - Consentement obligatoire (checkbox + token session) avant toute requête AI.  
  - Normalisation des prompts selon audience (B2C/B2B) et clamp de l'historique envoyé.  
  - Hachage du transcript, journalisation anonymisée (`coach_conversations`) et stockage des suggestions/techniques.  
  - UI riche (personnalités sélectionnables, ressources, voice toggle) et toasts en cas d'échec.
  - ✅ QA 06/2025 : scénario e2e `coach-ai-session.spec.ts` validant consentement → réponse.

### 🎵 Adaptive Music — 🟢 Livré
- **Entrée** : `src/modules/adaptive-music/AdaptiveMusicPage.tsx` sur `/app/music`.
- **Services** : `src/services/moodPlaylist.service.ts`, `src/hooks/useMusicControls.ts`.
- **Fonctionnalités clés** :
  - Builder de requête mood→playlist (mood, intensité, durée, préférences instrumentales & contexte).  
  - Normalisation stricte de la réponse (tracks, energyProfile, guidance) avec message d'erreur en cas de payload invalide.  
  - Gestion locale des favoris (persistés en `localStorage`) et reprise de lecture (`playback snapshot`).
  - Export/partage guidé avec synthèse de la playlist et recommandations.
  - ✅ QA 06/2025 : scénario e2e `adaptive-music-favorites.spec.ts` + tests `requestMoodPlaylist` (3 cas) sur la normalisation client.

### 📊 Scores Dashboard — 🟢 Livré
- **Entrées** : `src/pages/HeatmapPage.tsx`, `src/app/modules/scores/ScoresV2Panel.tsx`, `src/services/scoresDashboard.service.ts`, `src/hooks/useChartExporter.ts`.
- **Fonctionnalités clés** :
  - Récupération Supabase (trend 30j, sessions hebdo, heatmap) + fallback local `SCORES_DASHBOARD_FALLBACK`.
  - Graphiques Recharts (Line/Bar/Scatter) stylés, tooltips custom, palettes par type de séance.
  - Carte récap niveau/XP avec calcul du progrès et slots intenses.
  - Export PNG haute résolution via `useChartExporter` (scale, padding, toast d'erreur).

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
