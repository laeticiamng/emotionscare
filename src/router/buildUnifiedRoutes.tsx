
import React, { lazy, Suspense } from 'react';
import { createRoutesFromElements, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { b2bRoutes } from './routes/b2bRoutes';
import { b2cRoutes } from './routes/b2cRoutes';
import { optimizedRoutes } from './routes/lazyRoutes';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
import HomePage from '@/pages/HomePage';
import ChooseModePage from '@/pages/ChooseModePage';
import AuthPage from '@/pages/AuthPage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import NotFoundPage from '@/pages/NotFoundPage';
import TestPage from '@/pages/TestPage';
import UnifiedRouteGuard from '@/components/routing/UnifiedRouteGuard';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';

// Import des nouvelles pages créées
const VRGalactiquePage = lazy(() => import('@/pages/VRGalactiquePage'));
const ScreenSilkBreakPage = lazy(() => import('@/pages/ScreenSilkBreakPage'));
const StorySynthLabPage = lazy(() => import('@/pages/StorySynthLabPage'));
const ARFiltersPage = lazy(() => import('@/pages/ARFiltersPage'));
const BubbleBeatPage = lazy(() => import('@/pages/BubbleBeatPage'));

const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <ComponentLoadingFallback />
  </div>
);

export const buildUnifiedRoutes = () => {
  return createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path={UNIFIED_ROUTES.CHOOSE_MODE} element={<ChooseModePage />} />
      <Route path={UNIFIED_ROUTES.AUTH} element={<AuthPage />} />
      <Route path={UNIFIED_ROUTES.B2B_SELECTION} element={<B2BSelectionPage />} />
      
      {/* Routes B2C */}
      <Route path="/b2c/*" element={<UnifiedRouteGuard allowedRoles={['b2c']} redirectTo={UNIFIED_ROUTES.B2C_LOGIN} />}>
        {b2cRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>
      
      {/* Routes B2B */}
      <Route path="/b2b/*" element={<UnifiedRouteGuard allowedRoles={['b2b_user', 'b2b_admin']} redirectTo={UNIFIED_ROUTES.B2B_USER_LOGIN} />}>
        {b2bRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Lazy Loaded Routes */}
      {optimizedRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.Component} />
      ))}

      {/* New routes */}
      <Route
        path='/vr-galactique'
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <VRGalactiquePage />
          </Suspense>
        }
      />
      <Route
        path='/screen-silk-break'
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <ScreenSilkBreakPage />
          </Suspense>
        }
      />
      <Route
        path='/story-synth-lab'
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <StorySynthLabPage />
          </Suspense>
        }
      />
      <Route
        path='/ar-filters'
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <ARFiltersPage />
          </Suspense>
        }
      />
      <Route
        path='/bubble-beat'
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <BubbleBeatPage />
          </Suspense>
        }
      />

      {/* Test Routes - Development Only */}
      {import.meta.env.MODE === 'development' && (
        <Route path="/test" element={<TestPage />} />
      )}
      
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  );
};
