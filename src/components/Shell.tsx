
import React, { memo, ReactNode, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import GlobalNav from "./GlobalNav";
import { Toaster } from "./ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./ui/sidebar";
import useLogger from "@/hooks/useLogger";
import useDrawerState from "@/hooks/useDrawerState";

// Type pour notre composant MusicDrawer
type MusicDrawerComponent = React.ComponentType<{
  open: boolean;
  onClose: () => void;
}>;

interface ShellProps {
  children?: ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const logger = useLogger('Shell');
  const { isDrawerOpen, closeDrawer, openDrawer, toggleDrawer } = useDrawerState();
  
  // État pour stocker le composant chargé dynamiquement
  const [MusicDrawerComponent, setMusicDrawerComponent] = useState<MusicDrawerComponent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Charger le composant MusicDrawer dynamiquement
  useEffect(() => {
    logger.debug('Loading MusicDrawer component...');
    
    // Utilisation de l'import dynamique avec un typage plus flexible
    import('./music/player/MusicDrawer')
      .then((module: any) => {
        // Essayer d'obtenir soit l'export par défaut soit l'export nommé
        const Component = module.default || module.MusicDrawer;
        
        if (Component && (typeof Component === 'function' || typeof Component.render === 'function')) {
          logger.debug('MusicDrawer component loaded successfully');
          setMusicDrawerComponent(() => Component);
          setLoadError(null);
        } else {
          const errorMsg = 'MusicDrawer import is not a valid React component';
          logger.error(errorMsg, module);
          console.error('❌ ' + errorMsg, module);
          setLoadError(errorMsg);
        }
      })
      .catch(error => {
        const errorMsg = 'Failed to load MusicDrawer component';
        logger.error(errorMsg, error);
        console.error('❌ ' + errorMsg, error);
        setLoadError(errorMsg);
      });
  }, [logger]);
  
  const handleCloseDrawer = () => {
    logger.debug('Closing music drawer');
    closeDrawer();
  };
  
  logger.debug('Rendering shell component', { data: { isMobile, isDrawerOpen } });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation globale avec logo */}
      <GlobalNav />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar sur les écrans non-mobiles */}
        {!isMobile && <Sidebar />}
        
        {/* Contenu principal */}
        <main className="flex-1 w-full">
          <div className="container max-w-[1400px] px-4 py-6 md:px-6 lg:px-8">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      {/* Music Player Button */}
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        onClick={openDrawer}
        aria-label="Open Music Player"
      >
        🎵
      </button>
      
      {/* Système de notifications toast */}
      <Toaster />
      
      {/* Music Player Drawer - render only if component was successfully loaded */}
      {MusicDrawerComponent && isDrawerOpen && (
        <MusicDrawerComponent open={isDrawerOpen} onClose={handleCloseDrawer} />
      )}
      
      {/* Error message if component failed to load */}
      {loadError && isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-destructive">Erreur de chargement</h3>
            <p className="mt-2 text-muted-foreground">{loadError}</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={closeDrawer}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Export named component and default export for flexibility
export { Shell };
export default memo(Shell);
