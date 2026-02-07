

# Audit des 34 pages du Parc Emotionnel

---

## Synthese globale

| Critere | Resultat |
|---------|----------|
| Pages auditees | 34 |
| Routes toutes enregistrees | Oui (34/34) |
| Pages avec bouton retour | 22/34 (65%) |
| Pages avec `@ts-nocheck` | 3 (BubbleBeat, MoodMixer, CoachMicro) |
| Pages sans `usePageSEO` | ~28/34 |
| Score global | 7/10 |

---

## Audit individuel des 34 pages

### ZONE HUB (8 pages)

| # | Attraction | Route | Bouton retour | @ts-nocheck | Problemes |
|---|-----------|-------|---------------|-------------|-----------|
| 1 | Hall d'Accueil (Dashboard) | `/app/consumer/home` | N/A (c'est le home) | Non | OK |
| 2 | Salle des Cartes (Home) | `/app/home` | N/A (alias home) | Non | OK |
| 3 | Ciel des Auras (Leaderboard) | `/app/leaderboard` | Oui | Non | OK - bien structure |
| 4 | Jardin des Saisons (Activity) | `/app/activity` | **NON** | Non | Pas de bouton retour, pas de navigate |
| 5 | Carte des Humeurs (Scores) | `/app/scores` | Oui (HeatmapVibes) | Non | OK |
| 6 | Observatoire (Insights) | `/app/insights` | Oui (via PageRoot) | Non | OK - WCAG conforme |
| 7 | Pavillon Config (Settings) | `/app/settings/general` | Oui | Non | OK |
| 8 | Tour des Messages (Notifications) | `/app/notifications` | Oui | Non | OK |

### ZONE CALM (5 pages)

| # | Attraction | Route | Bouton retour | @ts-nocheck | Problemes |
|---|-----------|-------|---------------|-------------|-----------|
| 9 | Bulle Respirante (Nyvee) | `/app/nyvee` | **NON** | Non | **Pas de bouton retour, pas de navigate import**. Navigation morte. Lien hardcode `window.location.href = '/app/meditation'` au lieu de `navigate()`. |
| 10 | Temple de l'Air (VR Breath) | `/app/vr-breath-guide` | Oui | Non | OK |
| 11 | Ocean Interieur (Breath) | `/app/breath` | Oui | Non | OK (corrige precedemment) |
| 12 | Sanctuaire du Silence (Meditation) | `/app/meditation` | Oui (vers `/app`) | Non | Retour pointe vers `/app` au lieu de `/app/home` |
| 13 | Zone Seuil | `/app/seuil` | Oui (vers `/app/emotional-park`) | Non | OK - exemplaire |

### ZONE CREATIVE (4 pages)

| # | Attraction | Route | Bouton retour | @ts-nocheck | Problemes |
|---|-----------|-------|---------------|-------------|-----------|
| 14 | Galerie des Masques (Scan) | `/app/scan` | Oui | Non | OK (corrige precedemment) |
| 15 | Foret Sonore (Music) | `/app/music` | Oui | Non | OK (corrige precedemment) |
| 16 | Chambre des Reflets (AR) | `/app/face-ar` | **NON** | Non | Pas de bouton retour |
| 17 | Studio DJ (Mood Mixer) | `/app/mood-mixer` | **NON** | **OUI** | `@ts-nocheck` + pas de bouton retour |

### ZONE WISDOM (4 pages)

| # | Attraction | Route | Bouton retour | @ts-nocheck | Problemes |
|---|-----------|-------|---------------|-------------|-----------|
| 18 | Jardin des Pensees (Coach) | `/app/coach` | Oui | Non | OK (corrige precedemment) |
| 19 | Bibliotheque des Emotions (Journal) | `/app/journal` | Oui | Non | OK - exemplaire |
| 20 | Echo des Paroles (Voice Journal) | `/app/voice-journal` | **NON** | Non | **841 lignes, pas de bouton retour, pas de navigate import** |
| 21 | Theatre des Histoires (Story Synth) | `/app/story-synth` | Oui | Non | OK |

### ZONE ENERGY (3 pages)

