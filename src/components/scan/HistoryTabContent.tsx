// @ts-nocheck

import React from 'react';
import { Card } from '@/components/ui/card';
import { EmotionResult } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoryTabContentProps {
  emotionHistory: EmotionResult[];
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ emotionHistory }) => {
  if (emotionHistory.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p>Vous n'avez pas encore d'historique d'émotions.</p>
        <p className="text-muted-foreground mt-2">Effectuez votre première analyse émotionnelle pour commencer à suivre vos émotions.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Historique des analyses</h3>
      
      {emotionHistory.map((item) => (
        <Card key={item.id} className="p-4 hover:bg-accent/10 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{item.emotion}</p>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                Score: {Math.round(item.score * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: fr })}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HistoryTabContent;
