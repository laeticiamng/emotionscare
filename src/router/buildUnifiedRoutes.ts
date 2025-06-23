
import { RouteObject } from 'react-router-dom';
import { publicRoutes } from './routes/publicRoutes';
import { userRoutes } from './routes/userRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { scanRoutes } from './routes/scanRoutes';
import { musicRoutes } from './routes/musicRoutes';
import { vrRoutes } from './routes/vrRoutes';
import { gamificationRoutes } from './routes/gamificationRoutes';
import { b2bRoutes } from './routes/b2bRoutes';
import { onboardingRoutes } from './routes/onboardingRoutes';
import { securityRoutes } from './routes/securityRoutes';
import { accessRoutes } from './routes/accessRoutes';
import { reportsRoutes } from './routes/reportsRoutes';
import { feedbackRoutes } from './routes/feedbackRoutes';
import { innovationRoutes } from './routes/innovationRoutes';
import { privacyRoutes } from './routes/privacyRoutes';
import { notificationRoutes } from './routes/notificationRoutes';
import { auditRoutes } from './routes/auditRoutes';
import { accessibilityRoutes } from './routes/accessibilityRoutes';

// Import direct des pages principales pour éviter les problèmes de lazy loading
import HomePage from '@/pages/HomePage';
import TestPage from '@/pages/TestPage';
import Point20Page from '@/pages/Point20Page';

// Page 404 par défaut
const NotFoundPage = () => (
  <div data-testid="page-root" className="min-h-screen bg-yellow-500 text-black p-8 text-center">
    <h1 className="text-4xl font-bold mb-4">404 - Page introuvable</h1>
    <p className="mb-4">La page que vous recherchez n'existe pas ou a été déplacée.</p>
    <div className="space-x-4">
      <a href="/" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100">
        Retour à l'accueil
      </a>
    </div>
  </div>
);

/**
 * Construit un tableau unifié de toutes les routes de l'application
 * Fusionne tous les modules de routes et ajoute la route 404
 */
export function buildUnifiedRoutes(): RouteObject[] {
  console.log('🔧 Building unified routes...');
  
  const allRoutes: RouteObject[] = [
    // Routes principales en direct (sans lazy loading pour debug)
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/test',
      element: <TestPage />,
    },
    {
      path: '/point20',
      element: <Point20Page />,
    },
    
    // Routes publiques (/, /about, /contact, etc.)
    ...publicRoutes,
    
    // Routes utilisateur (B2C/B2B login, dashboard, etc.)
    ...userRoutes,
    
    // Routes admin
    ...adminRoutes,
    
    // Routes fonctionnelles
    ...scanRoutes,
    ...musicRoutes,
    ...vrRoutes,
    ...gamificationRoutes,
    ...b2bRoutes,
    ...onboardingRoutes,
    ...securityRoutes,
    ...accessRoutes,
    ...reportsRoutes,
    ...feedbackRoutes,
    ...innovationRoutes,
    ...privacyRoutes,
    ...notificationRoutes,
    ...auditRoutes,
    ...accessibilityRoutes,
    
    // Route 404 (doit être en dernier)
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ];

  // Vérification des doublons
  const paths = allRoutes.map(route => route.path).filter(Boolean);
  const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);
  
  if (duplicates.length > 0) {
    console.error('🚨 Routes dupliquées détectées:', duplicates);
  }
  
  console.log(`✅ ${allRoutes.length} routes configurées`);
  console.log('📋 Routes détectées:', paths.slice(0, 10), '...');
  
  return allRoutes;
}
