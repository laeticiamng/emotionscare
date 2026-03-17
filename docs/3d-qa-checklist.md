# 3D QA Checklist — EmotionsCare

Version: 1.0
Last updated: 2026-03-17

## Routes 3D critiques

| Route | Composant | Scene |
|-------|-----------|-------|
| `/` (hero) | `HeroScene3D` | hero |
| `/app/breathing-vr` | `BreathingScene` | breathing |
| `/app/vr-galaxy` | `GalaxyScene3D` | galaxy |
| `/app/vr-nebula` | `NebulaScene3D` | nebula |

## Checklist par scène

### 1. Rendu de base
- [ ] La scène se charge sans écran noir
- [ ] Le canvas 3D est visible dans le viewport
- [ ] Les particules sont animées
- [ ] Les lumières éclairent correctement les objets
- [ ] Le fog crée une profondeur sans voile sale

### 2. Post-processing
- [ ] Le bloom améliore l'image sans masquer la lisibilité
- [ ] La vignette ajoute de la profondeur
- [ ] L'aberration chromatique est subtile (non visible sans zoom)
- [ ] Si le postprocessing échoue, la scène reste visible (error boundary)

### 3. Lisibilité
- [ ] Les CTA sont lisibles au-dessus du canvas
- [ ] Les textes overlays ont un contraste suffisant
- [ ] La vignette ne coupe pas le contenu UI

### 4. Fallbacks
- [ ] WebGL indisponible → fallback premium gradient visible en < 1s
- [ ] Contexte WebGL perdu → message de rechargement + tentative de recovery
- [ ] `prefers-reduced-motion` → fallback CSS propre, pas d'écran noir

### 5. Performance
- [ ] Pas de freeze au chargement initial
- [ ] Navigation entre routes 3D sans crash
- [ ] Pas de fuite mémoire visible (tab longue durée)
- [ ] Onglet inactif → animations pausées
- [ ] Mobile viewport → budget particules réduit
- [ ] Pas de recréation d'objets THREE dans useFrame

### 6. Accessibilité
- [ ] `role="img"` et `aria-label` sur les fallbacks
- [ ] Reduced-motion respecté partout
- [ ] Navigation clavier possible autour du canvas

### 7. Cohérence visuelle
- [ ] Les 4 scènes partagent une palette cohérente
- [ ] Les transitions entre sections sont fluides
- [ ] Chaque scène a une intention perceptible différente :
  - Hero = aspiration / promesse
  - Breathing = calme / rythme
  - Galaxy = majesté / exploration
  - Nebula = introspection / enveloppement

### 8. Non-régression
- [ ] Refresh page → même état visuel
- [ ] Aller-retour entre routes → pas de canvas noir
- [ ] Resize fenêtre → adaptation propre
- [ ] Desktop / Tablette / Mobile → rendu cohérent

## Presets visuels validés

Les presets sont centralisés dans `src/components/3d/visualDirection.ts`.

| Preset | Bloom | Threshold | Vignette | CA |
|--------|-------|-----------|----------|-----|
| Hero | 1.0 | 0.35 | 0.3/0.5 | 0.0003 |
| Breathing | 1.2 | 0.28 | 0.35/0.55 | 0.0004 |
| Galaxy | 1.4 | 0.22 | 0.3/0.65 | 0.0004 |
| Nebula | 1.3 | 0.25 | 0.3/0.6 | 0.0004 |

Tone mapping: ACESFilmic, exposure: 1.3

## Guard-fous pour futures PR 3D

1. **Avant de modifier `visualDirection.ts`** : vérifier l'impact sur les 4 scènes
2. **Avant d'ajouter un effet** : vérifier que le `PostProcessingErrorBoundary` le capture
3. **Avant de modifier un useFrame** : vérifier isTabVisible(), pas d'allocation dans la boucle
4. **Avant de toucher aux particules** : vérifier les budgets par device tier
5. **Tester systématiquement** : desktop, mobile, reduced-motion, WebGL off
