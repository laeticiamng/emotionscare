
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WelcomeMessage from '@/components/home/WelcomeMessage';
import { logModeSelection } from '@/utils/modeSelectionLogger';
import '../styles/immersive-home.css';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark' | 'pastel'>('light');
  const [isLoaded, setIsLoaded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Determine time of day for adaptive theming and content
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };
  
  const timeOfDay = getTimeOfDay();
  
  // Effect for initial animation sequence
  useEffect(() => {
    // Detect user's preferred color scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    // Stagger the animations for a premium feel
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Effect to toggle audio when enabled
  useEffect(() => {
    if (audioEnabled && audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch(e => console.log('Audio autoplay prevented:', e));
    }
  }, [audioEnabled]);
  
  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
  };
  
  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'pastel';
      return 'light';
    });
  };
  
  const handleB2CClick = () => {
    logModeSelection('b2c_selection_from_home');
    
    // Use framer-motion's AnimatePresence for exit animations
    setIsLoaded(false);
    setTimeout(() => navigate('/b2c/login'), 600);
  };
  
  const handleB2BClick = () => {
    logModeSelection('b2b_selection_from_home');
    
    // Use framer-motion's AnimatePresence for exit animations
    setIsLoaded(false);
    setTimeout(() => navigate('/choose-mode'), 600);
  };
  
  return (
    <div className={`immersive-container ${theme}`} style={{ background: `var(--background)` }}>
      {/* Audio element */}
      <audio ref={audioRef} loop>
        <source src="/sounds/ambient-calm.mp3" type="audio/mp3" />
      </audio>
      
      {/* Ambient background elements */}
      <div className="ambient-circle primary w-[600px] h-[600px] top-[-100px] right-[-100px]"></div>
      <div className="ambient-circle accent w-[500px] h-[500px] bottom-[-100px] left-[-100px]"></div>
      
      {/* Welcome text with typewriter effect */}
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="premium-title">EmotionsCare</h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <WelcomeMessage className="premium-subtitle mb-8" />
        </motion.div>
      </div>
      
      {/* Mode selection buttons */}
      <motion.div 
        className="flex flex-col md:flex-row gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Button
          onClick={handleB2CClick}
          className="premium-button primary"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 1 0-16 0"></path></svg>
            Espace Particulier
          </span>
        </Button>
        
        <Button
          onClick={handleB2BClick}
          className="premium-button secondary"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path><path d="M12 7v14"></path><path d="M3 21h18"></path></svg>
            Espace Entreprise
          </span>
        </Button>
      </motion.div>
      
      {/* Control buttons */}
      <motion.div
        className="absolute bottom-6 right-6 flex gap-3"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 0.8 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <button 
          className={`control-button ${audioEnabled ? 'active' : ''}`}
          onClick={toggleAudio}
          aria-label={audioEnabled ? "Désactiver la musique" : "Activer la musique"}
        >
          {audioEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4-4 4-4Z"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v4"></path><path d="M11 10v4"></path><path d="M2 12C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 10-10 10S2 17.5 2 12z"></path></svg>
          )}
        </button>
        
        <button 
          className="control-button"
          onClick={toggleTheme}
          aria-label="Changer de thème"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
          ) : theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15V6"></path><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M12 12H3"></path><path d="M16 6H3"></path><path d="M12 18H3"></path></svg>
          )}
        </button>
        
        <button 
          className="control-button"
          onClick={() => console.log('Voice mode')}
          aria-label="Activer les commandes vocales"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><path d="M12 19v3"></path></svg>
        </button>
      </motion.div>
    </div>
  );
};

export default ImmersiveHome;
