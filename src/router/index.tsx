
import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import Shell from '@/Shell';
import HomePage from '@/pages/HomePage';
import ChooseModePage from '@/pages/ChooseModePage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import ScanPage from '@/pages/ScanPage';
import MusicPage from '@/pages/MusicPage';
import CoachPage from '@/pages/CoachPage';
import JournalPage from '@/pages/JournalPage';
import B2CLoginPage from '@/pages/B2CLoginPage';
import LoadingAnimation from '@/components/ui/loading-animation';

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <LoadingAnimation text="Chargement..." />
  </div>
);

// Composant 404 personnalisé
const NotFoundPage = () => (
  <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Page introuvable</h1>
      <p className="text-gray-600 mb-6">La page que vous recherchez n'existe pas.</p>
      <a 
        href="/" 
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retour à l'accueil
      </a>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Shell />
      </Suspense>
    ),
    errorElement: <NotFoundPage />,
    children: [
      // Routes publiques principales
      { index: true, element: <HomePage /> },
      { path: 'choose-mode', element: <ChooseModePage /> },
      { path: 'b2b/selection', element: <B2BSelectionPage /> },
      
      // Pages de fonctionnalités - ROUTES FONCTIONNELLES
      { path: 'scan', element: <ScanPage /> },
      { path: 'music', element: <MusicPage /> },
      { path: 'coach', element: <CoachPage /> },
      { path: 'journal', element: <JournalPage /> },
      
      // Routes d'authentification B2C
      { path: 'b2c/login', element: <B2CLoginPage /> },
      
      // AJOUT DE LA ROUTE /b2b QUI MANQUAIT
      { path: 'b2b', element: <B2BSelectionPage /> },
      
      // Pages avec contenu de base pour éviter les 404
      { 
        path: 'b2c/register', 
        element: (
          <div data-testid="page-root" className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Inscription B2C</h1>
              <p>Page d'inscription en cours de développement</p>
              <a href="/b2c/login" className="text-blue-600 hover:underline">← Retour à la connexion</a>
            </div>
          </div>
        )
      },
      { 
        path: 'b2b/user/login', 
        element: (
          <div data-testid="page-root" className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Connexion B2B Utilisateur</h1>
              <p>Page de connexion en cours de développement</p>
              <a href="/b2b/selection" className="text-blue-600 hover:underline">← Retour à la sélection</a>
            </div>
          </div>
        )
      },
      { 
        path: 'b2b/admin/login', 
        element: (
          <div data-testid="page-root" className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Connexion B2B Admin</h1>
              <p>Page de connexion administrateur en cours de développement</p>
              <a href="/b2b/selection" className="text-blue-600 hover:underline">← Retour à la sélection</a>
            </div>
          </div>
        )
      },
      { 
        path: 'vr', 
        element: (
          <div data-testid="page-root" className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Réalité Virtuelle</h1>
              <p>Module VR en cours de développement</p>
              <a href="/" className="text-blue-600 hover:underline">← Retour à l'accueil</a>
            </div>
          </div>
        )
      },
      
      // Catch-all pour les routes non trouvées
      { path: '*', element: <NotFoundPage /> }
    ],
  },
]);

export const routes = router.routes;
