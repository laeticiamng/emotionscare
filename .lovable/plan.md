

# Plan : Fix Build Errors + 3D Immersive Upgrade

## Part 1 — Fix Build Errors (4 fixes)

### 1. AuthContext.tsx — `Property 'id' does not exist on type 'never'`
`TEST_MODE.MOCK_USER` is typed as `null` (frozen object with `MOCK_USER: null`). Accessing `.id`, `.email`, `.user_metadata` on `null` gives type `never`. Fix: add type assertion in `createMockUser` to cast `TEST_MODE.MOCK_USER` properly, or guard with a type-safe check.

### 2. PredictiveAnalyticsContext.tsx line 184 — `randomEmotion` / `randomConfidence` undefined
The prediction object uses hardcoded `'calm'` and `0` but the toast still references deleted variables `randomEmotion` and `randomConfidence`. Fix: use `prediction.emotion` and `prediction.confidence` in the toast.

### 3. B2CDashboardPage.tsx line 700 — `role` prop on Card3D
`Card3D` doesn't accept a `role` prop. Fix: wrap Card3D in a `div` with the `role` attribute, or remove it from Card3D.

### 4. Supabase realtime-js Deno error
This is a Deno edge function build error, not a frontend issue. No frontend fix needed — it resolves itself or needs edge function config.

## Part 2 — Immersive 3D Breathing Scene Upgrade

Current state: A single metallic sphere with basic color change and scale animation. Minimal visual impact.

### Upgrade plan for `BreathingScene.tsx` and `BreathingSphere.tsx`:

**New `BreathingSphere.tsx`** — Complete rewrite with:
- **Animated particle field**: 200+ floating particles (using `@react-three/drei` `Points`/`PointMaterial`) that expand/contract with breathing
- **Organic sphere**: Replace metallic sphere with a glowing, semi-transparent orb using custom shader-like effects (emissive + transparency layers)
- **Color transitions**: Smooth lerping between phase colors using `THREE.Color.lerp`
- **Pulsing inner glow**: Second smaller sphere inside with high emissive intensity
- **Ripple rings**: 3 concentric torus rings that scale with breathing phases

**New `BreathingScene.tsx`** — Enhanced scene:
- **Starfield background**: `@react-three/drei` `Stars` component for depth
- **Fog**: Atmospheric fog for depth perception
- **Multiple colored lights** that shift with phase
- **Post-processing bloom** effect using `@react-three/drei` (or CSS glow fallback)
- **Full viewport height** option (h-[400px] → h-[500px] or configurable)
- **Smooth camera breathing**: Camera subtly moves in/out with the breath cycle

**New `BreathingParticles.tsx`** component:
- 300 particles in a sphere distribution
- Particles drift outward on inhale, inward on exhale
- Size and opacity pulsate with progress
- Color matches current phase

### Files to create/modify:

| File | Action |
|------|--------|
| `src/contexts/AuthContext.tsx` | Fix type assertions for MOCK_USER |
| `src/contexts/PredictiveAnalyticsContext.tsx` | Fix toast to use `prediction.emotion`/`prediction.confidence` |
| `src/pages/b2c/B2CDashboardPage.tsx` | Remove `role` from Card3D, wrap in div |
| `src/modules/breathing-vr/ui/BreathingParticles.tsx` | **New** — Particle field component |
| `src/modules/breathing-vr/ui/BreathingSphere.tsx` | Rewrite — Multi-layer glowing orb with rings |
| `src/modules/breathing-vr/ui/BreathingScene.tsx` | Rewrite — Stars, fog, dynamic lights, larger canvas |

