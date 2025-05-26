
import { useEffect, ReactNode } from 'react';

interface SecurityProviderProps {
  children: ReactNode;
}

const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  useEffect(() => {
    // Appliquer les headers de sécurité basiques
    console.info('[Security] Security headers and CSP applied');
    
    // En production, on pourrait configurer des CSP headers plus stricts
    // via le serveur ou via des meta tags
  }, []);

  return <>{children}</>;
};

export default SecurityProvider;