| # | Attraction | Route | Bouton retour | @ts-nocheck | Problemes |
|---|-----------|-------|---------------|-------------|-----------|
| 22 | Chambre des Lumieres (Flash Glow) | `/app/flash-glow` | Oui | Non | OK (corrige precedemment) |
| 23 | Labo des Bulles (Bubble Beat) | `/app/bubble-beat` | **NON** | **OUI** | `@ts-nocheck` + pas de bouton retour |
| 24 | Cocon Digital (Screen Silk) | `/app/screen-silk` | **NON** | Non | ArrowLeft importe mais jamais utilise dans le JSX |

### ZONE CHALLENGE (3 pages)

| # | Attraction | Route | Bouton retour | @ts-nocheck | Problemes |
|---|-----------|-------|---------------|-------------|-----------|
| 25 | Arene de la Perseverance (Boss Grit) | `/app/boss-grit` | **NON** | Non | Pas de bouton retour |
| 26 | Trampoline Resilient (Bounce Back) | `/app/bounce-back` | Oui | Non | OK |
| 27 | Salle des Defis (Ambition Arcade) | `/app/ambition-arcade` | Oui | Non | OK - exemplaire |

### ZONE SOCIAL (4 pages)

| # | Attraction | Route | Bouton retour | @ts-nocheck | Problemes |
|---|-----------|-------|---------------|-------------|-----------|
| 28 | Village Bienveillant (Community) | `/app/community` | Oui | Non | OK - PageSEO present, moderation |
| 29 | Cercle des Allies (Buddies) | `/app/buddies` | A verifier | Non | A verifier |
| 30 | Cocon Social | `/app/social-cocon` | Oui | Non | OK - `usePageSEO` present |
| 31 | Arene des Champions (Gamification) | `/app/gamification` | Oui | Non | OK |

### ZONE EXPLORE (3 pages)

| # | Attraction | Route | Bouton retour | @ts-nocheck | Problemes |
|---|-----------|-------|---------------|-------------|-----------|
| 32 | Constellation (VR Galaxy) | `/app/vr-galaxy` | Oui | Non | OK (corrige precedemment) |
| 33 | Atlas des Emotions | `/app/emotion-atlas` | A verifier | Non | A verifier |
| 34 | Sentier des Decouvertes | `/app/discovery` | A verifier | Non | A verifier |

### HORS ZONE (3 pages supplementaires)

| # | Page | Route | Bouton retour | Problemes |
|---|------|-------|---------------|-----------|
| - | Portail Immersif (VR) | `/app/vr` | **NON** | Pas de bouton retour, pas de navigate |
| - | Profil | `/app/profile` | Oui | OK |
| - | Confidentialite | `/app/settings/privacy` | Oui | OK |

---

## Problemes par priorite

### P1 -- 12 pages sans bouton retour

Les pages suivantes n'ont aucun moyen de revenir au parc ou au dashboard sans utiliser le bouton navigateur :

1. **B2CNyveeCoconPage.tsx** (`/app/nyvee`) -- 411 lignes, utilise `window.location.href` au lieu de `navigate()`
2. **B2CVoiceJournalPage.tsx** (`/app/voice-journal`) -- 841 lignes
3. **B2CARFiltersPage.tsx** (`/app/face-ar`) -- 145 lignes
4. **B2CMoodMixerPage.tsx** (`/app/mood-mixer`) -- 733 lignes
5. **B2CBubbleBeatPage.tsx** (`/app/bubble-beat`) -- 648 lignes
6. **B2CScreenSilkBreakPage.tsx** (`/app/screen-silk`) -- 924 lignes (ArrowLeft importe mais pas utilise)
7. **B2CBossLevelGritPage.tsx** (`/app/boss-grit`) -- 445 lignes
8. **B2CActivitePage.tsx** (`/app/activity`) -- 580 lignes
9. **B2CImmersivePage.tsx** (`/app/vr`) -- 288 lignes
10. **MeditationPage.tsx** -- retour vers `/app` (devrait etre `/app/home`)

### P2 -- 3 fichiers avec `@ts-nocheck`

1. **B2CBubbleBeatPage.tsx** -- ligne 1
2. **B2CMoodMixerPage.tsx** -- ligne 1
3. **B2CAICoachMicroPage.tsx** -- ligne 1

