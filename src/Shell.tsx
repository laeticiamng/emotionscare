
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface ShellProps {
  children: ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Pour la page d'accueil immersive, n'appliquons pas de conteneur ou de styles supplémentaires
  if (isHomePage) {
    return <>{children}</>;
  }

  // Pour les autres pages, conservons le Shell existant
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

export default Shell;
