
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { DailyInsightCardProps } from '@/types/widgets';

const DailyInsightCard: React.FC<DailyInsightCardProps> = ({ 
  message = "Prenez un moment pour vous aujourd'hui et pratiquez la respiration profonde."
}) => {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-medium mb-1">Conseil du jour</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyInsightCard;
