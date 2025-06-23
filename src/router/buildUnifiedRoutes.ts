
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

// IMPORTS DIRECTS - PAS DE LAZY LOADING pour éviter les problèmes de chunk
import HomePage from '@/pages/HomePage';
import TestPage from '@/pages/TestPage';
import Point20Page from '@/pages/Point20Page';

console.log('%c[Router] Building unified routes with DIRECT imports', 'color:purple; font-weight:bold');

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
 * STRUCTURE CORRIGÉE : index route en premier, wildcard en dernier
 */
export function buildUnifiedRoutes(): RouteObject[] {
  console.log('%c[Router] Building routes with proper index structure...', 'color:blue');
  
  // Récupérer toutes les routes modulaires SAUF celles déjà définies comme principales
  const allModularRoutes = [
    ...publicRoutes,
    ...userRoutes,
    ...adminRoutes,
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
  ];

  // Filtrer les doublons avec les routes principales
  const reservedPaths = ['/', '/test', '/point20'];
  const filteredModularRoutes = allModularRoutes.filter(route => 
    !reservedPaths.includes(route.path as string) && route.path !== '/'
  );

  // STRUCTURE CORRIGÉE : Une seule route racine avec children
  const allRoutes: RouteObject[] = [
    // ROUTE INDEX EN PREMIER - IMPORT DIRECT
    {
      index: true,
      element: <HomePage />,
    },
    
    // ROUTES PRINCIPALES - IMPORTS DIRECTS
    {
      path: 'test',
      element: <TestPage />,
    },
    {
      path: 'point20',
      element: <Point20Page />,
    },
    
    // ROUTES MODULAIRES
    ...filteredModularRoutes,
    
    // WILDCARD EN DERNIER - TOUJOURS
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ];

  // Vérification des doublons (debug)
  const paths = allRoutes.map(route => route.path || (route.index ? 'index' : 'unknown')).filter(Boolean);
  const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);
  
  if (duplicates.length > 0) {
    console.error('%c[Router] DOUBLONS DÉTECTÉS:', 'color:red; font-weight:bold', duplicates);
  } else {
    console.log('%c[Router] ✅ Aucun doublon détecté', 'color:green');
  }
  
  console.log(`%c[Router] ✅ ${allRoutes.length} routes configurées`, 'color:green; font-weight:bold');
  console.log('%c[Router] Routes principales:', 'color:blue', ['index (HomePage)', '/test', '/point20']);
  
  return allRoutes;
}
