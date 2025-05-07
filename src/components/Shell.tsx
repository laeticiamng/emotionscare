
import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import GlobalNav from "./GlobalNav";
import { Toaster } from "./ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./ui/sidebar";
import useLogger from "@/hooks/useLogger";

export const Shell: React.FC = () => {
  const isMobile = useIsMobile();
  const logger = useLogger('Shell');
  
  logger.debug('Rendering shell component', { isMobile });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation globale */}
      <GlobalNav />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar sur les écrans non-mobiles */}
        {!isMobile && <Sidebar />}
        
        {/* Contenu principal */}
        <main className="flex-1 w-full">
          <div className="container max-w-[1400px] px-4 py-6 md:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Système de notifications toast */}
      <Toaster />
    </div>
  );
};

// Optimisation avec memo pour éviter les re-rendus inutiles
export default memo(Shell);
