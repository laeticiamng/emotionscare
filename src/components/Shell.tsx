
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavbar from './navigation/MainNavbar';
import MainFooter from './navigation/MainFooter';
import { useTheme } from '@/contexts/ThemeContext';
import AudioControls from './audio/AudioControls';

interface ShellProps {
  children?: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  className?: string;
  immersive?: boolean;
}

const Shell: React.FC<ShellProps> = ({ 
  children, 
  hideNav = false, 
  hideFooter = false,
  className = "",
  immersive = false
}) => {
  const { theme, soundEnabled = false, reduceMotion = false } = useTheme();
  
  return (
    <div className={`flex flex-col min-h-screen ${className} ${theme}`}>
      {/* Fond animé pour les pages immersives */}
      {immersive && !reduceMotion && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-indigo-900"></div>
      )}
      
      {/* Arrière-plan adaptatif selon le thème */}
      <div className={`absolute inset-0 -z-20 transition-colors duration-500 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-white to-blue-50/30' 
          : theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 to-blue-950' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100'
      }`} />
      
      {/* Navigation */}
      {!hideNav && <MainNavbar />}

      {/* Contenu principal */}
      <main className="flex-1 relative z-0">
        {children || <Outlet />}
      </main>

      {/* Contrôles audio (si activé) */}
      {soundEnabled && !hideFooter && (
        <div className="fixed bottom-4 right-4 z-50">
          <AudioControls minimal />
        </div>
      )}

      {/* Footer */}
      {!hideFooter && <MainFooter />}
    </div>
  );
};

export default Shell;
