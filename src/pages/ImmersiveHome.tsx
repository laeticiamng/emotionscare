
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useToast } from '@/hooks/use-toast';
import Shell from '@/Shell';
import '@/styles/immersive-home.css';
import AnimatedBackground from '@/components/immersive/AnimatedBackground';
import ImmersiveControls from '@/components/immersive/ImmersiveControls';
import PremiumContent from '@/components/immersive/PremiumContent';
import { useMusic } from '@/contexts/music';

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
  const { loadPlaylistForEmotion } = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

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
        await loadPlaylistForEmotion('calm');
        console.log('Ambient music ready to play');
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
