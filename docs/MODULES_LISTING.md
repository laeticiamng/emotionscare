# 🧩 Modules EmotionsCare

## 🗂️ Légende des statuts
- **🟢 Livré** : expérience complète branchée (données Supabase/Edge Functions, analytics optionnels).
- **🟡 Bêta** : parcours opérationnel mais encore en validation (UX ou intégrations tierces en cours).
- **🟠 Prototype** : module conservé pour la R&D ou les démonstrations internes.

## Modules livrés

### 🧠 Emotion Scan — 🟢 Livré
- **Entrée** : `src/modules/emotion-scan/EmotionScanPage.tsx` routé via `/app/scan`.
- **Services** : `invokeEmotionScan`, `getEmotionScanHistory` dans `src/services/emotionScan.service.ts`.
- **Fonctionnalités clés** :
  - Questionnaire I-PANAS-SF complet avec calcul immédiat du score et libellé d'équilibre.  
  - Mutation React Query vers la fonction edge Supabase (historique distant) et fallback local (`localStorage`) hors ligne.  
  - Rafraîchissement automatique des widgets « recent-scans » et enregistrement analytics optionnels via `recordEvent`.

### 🎚️ Mood Mixer — 🟢 Livré
- **Entrée** : `src/pages/B2CMoodMixerPage.tsx` sur `/app/mood-mixer`.
- **Services** : `src/services/moodPresetsService.ts`, `src/services/moodPlaylist.service.ts` et `adaptiveMusicService`.
- **Fonctionnalités clés** :
  - Chargement/sauvegarde des presets `mood_presets` (Supabase) avec clamp des ratios et synchronisation utilisateur.  
  - Génération de noms de vibes dynamiques et édition en temps réel des curseurs douceur/clarté.  
  - Pré-écoute Adaptive Music : appel API pour récupérer une piste, contrôle lecture/pause et bascule mock/API suivant la disponibilité.  
  - Gestion accessibilité (particles conditionnels sur `prefers-reduced-motion`).

### ⚡ Flash Glow & Ultra — 🟢 Livré
- **Entrées** : `src/modules/flash-glow/useFlashGlowMachine.ts`, `src/modules/flash-glow/journal.ts`, `src/modules/flash-glow-ultra/FlashGlowUltraPage.tsx`.
- **Services** : `src/modules/flash-glow/flash-glowService.ts`, intégration journal via `createFlashGlowJournalEntry`.
- **Fonctionnalités clés** :
  - Machine d'état asynchrone (idle → active → ending) gérant timers, extensions et haptique.  
  - Suivi des humeurs (`moodBaseline`, `moodAfter`, `moodDelta`) avec clamp et calcul auto.  
  - Journalisation automatique en fin de session (contenu enrichi, tags, sauvegarde Supabase + toast de feedback).  
  - Statistiques locales (nombre/temps moyen) et toasts en cas d'interruption.

### 🌌 Breath Constellation — 🟢 Livré
- **Entrée** : `src/modules/breath-constellation/BreathConstellationPage.tsx` via `/app/breath`.
- **Services** : `src/services/breathworkSessions.service.ts` (persistance) et `@/ui/hooks/useBreathPattern`.
- **Fonctionnalités clés** :
  - Protocoles nommés (cohérence 5-5, 4-7-8, box, triangle) avec cadence calculée et bénéfices contextualisés.  
  - Support `prefers-reduced-motion` : désactive animations complexes et affiche instructions textuelles.  
  - Options audio/haptique via `useSound` + enregistrement Supabase des sessions (gestion erreurs auth/persistance).  
  - Émissions d'events analytics facultatifs (`recordEvent`).

### 📝 Journal — 🟢 Livré
- **Entrée** : `src/modules/journal/JournalPage.tsx` sur `/app/journal`.
- **Services** : `src/services/journalFeed.service.ts`, `src/hooks/useJournalFeed.ts`.
- **Fonctionnalités clés** :
  - Formulaire sanitisé (tags normalisés, suppression XSS) + création Supabase avec état optimiste.  
  - Feed React Query avec recherche plein texte, filtres par tag, skeletons et fallback vide.  
  - Hashing/suppression de données sensibles côté service et instrumentation analytics optionnelle.  
  - Gestion fine des erreurs de création et message utilisateur.

### 🧭 Coach IA — 🟢 Livré
- **Entrée** : `src/pages/B2CAICoachPage.tsx` (`/app/coach`).
- **Services** : `src/modules/coach/coachService.ts`, edge function `supabase/functions/ai-coach/index.ts`.
- **Fonctionnalités clés** :
  - Consentement obligatoire (checkbox + token session) avant toute requête AI.  
  - Normalisation des prompts selon audience (B2C/B2B) et clamp de l'historique envoyé.  
  - Hachage du transcript, journalisation anonymisée (`coach_conversations`) et stockage des suggestions/techniques.  
  - UI riche (personnalités sélectionnables, ressources, voice toggle) et toasts en cas d'échec.

### 🎵 Adaptive Music — 🟢 Livré
- **Entrée** : `src/modules/adaptive-music/AdaptiveMusicPage.tsx` sur `/app/music`.
- **Services** : `src/services/moodPlaylist.service.ts`, `src/hooks/useMusicControls.ts`.
- **Fonctionnalités clés** :
  - Builder de requête mood→playlist (mood, intensité, durée, préférences instrumentales & contexte).  
  - Normalisation stricte de la réponse (tracks, energyProfile, guidance) avec message d'erreur en cas de payload invalide.  
  - Gestion locale des favoris (persistés en `localStorage`) et reprise de lecture (`playback snapshot`).  
  - Export/partage guidé avec synthèse de la playlist et recommandations.

### 📊 Scores Dashboard — 🟢 Livré
- **Entrées** : `src/app/modules/scores/ScoresV2Panel.tsx`, `src/services/scoresDashboard.service.ts`, `src/hooks/useChartExporter.ts`.
- **Fonctionnalités clés** :
  - Récupération Supabase (trend 30j, sessions hebdo, heatmap) + fallback local `SCORES_DASHBOARD_FALLBACK`.  
  - Graphiques Recharts (Line/Bar/Scatter) stylés, tooltips custom, palettes par type de séance.  
  - Carte récap niveau/XP avec calcul du progrès et slots intenses.  
  - Export PNG haute résolution via `useChartExporter` (scale, padding, toast d'erreur).

## Modules en bêta ou prototypes
- **B2C fun-first hérités** (`src/pages/modules/*`) : conservés pour démos gamifiées (Story Synth, Bubble Beat…).
- **Admin & outils** (`src/modules/admin`, `src/modules/screen-silk`) : fonctions internes, statut 🟠.

> _Mettez à jour ce fichier dès qu'un module change de statut ou qu'un nouveau service partagé est introduit._
