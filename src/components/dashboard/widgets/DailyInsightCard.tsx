
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface DailyInsightCardProps {
  message?: string;
}

const DailyInsightCard: React.FC<DailyInsightCardProps> = ({ 
  message = "Prendre du temps pour soi n'est pas un luxe, c'est une nécessité pour votre équilibre émotionnel et mental. Aujourd'hui, essayez de consacrer au moins 15 minutes à une activité qui vous fait du bien."
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Réflexion du jour</h3>
            <p className="text-muted-foreground text-sm">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyInsightCard;
