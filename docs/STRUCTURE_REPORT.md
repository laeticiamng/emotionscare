# Structure Report

## État initial
- Aucune route Next.js détectée.
- Aucun export de `COMPONENTS.reg.ts`.
- Aucun fichier dans `src/app`.

## État après complétion
### Modules existants
- `flash-glow` → composant `FlashGlowPage` route `/modules/flash-glow`
- `adaptive-music` → composant `AdaptiveMusicPage` route `/modules/adaptive-music`
- `boss-grit` → composant `BossGritPage` route `/modules/boss-grit`
- `breath-constellation` → composant `BreathConstellationPage` route `/modules/breath-constellation`
- `bubble-beat` → composant `BubbleBeatPage` route `/modules/bubble-beat`
- `coach` → composant `CoachPage` route `/modules/coach`
- `emotion-scan` → composant `EmotionScanPage` route `/modules/emotion-scan`
- `flash-glow-ultra` → composant `FlashGlowUltraPage` route `/modules/flash-glow-ultra`
- `journal` → composant `JournalPage` route `/modules/journal`
- `mood-mixer` → composant `MoodMixerPage` route `/modules/mood-mixer`
- `scan` → composant `ScanPage` route `/modules/scan`
- `story-synth` → composant `StorySynthPage` route `/modules/story-synth`

### Manques/ébauches
- Aucun module restant.

### Doublons détectés (à ignorer)
- Aucun doublon détecté.

### Points d'attention
- La structure est désormais verrouillable via les scripts de snapshot et vérification.

## Fichiers créés
- `src/ROUTES.reg.ts` : registre central des routes.
- `src/COMPONENTS.reg.ts` : registre des composants UI.
- `src/SCHEMA.ts` : schéma Zod pour les préférences.
- Pages Next.js pour chaque module dans `src/app/modules/*/page.tsx`.
- Tests snapshot pour chaque module dans `src/__tests__/*snapshot.spec.tsx`.
- `e2e/smoke.routes.spec.ts` : test Playwright des routes.
- `scripts/lock-structure.ts` : génération du snapshot de structure.
- `scripts/verify-structure.ts` : vérification de l'intégrité de la structure.
- `docs/STRUCTURE_REPORT.md` : ce rapport.

## TODO restants
- Aucun.

## Onboarding
- Route ajoutée `/onboarding` → composant `OnboardingPage`.
- Champs Zod optionnels : `musicRelax`, `defaultDurationMin`, `favoriteModule`.
- Tests ajoutés : `src/__tests__/onboarding.snapshot.spec.tsx` et `e2e/onboarding.smoke.spec.ts`.
- Aucun élément existant modifié/supprimé.

## P2 — Données & Sécurité
- connect-src autorisés : https://api.openai.com, https://*.supabase.co, https://*.sentry.io
- Flags `data-export` / `data-delete` pour activer les endpoints d'export et de suppression via `ff`.
- Page dédiée : [/account/data](/account/data)

- Ajouter et compléter d'autres modules.

## P1 — Finition
- Thème et mode sombre via `ThemeProvider` et `ThemeToggle`.
- Composants de micro-animations `FadeIn` et `SlideIn`.
- Base i18n FR/EN avec `I18nProvider` et `t()`.
- Composant `SeoHead` pour les métadonnées.
- Cookbooks disponibles dans `docs/cookbooks/`.

## P6 — Scores V2
- Flags : scores-v2 (UI), telemetry-opt-in (sync).
- API : /api/scores/sync (stub).
- Service : recordEvent(), format SessionEvent.
- Calculs : streak, niveaux, badges, agrégation par jour.
- UI DS : ProgressBar, Sparkline, BadgeLevel.
- Intégration module : exemple d’appel à recordEvent sur le CTA principal.

## P4 — Navigation & Discoverability
- `/modules` comme hub ; source : `ROUTES.reg.ts`.
- Présence de NavBar, Footer, error.tsx, not-found.tsx.
- Raccourci Cmd/Ctrl + K pour la Command Palette.
- Règles a11y appliquées ; comportements de prefetch.

## Module — Coach
- Route `/modules/coach`, composant `CoachPage`.
- Contexte : `getCoachContext()` (streak, scan, récents).
- Règles : `buildAdvice()` (tags respire/écris/musique/scan/routine).
- Event `recordEvent` à l’ouverture d’un conseil (si P6).
- Aucune dépendance externe ; append-only.

## Scores — Activation
- Route `/modules/scores-v2` ajoutée, composant `ScoresV2Page` (qui rend `ScoresV2Panel`).
- Rollout : `flagActive("scores-v2", { percent, ff })` + overrides locaux via `/admin/flags`.
- Cohorte stable par utilisateur via `ec_uid_v1`.
- Aucun remplacement de la page legacy ; lien d’essai optionnel.
## Module — Journal
- Route `/modules/journal`, composant `JournalPage`.
- Schéma `JournalEntry` (tous champs optionnels).
- Stockage local : clé `ec_journal_entries_v1`.
- Events : `recordEvent` à la création (si P6).
- Filtres : texte + tag, soft delete.

## Module — Emotion Scan
- Route ajoutée `/modules/emotion-scan`.
- Composant `EmotionScanPage`.
- Schéma `EmotionScanData` (tous champs optionnels).
- Event `recordEvent` à la soumission (si P6 présent).
- Historique : clé `emotion_scan_history_v1` (localStorage, 12 points).

## Module — Breath Constellation
- Route `/modules/breath-constellation`, composant `BreathConstellationPage`.
- DS : ConstellationCanvas, hooks useRaf, useBreathPattern.
- Schéma `BreathConstellationPrefs` (tous optionnels).
- Event `recordEvent` à la fin de session.
- Notes perf & reduced motion.
