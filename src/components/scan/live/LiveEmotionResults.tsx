
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { EmotionResult } from '@/types';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

interface LiveEmotionResultsProps {
  result: EmotionResult;
  onSave: () => Promise<void>;
  onReset: () => void;
  isSaving: boolean;
}

const LiveEmotionResults: React.FC<LiveEmotionResultsProps> = ({
  result,
  onSave,
  onReset,
  isSaving
}) => {
  const { loadPlaylistForEmotion, isPlaying, currentTrack, playTrack } = useMusic();
  const { toast } = useToast();
  
  // Fonction pour charger une playlist basée sur l'émotion
  const handleLoadPlaylist = () => {
    try {
      const playlist = loadPlaylistForEmotion(result.emotion.toLowerCase());
      
      if (playlist && playlist.tracks.length > 0) {
        if (!isPlaying || !currentTrack) {
          playTrack(playlist.tracks[0]);
        }
        
        toast({
          title: "Playlist chargée",
          description: `Lecture de la playlist '${playlist.name}' démarrée`,
        });
      } else {
        toast({
          title: "Aucune playlist disponible",
          description: `Aucune playlist n'a été trouvée pour l'émotion ${result.emotion}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la playlist",
        variant: "destructive"
      });
    }
  };
  
  // Obtenir une couleur de badge basée sur l'émotion
  const getBadgeColor = (emotion: string) => {
    const emotionMap: Record<string, string> = {
      happy: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      calm: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      sad: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      angry: "bg-red-100 text-red-800 hover:bg-red-200",
      anxious: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      neutral: "bg-gray-100 text-gray-800 hover:bg-gray-200"
    };
    
    return emotionMap[emotion.toLowerCase()] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Analyse complétée</CardTitle>
          <Badge className={getBadgeColor(result.emotion)}>
            {result.emotion}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Niveau de confiance */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Niveau de confiance</span>
          <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
        </div>
        
        {/* Transcription */}
        {result.transcript && (
          <div className="bg-muted/30 p-3 rounded-md">
            <p className="text-sm italic">"{result.transcript}"</p>
          </div>
        )}
        
        {/* Feedback IA */}
        {result.feedback && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Analyse</h4>
            <p className="text-sm">{result.feedback}</p>
          </div>
        )}
        
        {/* Recommandations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recommandations</h4>
            <ul className="space-y-1">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2 justify-between pt-2">
          <Button variant="outline" size="sm" onClick={onReset} disabled={isSaving}>
            Nouvelle analyse
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLoadPlaylist}
              className="flex items-center gap-1"
            >
              Écouter musique recommandée
              <ArrowRight className="h-3 w-3" />
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={onSave} 
              disabled={isSaving}
              className="flex items-center gap-1"
            >
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
              {!isSaving && <Check className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveEmotionResults;
