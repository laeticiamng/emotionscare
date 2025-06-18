
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingIllustration } from '@/components/ui/loading-illustration';

// Lazy load components - CHEMINS UNIQUES UNIQUEMENT
const Home = React.lazy(() => import('./Home'));
const BreathHome = React.lazy(() => import('./pages/BreathHome'));
const FlowWalkStart = React.lazy(() => import('./pages/FlowWalkStart'));
const FlowWalkLive = React.lazy(() => import('./pages/FlowWalkLive'));
const FlowWalkSummary = React.lazy(() => import('./pages/FlowWalkSummary'));
const GlowMugStart = React.lazy(() => import('./pages/GlowMugStart'));
const GlowMugLive = React.lazy(() => import('./pages/GlowMugLive'));
const GlowMugSummary = React.lazy(() => import('./pages/GlowMugSummary'));
const SilkPage = React.lazy(() => import('./pages/settings/SilkPage'));
const GlowBreathPage = React.lazy(() => import('./pages/GlowBreathPage'));

const AppRouter: React.FC = () => {
  console.log('AppRouter rendering with React:', !!React);
  
  return (
    <React.Suspense fallback={<LoadingIllustration />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/breath" element={<BreathHome />} />
        <Route path="/breath/flowwalk" element={<FlowWalkStart />} />
        <Route path="/breath/flowwalk/live" element={<FlowWalkLive />} />
        <Route path="/breath/flowwalk/summary" element={<FlowWalkSummary />} />
        <Route path="/breath/glowmug" element={<GlowMugStart />} />
        <Route path="/breath/glowmug/live" element={<GlowMugLive />} />
        <Route path="/breath/glowmug/summary" element={<GlowMugSummary />} />
        <Route path="/settings/wallpapers" element={<SilkPage />} />
        <Route path="/glow-breath" element={<GlowBreathPage />} />
        {/* SUPPRESSION DES DOUBLONS - les routes principales sont gérées par src/router.tsx */}
        <Route path="/*" element={<Home />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRouter;
