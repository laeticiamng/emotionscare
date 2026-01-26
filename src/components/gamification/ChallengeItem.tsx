// @ts-nocheck

import React from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';

interface ChallengeItemProps {
  id: string;
  title: string;
  description: string;
  points: number;
  isCompleted: boolean;
  onComplete: (id: string) => void;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({ 
  id, 
  title, 
  description, 
  points, 
  isCompleted, 
  onComplete 
}) => {
  return (
    <Card className={isCompleted ? 'border-green-200 bg-green-50/30 dark:bg-green-900/10' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Circle className="h-5 w-5 mr-2" />
              )}
              {title}
            </CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
          </div>
          <Badge variant={isCompleted ? "outline" : "secondary"} className="ml-2">
            {points} points
          </Badge>
        </div>
      </CardHeader>
      {!isCompleted && (
        <CardFooter className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            onClick={() => onComplete(id)}
          >
            Compléter
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ChallengeItem;
