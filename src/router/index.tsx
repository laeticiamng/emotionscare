
import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import Home from '@/Home';

// Import des pages qui fonctionnent
const Point20Page = lazy(() => import('@/pages/Point20Page'));

// Page de test simple - SANS Shell pour tester
const TestPage = () => (
  <div data-testid="page-root" className="min-h-screen bg-red-500 text-white p-8">
    <h1 className="text-4xl font-bold">PAGE TEST - ROUGE VISIBLE</h1>
    <p>Si vous voyez cette page rouge, le routage fonctionne !</p>
    <a href="/" className="text-yellow-300 underline">Retour accueil</a>
  </div>
);

// Page d'accueil simple - SANS Shell pour tester
const SimpleHome = () => (
  <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8 text-white">EmotionsCare</h1>
        <p className="text-2xl mb-8 text-blue-100">
          ACCUEIL SIMPLIFIÉ - TEST DE FONCTIONNEMENT
        </p>
        
        <div className="bg-green-500/20 border border-green-400 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-green-300">✅ Page d'accueil SIMPLE</h2>
          <p className="text-lg text-blue-100">
            Si vous voyez ce contenu, la page d'accueil fonctionne maintenant !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-green-400">🏠 Accueil</h3>
            <p className="text-blue-100">Vous êtes ici - page fonctionnelle</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-red-400">🧪 Test</h3>
            <a href="/test" className="text-yellow-300 underline hover:text-yellow-100">
              Aller à la page test
            </a>
          </div>
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">📊 Point 20</h3>
            <a href="/point20" className="text-yellow-300 underline hover:text-yellow-100">
              Aller au Point 20 (fonctionne)
            </a>
          </div>
        </div>
      </div>
    </div>
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

console.log('🔧 Configuration du router SIMPLIFIÉE...');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SimpleHome />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
  {
    path: '/point20',
    element: <Point20Page />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

console.log('✅ Router configuré avec routes DIRECTES:', router.routes);
