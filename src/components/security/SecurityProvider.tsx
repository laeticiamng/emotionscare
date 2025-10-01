// @ts-nocheck

import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { useSecurity } from '@/hooks/useSecurity';

interface SecurityContextType {
  logAccess: (page: string, success: boolean, reason?: string) => void;
  exportSecurityData: () => Promise<void>;
  requestDataDeletion: () => Promise<void>;
  updateSecurityPreferences: (preferences: Record<string, boolean>) => Promise<void>;
  metrics: {
    securityScore: number;
    lastLogin: string;
    eventsCount: number;
    complianceLevel: 'high' | 'medium' | 'low';
  };
  accessHistory: Array<{
    page: string;
    timestamp: string;
    success: boolean;
    userRole: string;
    reason?: string;
  }>;
  loading: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const security = useSecurity();
  
  // Safe useLocation hook
  let location;
  try {
    location = useLocation();
  } catch (error) {
    // Si useLocation échoue, on utilise window.location
    location = { pathname: window.location.pathname };
  }

  // Enregistrer automatiquement les accès aux pages
  useEffect(() => {
    if (isAuthenticated && user) {
      security.logAccess(location.pathname, true);
    }
  }, [location.pathname, isAuthenticated, user]);

  // Enregistrer les tentatives d'accès refusées
  useEffect(() => {
    const handleUnauthorizedAccess = (event: CustomEvent) => {
      security.logAccess(
        event.detail.page,
        false,
        event.detail.reason
      );
    };

    window.addEventListener('unauthorized-access', handleUnauthorizedAccess as EventListener);
    
    return () => {
      window.removeEventListener('unauthorized-access', handleUnauthorizedAccess as EventListener);
    };
  }, []);

  return (
    <SecurityContext.Provider value={security}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

export default SecurityProvider;
