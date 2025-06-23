
import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import Shell from '@/Shell';
import HomePage from '@/pages/HomePage';
import ChooseModePage from '@/pages/ChooseModePage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import LoadingAnimation from '@/components/ui/loading-animation';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';

// Fallback de chargement robuste
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <LoadingAnimation text="Chargement..." />
  </div>
);

// Page 404 améliorée
const NotFoundPage = () => (
  <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center max-w-md mx-auto p-6">
      <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page introuvable</h2>
      <p className="text-muted-foreground mb-6">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="space-y-2">
        <a 
          href="/" 
          className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Retour à l'accueil
        </a>
        <br />
        <a 
          href="/choose-mode" 
          className="inline-block text-muted-foreground hover:text-foreground transition-colors"
        >
          Choisir un mode d'accès
        </a>
      </div>
    </div>
  </div>
);

// Pages de fonctionnalités avec contenu de base
const ScanPage = () => (
  <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Scan Émotionnel</h1>
      <p className="text-muted-foreground mb-6">Module de scan émotionnel en cours de développement</p>
      <a href="/" className="text-primary hover:underline">← Retour à l'accueil</a>
    </div>
  </div>
);

const MusicPage = () => (
  <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Musique Thérapeutique</h1>
      <p className="text-muted-foreground mb-6">Module musical en cours de développement</p>
      <a href="/" className="text-primary hover:underline">← Retour à l'accueil</a>
    </div>
  </div>
);

const CoachPage = () => (
  <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Coach IA</h1>
      <p className="text-muted-foreground mb-6">Coach intelligent en cours de développement</p>
      <a href="/" className="text-primary hover:underline">← Retour à l'accueil</a>
    </div>
  </div>
);

const JournalPage = () => (
  <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Journal Personnel</h1>
      <p className="text-muted-foreground mb-6">Journal émotionnel en cours de développement</p>
      <a href="/" className="text-primary hover:underline">← Retour à l'accueil</a>
    </div>
  </div>
);

const B2CLoginPage = () => (
  <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Connexion Particulier</h1>
      <p className="text-muted-foreground mb-6">Interface de connexion B2C en cours de développement</p>
      <a href="/choose-mode" className="text-primary hover:underline">← Retour au choix du mode</a>
    </div>
  </div>
);

// Configuration du routeur avec gestion d'erreurs robuste
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <EnhancedErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Shell />
        </Suspense>
      </EnhancedErrorBoundary>
    ),
    errorElement: <NotFoundPage />,
    children: [
      // Routes principales
      { 
        index: true, 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        )
      },
      { 
        path: 'choose-mode', 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ChooseModePage />
          </Suspense>
        )
      },
      { 
        path: 'b2b/selection', 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <B2BSelectionPage />
          </Suspense>
        )
      },
      
      // Alias pour b2b -> b2b/selection
      { 
        path: 'b2b', 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <B2BSelectionPage />
          </Suspense>
        )
      },
      
      // Pages de fonctionnalités
      { 
        path: 'scan', 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ScanPage />
          </Suspense>
        )
      },
      { 
        path: 'music', 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MusicPage />
          </Suspense>
        )
      },
      { 
        path: 'coach', 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CoachPage />
          </Suspense>
        )
      },
      { 
        path: 'journal', 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <JournalPage />
          </Suspense>
        )
      },
      
      // Pages d'authentification
      { 
        path: 'b2c/login', 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <B2CLoginPage />
          </Suspense>
        )
      },
      
      // Pages temporaires pour éviter les 404
      { 
        path: 'b2c/register', 
        element: (
          <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center max-w-md mx-auto p-6">
              <h1 className="text-3xl font-bold mb-4">Inscription B2C</h1>
              <p className="text-muted-foreground mb-6">Page d'inscription en cours de développement</p>
              <a href="/b2c/login" className="text-primary hover:underline">← Retour à la connexion</a>
            </div>
          </div>
        )
      },
      { 
        path: 'b2b/user/login', 
        element: (
          <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center max-w-md mx-auto p-6">
              <h1 className="text-3xl font-bold mb-4">Connexion Utilisateur B2B</h1>
              <p className="text-muted-foreground mb-6">Interface de connexion utilisateur en cours de développement</p>
              <a href="/b2b/selection" className="text-primary hover:underline">← Retour à la sélection</a>
            </div>
          </div>
        )
      },
      { 
        path: 'b2b/admin/login', 
        element: (
          <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center max-w-md mx-auto p-6">
              <h1 className="text-3xl font-bold mb-4">Connexion Administrateur B2B</h1>
              <p className="text-muted-foreground mb-6">Interface de connexion administrateur en cours de développement</p>
              <a href="/b2b/selection" className="text-primary hover:underline">← Retour à la sélection</a>
            </div>
          </div>
        )
      },
      { 
        path: 'vr', 
        element: (
          <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center max-w-md mx-auto p-6">
              <h1 className="text-3xl font-bold mb-4">Réalité Virtuelle</h1>
              <p className="text-muted-foreground mb-6">Module VR en cours de développement</p>
              <a href="/" className="text-primary hover:underline">← Retour à l'accueil</a>
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
