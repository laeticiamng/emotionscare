
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface ChallengeItemProps {
  title: string;
  description: string;
  points: number;
  isCompleted: boolean;
  onComplete: (challengeId: string) => void;
  id: string;
  isLoading?: boolean;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({
  title,
  description,
  points,
  isCompleted,
  onComplete,
  id,
  isLoading = false
}) => {
  return (
    <Card className={`transition-all ${isCompleted ? 'border-primary/30 bg-primary/5' : ''}`}>
      <CardContent className="pt-6 pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <h3 className="font-medium">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {points} points
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button
          variant={isCompleted ? "secondary" : "default"}
          size="sm"
          onClick={() => onComplete(id)}
          disabled={isCompleted || isLoading}
          className="ml-7"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              En cours...
            </>
          ) : isCompleted ? (
            'Complété'
          ) : (
            'Marquer comme complété'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeItem;
