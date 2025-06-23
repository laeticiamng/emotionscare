
import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import AppProviders from '@/AppProviders';
import Shell from '@/Shell';
import HomePage from '@/pages/HomePage';
import ChooseModePage from '@/pages/ChooseModePage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import LoadingAnimation from '@/components/ui/loading-animation';

// Routes d'authentification
import { authRoutes } from './routes/authRoutes';
import { b2cRoutes } from './routes/b2cRoutes';
import { b2bUserRoutes } from './routes/b2bUserRoutes';
import { b2bAdminRoutes } from './routes/b2bAdminRoutes';

// Routes de fonctionnalités
import { scanRoutes } from './routes/scanRoutes';
import { musicRoutes } from './routes/musicRoutes';
import { coachRoutes } from './routes/coachRoutes';
import { journalRoutes } from './routes/journalRoutes';
import { vrRoutes } from './routes/vrRoutes';
import { preferencesRoutes } from './routes/preferencesRoutes';
import { gamificationRoutes } from './routes/gamificationRoutes';
import { socialCoconRoutes } from './routes/socialCoconRoutes';

// Routes admin uniquement
import { teamsRoutes } from './routes/teamsRoutes';
import { reportsRoutes } from './routes/reportsRoutes';
import { eventsRoutes } from './routes/eventsRoutes';
import { optimisationRoutes } from './routes/optimisationRoutes';
import { settingsRoutes } from './routes/settingsRoutes';
import { notificationsRoutes } from './routes/notificationsRoutes';
import { securityRoutes } from './routes/securityRoutes';
import { privacyRoutes } from './routes/privacyRoutes';
import { auditRoutes } from './routes/auditRoutes';
import { accessibilityRoutes } from './routes/accessibilityRoutes';
import { innovationRoutes } from './routes/innovationRoutes';
import { feedbackRoutes } from './routes/feedbackRoutes';

// Routes d'accès et de diagnostic
import { accessRoutes } from './routes/accessRoutes';

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
        <AppProviders>
          <Shell />
        </AppProviders>
      </Suspense>
    ),
    errorElement: <NotFoundPage />,
    children: [
      // Routes publiques
      { index: true, element: <HomePage /> },
      { path: 'choose-mode', element: <ChooseModePage /> },
      { path: 'b2b/selection', element: <B2BSelectionPage /> },
      
      // Routes d'authentification
      ...authRoutes,
      
      // Routes B2C
      ...b2cRoutes,
      
      // Routes B2B User
      ...b2bUserRoutes,
      
      // Routes B2B Admin
      ...b2bAdminRoutes,
      
      // Routes de fonctionnalités communes
      ...scanRoutes,
      ...musicRoutes,
      ...coachRoutes,
      ...journalRoutes,
      ...vrRoutes,
      ...preferencesRoutes,
      ...gamificationRoutes,
      ...socialCoconRoutes,
      
      // Routes admin uniquement
      ...teamsRoutes,
      ...reportsRoutes,
      ...eventsRoutes,
      ...optimisationRoutes,
      ...settingsRoutes,
      ...notificationsRoutes,
      ...securityRoutes,
      ...privacyRoutes,
      ...auditRoutes,
      ...accessibilityRoutes,
      ...innovationRoutes,
      ...feedbackRoutes,
      
      // Routes de diagnostic et d'accès
      ...accessRoutes,
      
      // Catch-all pour les routes non trouvées
      { path: '*', element: <NotFoundPage /> }
    ],
  },
]);

export const routes = router.routes;
