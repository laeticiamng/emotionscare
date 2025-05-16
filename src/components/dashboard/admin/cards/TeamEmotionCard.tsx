
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface TeamEmotionCardProps {
  title?: string;
  emotions: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const TeamEmotionCard: React.FC<TeamEmotionCardProps> = ({
  title = "Émotions de l'équipe",
  emotions
}) => {
  // Find the dominant emotion (highest value)
  const dominantEmotion = emotions.reduce(
    (max, emotion) => (emotion.value > max.value ? emotion : max),
    emotions[0] || { name: 'Neutre', value: 0, color: '#888' }
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-around mb-4">
          <div className="w-24 h-24">
            <CircularProgressbar
              value={dominantEmotion.value}
              maxValue={100}
              text={`${Math.round(dominantEmotion.value)}%`}
              styles={buildStyles({
                pathColor: dominantEmotion.color,
                textColor: dominantEmotion.color,
                trailColor: '#eee',
              })}
            />
          </div>
          <div>
            <h3 className="text-xl font-medium">{dominantEmotion.name}</h3>
            <p className="text-muted-foreground text-sm">Émotion dominante</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {emotions.map((emotion) => (
            <div key={emotion.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm">{emotion.name}</span>
                <span className="text-sm text-muted-foreground">{emotion.value}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${emotion.value}%`,
                    backgroundColor: emotion.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamEmotionCard;
