import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const RouteDebugger: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Ne s'affiche que en développement
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-2 right-2 bg-slate-800 text-white p-3 rounded-md text-xs opacity-80 hover:opacity-100 transition-opacity z-50 max-w-xs">
      <h4 className="font-bold mb-2 text-green-400">🔧 Dev Mode</h4>
      <div className="space-y-1">
        <p><span className="text-gray-400">Route:</span> {location.pathname}</p>
        <p><span className="text-gray-400">Auth:</span> {
          isLoading ? "⏳ Loading..." : 
          isAuthenticated ? "✅ Authentifié" : "❌ Non authentifié"
        }</p>
        {user && <p><span className="text-gray-400">Rôle:</span> {user.role}</p>}
      </div>
    </div>
  );
};

export default RouteDebugger;
