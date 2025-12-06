
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Lock } from 'lucide-react';

interface BadgeCardProps {
  name: string;
  description: string;
  iconUrl?: string;
  isEarned: boolean;
  progress: number;
  threshold: number;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  description,
  iconUrl,
  isEarned,
  progress,
  threshold
}) => {
  return (
    <Card className={`transition-all ${isEarned ? 'border-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-center pb-2">
        <div className={`relative flex h-16 w-16 items-center justify-center rounded-full ${
          isEarned ? 'bg-primary/10' : 'bg-muted'
        }`}>
          {iconUrl ? (
            <img 
              src={iconUrl} 
              alt={name} 
              className="h-10 w-10"
              onError={(e) => {
                // If icon fails to load, show fallback
                (e.target as HTMLImageElement).style.display = 'none';
                e.currentTarget.parentElement?.classList.add('show-fallback');
              }}
            />
          ) : (
            <Award className={`h-8 w-8 ${isEarned ? 'text-primary' : 'text-muted-foreground'}`} />
          )}

          {!isEarned && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground text-white">
              <Lock className="h-3 w-3" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="text-center pb-2">
        <h3 className={`font-medium ${isEarned ? 'text-primary' : ''}`}>{name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>

      <CardFooter className="flex-col space-y-2">
        <Progress value={progress} className="w-full h-2" />
        <div className="text-xs text-muted-foreground">
          {isEarned ? 'Débloqué' : `${Math.round(progress)}% - ${threshold} points requis`}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BadgeCard;
