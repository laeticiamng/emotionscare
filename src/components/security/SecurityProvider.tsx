
import React, { useEffect } from 'react';
import { applyCSP } from '@/lib/security/csp';
import { applySecurityMeta } from '@/lib/security/headers';

interface SecurityProviderProps {
  children: React.ReactNode;
}

/**
 * Security provider component that applies security headers and CSP
 */
export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  useEffect(() => {
    // Apply security headers and CSP on mount
    applySecurityMeta();
    applyCSP();

    // Log security initialization in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Security] Security headers and CSP applied');
    }
  }, []);

  return <>{children}</>;
};

export default SecurityProvider;
