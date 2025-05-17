import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, List, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';

interface VoiceCommandsProps {
  onCommandRecognized?: (command: string) => void;
  disabled?: boolean;
}

const VoiceCommands: React.FC<VoiceCommandsProps> = ({
  onCommandRecognized,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supportsSpeechRecognition, setSupportsSpeechRecognition] = useState<boolean | null>(null);
  const { toast } = useToast();
  const music = useMusic();

  // Liste des commandes reconnues
  const commands = {
    music: {
      play: ['jouer la musique', 'jouer', 'play', 'lecture', 'démarrer musique'],
      pause: ['pause', 'stop', 'arrêter la musique', 'stop la musique'],
      next: ['musique suivante', 'next', 'suivant', 'chanson suivante'],
      previous: ['musique précédente', 'previous', 'précédent', 'chanson précédente']
    },
    emotion: {
      scan: ['analyser mon humeur', 'scan émotionnel', 'comment je me sens', 'analyse émotionnelle']
    },
    navigation: {
      dashboard: ['aller au tableau de bord', 'dashboard', 'accueil'],
      journal: ['ouvrir mon journal', 'journal', 'notes'],
      profile: ['mon profil', 'profil', 'paramètres']
    }
  };

  useEffect(() => {
    // Vérifier si la reconnaissance vocale est supportée
    const checkSpeechRecognition = () => {
      const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setSupportsSpeechRecognition(hasSpeechRecognition);
    };
    
    checkSpeechRecognition();
  }, []);

  // Simuler la reconnaissance vocale
  const startListening = () => {
    if (!supportsSpeechRecognition) {
      toast({
        title: "Non supporté",
        description: "Votre navigateur ne prend pas en charge la reconnaissance vocale",
        variant: "destructive"
      });
      return;
    }
    
    setIsListening(true);
    setTranscript('');
    
    // Simuler la reconnaissance vocale après un délai
    setTimeout(() => {
      // Dans une implémentation réelle, cette partie utiliserait l'API SpeechRecognition
      const fakeCommands = [
        "jouer la musique",
        "pause",
        "musique suivante",
        "analyser mon humeur",
        "aller au tableau de bord"
      ];
      
      const randomCommand = fakeCommands[Math.floor(Math.random() * fakeCommands.length)];
      setTranscript(randomCommand);
      
      // Traiter la commande reconnue
      processCommand(randomCommand);
      
      setIsListening(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const processCommand = (command: string) => {
    let recognized = false;
    
    // Vérifier les commandes de musique
    Object.entries(commands.music).forEach(([action, phrases]) => {
      if (phrases.some(phrase => command.toLowerCase().includes(phrase))) {
        recognized = true;
        
        switch (action) {
          case 'play':
            if (music.currentTrack) {
              music.playTrack(music.currentTrack);
              toast({
                title: "Musique",
                description: "Lecture démarrée"
              });
            } else {
              toast({
                title: "Musique",
                description: "Aucune piste disponible. Choisissez d'abord une playlist."
              });
            }
            break;
            
          case 'pause':
            music.pauseTrack();
            toast({
              title: "Musique",
              description: "Lecture en pause"
            });
            break;
            
          case 'next':
            music.nextTrack();
            toast({
              title: "Musique",
              description: "Piste suivante"
            });
            break;
            
          case 'previous':
            music.prevTrack();
            toast({
              title: "Musique",
              description: "Piste précédente"
            });
            break;
        }
      }
    });
    
    // Vérifier les commandes de navigation
    Object.entries(commands.navigation).forEach(([page, phrases]) => {
      if (phrases.some(phrase => command.toLowerCase().includes(phrase))) {
        recognized = true;
        
        toast({
          title: "Navigation",
          description: `Navigation vers ${page}`
        });
        
        // Dans une implémentation réelle, on utiliserait useNavigate ici
      }
    });
    
    // Vérifier les commandes d'émotion
    Object.entries(commands.emotion).forEach(([action, phrases]) => {
      if (phrases.some(phrase => command.toLowerCase().includes(phrase))) {
        recognized = true;
        
        toast({
          title: "Analyse émotionnelle",
          description: "Démarrage de l'analyse émotionnelle"
        });
      }
    });
    
    if (onCommandRecognized && recognized) {
      onCommandRecognized(command);
    }
    
    if (!recognized) {
      toast({
        title: "Commande non reconnue",
        description: "Essayez à nouveau avec une commande différente",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          Commandes vocales
        </CardTitle>
        <CardDescription>
          Contrôlez l'application par la voix
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className={`rounded-full h-16 w-16 ${isListening ? 'animate-pulse' : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={disabled || !supportsSpeechRecognition}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          </div>
          
          {transcript && (
            <div className="p-3 bg-muted rounded-md text-center">
              <p className="text-sm font-medium">{transcript}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Commandes disponibles:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <Music className="h-3 w-3 mr-1" /> Jouer la musique
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Music className="h-3 w-3 mr-1" /> Pause
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <List className="h-3 w-3 mr-1" /> Ouvrir mon journal
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Volume2 className="h-3 w-3 mr-1" /> Analyser mon humeur
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <p className="text-xs text-muted-foreground w-full text-center">
          {supportsSpeechRecognition === false ? 
            "Votre navigateur ne prend pas en charge la reconnaissance vocale" : 
            "Cliquez sur le microphone pour activer les commandes vocales"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default VoiceCommands;
