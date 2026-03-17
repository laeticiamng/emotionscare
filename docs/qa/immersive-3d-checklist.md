# QA Checklist — Scènes 3D Immersives EmotionsCare

## Parcours critiques

### Hero (Landing page)
- [ ] La scène hero se charge sans écran noir sur Desktop Chrome
- [ ] La scène hero se charge sans écran noir sur Desktop Firefox
- [ ] La scène hero se charge sans écran noir sur Desktop Safari
- [ ] La scène hero se charge sur mobile iOS Safari (iPhone 12+)
- [ ] La scène hero se charge sur mobile Android Chrome
- [ ] Le CTA "Commencer gratuitement" est lisible au-dessus de la 3D
- [ ] Le heading H1 est lisible avec bon contraste
- [ ] Pas de scroll horizontal causé par le canvas
- [ ] Le canvas ne déborde pas du conteneur hero

### Breathing Scene
- [ ] La scène breathing se charge quand on démarre un exercice
- [ ] L'orbe réagit correctement aux phases (inhale → grossit, exhale → rétrécit)
- [ ] Les particules s'étendent/contractent avec la respiration
- [ ] Les lumières changent de couleur avec les phases
- [ ] La caméra "respire" de manière perceptible
- [ ] Le texte de phase reste lisible au-dessus de la 3D

### Galaxy Scene
- [ ] La galaxie spirale est visible avec ses 4 bras
- [ ] Le core lumineux pulse doucement
- [ ] La caméra orbite de manière cinématique
- [ ] Les dust lanes ajoutent de la profondeur
- [ ] La scène n'est pas trop sombre / "boueuse"

### Nebula Scene
- [ ] Les rubans aurora ondulent de manière organique
- [ ] La sphère de respiration réagit au breathProgress
- [ ] Le changement de palette (cosmos/aurora/galaxy/ocean) fonctionne
- [ ] Les particules cosmiques sont visibles et réactives

## Fallbacks & Accessibilité

### Reduced Motion
- [ ] Hero : fallback gradient statique, pas de canvas
- [ ] Breathing : fallback avec cercle statique, pas d'animation 3D
- [ ] Galaxy : fallback gradient statique
- [ ] Nebula : fallback gradient statique

### WebGL indisponible
- [ ] Hero : PremiumFallback visible, pas de zone vide
- [ ] Breathing : PremiumFallback visible
- [ ] Galaxy : PremiumFallback visible
- [ ] Nebula : PremiumFallback visible
- [ ] Tous les fallbacks ont un `role="img"` et un `aria-label`

### Context loss
- [ ] Si WebGL context est perdu, message "Rechargement de la scène..." affiché
- [ ] Si WebGL context est restauré, la scène reprend normalement

### Device tiers
- [ ] Desktop (high) : tous effets activés, bloom + CA + particules max
- [ ] Tablet (medium) : bloom réduit, CA désactivée, particules réduites
- [ ] Mobile (low) : postprocessing désactivé, particules minimales, DPR 1x

## Navigation & Stabilité

- [ ] Home → Login → Home : pas de crash
- [ ] Refresh page : pas d'écran noir persistant
- [ ] Navigation rapide (changements successifs) : pas de crash
- [ ] Pas de memory leak visible après navigation (vérifier DevTools Performance)
- [ ] Pas d'erreur dans la console au chargement initial
- [ ] Pas d'erreur dans la console après navigation

## Performance

- [ ] FPS > 30 sur Desktop Chrome
- [ ] FPS > 24 sur Mobile (device récent)
- [ ] Pas de jank visible sur les animations de particules
- [ ] Le tab inactif n'utilise pas de CPU (animations pausées)
- [ ] Le fog ne "lave" pas les objets principaux
- [ ] Le bloom ne noie pas le contraste texte/3D

## Cohérence visuelle

- [ ] Les matériaux (orbes, cores, rings) ont une qualité homogène sur toutes les scènes
- [ ] Pas de composant qui paraît "cheap" par rapport aux autres
- [ ] Profondeur atmosphérique perceptible grâce au fog
- [ ] Vignette CSS ajoute de la profondeur sans cacher le contenu
- [ ] Signature visuelle cohérente : premium, immersif, cinématique, sobre
