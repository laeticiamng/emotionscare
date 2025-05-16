
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import Shell from '@/Shell';
import '@/styles/immersive-home.css';
import AnimatedBackground from '@/components/immersive/AnimatedBackground';
import ImmersiveControls from '@/components/immersive/ImmersiveControls';
import PremiumContent from '@/components/immersive/PremiumContent';
import { useMusic } from '@/contexts/MusicContext';
import useVoiceCommand from '@/hooks/useVoiceCommand';

const ImmersiveHome = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [greeting, setGreeting] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const { loadPlaylistForEmotion } = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Set up voice commands
  const voiceCommands = useVoiceCommand({
    commands: {
      'particulier': () => navigate('/b2c/login'),
      'entreprise': () => navigate('/b2b/selection'),
      'je suis un particulier': () => navigate('/b2c/login'),
      'je suis une entreprise': () => navigate('/b2b/selection'),
    }
  });

  // Generate greeting based on time of day
  const generateGreeting = () => {
    const hour = new Date().getHours();
    
    let timeBasedGreeting = '';
    if (hour >= 5 && hour < 12) {
      timeBasedGreeting = "Bienvenue dans votre espace de reconnexion émotionnelle matinale";
    } else if (hour >= 12 && hour < 18) {
      timeBasedGreeting = "Votre espace premium pour le bien-être émotionnel quotidien";
    } else if (hour >= 18 && hour < 22) {
      timeBasedGreeting = "Votre refuge émotionnel pour une soirée apaisante";
    } else {
      timeBasedGreeting = "Votre havre de paix émotionnel nocturne";
    }

    return timeBasedGreeting;
  };

  useEffect(() => {
    // Set initial greeting
    setGreeting(generateGreeting());

    // Set ambient audio
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }

    // Update greeting based on time of day periodically
    const intervalId = setInterval(() => {
      setGreeting(generateGreeting());
    }, 60000);

    // Simulate loading playlist on mount
    const loadAmbientMusic = async () => {
      try {
        await loadPlaylistForEmotion({ emotion: 'calm', intensity: 0.5 });
        console.log('Ambient music ready to play');
      } catch (error) {
        console.error('Error loading ambient music:', error);
      }
    };

    loadAmbientMusic();

    // Check for stored user preference
    const checkUserMode = () => {
      const storedUserMode = localStorage.getItem('userMode');
      if (storedUserMode === 'b2c') {
        navigate('/b2c/login');
      } else if (storedUserMode === 'b2b_user') {
        navigate('/b2b/user/login');
      } else if (storedUserMode === 'b2b_admin') {
        navigate('/b2b/admin/login');
      }
    };

    setTimeout(checkUserMode, 1000);

    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [loadPlaylistForEmotion, navigate]);

  return (
    <Shell hideNav>
      <div className={`immersive-container bg-premium-gradient ${theme}`}>
        {/* Audio element for background music */}
        <audio 
          ref={audioRef}
          src="/sounds/ambient-calm.mp3" 
          loop 
        />

        {/* Background Components */}
        <AnimatedBackground />

        {/* Controls */}
        <ImmersiveControls 
          isListening={isListening}
          setIsListening={setIsListening}
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
          audioRef={audioRef}
        />

        {/* Main Content */}
        <PremiumContent greeting={greeting} />
      </div>
    </Shell>
  );
};

export default ImmersiveHome;