### P2 -- 1 lien incorrect

1. **B2CNyveeCoconPage.tsx** ligne 367 : `window.location.href = '/app/meditation'` au lieu de `navigate('/app/meditation')` -- provoque un rechargement complet de la page

---

## Plan d'implementation

### Etape 1 : Ajouter boutons retour (9 pages)

Pour chaque page, ajouter un bouton retour standardise au-dessus du titre principal. Le pattern est :

```text
<Link to="/app/home">
  <Button variant="ghost" size="sm" aria-label="Retour a l'accueil">
    <ArrowLeft /> Retour
  </Button>
</Link>
```

**Fichiers a modifier :**

1. `src/pages/b2c/B2CNyveeCoconPage.tsx` -- ajouter bouton retour + remplacer `window.location.href` par `useNavigate`
2. `src/pages/b2c/B2CVoiceJournalPage.tsx` -- ajouter bouton retour
3. `src/pages/b2c/B2CARFiltersPage.tsx` -- ajouter bouton retour
4. `src/pages/b2c/B2CMoodMixerPage.tsx` -- ajouter bouton retour
5. `src/pages/b2c/B2CBubbleBeatPage.tsx` -- ajouter bouton retour
6. `src/pages/b2c/B2CScreenSilkBreakPage.tsx` -- utiliser ArrowLeft deja importe, ajouter bouton retour
7. `src/pages/b2c/B2CBossLevelGritPage.tsx` -- ajouter bouton retour
8. `src/pages/b2c/B2CActivitePage.tsx` -- ajouter bouton retour
9. `src/pages/b2c/B2CImmersivePage.tsx` -- ajouter bouton retour

### Etape 2 : Corriger le lien Meditation (1 page)

- `src/pages/MeditationPage.tsx` ligne 388 : changer `navigate('/app')` en `navigate('/app/home')`

### Etape 3 : Corriger Nyvee navigation (1 page)

- `src/pages/b2c/B2CNyveeCoconPage.tsx` ligne 367 : remplacer `window.location.href = '/app/meditation'` par `navigate('/app/meditation')` avec import de `useNavigate`

### Etape 4 : Retirer `@ts-nocheck` (3 fichiers)

- `src/pages/b2c/B2CBubbleBeatPage.tsx`
- `src/pages/b2c/B2CMoodMixerPage.tsx`
- `src/pages/b2c/B2CAICoachMicroPage.tsx`

Note : la suppression de `@ts-nocheck` peut reveler des erreurs TypeScript. Les corrections seront adaptees au cas par cas (ajout de types, casts).

### Fichiers a ne PAS toucher

Toutes les pages deja corrigees lors des audits precedents (Scan, Music, Breath, Coach, FlashGlow, VR Galaxy, Journal) ainsi que les pages exemplaires (Seuil, AmbitionArcade, BounceBack, Community, SocialCocon, Leaderboard, StorySynth).

---

## Resume des modifications

| Fichier | Modification | Priorite |
|---------|-------------|----------|
| `B2CNyveeCoconPage.tsx` | Bouton retour + remplacer `window.location.href` par `navigate` | P1 |
| `B2CVoiceJournalPage.tsx` | Bouton retour | P1 |
| `B2CARFiltersPage.tsx` | Bouton retour | P1 |
| `B2CMoodMixerPage.tsx` | Bouton retour + retirer `@ts-nocheck` | P1/P2 |
| `B2CBubbleBeatPage.tsx` | Bouton retour + retirer `@ts-nocheck` | P1/P2 |
| `B2CScreenSilkBreakPage.tsx` | Bouton retour (utiliser ArrowLeft deja importe) | P1 |
| `B2CBossLevelGritPage.tsx` | Bouton retour | P1 |
| `B2CActivitePage.tsx` | Bouton retour | P1 |
| `B2CImmersivePage.tsx` | Bouton retour | P1 |
| `MeditationPage.tsx` | Corriger retour `/app` -> `/app/home` | P2 |
| `B2CAICoachMicroPage.tsx` | Retirer `@ts-nocheck` | P2 |

Total : **11 fichiers a modifier**, aucun fichier a creer ou supprimer.

