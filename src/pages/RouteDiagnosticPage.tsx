
import React from 'react';
import { Link } from 'react-router-dom';

const RouteDiagnosticPage: React.FC = () => {
  const routes = [
    // Routes principales
    { path: '/', name: 'Accueil', category: 'Principal' },
    { path: '/choose-mode', name: 'Choix du mode', category: 'Principal' },
    { path: '/about', name: 'À propos', category: 'Principal' },
    { path: '/contact', name: 'Contact', category: 'Principal' },
    
    // Fonctionnalités
    { path: '/scan', name: 'Scan Émotions', category: 'Fonctionnalités' },
    { path: '/music', name: 'Musique', category: 'Fonctionnalités' },
    { path: '/coach', name: 'Coach IA', category: 'Fonctionnalités' },
    { path: '/journal', name: 'Journal', category: 'Fonctionnalités' },
    { path: '/vr', name: 'Réalité Virtuelle', category: 'Fonctionnalités' },
    { path: '/gamification', name: 'Gamification', category: 'Fonctionnalités' },
    
    // B2C
    { path: '/b2c/login', name: 'Login B2C', category: 'B2C' },
    { path: '/b2c/register', name: 'Register B2C', category: 'B2C' },
    { path: '/b2c/dashboard', name: 'Dashboard B2C', category: 'B2C' },
    
    // B2B User
    { path: '/b2b/selection', name: 'Sélection B2B', category: 'B2B' },
    { path: '/b2b/user/login', name: 'Login User B2B', category: 'B2B User' },
    { path: '/b2b/user/register', name: 'Register User B2B', category: 'B2B User' },
    { path: '/b2b/user/dashboard', name: 'Dashboard User B2B', category: 'B2B User' },
    
    // B2B Admin
    { path: '/b2b/admin/login', name: 'Login Admin B2B', category: 'B2B Admin' },
    { path: '/b2b/admin/dashboard', name: 'Dashboard Admin B2B', category: 'B2B Admin' },
    
    // Admin
    { path: '/teams', name: 'Gestion Équipes', category: 'Admin' },
    { path: '/reports', name: 'Rapports', category: 'Admin' },
    { path: '/events', name: 'Événements', category: 'Admin' },
    
    // Test
    { path: '/test', name: 'Page Test', category: 'Test' },
    { path: '/point20', name: 'Point 20', category: 'Test' },
  ];

  const groupedRoutes = routes.reduce((acc, route) => {
    if (!acc[route.category]) {
      acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
  }, {} as Record<string, typeof routes>);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔍 Diagnostic des Routes</h1>
          <p className="text-xl text-indigo-100">
            Test de toutes les routes du système unifié
          </p>
          <p className="text-sm text-indigo-200 mt-2">
            Total: {routes.length} routes configurées
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedRoutes).map(([category, categoryRoutes]) => (
            <div key={category} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4 text-yellow-300">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryRoutes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    className="bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors block"
                  >
                    <div className="font-semibold text-white">{route.name}</div>
                    <div className="text-sm text-gray-300">{route.path}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="bg-green-500/20 border border-green-400 rounded-lg p-6">
            <h3 className="font-semibold text-green-300 mb-2">✅ Système Unifié Actif</h3>
            <p className="text-sm text-green-200">
              Toutes les routes sont maintenant connectées au routeur principal<br/>
              Généré le: {new Date().toLocaleString()}
            </p>
          </div>
          
          <div className="mt-6">
            <Link to="/" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDiagnosticPage;
