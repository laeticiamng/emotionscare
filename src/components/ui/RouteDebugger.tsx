
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const RouteDebugger: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-2 right-2 bg-slate-800 text-white p-4 rounded-md text-xs opacity-70 hover:opacity-100 transition-opacity z-50">
      <h4 className="font-bold mb-1">Route Debugger</h4>
      <p>Path: {location.pathname}</p>
      <p>Auth: {isLoading ? "Loading..." : isAuthenticated ? "Authentifié" : "Non authentifié"}</p>
      {user && <p>Rôle: {user.role}</p>}
    </div>
  );
};

export default RouteDebugger;
