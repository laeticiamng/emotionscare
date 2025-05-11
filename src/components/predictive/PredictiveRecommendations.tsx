
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePredictiveAnalytics } from '@/providers/PredictiveAnalyticsProvider';
import { SparkleIcon, RefreshCw, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

interface PredictiveRecommendationsProps {
  className?: string;
  maxRecommendations?: number;
  showControls?: boolean;
}

const PredictiveRecommendations: React.FC<PredictiveRecommendationsProps> = ({
  className,
  maxRecommendations = 3,
  showControls = true
}) => {
  const { 
    recommendations, 
    isPredicting, 
    applyRecommendation, 
    clearRecommendations,
    generatePredictions,
    lastUpdated
  } = usePredictiveAnalytics();
  
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Format last updated time
  const formattedLastUpdate = lastUpdated 
    ? new Date(lastUpdated).toLocaleString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    : '--:--';
  
  // Filter recommendations to show only the most relevant ones
  const displayRecommendations = recommendations
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, maxRecommendations);
  
  // Get confidence level class
  const getConfidenceClass = (confidence: number) => {
    if (confidence > 0.9) return 'bg-primary/10 text-primary';
    if (confidence > 0.8) return 'bg-secondary/10 text-secondary';
    return 'bg-muted text-muted-foreground';
  };
  
  return (
    <Card className={cn("overflow-hidden transition-all", 
      isDarkMode ? "border-slate-800" : "border-slate-200",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg">
            <SparkleIcon className="h-5 w-5 text-primary" />
            Recommandations prédictives
          </CardTitle>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {isPredicting ? 'Mise à jour...' : `Mis à jour: ${formattedLastUpdate}`}
              </span>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-7 w-7" 
                onClick={() => generatePredictions()}
                disabled={isPredicting}
              >
                <RefreshCw className={cn("h-4 w-4", isPredicting && "animate-spin")} />
              </Button>
              
              {recommendations.length > 0 && (
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-7 w-7" 
                  onClick={() => clearRecommendations()}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {displayRecommendations.length > 0 ? (
          <div className="space-y-3">
            {displayRecommendations.map((recommendation) => (
              <div 
                key={recommendation.id} 
                className={cn(
                  "p-3 rounded-lg transition-all hover:translate-y-[-2px]",
                  isDarkMode ? "bg-slate-800/50" : "bg-slate-50"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{recommendation.title}</h3>
                  <Badge variant="outline" className={getConfidenceClass(recommendation.confidence)}>
                    {Math.round(recommendation.confidence * 100)}%
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {recommendation.description}
                </p>
                
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => applyRecommendation(recommendation)}
                >
                  Appliquer cette suggestion
                </Button>
              </div>
            ))}
          </div>
        ) : isPredicting ? (
          <div className="py-8 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Génération des recommandations...</p>
            </div>
          </div>
        ) : (
          <div className="py-8 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 max-w-xs text-center">
              <SparkleIcon className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-muted-foreground">Aucune recommandation prédictive disponible actuellement</p>
              {showControls && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => generatePredictions()}
                >
                  Générer des recommandations
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveRecommendations;
