// ==========================================
// REBOOT COMPLET - ZÉRO DÉPENDANCES PROJET
// ==========================================

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import CSS direct
import './index.css';

console.log('✅ main.reboot.tsx loaded');

// ==========================================
// QUERY CLIENT
// ==========================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// ==========================================
// PAGES INLINE (ZERO LAZY IMPORT)
// ==========================================

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-8">✅ EmotionsCare REBOOT</h1>
        <p className="text-2xl mb-8">L'application se charge correctement!</p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/login" className="block p-6 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <h2 className="text-2xl font-bold mb-2">🔑 Login</h2>
            <p>Se connecter à votre compte</p>
          </Link>
          
          <Link to="/dashboard" className="block p-6 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <h2 className="text-2xl font-bold mb-2">📊 Dashboard</h2>
            <p>Accéder au tableau de bord</p>
          </Link>
        </div>

        <div className="bg-white/10 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">📋 Tests à effectuer:</h3>
          <ul className="space-y-2">
            <li>✅ React se charge</li>
            <li>✅ Router fonctionne</li>
            <li>✅ Tailwind appliqué</li>
            <li>⏳ Providers à ajouter progressivement</li>
            <li>⏳ Pages métier à réintégrer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔑 Login</h1>
        <div className="bg-white/10 p-6 rounded-lg">
          <p className="mb-4">Page de login fonctionnelle</p>
          <Link to="/" className="block w-full py-3 px-4 bg-white text-purple-600 rounded-lg font-bold text-center hover:bg-gray-100 transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-500 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📊 Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">42</h3>
            <p>Scans effectués</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">18</h3>
            <p>Sessions musique</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">95%</h3>
            <p>Score bien-être</p>
          </div>
        </div>
        <Link to="/" className="inline-block py-3 px-6 bg-white text-teal-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-500 text-white p-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-8">Page introuvable</p>
        <Link to="/" className="inline-block py-3 px-6 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

// ==========================================
// ROUTER
// ==========================================

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// ==========================================
// RENDER
// ==========================================

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root element not found');
  throw new Error('Root element not found');
}

console.log('✅ Rendering app...');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);

console.log('✅ App rendered successfully');
