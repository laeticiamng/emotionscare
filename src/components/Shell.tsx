
import React, { memo, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import GlobalNav from "./GlobalNav";
import { Toaster } from "./ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./ui/sidebar";
import useDrawerState from "@/hooks/useDrawerState";
import useLogger from "@/hooks/useLogger";
// Conservons l'import direct pour éviter les problèmes circulaires
import MusicDrawer from "./music/player/MusicDrawer";

interface ShellProps {
  children?: ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const logger = useLogger('Shell');
  const { isDrawerOpen, closeDrawer, openDrawer } = useDrawerState();
  
  logger.debug('Rendering shell component', { data: { isMobile, isDrawerOpen } });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global navigation with logo */}
      <GlobalNav />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar on non-mobile screens */}
        {!isMobile && <Sidebar />}
        
        {/* Main content */}
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
        type="button"
      >
        🎵
      </button>
      
      {/* Toast notification system */}
      <Toaster />
      
      {/* STUB de test - Remplacer temporairement MusicDrawer pour isoler le problème */}
      {isDrawerOpen && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', color: 'black', padding: 20, zIndex: 50, border: '2px solid red' }}>
          ✔ Le tiroir s'ouvre (stub) ! Cela prouve que useDrawerState fonctionne correctement.
        </div>
      )}
      
      {/* Commenté temporairement pour le test
      {isDrawerOpen && <MusicDrawer open={isDrawerOpen} onClose={closeDrawer} />}
      */}
    </div>
  );
};

// Export named component and default export for flexibility
export { Shell };
export default memo(Shell);
