import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { NavigationHelper } from '@/config/navigation';
import { Sidebar } from '@/components/navigation/Sidebar';
import { TopBar } from '@/components/navigation/TopBar';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { StatusIndicator } from '@/components/common/StatusIndicator';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal de l'application
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Récupérer les informations de la page courante
  const currentItem = NavigationHelper.findByPath(location.pathname);
  const breadcrumb = NavigationHelper.generateBreadcrumb(location.pathname);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={handleSidebarToggle}
      />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barre de navigation supérieure */}
        <TopBar 
          currentItem={currentItem}
          onSidebarToggle={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Zone de contenu avec breadcrumb */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb */}
          {breadcrumb.length > 1 && (
            <div className="px-6 py-2 border-b border-border">
              <Breadcrumb items={breadcrumb} />
            </div>
          )}

          {/* Contenu principal avec animations */}
          <main className={cn(
            "flex-1 overflow-auto relative",
            "transition-all duration-300 ease-in-out"
          )}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>

            {/* Indicateur de statut global */}
            <StatusIndicator />
          </main>
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default MainLayout;