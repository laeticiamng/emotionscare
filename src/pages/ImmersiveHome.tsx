
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUserMode } from '@/contexts/UserModeContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import useVoiceCommand from '@/hooks/useVoiceCommand';
import '@/styles/immersive-home.css';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserMode } = useUserMode();
  const [greeting, setGreeting] = useState('Bienvenue dans votre espace de bien-être émotionnel');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const audioPlayer = useAudioPlayer();
  
  const voiceCommands = {
    'particulier': () => handleModeSelection('b2c'),
    'personnel': () => handleModeSelection('b2c'),
    'entreprise': () => handleModeSelection('b2b'),
    'collaborateur': () => navigate('/b2b/user/login'),
    'administrateur': () => navigate('/b2b/admin/login'),
    'rh': () => navigate('/b2b/admin/login'),
    'manager': () => navigate('/b2b/admin/login'),
  };
  
  const { isListening, toggleListening, isSupported, executeCommand } = useVoiceCommand({
    commands: voiceCommands
  });

  // Determine time of day and set appropriate greeting
  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting = 'Bienvenue dans votre espace de bien-être émotionnel';
    let currentTimeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning';
    
    if (hour >= 5 && hour < 12) {
      timeGreeting = 'Bonjour. Laissez votre journée commencer dans la douceur.';
      currentTimeOfDay = 'morning';
    } else if (hour >= 12 && hour < 18) {
      timeGreeting = 'Bienvenue dans votre espace personnel de reconnexion émotionnelle.';
      currentTimeOfDay = 'afternoon';
    } else {
      timeGreeting = 'Bonsoir. Bienvenue dans votre espace de tranquillité.';
      currentTimeOfDay = 'evening';
    }
    
    setGreeting(timeGreeting);
    setTimeOfDay(currentTimeOfDay);
    
    // Simulate playing ambient music
    // In a real implementation, this would connect to Music Generator API
    const ambientMusicUrl = '/ambient-music.mp3'; // This would be replaced with a real API call
    
    const playAmbientMusic = async () => {
      try {
        // This is a mock implementation - in production this would use your Music Generator API
        console.log('Playing ambient music for time of day:', currentTimeOfDay);
        
        // Uncomment this when you have actual audio files or API integration
        // audioPlayer.play(ambientMusicUrl);
        
        setIsMusicPlaying(true);
      } catch (error) {
        console.error('Failed to play ambient music:', error);
      }
    };
    
    setTimeout(playAmbientMusic, 1000);
    
    return () => {
      // Clean up audio when component unmounts
      audioPlayer.pause();
    };
  }, [audioPlayer]);

  const handleModeSelection = (mode: 'b2c' | 'b2b') => {
    console.log(`Selected mode: ${mode}`);
    
    // Store the user mode in localStorage
    localStorage.setItem('userMode', mode);
    
    // Update context
    setUserMode(mode);
    
    // Add haptic feedback for mobile devices if supported
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // subtle vibration for 50ms
    }
    
    // Toast notification to enhance feedback
    toast({
      title: mode === 'b2c' ? 'Espace Particulier' : 'Espace Entreprise',
      description: 'Redirection en cours...',
    });
    
    // Navigate to the appropriate route with preloading hint
    // In a real implementation, you would use a preloading strategy here
    if (mode === 'b2c') {
      navigate('/b2c/login');
    } else {
      navigate('/b2b/selection');
    }
  };
  
  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioPlayer.pause();
      setIsMusicPlaying(false);
    } else {
      // This would actually play music in a real implementation
      setIsMusicPlaying(true);
    }
  };

  return (
    <div className={`immersive-container ${timeOfDay}`}>
      {/* Ambient background animation */}
      <div className="ambient-animation">
        <motion.div 
          className="blur-circle circle-1"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="blur-circle circle-2"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
      </div>
      
      {/* Content */}
      <div className="content-container">
        <motion.div 
          className="greeting-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="greeting-title">{greeting}</h1>
          <p className="greeting-subtitle">Choisissez votre chemin.</p>
        </motion.div>
        
        <motion.div 
          className="options-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* B2C Option */}
          <motion.div 
            className="option-card b2c-card"
            whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="option-icon b2c-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 className="option-title">Je suis un particulier</h2>
            <p className="option-description">
              Accédez à votre espace personnel pour prendre soin de votre bien-être émotionnel
            </p>
            <Button 
              onClick={() => handleModeSelection('b2c')}
              className="option-button b2c-button"
            >
              Espace Personnel
            </Button>
          </motion.div>
          
          {/* B2B Option */}
          <motion.div 
            className="option-card b2b-card"
            whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="option-icon b2b-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h2 className="option-title">Je suis une entreprise</h2>
            <p className="option-description">
              Solutions de bien-être émotionnel pour vos équipes et votre organisation
            </p>
            <Button 
              onClick={() => handleModeSelection('b2b')}
              className="option-button b2b-button"
              variant="outline"
            >
              Espace Entreprise
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Controls */}
        <motion.div 
          className="controls"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            className="control-button voice-button"
            onClick={toggleListening}
            disabled={!isSupported}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            <span>{isListening ? 'Désactiver commandes vocales' : 'Activer commandes vocales'}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="control-button music-button"
            onClick={toggleMusic}
          >
            {isMusicPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isMusicPlaying ? 'Désactiver la musique' : 'Activer la musique'}</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
