
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Moon, Sun, Building, User, Play, Pause } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import WelcomeMessage from '@/components/home/WelcomeMessage';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { useMusic } from '@/hooks/useMusic';
import '../styles/immersive-home.css';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { activateMusicForEmotion } = useMusicEmotionIntegration();
  const music = useMusic();
  
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [showIntroBg, setShowIntroBg] = useState(true);
  
  const isDarkMode = theme === 'dark';
  
  // Update current hour every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle background music
  const toggleBackgroundMusic = async () => {
    if (isBackgroundMusicPlaying) {
      if (music.pauseTrack) {
        music.pauseTrack();
      }
      setIsBackgroundMusicPlaying(false);
    } else {
      const result = await activateMusicForEmotion({ emotion: 'calm' });
      setIsBackgroundMusicPlaying(!!result);
    }
  };
  
  // Simulate voice command
  const toggleVoiceCommand = () => {
    setIsVoiceListening(prev => !prev);
    
    // Simulate voice recognition after 3 seconds
    if (!isVoiceListening) {
      setTimeout(() => {
        setIsVoiceListening(false);
      }, 3000);
    }
  };
  
  // Hide intro background after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowIntroBg(false);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`immersive-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Background Elements */}
      <AnimatePresence>
        {showIntroBg && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-primary/10 to-transparent z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        )}
      </AnimatePresence>
      
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Animated circles in background */}
        <motion.div
          className="ambient-circle primary w-[500px] h-[500px]"
          style={{ top: '10%', left: '10%', opacity: 0.1 }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="ambient-circle accent w-[600px] h-[600px]"
          style={{ bottom: '5%', right: '10%', opacity: 0.1 }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="ambient-circle primary w-[300px] h-[300px]"
          style={{ top: '40%', right: '25%', opacity: 0.08 }}
          animate={{
            x: [0, 20, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>
      
      {/* Header Controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-3 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="control-button"
          onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`control-button ${isBackgroundMusicPlaying ? 'active' : ''}`}
          onClick={toggleBackgroundMusic}
          aria-label={isBackgroundMusicPlaying ? "Pause background music" : "Play background music"}
        >
          {isBackgroundMusicPlaying ? <Pause size={18} /> : <Play size={18} />}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`control-button ${isVoiceListening ? 'voice-active' : ''}`}
          onClick={toggleVoiceCommand}
          aria-label="Voice command"
        >
          <Mic size={18} className={isVoiceListening ? "text-primary" : ""} />
        </motion.button>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="premium-title">
            EmotionsCare
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <WelcomeMessage className="premium-subtitle mb-12" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => navigate('/b2c/login')}
              className="premium-button primary w-full sm:w-auto"
              size="lg"
            >
              <User className="mr-2 h-5 w-5" />
              Je suis un particulier
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => navigate('/b2b/selection')}
              className="premium-button secondary w-full sm:w-auto"
              size="lg"
              variant="outline"
            >
              <Building className="mr-2 h-5 w-5" />
              Je suis une entreprise
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Footer Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 text-center w-full px-6 z-10"
      >
        <p className="text-sm font-light opacity-70">
          Vous êtes au bon endroit pour prendre soin de vos émotions
        </p>
      </motion.div>
    </div>
  );
};

export default ImmersiveHome;
