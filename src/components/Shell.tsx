
import React, { memo, ReactNode, Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import GlobalNav from "./GlobalNav";
import { Toaster } from "./ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./ui/sidebar";
import useLogger from "@/hooks/useLogger";
import useDrawerState from "@/hooks/useDrawerState";

// Type definition for our drawer component
type DrawerComponentType = React.ComponentType<{
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
  
  // State to hold the dynamically loaded MusicDrawer component
  const [MusicDrawerComponent, setMusicDrawerComponent] = useState<DrawerComponentType | null>(null);
  
  // Load the MusicDrawer component dynamically
  useEffect(() => {
    import('./music/player/MusicDrawer')
      .then(module => {
        // Try to get either default export or named export
        const Component = module.default || module.MusicDrawer;
        
        if (Component && (typeof Component === 'function' || typeof Component.render === 'function')) {
          logger.debug('MusicDrawer component loaded successfully');
          setMusicDrawerComponent(() => Component);
        } else {
          logger.error('MusicDrawer import is not a valid React component:', module);
          console.error('❌ MusicDrawer import is not a valid React component:', module);
        }
      })
      .catch(error => {
        logger.error('Failed to load MusicDrawer component:', error);
        console.error('❌ Failed to load MusicDrawer component:', error);
      });
  }, [logger]);
  
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
        <MusicDrawerComponent open={isDrawerOpen} onClose={closeDrawer} />
      )}
    </div>
  );
};

// Export named component and default export for flexibility
export { Shell };
export default memo(Shell);
