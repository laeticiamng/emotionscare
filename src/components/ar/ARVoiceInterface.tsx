
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Volume2, Command } from 'lucide-react';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

interface ARVoiceInterfaceProps {
  onCommand?: (command: string) => void;
  enabled?: boolean;
}

const ARVoiceInterface: React.FC<ARVoiceInterfaceProps> = ({
  onCommand,
  enabled = false
}) => {
  const { isListening, toggleListening, supported, lastCommand } = useVoiceCommands({
    enabled,
    commandCallback: onCommand
  });
  
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
            <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer" onClick={() => onCommand && onCommand('play')}>
              "Lecture"
            </Badge>
            <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer" onClick={() => onCommand && onCommand('pause')}>
              "Pause"
            </Badge>
            <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer" onClick={() => onCommand && onCommand('volume plus')}>
              "Plus fort"
            </Badge>
            <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer" onClick={() => onCommand && onCommand('volume moins')}>
              "Moins fort"
            </Badge>
            <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer" onClick={() => onCommand && onCommand('changer environnement')}>
              "Changer environnement"
            </Badge>
          </div>
          
          {lastCommand && (
            <div className="text-xs text-muted-foreground">
              Dernière commande : <span className="font-medium">{lastCommand}</span>
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
