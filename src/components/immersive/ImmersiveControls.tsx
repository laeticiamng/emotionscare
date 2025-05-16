
import React, { MutableRefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import useVoiceCommand from '@/hooks/useVoiceCommand'; // Fixed import statement

interface ImmersiveControlsProps {
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
}

const ImmersiveControls: React.FC<ImmersiveControlsProps> = ({
  isListening,
  setIsListening,
  audioEnabled,
  setAudioEnabled,
  audioRef
}) => {
  const { theme, setTheme } = useTheme();
  const { toggleListening } = useVoiceCommand();
  
  const handleToggleAudio = () => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log("Audio play failed:", error);
        });
      }
      setAudioEnabled(!audioEnabled);
    }
  };
  
  const handleToggleVoice = () => {
    setIsListening(!isListening);
    toggleListening();
  };
  
  const handleToggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('pastel');
    else setTheme('light');
  };
  
  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={16} />;
    if (theme === 'dark') return <Moon size={16} />;
    return <Laptop size={16} />;
  };

  return (
    <div className="controls-container">
      <div className="control-group">
        <Button
          variant="ghost"
          size="icon"
          className={`control-button ${audioEnabled ? 'active-control' : ''}`}
          onClick={handleToggleAudio}
          title={audioEnabled ? "Désactiver la musique" : "Activer la musique"}
        >
          {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={`control-button ${isListening ? 'active-control' : ''}`}
          onClick={handleToggleVoice}
          title={isListening ? "Désactiver les commandes vocales" : "Activer les commandes vocales"}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="control-button"
          onClick={handleToggleTheme}
          title="Changer le thème"
        >
          {getThemeIcon()}
        </Button>
      </div>
    </div>
  );
};

export default ImmersiveControls;
