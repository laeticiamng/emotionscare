
import React, { lazy, Suspense } from 'react';
import { createRoutesFromElements, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';
import EmergencyPage from '@/pages/EmergencyPage';

// Import des pages de base
const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <ComponentLoadingFallback />
  </div>
);

console.log('🛠️ buildUnifiedRoutes - Building routes...');

export const buildUnifiedRoutes = () => {
  console.log('📋 buildUnifiedRoutes - Creating route elements...');
  
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<EmergencyPage />}>
      <Route 
        index 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <HomePage />
          </Suspense>
        } 
      />
      <Route 
        path="emergency" 
        element={<EmergencyPage />} 
      />
      <Route 
        path="*" 
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        } 
      />
    </Route>
  );

  console.log('✅ buildUnifiedRoutes - Routes created successfully');
  return routes;
};
