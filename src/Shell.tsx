
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MainNavbar from './components/navigation/MainNavbar';
import MainFooter from './components/navigation/MainFooter';
import MusicMiniPlayer from './components/music/MusicMiniPlayer';
import MusicDrawer from './components/music/player/MusicDrawer';
import { useMusic } from './contexts/music';
import { useTheme } from './contexts/ThemeContext';
import ScrollProgress from './components/ui/ScrollProgress';
import { ShellProps } from '@/types/layout';

const Shell: React.FC<ShellProps> = ({ 
  children, 
  hideNav = false,
  hideFooter = false,
  immersive = false,
  className = "" 
}) => {
  const { openDrawer, toggleDrawer, playlist, currentTrack } = useMusic();
  const { theme, reduceMotion } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <div className={`flex flex-col min-h-screen bg-background transition-colors duration-300 ${className} ${theme}`}>
      {/* Gradient background effect */}
      <div className={`fixed inset-0 -z-10 pointer-events-none transition-opacity duration-500 ${
        theme === 'light' 
          ? 'bg-gradient-to-b from-blue-50/50 to-white' 
          : theme === 'dark' 
            ? 'bg-gradient-to-b from-gray-900 to-black/80' 
            : 'bg-gradient-to-b from-blue-100/50 to-blue-50/30'
      }`} />

      {/* Immersive floating particles (optional) */}
      {immersive && !reduceMotion && (
        <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full ${
                  theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
                }`}
                style={{
                  width: Math.random() * 8 + 4,
                  height: Math.random() * 8 + 4,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Header/Navbar */}
      {!hideNav && (
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`sticky top-0 z-50 w-full transition-all duration-300 ${
            scrolled
              ? 'bg-background/80 backdrop-blur-lg shadow-sm'
              : 'bg-transparent'
          }`}
        >
          <MainNavbar />
        </motion.header>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children || <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Music Mini Player */}
      <div className="fixed bottom-4 right-4 z-50">
        <MusicMiniPlayer />
      </div>

      {/* Music Drawer */}
      <MusicDrawer
        open={openDrawer}
        onClose={toggleDrawer}
        onOpenChange={(open) => {
          if (!open) toggleDrawer();
        }}
        playlist={playlist || undefined}
        currentTrack={currentTrack || undefined}
      />

      {/* Footer */}
      {!hideFooter && (
        <motion.footer
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <MainFooter />
        </motion.footer>
      )}
    </div>
  );
};

export default Shell;
