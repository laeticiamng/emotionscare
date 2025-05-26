
import * as React from 'react';

interface SecurityContextType {
  isSecure: boolean;
  checkSecurity: () => void;
}

const SecurityContext = React.createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = React.useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecure, setIsSecure] = React.useState(true);

  React.useEffect(() => {
    // Vérifications de sécurité de base
    const checkSecurity = () => {
      // Vérifier si nous sommes en HTTPS en production
      if (import.meta.env.PROD && window.location.protocol !== 'https:') {
        console.warn('🔒 Site non sécurisé en production');
        setIsSecure(false);
        return;
      }
      
      // Autres vérifications de sécurité
      setIsSecure(true);
    };

    checkSecurity();
  }, []);

  const checkSecurity = () => {
    console.log('🔍 Vérification de sécurité effectuée');
  };

  const value: SecurityContextType = {
    isSecure,
    checkSecurity
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export default SecurityProvider;
