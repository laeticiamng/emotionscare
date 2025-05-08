
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertOctagon, Brain, RefreshCw, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoachRecommendationsProps {
  recommendations: string[];
  isProcessing: boolean;
  apiCheckInProgress: boolean;
  onRefresh: () => void;
  onPlayMusic: () => void;
}

const CoachRecommendations: React.FC<CoachRecommendationsProps> = ({ 
  recommendations, 
  isProcessing, 
  apiCheckInProgress, 
  onRefresh,
  onPlayMusic 
}) => {
  // État de chargement combiné
  const isLoading = isProcessing || apiCheckInProgress;

  // Si nous n'avons pas de recommandations, afficher un état alternatif
  if (recommendations.length === 0) {
    return (
      <div className="px-4 pb-4">
        <div className="bg-muted/30 rounded-lg p-3 mt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Recommandations IA
            </h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              disabled={isLoading} 
              onClick={onRefresh}
              aria-label="Rafraîchir les recommandations"
            >
              <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
            <AlertOctagon className="h-3 w-3" /> 
            Aucune recommandation disponible
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs h-7"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-3 w-3 mr-1", isLoading && "animate-spin")} />
            {isLoading ? "Génération en cours..." : "Générer des recommandations"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <div className="bg-muted/30 rounded-lg p-3 mt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Recommandations IA
          </h4>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            disabled={isLoading} 
            onClick={onRefresh}
            aria-label="Rafraîchir les recommandations"
          >
            <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
          </Button>
        </div>
        <div className="space-y-2">
          {recommendations.slice(0, 1).map((rec, i) => (
            <div key={i} className="text-xs flex gap-2 items-start">
              <span className="text-primary">•</span>
              <span>{rec}</span>
            </div>
          ))}
          {recommendations.length > 1 && (
            <div className="text-xs text-muted-foreground text-right">
              + {recommendations.length - 1} autre(s)
            </div>
          )}
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs h-7 mt-1"
            onClick={onPlayMusic}
            disabled={isLoading}
          >
            <Music className="h-3 w-3 mr-1" />
            Écouter musique recommandée
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachRecommendations;
