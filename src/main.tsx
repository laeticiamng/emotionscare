/**
 * Main.tsx - RouterV2 réparé
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router as routerV2 } from '@/routerV2/router';
import { RootProvider } from '@/providers/RootProvider';
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
    <RootProvider>
      <React.Suspense
        fallback={
          <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center">
            <Loader2 className="mb-6 h-12 w-12 animate-spin text-primary" />
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">Chargement de l'application…</p>
              <p className="text-sm text-muted-foreground">
                Nous préparons votre espace émotionnel, merci de patienter.
              </p>
            </div>
          </div>
        }
      >
        <RouterProvider router={routerV2} />
      </React.Suspense>
    </RootProvider>
  </React.StrictMode>
);
