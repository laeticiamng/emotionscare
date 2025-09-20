# 🥽 VR Safety Guidelines

Ce document recense les garde-fous VR déjà implémentés et la checklist à respecter pour toute évolution VR (`/app/vr*`).

## 🧱 Socle technique
- Store : `src/store/vrSafety.store.ts`
  - Persistance locale (`persist`), stockage des préférences (mode 2D/VR_soft/VR), SSQ & POMS récents.
  - Sélecteurs `useVRSafetyStore.use.*` pour lecture (particleMode, lowPerformance, etc.).
- Hooks :
  - `useVRPerformanceGuard` → détecte `prefers-reduced-motion`, FPS faibles, GPU non supporté.
  - `useClinicalConsent` (`FF_ASSESS_SSQ`) → déclenche SSQ (Simulator Sickness Questionnaire) lorsque nécessaire.
- Composants :
  - `VRSafetyCheck` (questionnaire rapide avant session, CTA fallback 2D).
  - `VRModeControls` (switch VR ↔ 2D).

## 🧠 Règles UX & produit
1. **Opt-in systématique** : si l'utilisateur n'a jamais validé la safety checklist, afficher `VRSafetyCheck` avant d'activer le mode immersif.
2. **Fallback 2D** : toujours proposer un mode 2D accessible (`modePreference = '2d'`). Ne jamais forcer le mode VR.
3. **Temps max** : `useVRSafetyStore` limite la durée (`maxSessionDuration`) en fonction des réponses POMS/SSQ (ex. `tense` → 180 s max).
4. **Motion** : respecter `prefers-reduced-motion` → bascule automatique `vr_soft` ou 2D (aucune animation agressive).
5. **doNotTrack** : si DNT actif, ne pas enregistrer de métriques immersives.
6. **Analytics** : breadcrumbs Sentry `vr:enter` / `vr:exit`, tags `motion_safe`, `ssq_hint_used`.

## 🔐 Sécurité & données
- Sessions persistées via `createSession({ type: 'vr_galaxy' | 'vr_breath' })`.
- `meta` des sessions contient uniquement : mode (`2D`, `VR_soft`, `VR`), summary texte (poétique), hints SSQ/POMS.
- Aucun flux vidéo/audio n'est enregistré.

## ✅ Checklist avant merge
- [ ] Feature flag `FF_VR` vérifié avant d'afficher le module.
- [ ] `VRSafetyCheck` affiché pour toute nouvelle entrée immersive.
- [ ] Fallback 2D opérationnel (testé avec `prefers-reduced-motion` + `force lowPerformance`).
- [ ] Durées/clocks respectent `maxSessionDuration`.
- [ ] Breadcrumbs Sentry (`vr:*`) visibles en QA.

> _Mettre à jour ce guide si un nouveau module VR (ex: mini-jeux) est ajouté ou si la politique SSQ change._
