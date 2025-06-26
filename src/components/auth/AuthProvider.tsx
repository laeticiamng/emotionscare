
import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Initialiser l'authentification au démarrage
    initialize().catch(error => {
      console.error('❌ Failed to initialize auth:', error);
    });
  }, [initialize]);

  return <>{children}</>;
};

export default AuthProvider;
