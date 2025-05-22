
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Shell from './Shell';

// Pages à chargement différé pour optimiser le temps de chargement
const Home = lazy(() => import('./Home'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const VR = lazy(() => import('./pages/VR')); // Using the correct VR component
const Music = lazy(() => import('./pages/Music'));
const Journal = lazy(() => import('./pages/Journal')); // Using the newly created Journal component
const Login = lazy(() => import('./pages/Login'));
const Team = lazy(() => import('./pages/Team'));
const Support = lazy(() => import('./pages/Support'));
const Settings = lazy(() => import('./pages/UnifiedSettingsPage'));
const Session = lazy(() => import('./pages/Session'));
const Coach = lazy(() => import('./pages/Coach'));
const Social = lazy(() => import('./pages/Social'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));
const FeatureHub = lazy(() => import('./pages/FeatureHub'));
const Audio = lazy(() => import('./pages/Audio'));

// Configuration des routes
const routes = [
  {
    path: '/',
    element: <LandingPage />,
    index: true,
  },
  {
    path: '/home',
    element: (
      <Shell>
        <Home />
      </Shell>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Shell>
        <Dashboard />
      </Shell>
    ),
  },
  {
    path: '/profile',
    element: (
      <Shell>
        <Profile />
      </Shell>
    ),
  },
  {
    path: '/vr',
    element: (
      <Shell>
        <VR />
      </Shell>
    ),
  },
  {
    path: '/music',
    element: (
      <Shell>
        <Music />
      </Shell>
    ),
  },
  {
    path: '/journal',
    element: (
      <Shell>
        <Journal />
      </Shell>
    ),
  },
  {
    path: '/coach',
    element: (
      <Shell>
        <Coach />
      </Shell>
    ),
  },
  {
    path: '/settings',
    element: (
      <Shell>
        <Settings />
      </Shell>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/b2c/login',
    element: <Login mode="b2c" />,
  },
  {
    path: '/b2b/selection',
    element: <Login mode="b2b" />,
  },
  {
    path: '/team',
    element: (
      <Shell>
        <Team />
      </Shell>
    ),
  },
  {
    path: '/support',
    element: (
      <Shell>
        <Support />
      </Shell>
    ),
  },
  {
    path: '/sessions',
    element: (
      <Shell>
        <Session />
      </Shell>
    ),
  },
  {
    path: '/social',
    element: (
      <Shell>
        <Social />
      </Shell>
    ),
  },
  {
    path: '/features',
    element: (
      <Shell>
        <FeatureHub />
      </Shell>
    ),
  },
  {
    path: '/audio',
    element: (
      <Shell>
        <Audio />
      </Shell>
    ),
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];

export default routes;
