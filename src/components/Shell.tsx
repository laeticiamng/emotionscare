
import React, { memo, ReactNode, useState } from "react";
import { Outlet } from "react-router-dom";
import GlobalNav from "./GlobalNav";
import { Toaster } from "./ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./ui/sidebar";
import useLogger from "@/hooks/useLogger";
import MusicDrawer from "./music/player/MusicDrawer"; // Import du composant MusicDrawer depuis le bon chemin
import useDrawerState from "@/hooks/useDrawerState";

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
      
      {/* Système de notifications toast */}
      <Toaster />
      
      {/* Music Player Drawer - accessible from anywhere */}
      <MusicDrawer open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

// Export named component and default export for flexibility
export { Shell };
export default memo(Shell);
