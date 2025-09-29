
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface StoryNotificationProps {
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

const StoryNotification: React.FC<StoryNotificationProps> = ({
  position = 'bottom-right'
}) => {
  // Positioning classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-4 left-4'
  };
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-sm`}>
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Nouvelle histoire disponible</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Découvrez comment améliorer votre bien-être quotidien
              </p>
              <Button size="sm" variant="default">Lire</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryNotification;
