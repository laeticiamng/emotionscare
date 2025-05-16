
import React from 'react';
import { EmotionResult } from '@/types/emotion';
import EmotionTrendChart from './EmotionTrendChart';
import { Card } from '@/components/ui/card';

interface HistoryTabContentProps {
  results: EmotionResult[];
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ results = [] }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Aucun historique d'analyse émotionnelle disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-xl font-medium mb-4">Tendances émotionnelles</h3>
        <EmotionTrendChart data={results} height={300} />
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">Historique des analyses</h3>
        
        {results.map((result, index) => (
          <Card key={result.id || index} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{result.emotion}</h4>
                <p className="text-sm text-muted-foreground">
                  {result.timestamp ? new Date(result.timestamp).toLocaleString() : 'Date inconnue'}
                </p>
                {result.text && (
                  <p className="mt-2 text-sm border-l-2 border-primary pl-3 italic">
                    {result.text}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">
                  {Math.round(result.score * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Confiance: {Math.round(result.confidence * 100)}%
                </div>
              </div>
            </div>
            
            {result.feedback && (
              <div className="mt-3 pt-3 border-t text-sm">
                <p className="font-medium">Feedback:</p>
                <p className="text-muted-foreground">{result.feedback}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryTabContent;
