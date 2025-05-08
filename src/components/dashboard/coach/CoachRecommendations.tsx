
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertOctagon, Brain, RefreshCw, Music, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actualiser les recommandations</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Actualiser les recommandations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-2">
          {recommendations.map((rec, i) => (
            <div key={i} className="text-xs flex gap-2 items-start p-2 bg-background/40 rounded-md transition-all hover:bg-background/60">
              <span className="text-primary mt-0.5">•</span>
              <span>{rec}</span>
            </div>
          ))}
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs h-7"
              onClick={onPlayMusic}
              disabled={isLoading}
            >
              <Music className="h-3 w-3 mr-1" />
              Musique recommandée
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7 w-8 flex items-center justify-center"
              onClick={() => window.open('/well-being', '_blank')}
              title="Plus de conseils bien-être"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachRecommendations;
