/**
 * Main.tsx - RouterV2 réparé
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router as routerV2 } from '@/routerV2/router';
import { Loader2 } from 'lucide-react';

// Configuration basique
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'fr';
  document.title = "EmotionsCare - Plateforme d'intelligence émotionnelle";
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Application root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <React.Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16 text-center">
          <Loader2 className="mb-6 h-12 w-12 animate-spin text-blue-600" />
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">Chargement de l'application…</p>
            <p className="text-sm text-gray-600">
              Nous préparons votre espace émotionnel, merci de patienter.
            </p>
          </div>
        </div>
      }
    >
      <RouterProvider router={routerV2} />
    </React.Suspense>
  </React.StrictMode>
);
