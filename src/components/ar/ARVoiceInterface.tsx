
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Command } from 'lucide-react';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

interface ARVoiceInterfaceProps {
  onCommand?: (command: string) => void;
  enabled?: boolean;
}

const ARVoiceInterface: React.FC<ARVoiceInterfaceProps> = ({
  onCommand,
  enabled = false
}) => {
  const { isListening, toggleListening, supported, lastCommand, lastTranscript } = useVoiceCommands({
    enabled,
    commandCallback: onCommand
  });
  
  const [expandedCommands, setExpandedCommands] = useState<boolean>(false);

  // List of available commands with descriptions
  const availableCommands = [
    { command: "Lecture", description: "Démarrer la lecture" },
    { command: "Pause", description: "Mettre en pause" },
    { command: "Plus fort", description: "Augmenter le volume" },
    { command: "Moins fort", description: "Baisser le volume" },
    { command: "Suivant", description: "Piste suivante" },
    { command: "Changer environnement", description: "Changer le décor AR" },
    { command: "Quitter", description: "Terminer l'expérience" }
  ];
  
  if (!supported || !enabled) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Command className="h-5 w-5 text-muted-foreground" />
            Interface vocale
          </CardTitle>
          <CardDescription>
            Fonctionnalité de commande vocale non disponible sur cet appareil
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className={isListening ? 'border-primary' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Interface vocale
          </CardTitle>
          {isListening && (
            <Badge variant="outline" className="animate-pulse">
              Écoute active
            </Badge>
          )}
        </div>
        <CardDescription>
          Contrôlez votre expérience AR par la voix
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1 text-sm">
            {!expandedCommands ? (
              <>
                {availableCommands.slice(0, 4).map((cmd, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="hover:bg-secondary/80 cursor-pointer" 
                    onClick={() => onCommand && onCommand(cmd.command.toLowerCase())}
                  >
                    "{cmd.command}"
                  </Badge>
                ))}
                <Badge 
                  variant="outline" 
                  className="cursor-pointer text-xs hover:bg-accent" 
                  onClick={() => setExpandedCommands(true)}
                >
                  Voir plus...
                </Badge>
              </>
            ) : (
              <>
                {availableCommands.map((cmd, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="hover:bg-secondary/80 cursor-pointer flex items-center gap-1" 
                    onClick={() => onCommand && onCommand(cmd.command.toLowerCase())}
                  >
                    <span>"{cmd.command}"</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      - {cmd.description}
                    </span>
                  </Badge>
                ))}
                <Badge 
                  variant="outline" 
                  className="cursor-pointer text-xs hover:bg-accent" 
                  onClick={() => setExpandedCommands(false)}
                >
                  Voir moins
                </Badge>
              </>
            )}
          </div>
          
          {lastTranscript && (
            <div className="text-xs bg-muted p-2 rounded-md">
              <span className="text-muted-foreground">Vous avez dit : </span>
              <span className="italic font-medium">"{lastTranscript}"</span>
              {lastCommand && (
                <span className="text-primary"> → {lastCommand}</span>
              )}
            </div>
          )}
          
          <button 
            onClick={toggleListening} 
            className={`w-full py-2 px-3 rounded-md text-center text-sm transition-all ${
              isListening 
                ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                : 'bg-secondary/50 hover:bg-secondary/70'
            }`}
          >
            {isListening ? 'Arrêter l\'écoute' : 'Activer l\'écoute vocale'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ARVoiceInterface;
