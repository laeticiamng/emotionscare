
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Volume2, VolumeX, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/transitions/PageTransition';
import '../styles/immersive-home.css';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark' | 'pastel'>('light');
  const [audioOn, setAudioOn] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  
  // Time-based greeting
  const [greeting, setGreeting] = useState<string>("Bienvenue");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
    
    // Default theme based on user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
    
    // Add ambient audio effect when component mounts
    const ambientAudio = new Audio('/sounds/ambient-calm.mp3');
    ambientAudio.loop = true;
    ambientAudio.volume = 0.1;
    
    return () => {
      ambientAudio.pause();
    };
  }, []);
  
  // Toggle audio
  const toggleAudio = () => {
    const ambientAudio = document.querySelector('#ambient-audio') as HTMLAudioElement;
    if (audioOn) {
      ambientAudio?.pause();
    } else {
      ambientAudio?.play();
    }
    setAudioOn(!audioOn);
  };
  
  // Handle theme change with smooth transition
  const changeTheme = (newTheme: 'light' | 'dark' | 'pastel') => {
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark', 'pastel');
    document.documentElement.classList.add(newTheme);
  };
  
  const ambientCircleVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.4, 0.6, 0.4],
      transition: {
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };
  
  return (
    <PageTransition mode="fade">
      <div className={`immersive-container ${theme}`} style={{ background: 'var(--background)' }}>
        {/* Background ambient circles */}
        <motion.div
          className="ambient-circle primary"
          variants={ambientCircleVariants}
          animate="animate"
          style={{
            width: '40vh',
            height: '40vh',
            left: '10%',
            top: '20%',
          }}
        />
        
        <motion.div
          className="ambient-circle accent"
          variants={ambientCircleVariants}
          animate="animate"
          style={{
            width: '50vh',
            height: '50vh',
            right: '5%',
            bottom: '10%',
          }}
        />
        
        {/* Controls */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button 
            onClick={() => changeTheme('light')}
            className={`control-button ${theme === 'light' ? 'active' : ''}`}
          >
            <Sun size={18} />
          </button>
          <button 
            onClick={() => changeTheme('dark')} 
            className={`control-button ${theme === 'dark' ? 'active' : ''}`}
          >
            <Moon size={18} />
          </button>
          <button 
            onClick={toggleAudio} 
            className="control-button"
          >
            {audioOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="control-button"
          >
            <Menu size={18} />
          </button>
        </div>
        
        {/* Menu overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMenuOpen(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute right-0 top-0 bottom-0 w-64 sm:w-80 bg-white dark:bg-slate-900 p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-6">Menu</h3>
                <nav className="space-y-4">
                  <a href="/" className="block py-2 hover:text-primary transition-colors">Accueil</a>
                  <a href="/b2c" className="block py-2 hover:text-primary transition-colors">Espace particulier</a>
                  <a href="/b2b" className="block py-2 hover:text-primary transition-colors">Espace entreprise</a>
                  <a href="/login" className="block py-2 hover:text-primary transition-colors">Connexion</a>
                  <a href="/register" className="block py-2 hover:text-primary transition-colors">Inscription</a>
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center z-10 relative px-4 max-w-4xl mx-auto"
        >
          <motion.h2 
            className="premium-title"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            {greeting}
          </motion.h2>
          
          <motion.p 
            className="premium-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Explorez notre plateforme dédiée au bien-être émotionnel et la gestion du stress.
            Découvrez des outils innovants pour apaiser votre esprit et améliorer votre quotidien.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              className="premium-button primary"
              onClick={() => navigate('/b2c')}
            >
              Espace particulier
            </Button>
            
            <Button 
              className="premium-button secondary"
              onClick={() => navigate('/b2b/selection')}
            >
              Solutions entreprise
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Hidden audio element */}
        <audio id="ambient-audio" src="/sounds/ambient-calm.mp3" loop />
        
        {/* Floating indicators */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-center opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p>Faites défiler pour explorer</p>
          <motion.div 
            animate={{ y: [0, 8, 0] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mx-auto mt-2"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ImmersiveHome;
