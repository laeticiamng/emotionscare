
import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ShellProps {
  children: ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Ajouter des logs pour le débogage
  useEffect(() => {
    console.log('🏗️ Shell: Montage du Shell avec location:', location.pathname);
    console.log('🏠 Shell: Est-ce la page d\'accueil?', isHomePage);
  }, [location.pathname, isHomePage]);

  // Pour la page d'accueil immersive, n'appliquons pas de conteneur ou de styles supplémentaires
  if (isHomePage) {
    return (
      <>
        <div className="debug-indicator" style={{ position: 'fixed', top: 0, left: 0, padding: '2px 5px', background: 'rgba(0,0,0,0.1)', fontSize: '10px', zIndex: 9999, display: 'none' }}>
          Shell: HomePage
        </div>
        {children}
      </>
    );
  }

  // Pour les autres pages, conservons le Shell existant
  return (
    <div className="min-h-screen bg-background">
      <div className="debug-indicator" style={{ position: 'fixed', top: 0, left: 0, padding: '2px 5px', background: 'rgba(0,0,0,0.1)', fontSize: '10px', zIndex: 9999, display: 'none' }}>
        Shell: Standard
      </div>
      {children}
    </div>
  );
};

export default Shell;
