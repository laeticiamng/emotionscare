

# Plan : Push 3D au niveau "best of 2026"

## Diagnostic actuel

Les 3 scènes 3D (Breathing, Galaxy, Nebula) sont fonctionnelles avec Stars, particules, fog et post-processing Bloom. Mais elles restent visuellement "propres" sans être spectaculaires. Voici ce qui manque pour atteindre le niveau premium 2026 :

| Manque | Impact |
|--------|--------|
| Sphère de respiration = scale uniforme, pas de déformation organique | L'orbe paraît rigide |
| Particules statiques, pas de réaction au curseur | Pas d'interactivité |
| Home page = Canvas 2D basique (8 orbes flous) | Première impression faible |
| Ancien `BreathPacerSphere` dans `src/components/vr/` = MeshBasicMaterial simple | Incohérence visuelle |
| Pas de chromatic aberration ni de depth of field | Rendu "flat" |

## 5 upgrades

### 1. Vertex shader organique sur BreathingSphere
Ajouter un bruit Simplex directement en GLSL via `onBeforeCompile` sur le `MeshPhysicalMaterial` de la sphère extérieure. Les vertices se déforment en temps réel — l'orbe "respire" comme un organisme vivant, pas comme un ballon qui gonfle/dégonfle.

**Fichier** : `src/modules/breathing-vr/ui/BreathingSphere.tsx`

### 2. Particules interactives (réaction curseur/touch)
Créer un composant `InteractiveParticles` qui réagit à la position de la souris/du doigt : les particules s'écartent doucement quand le curseur passe, créant un effet de "champ de force". Intégrer dans les 3 scènes.

**Fichier** : `src/components/3d/InteractiveParticles.tsx` (nouveau)
**Modifs** : BreathingScene, GalaxyScene3D, NebulaScene3D

### 3. Post-processing enrichi
Ajouter `ChromaticAberration` subtile et `DepthOfField` au composant `ImmersivePostProcessing` pour un rendu cinématique. Paramétrable par scène.

**Fichier** : `src/components/3d/ImmersivePostProcessing.tsx`

### 4. Hero 3D sur la page d'accueil
Remplacer le `AnimatedBackground` (Canvas 2D avec 8 orbes flous) par une scène Three.js légère : un champ de particules interactif + subtle bloom. Première impression immersive dès la landing.

**Fichier** : `src/components/home/AnimatedBackground3D.tsx` (nouveau)
**Modif** : `src/components/home/ImmersiveHome.tsx` — remplacer l'import

### 5. Upgrade BreathPacerSphere legacy
Le composant `src/components/vr/BreathPacerSphere.tsx` utilise encore un `MeshBasicMaterial` simple. Le remplacer par l'approche multi-couches (physical material + inner glow + rings) pour cohérence visuelle.

**Fichier** : `src/components/vr/BreathPacerSphere.tsx`

## Récapitulatif fichiers

| Fichier | Action |
|---------|--------|
| `src/modules/breathing-vr/ui/BreathingSphere.tsx` | Ajouter vertex shader Simplex noise |
| `src/components/3d/InteractiveParticles.tsx` | Nouveau — particules réactives au curseur |
| `src/components/3d/ImmersivePostProcessing.tsx` | Ajouter ChromaticAberration + DepthOfField |
| `src/components/home/AnimatedBackground3D.tsx` | Nouveau — hero 3D landing page |
| `src/components/home/ImmersiveHome.tsx` | Intégrer AnimatedBackground3D |
| `src/modules/breathing-vr/ui/BreathingScene.tsx` | Ajouter InteractiveParticles |
| `src/modules/vr-galaxy/components/GalaxyScene3D.tsx` | Ajouter InteractiveParticles |
| `src/modules/vr-nebula/components/NebulaScene3D.tsx` | Ajouter InteractiveParticles |
| `src/components/vr/BreathPacerSphere.tsx` | Upgrade multi-couches |

