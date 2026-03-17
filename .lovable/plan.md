

# Plan : Upgrade 3D immersif — Niveau 2026

## Diagnostic

| Module | Etat actuel | 3D réelle ? |
|--------|------------|-------------|
| **Breathing VR** | Sphère multi-couches + particules + stars + fog | Oui (upgrade récent) |
| **VR Galaxy** | Divs 2D avec dots animés framer-motion | Non |
| **VR Nebula** | Formulaire + stats, aucun visuel | Non |

Les deux modules Galaxy et Nebula n'ont **aucune scène 3D** — c'est le plus gros gap d'immersion sur la plateforme.

## Plan en 5 étapes

### 1. Ajouter `@react-three/postprocessing` pour le bloom HDR

Installer le package et créer un wrapper `<ImmersivePostProcessing>` réutilisable (Bloom, Vignette, ChromaticAberration) utilisable dans toutes les scènes 3D.

### 2. Améliorer le Breathing Sphere avec un vertex shader custom

Remplacer la sphère statique par une sphère avec **déformation organique en temps réel** (bruit Simplex sur les vertices). L'orbe "respire" de manière fluide et vivante, pas juste un scale uniforme. Ajouter le post-processing Bloom à la scène breathing.

### 3. Créer une vraie scène 3D pour VR Galaxy

Nouveau composant `GalaxyScene3D.tsx` :
- **Galaxie spirale** : 5000+ particules en distribution spirale (bras de Fibonacci)
- **Nébuleuses** : Nuages volumétriques semi-transparents (sprites additifs)
- **Constellations 3D** : Les constellations débloquées s'affichent en 3D avec des lignes lumineuses
- **Camera fly-through** : Déplacement lent automatique dans la galaxie
- **Post-processing** : Bloom + vignette
- Intégrer dans `VRGalaxyMain.tsx` en remplacement du div 2D actuel (lignes 127-147)

### 4. Créer une vraie scène 3D pour VR Nebula

Nouveau composant `NebulaScene3D.tsx` :
- **4 environnements** correspondant aux scènes existantes (cosmos, aurora, galaxy, ocean)
- **Aurore boréale** : Rubans ondulants avec vertex shader
- **Champ d'étoiles** profond avec parallaxe
- **Sphère de respiration** intégrée qui pulse avec le timer
- Intégrer dans `VRNebulaSessionPanel` quand la session est active

### 5. Infrastructure partagée

- `src/components/3d/ImmersiveCanvas.tsx` : Wrapper Canvas réutilisable (fog, tone mapping, post-processing, CSS bloom overlay, responsive height)
- `src/components/3d/ImmersivePostProcessing.tsx` : EffectComposer + Bloom + Vignette
- `src/components/3d/CosmicParticleField.tsx` : Champ de particules paramétrable (couleur, densité, comportement)

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `src/components/3d/ImmersiveCanvas.tsx` | Nouveau — wrapper Canvas partagé |
| `src/components/3d/ImmersivePostProcessing.tsx` | Nouveau — Bloom + Vignette |
| `src/components/3d/CosmicParticleField.tsx` | Nouveau — particules réutilisables |
| `src/modules/breathing-vr/ui/BreathingSphere.tsx` | Upgrade — vertex shader organique |
| `src/modules/breathing-vr/ui/BreathingScene.tsx` | Upgrade — ajouter post-processing |
| `src/modules/vr-galaxy/components/GalaxyScene3D.tsx` | Nouveau — scène galaxie spirale 3D |
| `src/modules/vr-galaxy/components/VRGalaxyMain.tsx` | Modifier — intégrer GalaxyScene3D |
| `src/modules/vr-nebula/components/NebulaScene3D.tsx` | Nouveau — scène nébuleuse 3D |
| `src/modules/vr-nebula/components/index.tsx` | Modifier — intégrer NebulaScene3D |

## Détails techniques

- **Post-processing** : `@react-three/postprocessing` (EffectComposer, Bloom avec luminanceThreshold, Vignette)
- **Vertex shader** : Déformation Simplex noise via `onBeforeCompile` sur MeshPhysicalMaterial (pas besoin de package externe — noise intégré en GLSL)
- **Galaxie spirale** : Distribution logarithmique en 4 bras, 5000 particules Points avec PointsMaterial AdditiveBlending
- **Aurore** : Plane geometry avec vertex displacement sinusoïdal + gradient alpha

## Impact visuel attendu

- La sphère de respiration ondule organiquement comme un organisme vivant
- La galaxie ressemble à une vraie photo Hubble avec bloom HDR
- La nébuleuse crée un cocon immersif de lumière
- Toutes les scènes ont un rendu cinématique cohérent (même tone mapping, même bloom)

