
import React from 'react';
import { Button } from '@/components/ui/button';
import { MicIcon, Speaker, VolumeX } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';
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
  const { toast } = useToast();
  const navigate = useNavigate();

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
        
        <ModeToggle />
      </div>
    </div>
  );
};

export default ImmersiveControls;
