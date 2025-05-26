
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Smile } from 'lucide-react';

const UnifiedEmotionCheckin: React.FC = () => {
  const quickEmotions = [
    { icon: Smile, label: 'Heureux', color: 'text-green-500' },
    { icon: Heart, label: 'Calme', color: 'text-blue-500' },
    { icon: Brain, label: 'Concentré', color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comment vous sentez-vous aujourd'hui ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {quickEmotions.map((emotion, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <emotion.icon className={`h-6 w-6 ${emotion.color}`} />
                <span className="text-sm">{emotion.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Historique récent</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Aucune analyse récente disponible
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedEmotionCheckin;
