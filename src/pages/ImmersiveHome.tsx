
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WelcomeMessage } from '@/components/home/WelcomeMessage';
import ThreeCanvas from '@/components/three/ThreeCanvas';
import { motion } from 'framer-motion';
import { User, Building, Volume2, VolumeX } from 'lucide-react';
import '../styles/immersive-home.css';
import { useTheme } from '@/contexts/ThemeContext';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const { theme } = useTheme();

  // Determine time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('afternoon');
    else if (hour >= 18 && hour < 22) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  // Initialize welcome audio
  useEffect(() => {
    const audioElement = new Audio('/sounds/ambient-calm.mp3');
    audioElement.volume = 0.3;
    audioElement.loop = true;
    setAudio(audioElement);

    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, []);

  // Handle audio toggle
  const toggleAudio = () => {
    if (!audio) return;
    
    if (audioEnabled) {
      audio.pause();
    } else {
      audio.play().catch(err => console.log('Audio playback prevented:', err));
    }
    setAudioEnabled(!audioEnabled);
    
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Navigate to B2C login
  const goToB2CLogin = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate('/b2c/login');
  };

  // Navigate to B2B selection
  const goToB2BSelection = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate('/b2b/selection');
  };

  // Generate greeting based on time of day
  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning': return 'Bonjour';
      case 'afternoon': return 'Bon après-midi';
      case 'evening': return 'Bonsoir';
      case 'night': return 'Bonne nuit';
      default: return 'Bienvenue';
    }
  };

  return (
    <div className={`immersive-container ${theme}`}>
      {/* Animated background */}
      <ThreeCanvas />
      
      {/* Ambient circles */}
      <div 
        className="ambient-circle primary" 
        style={{
          width: '40vw',
          height: '40vw',
          top: '10%',
          left: '5%',
          opacity: 0.3
        }}
      />
      <div 
        className="ambient-circle accent" 
        style={{
          width: '35vw',
          height: '35vw',
          bottom: '10%',
          right: '5%',
          opacity: 0.25
        }}
      />
      
      {/* Main content */}
      <motion.div 
        className="relative z-10 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="premium-title"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          EmotionsCare
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="premium-subtitle mb-8">
            {getGreeting()} et bienvenue sur votre plateforme de bien-être émotionnel
          </p>
          
          <WelcomeMessage className="text-lg mb-12 premium-subtitle" />
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-6 mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button
            onClick={goToB2CLogin}
            className="premium-button primary flex items-center gap-2 group"
          >
            <User className="mr-1" />
            <span>Je suis un particulier</span>
          </Button>
          
          <Button
            onClick={goToB2BSelection}
            className="premium-button secondary flex items-center gap-2 group"
          >
            <Building className="mr-1" />
            <span>Je suis une entreprise</span>
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Audio control button */}
      <motion.button
        className={`control-button absolute bottom-6 right-6 ${audioEnabled ? 'active' : ''}`}
        onClick={toggleAudio}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-label={audioEnabled ? 'Désactiver le son' : 'Activer le son'}
      >
        {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </motion.button>
    </div>
  );
};

export default ImmersiveHome;
