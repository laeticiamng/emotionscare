
import React from 'react';
import { Button } from '@/components/ui/button';
import { MicIcon, Speaker, VolumeX } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ImmersiveControlsProps {
  isListening: boolean;
  setIsListening: React.Dispatch<React.SetStateAction<boolean>>;
  audioEnabled: boolean;
  setAudioEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const ImmersiveControls: React.FC<ImmersiveControlsProps> = ({
  isListening,
  setIsListening,
  audioEnabled,
  setAudioEnabled,
  audioRef
}) => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleVoiceRecognition = () => {
    if (isListening) {
      setIsListening(false);
      toast({
        description: "Nous n'écoutons plus",
      });
    } else {
      setIsListening(true);
      toast({
        description: "Dites 'Particulier' ou 'Entreprise' pour naviguer",
      });
      
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        toast({
          description: "Redirection vers votre espace...",
        });
        setTimeout(() => navigate('/home'), 1500);
      }, 3000);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
    
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause();
        toast({
          description: "Ambiance musicale coupée",
        });
      } else {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
        toast({
          description: "Ambiance musicale activée",
        });
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
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
            <VolumeX className="h-5 w-5 text-blue-300" />
          )}
          <span className="sr-only">Audio</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="control-button"
        >
          <span className="h-5 w-5 text-blue-300">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
          <span className="sr-only">Theme</span>
        </Button>
      </div>
    </div>
  );
};

export default ImmersiveControls;
