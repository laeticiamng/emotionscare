
import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useTheme } from '@/hooks/use-theme';
import useSound from '@/hooks/use-sound';
import PremiumContent from '@/components/immersive/PremiumContent';
import ImmersiveControls from '@/components/immersive/ImmersiveControls';
import PageTransition from '@/components/transitions/PageTransition';
import { Button } from '@/components/ui/button';
import '../styles/immersive-home.css';
import { useState, useRef } from 'react';

// Sound imports
import hoverSfx from '/sounds/hover.mp3';
import clickSfx from '/sounds/click.mp3';

const ImmersiveHome: React.FC = () => {
  // Context and state
  const { theme, setTheme } = useTheme();
  const { language } = usePreferences();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Sound effects
  const [playHover] = useSound(hoverSfx, { volume: 0.5, soundEnabled });
  const [playClick] = useSound(clickSfx, { volume: 0.4, soundEnabled });

  // Motion values for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smoother movement
  const springConfig = { damping: 25, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transform values for parallax layers - these functions replaced the pipe method
  const moveBackground = useTransform(springY, [-100, 100], [5, -5]);
  const moveMiddleground = useTransform(springX, [-100, 100], [10, -10]);
  const moveForeground = useTransform(springX, [-100, 100], [15, -15]);

  // Greeting message based on time of day & language
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (language === 'fr') {
      if (hour < 12) return "Bonjour et bienvenue sur EmotionsCare";
      if (hour < 18) return "Bon après-midi, bienvenue sur EmotionsCare";
      return "Bonsoir, bienvenue sur EmotionsCare";
    } else if (language === 'es') {
      if (hour < 12) return "Buenos días, bienvenido a EmotionsCare";
      if (hour < 18) return "Buenas tardes, bienvenido a EmotionsCare";
      return "Buenas noches, bienvenido a EmotionsCare";
    } else {
      if (hour < 12) return "Good morning, welcome to EmotionsCare";
      if (hour < 18) return "Good afternoon, welcome to EmotionsCare";
      return "Good evening, welcome to EmotionsCare";
    }
  };

  // Check first visit for onboarding
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedLanding');
    if (!hasVisitedBefore) {
      setShowOnboarding(true);
      localStorage.setItem('hasVisitedLanding', 'true');
    }

    // Initial check for sound preference
    const soundPref = localStorage.getItem('soundEnabled');
    if (soundPref === 'true') {
      setSoundEnabled(true);
    }

    // Mouse move handler for parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    if (isDesktop) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (isDesktop) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mouseX, mouseY, isDesktop]);

  // Toggle sound effects
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('soundEnabled', newState.toString());
    
    // Provide haptic feedback on mobile
    if (navigator.vibrate && newState) {
      navigator.vibrate(50);
    }
  };

  // Theme toggling
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <PageTransition>
      <div 
        ref={containerRef}
        className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 flex flex-col justify-center items-center"
      >
        {/* Background layers for parallax effect */}
        <motion.div 
          className="absolute inset-0 z-0 opacity-30"
          style={{ y: moveBackground }}
        >
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-300 dark:bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-2/3 right-1/6 w-80 h-80 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </motion.div>

        <motion.div 
          className="absolute inset-0 z-0 opacity-30"
          style={{ x: moveMiddleground }}
        >
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        </motion.div>

        <motion.div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ x: moveForeground }}
        >
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-cyan-200 dark:bg-cyan-800 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 w-full">
          <PremiumContent 
            greeting={getTimeBasedGreeting()}
            onHover={() => soundEnabled && playHover()}
            onClick={() => soundEnabled && playClick()}
          />
        </div>

        {/* Controls */}
        <div className="fixed bottom-6 right-6 z-20">
          <ImmersiveControls
            soundEnabled={soundEnabled} 
            onSoundToggle={toggleSound}
            onThemeToggle={toggleTheme}
          />
        </div>

        {/* Simple onboarding modal */}
        {showOnboarding && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring" }}
            >
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500">
                Bienvenue sur EmotionsCare
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Découvrez une nouvelle approche de la gestion émotionnelle, adaptée à vos besoins personnels ou professionnels.
              </p>
              <div className="flex justify-end">
                <Button 
                  onClick={() => {
                    setShowOnboarding(false);
                    if (soundEnabled) playClick();
                    if (navigator.vibrate) navigator.vibrate(50);
                  }}
                  className="mt-4"
                >
                  Commencer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default ImmersiveHome;
