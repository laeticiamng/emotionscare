// @ts-nocheck
import React from 'react';
import { useAuthStore } from '@/store';

const AuthDebug: React.FC = () => {
  const { user, session, isAuthenticated, isLoading } = useAuthStore();

  // N'afficher qu'en développement
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50 max-w-sm">
      <div className="font-semibold mb-2">🔐 Auth Debug</div>
      <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      <div>Loading: {isLoading ? '⏳' : '✅'}</div>
      <div>User ID: {user?.id?.slice(0, 8) || 'None'}</div>
      <div>Session: {session ? '✅' : '❌'}</div>
      {session?.expires_at && (
        <div>
          Expires: {new Date(session.expires_at * 1000).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default AuthDebug;
