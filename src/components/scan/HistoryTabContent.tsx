
import React from 'react';
import { EmotionResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoryTabContentProps {
  emotionHistory: EmotionResult[];
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ emotionHistory }) => {
  const formatDate = (dateValue: string | Date | undefined) => {
    if (!dateValue) return 'Date inconnue';
    try {
      return format(new Date(dateValue), 'PPP', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Historique des scans émotionnels</h2>
      
      {emotionHistory.length > 0 ? (
        <div className="grid gap-4">
          {emotionHistory.map((result, index) => (
            <Card key={result.id || `emotion-${index}`} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">{result.emotion}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(result.date || result.timestamp)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Intensité:</span>
                    <span className="font-semibold">{Math.round((result.score || 0) * 100)}%</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${Math.round((result.score || 0) * 100)}%` }}
                    ></div>
                  </div>
                  
                  {result.text && (
                    <div className="mt-2">
                      <p className="text-sm italic">{result.text}</p>
                    </div>
                  )}
                  
                  {(result.ai_feedback || result.feedback) && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm">{result.ai_feedback || result.feedback}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Aucun historique disponible</p>
          <p className="text-sm text-muted-foreground">Effectuez votre premier scan pour commencer à suivre vos émotions.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryTabContent;
