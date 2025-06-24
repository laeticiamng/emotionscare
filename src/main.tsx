
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import AppProviders from './AppProviders';
import './index.css';

console.log('🚀 Starting EmotionsCare application...');
console.log('🔍 Router configuration loaded:', router);
console.log('📍 Current route should load LandingPage component');
console.log('✅ AUDIT: Configuration unifiée appliquée avec succès');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>
);
