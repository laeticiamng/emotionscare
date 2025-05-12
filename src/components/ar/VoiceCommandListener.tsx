
import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommandListenerProps {
  isActive: boolean;
  onCommand: (command: string) => void;
}

const VoiceCommandListener: React.FC<VoiceCommandListenerProps> = ({ isActive, onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  // Vérifier la compatibilité de la reconnaissance vocale
  useEffect(() => {
    setSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }, []);
  
  const toggleListening = () => {
    if (!supported || !isActive) return;
    
    const listening = !isListening;
    setIsListening(listening);
    
    if (listening) {
      startListening();
    } else {
      stopListening();
    }
  };
  
  const startListening = () => {
    toast({
      title: "Commandes vocales activées",
      description: "Dites 'Pause', 'Lecture', 'Suivant', 'Plus fort', 'Moins fort', ou 'Changer d'environnement'",
    });
    
    // Dans une implémentation réelle, nous activerions l'API de reconnaissance vocale ici
    // Pour cette démo, nous simulons une reconnaissance
    
    // Simuler la reconnaissance après un délai
    const timeout = setTimeout(() => {
      const commands = ['Pause', 'Lecture', 'Suivant', 'Plus fort', 'Moins fort', 'Changer environnement'];
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      
      onCommand(randomCommand.toLowerCase());
      
      toast({
        title: "Commande reconnue",
        description: `"${randomCommand}" - Action effectuée`,
      });
      
      setIsListening(false);
    }, 3000);
    
    return () => clearTimeout(timeout);
  };
  
  const stopListening = () => {
    // Dans une implémentation réelle, nous arrêterions l'API de reconnaissance vocale ici
    toast({
      title: "Commandes vocales désactivées",
      description: "Mode d'écoute terminé",
    });
  };
  
  if (!supported || !isActive) return null;
  
  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleListening}
      className={`rounded-full ${isListening ? 'bg-primary/20' : ''}`}
      title="Commandes vocales"
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceCommandListener;
