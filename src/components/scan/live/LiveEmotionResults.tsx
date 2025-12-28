import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';

interface LiveEmotionResultsProps {
  result?: EmotionResult;
  className?: string;
}

const LiveEmotionResults: React.FC<LiveEmotionResultsProps> = ({ result, className }) => {
  if (!result) {
    return <div className={className}>Aucun résultat à afficher.</div>;
  }

  // Helper function to handle recommendations that might be strings or objects
  const renderRecommendation = (rec: string | EmotionRecommendation, index: number) => {
    if (typeof rec === 'string') {
      return (
        <Badge key={index} variant="secondary">
          {rec}
        </Badge>
      );
    } else {
      return (
        <Badge key={index} variant="secondary">
          {rec.title || "Recommendation"} - {rec.description || ""}
        </Badge>
      );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Analyse en direct</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`} alt="Avatar" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{result.emotion}</h3>
            <p className="text-sm text-muted-foreground">
              Confiance: {Math.round((result.confidence || 0) * 100)}% | Intensité: {Math.round((result.intensity || 0) * 100)}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-md font-semibold">Recommandations</h4>
          <ScrollArea className="h-[150px] w-full space-y-2">
            {result.recommendations && result.recommendations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.recommendations.map((recommendation, index) => 
                  renderRecommendation(recommendation as any, index)
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune recommandation pour le moment.</p>
            )}
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <h4 className="text-md font-semibold">Feedback</h4>
          <p className="text-sm">
            {result.insight || "Aucun feedback disponible."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveEmotionResults;
