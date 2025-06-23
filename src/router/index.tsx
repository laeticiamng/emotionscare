
import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import Shell from '@/Shell';
import Home from '@/Home';

// Import des pages qui fonctionnent
const Point20Page = lazy(() => import('@/pages/Point20Page'));

// Page de test simple
const TestPage = () => (
  <div data-testid="page-root" className="min-h-screen bg-red-500 text-white p-8">
    <h1 className="text-4xl font-bold">PAGE TEST - ROUGE VISIBLE</h1>
    <p>Si vous voyez cette page rouge, le routage fonctionne !</p>
    <a href="/" className="text-yellow-300 underline">Retour accueil</a>
  </div>
);

// Page 404
const NotFoundPage = () => (
  <div data-testid="page-root" className="min-h-screen bg-yellow-500 text-black p-8 text-center">
    <h1 className="text-4xl font-bold mb-4">404 - Page introuvable</h1>
    <p className="mb-4">La page que vous recherchez n'existe pas ou a été déplacée.</p>
    <div className="space-x-4">
      <a href="/" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100">
        Retour à l'accueil
      </a>
      <a href="/point20" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Voir Point 20 (qui fonctionne)
      </a>
    </div>
  </div>
);

console.log('🔧 Configuration du router...');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'test',
        element: <TestPage />,
      },
      {
        path: 'point20',
        element: <Point20Page />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

console.log('✅ Router configuré avec routes:', router.routes);
