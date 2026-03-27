// @ts-nocheck
/**
 * Hero 3D immersif pour la page d'accueil (ImmersiveHome variant)
 * Now uses unified visual direction and delegates to HeroScene3D
 */

import { lazy, Suspense } from 'react';

const HeroScene3D = lazy(() => import('@/components/3d/HeroScene3D'));

const AnimatedBackground3D = () => (
  <Suspense
    fallback={
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(59,130,246,0.06) 0%, transparent 50%), #0a0a1a',
        }}
      />
    }
  >
    <HeroScene3D />
  </Suspense>
);

export default AnimatedBackground3D;
