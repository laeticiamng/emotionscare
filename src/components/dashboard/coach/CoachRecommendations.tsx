
import React from 'react';
import { Button } from "@/components/ui/button";
import { Brain, RefreshCw, Music } from 'lucide-react';
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
  if (recommendations.length === 0) return null;

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
            disabled={isProcessing || apiCheckInProgress} 
            onClick={onRefresh}
          >
            <RefreshCw className={cn("h-3 w-3", isProcessing && "animate-spin")} />
          </Button>
        </div>
        <div className="space-y-2">
          {recommendations.slice(0, 1).map((rec, i) => (
            <div key={i} className="text-xs flex gap-2 items-start">
              <span className="text-primary">•</span>
              <span>{rec}</span>
            </div>
          ))}
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs h-7 mt-1"
            onClick={onPlayMusic}
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
