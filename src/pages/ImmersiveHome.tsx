
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import { MicIcon, Speaker, SpeakerOff, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Shell from '@/Shell';
import '@/styles/immersive-home.css';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useMusic } from '@/contexts/music/MusicContext';
import ThreeCanvas from '@/components/three/ThreeCanvas';

const generateGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Bonjour";
  } else if (hour >= 12 && hour < 18) {
    return "Bel après-midi";
  } else if (hour >= 18 && hour < 22) {
    return "Bonsoir";
  } else {
    return "Bienvenue";
  }
};

const ImmersiveHome = () => {
  const { theme } = useTheme();
  const [greeting, setGreeting] = useState(generateGreeting());
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { loadPlaylistForEmotion, playTrack, setVolume, pauseTrack } = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Set ambient audio
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }

    // Update greeting based on time of day
    const intervalId = setInterval(() => {
      setGreeting(generateGreeting());
    }, 60000);

    // Simulate loading playlist on mount
    const loadAmbientMusic = async () => {
      try {
        const playlist = await loadPlaylistForEmotion({ emotion: 'calm' });
        if (playlist && playlist.tracks.length > 0) {
          console.log('Ambient music ready to play');
        }
      } catch (error) {
        console.error('Error loading ambient music:', error);
      }
    };

    loadAmbientMusic();

    return () => {
      clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [loadPlaylistForEmotion]);

  const toggleVoiceRecognition = () => {
    if (isListening) {
      setIsListening(false);
      toast({
        title: "Commandes vocales désactivées",
        description: "Nous n'écoutons plus",
      });
    } else {
      setIsListening(true);
      toast({
        title: "Commandes vocales activées",
        description: "Dites 'Particulier' ou 'Entreprise' pour naviguer",
      });
      
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        toast({
          title: "✓ Commande reconnue",
          description: "Redirection vers votre espace...",
        });
        setTimeout(() => navigate('/b2c/login'), 1500);
      }, 3000);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
    
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause();
        toast({
          title: "Son désactivé",
          description: "Ambiance musicale coupée",
        });
      } else {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
        toast({
          title: "Son activé",
          description: "Ambiance musicale activée",
        });
      }
    }
  };

  return (
    <Shell hideNav>
      <div className={`immersive-container bg-premium-gradient ${theme}`}>
        {/* Audio element for background music */}
        <audio 
          ref={audioRef}
          src="/sounds/ambient-calm.mp3" 
          loop 
        />

        {/* 3D Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <ThreeCanvas />
        </div>

        {/* Ambient Background */}
        <div className="ambient-animation">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
              transition: { 
                repeat: Infinity, 
                duration: 10,
                ease: "easeInOut"
              }
            }}
            className="blur-circle circle-1"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.15, 0.1],
              transition: { 
                repeat: Infinity, 
                duration: 15,
                ease: "easeInOut",
                delay: 1
              }
            }}
            className="blur-circle circle-2"
          />
        </div>

        {/* Controls */}
        <div className="controls-container">
          <div className="control-group">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleVoiceRecognition}
              className={`control-button ${isListening ? 'active-control' : ''}`}
            >
              <MicIcon className={`h-5 w-5 ${isListening ? 'text-blue-500' : 'text-blue-300'}`} />
              <span className="sr-only">Commandes vocales</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleAudio}
              className="control-button"
            >
              {audioEnabled ? (
                <Speaker className="h-5 w-5 text-blue-300" />
              ) : (
                <SpeakerOff className="h-5 w-5 text-blue-300" />
              )}
              <span className="sr-only">Audio</span>
            </Button>
            
            <ModeToggle />
          </div>
        </div>

        {/* Main Content */}
        <div className="premium-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="premium-header"
          >
            <motion.h1 
              className="premium-title"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              EmotionsCare
            </motion.h1>
            <motion.p 
              className="premium-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {greeting}, votre espace de bien-être émotionnel
            </motion.p>
          </motion.div>

          <motion.div 
            className="premium-options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <AnimatePresence>
              <motion.div 
                className="premium-option-card"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="option-icon-container">
                  <Sparkles className="h-7 w-7 text-blue-500" />
                </div>
                <h2 className="option-title">Espace Particulier</h2>
                <p className="option-description">
                  Accédez à votre espace personnel pour explorer vos émotions, gérer votre journal et suivre votre progression.
                </p>
                <Link to="/b2c/login">
                  <Button className="premium-button">
                    Accéder à mon espace
                  </Button>
                </Link>
              </motion.div>

              <motion.div 
                className="premium-option-card"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="option-icon-container">
                  <Sparkles className="h-7 w-7 text-blue-500" />
                </div>
                <h2 className="option-title">Espace Entreprise</h2>
                <p className="option-description">
                  Solutions de bien-être professionnel pour les collaborateurs et outils d'analyse pour les responsables RH.
                </p>
                <Link to="/b2b/selection">
                  <Button className="premium-button premium-button-secondary">
                    Accéder à l'espace pro
                  </Button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div 
            className="premium-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EmotionsCare • <Link to="/privacy-policy" className="hover:underline">Confidentialité</Link> • <Link to="/terms" className="hover:underline">Conditions d'utilisation</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
};

export default ImmersiveHome;
