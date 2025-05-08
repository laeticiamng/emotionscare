
import React, { memo, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import GlobalNav from "./GlobalNav";
import { Toaster } from "./ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./ui/sidebar";
import useDrawerState from "@/hooks/useDrawerState";
// Import MusicDrawer directly to ensure it's properly loaded
import MusicDrawer from "./music/player/MusicDrawer";
import useLogger from "@/hooks/useLogger";

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
      
      {/* Music Player Drawer - Using React.Suspense with a proper fallback */}
      <React.Suspense fallback={<div className="hidden">Loading...</div>}>
        {isDrawerOpen && (
          <MusicDrawer 
            open={isDrawerOpen} 
            onClose={closeDrawer} 
          />
        )}
      </React.Suspense>
    </div>
  );
};

// Export named component and default export for flexibility
export { Shell };
export default memo(Shell);
