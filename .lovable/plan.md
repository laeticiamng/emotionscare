

# Plan de Consolidation et Complétion des Modules EmotionsCare

## Constat

L'application a actuellement :
- **48 dossiers** dans `src/modules/`
- **37 modules** listés dans `ModulesDashboard.tsx` (tous en statut "partial" sauf 2)
- **209 routes** listées dans `NavigationPage.tsx` réparties en 24 catégories
- De nombreux doublons et modules qui se chevauchent

La demande est claire : **ne rien supprimer, mais compléter et fusionner** pour que chaque module serve vraiment l'utilisateur.

---

## Stratégie : Fusionner par famille, compléter le contenu

### Famille 1 — Respiration (6 modules → 1 hub unifié)

Modules existants : `breath`, `breath-constellation`, `breathing-vr`, `bubble-beat`, `nyvee`, `breath-unified`

**Action** : `breath-unified` devient le point d'entrée unique avec 4 modes accessibles par onglets :
- Mode Classique (cohérence cardiaque, 4-7-8, box breathing)
- Mode Gamifié (bubble-beat : éclater des bulles au rythme)
- Mode Immersif (constellation + VR)
- Mode Nuit (nyvee : cocon d'endormissement)

Les 5 autres modules deviennent des re-exports vers breath-unified. Les routes `/app/bubble-beat`, `/app/nyvee`, `/app/breath` redirigent vers `/app/breath?mode=X`.

### Famille 2 — Musique (5 modules → 1 hub unifié)

Modules : `music-therapy`, `music-unified`, `adaptive-music`, `mood-mixer`, `audio-studio`

**Action** : `music-unified` absorbe tout avec 3 onglets :
- Bibliothèque (vinyles thématiques, playlists)
- Mixer (mood-mixer : mélanger des ambiances)
- Journal Vocal (audio-studio : enregistrement + transcription pour le journal)

### Famille 3 — Gamification (8 modules → 2)

Modules : `gamification`, `scores`, `achievements`, `ambition-arcade`, `ambition`, `boss-grit`, `bounce-back`, `flash-lite`

**Action** :
- `gamification` = hub unique (XP, niveaux, badges, leaderboard, streaks)
- `ambition-arcade` = Défis & Objectifs (absorbe ambition, boss-grit, bounce-back, flash-lite)

### Famille 4 — Social (5 modules → 1)

Modules : `community`, `buddies`, `group-sessions`, `exchange`, `meditation`

**Action** : `community` devient le hub social avec :
- Entraide (forum/cercles)
- Buddies (trouver un binôme)
- Sessions Groupe (pratiquer ensemble)
- Échange de temps (la partie utile d'exchange : s'échanger du temps d'écoute)

### Famille 5 — VR & Immersif (3 modules → 1)

Modules : `vr-galaxy`, `vr-nebula`, `breathing-vr`

**Action** : Un seul module `vr` avec scènes sélectionnables (galaxie, nébuleuse, respiration immersive).

### Famille 6 — Modules à compléter (leur donner un vrai contenu)

| Module | Transformation |
|--------|---------------|
| **screen-silk** | Devient "Protocole Stop" : timer 20-20-20 guidé avec sons, stats de pauses prises |
| **story-synth** | Devient "Récits Thérapeutiques" : bibliothèque de récits guidés par l'IA pour la relaxation |
| **emotion-atlas** | Fusionné dans le Scanner : visualisation de l'historique émotionnel sur une carte temporelle |
| **seuil** | Fusionné dans le Coach IA : alertes proactives quand les indicateurs dépassent un seuil |
| **ar-filters** | Supprimé de la nav (pas de valeur thérapeutique), code conservé en hidden |
| **discovery** | Fusionné dans le Dashboard : section "Découvrir" avec suggestions personnalisées |
| **emotion-orchestrator** | Module technique interne, retiré de la navigation utilisateur |

---

## Nettoyage de NavigationPage (209 → ~80 routes)

Supprimer de la liste visible :
- **Doublons** : `/app/communaute` vs `/app/community`, `/export` vs `/app/data-export`, double accessibilité, double notifications
- **Pages admin/dev** : 20+ routes admin (alert-config, cron-monitoring, blockchain-backups...) → déplacer dans une section cachée, visible uniquement pour admin
- **Pages système** : 401/403/404/500, test pages → retirer de la navigation
- **Sous-pages** inutiles comme navigation autonome : `/app/journal/notes`, `/app/journal/search`, `/app/journal/archive` → onglets dans le Journal, pas des pages séparées dans la nav

Catégories résultantes (~80 routes) :
1. Accueil (3)
2. Comprendre — Scan, Insights, Tendances (5)
3. Agir — Respiration, Coach, Journal, Protocoles (8)
4. S'évader — Musique, VR, Parc Émotionnel (5)
5. Progresser — Gamification, Défis, Objectifs (6)
6. Communauté — Entraide, Buddies, Sessions (4)
7. B2B — Dashboard RH, Rapports, Alertes, Équipes (10)
8. Paramètres — Profil, Confidentialité, Premium (8)
9. Public — About, Pricing, FAQ, Légal (10)
10. Admin (masqué par défaut, ~20 routes)

---

## Mise à jour de ModulesDashboard (37 → 30 modules)

Fusionner les entrées redondantes et mettre à jour les statuts. Les 37 modules deviennent 30 modules bien définis avec des descriptions précises et des routes fonctionnelles.

---

## Phases d'implémentation

### Phase 1 — Fusions respirations et musique
- Ajouter les modes/onglets dans `breath-unified` et `music-unified`
- Créer les redirections depuis les anciennes routes
- Mettre à jour les imports

### Phase 2 — Fusions gamification et social
- Consolider `gamification` comme hub unique
- Fusionner `ambition-arcade` + `boss-grit` + `bounce-back`
- Unifier `community` + `buddies` + `group-sessions`

### Phase 3 — Compléter les modules "vides"
- Screen Silk → timer 20-20-20 fonctionnel
- Story Synth → contenu enrichi
- Emotion Atlas → fusionné dans Scan
- Seuil → fusionné dans Coach IA
- Discovery → section dans Dashboard

### Phase 4 — Nettoyer NavigationPage et ModulesDashboard
- Réduire NavigationPage de 209 à ~80 routes
- Mettre à jour ModulesDashboard avec les statuts réels
- Masquer les routes admin/dev pour les utilisateurs normaux

### Phase 5 — VR et finitions
- Unifier les 3 modules VR
- Vérifier que toutes les redirections fonctionnent
- Build final et test

---

## Détails techniques

- Les fusions utilisent des **re-exports** pour ne casser aucun import existant
- Les routes deprecated reçoivent `deprecated: true` + `redirectTo` dans le registry (le routeur redirige automatiquement)
- Les routes admin reçoivent `hidden: true` dans le registry
- NavigationPage filtre les routes `hidden` et `deprecated` au lieu de les lister en dur
- Le ModulesDashboard lit dynamiquement les statuts depuis le registry au lieu d'un tableau statique

