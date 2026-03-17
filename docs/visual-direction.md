# Visual Direction — EmotionsCare 3D

Version: 1.0
Last updated: 2026-03-17

## System Architecture

```
visualDirection.ts (Central Config — SINGLE SOURCE OF TRUTH)
    │
    ├── Scene3DErrorBoundary.tsx
    │   ├── WebGLGate (wraps Canvas, blocks if no WebGL)
    │   ├── Scene3DErrorBoundary (catches React errors)
    │   ├── PremiumFallback (gradient fallback)
    │   └── WebGLDiagnosticBadge (dev only)
    │
    ├── ImmersiveCanvas.tsx (Reusable wrapper)
    │   ├── WebGLGate
    │   ├── Context-loss detection
    │   ├── Fog, ambientLight, DPR, GL config
    │   └── Vignette overlay
    │
    ├── ImmersivePostProcessing.tsx
    │   ├── PostProcessingErrorBoundary
    │   ├── Bloom + Vignette + ChromaticAberration
    │   └── enabled prop (off on low-end)
    │
    └── Scene Components:
        ├── HeroScene3D (own Canvas + WebGLGate)
        ├── BreathingScene (own Canvas + WebGLGate)
        ├── GalaxyScene3D (via ImmersiveCanvas)
        └── NebulaScene3D (via ImmersiveCanvas)
```

## Scene Intentions

| Scene | Mood | Camera | Particles | Glow |
|-------|------|--------|-----------|------|
| **Hero** | Aspiration / Promise | Gentle sway | Sparse, premium | Subtle |
| **Breathing** | Calm / Centering | Breath-synced | Moderate | Phase-driven |
| **Galaxy** | Majesty / Exploration | Orbital flythrough | Dense starfield | Warm core |
| **Nebula** | Introspection / Presence | Gentle drift | Enveloping | Palette-driven |

## Tone Mapping

- **Algorithm**: ACESFilmicToneMapping
- **Exposure**: 1.3 (calibrated for visible forms without wash-out)

## Post-Processing Presets

| | Bloom Intensity | Bloom Threshold | Bloom Radius | Vignette Offset | Vignette Darkness | CA Offset |
|---|---|---|---|---|---|---|
| Hero | 1.0 | 0.35 | 0.6 | 0.3 | 0.5 | 0.0003 |
| Breathing | 1.2 | 0.28 | 0.65 | 0.35 | 0.55 | 0.0004 |
| Galaxy | 1.4 | 0.22 | 0.7 | 0.3 | 0.65 | 0.0004 |
| Nebula | 1.3 | 0.25 | 0.7 | 0.3 | 0.6 | 0.0004 |

**Design principles**:
- Bloom threshold high enough to preserve shape readability
- Bloom intensity scaled per-scene (galaxy needs more glow for star richness)
- Chromatic aberration barely perceptible (decorative only)
- Vignette draws focus to center without cutting UI

## Fog Strategy

| Scene | Color | Near | Far | Purpose |
|-------|-------|------|-----|---------|
| Hero | `#0a0a1a` | 6 | 24 | Clean depth, don't obscure orbs |
| Breathing | `#0a0a1a` | 5 | 22 | Intimate but spacious |
| Galaxy | `#050510` | 8 | 35 | Deep space, far-reaching arms visible |
| Nebula | `#0a0818` | 5 | 24 | Enveloping, cozy atmosphere |

## Device Tiers

| Tier | Criteria | DPR | Postprocessing | Antialias |
|------|----------|-----|----------------|-----------|
| High | Desktop ≥1200px, DPR ≥1.5, cores >2 | 1-2 | Full | Yes |
| Medium | 768-1199px | 1-1.5 | Full | Yes |
| Low | <768px, DPR <1.5, reduced-motion, cores ≤2 | 1 | Disabled | No |

## Particle Budgets

| Scene | High | Medium | Low |
|-------|------|--------|-----|
| Hero | 160 | 96 | 60 |
| Breathing | 250 | 150 | 100 |
| Galaxy | 4000 | 2400 | 1500 |
| Nebula | 350 | 210 | 120 |
| Interactive | 140 | 84 | 40 |

## Error Handling Chain

1. **WebGLGate** — Checks WebGL availability before Canvas mount
2. **Scene3DErrorBoundary** — Catches React render errors
3. **PostProcessingErrorBoundary** — Catches EffectComposer errors
4. **Context-loss handler** — Detects and reports GPU context loss
5. **PremiumFallback** — Gradient alternative (always available)

## Performance Guards

- `isTabVisible()` check in every `useFrame` callback
- `shouldEnablePostProcessing()` disables effects on low-end
- Stars and particle counts scale by device tier
- Aurora ribbon segments: 50×4 (high) / 30×4 (low) instead of original 100×8
- No object allocations inside `useFrame` loops
- Proper event listener cleanup in all `useEffect` hooks
