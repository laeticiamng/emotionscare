// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface EmotionData {
  emotion: string;
  percentage: number;
  color: string;
}

interface TeamEmotionCardProps {
  title?: string;
  emotions: EmotionData[];
  period?: string;
}

const TeamEmotionCard: React.FC<TeamEmotionCardProps> = ({
  title = "Émotions d'équipe",
  emotions = [],
  period = "Cette semaine"
}) => {
  // Find the dominant emotion (highest percentage)
  const dominantEmotion = [...emotions].sort((a, b) => b.percentage - a.percentage)[0];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{period}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {dominantEmotion ? (
            <>
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={dominantEmotion.percentage}
                  text={`${Math.round(dominantEmotion.percentage)}%`}
                  styles={buildStyles({
                    pathColor: dominantEmotion.color,
                    textColor: dominantEmotion.color,
                    trailColor: 'hsl(var(--muted))'
                  })}
                />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">
                  {dominantEmotion.emotion.charAt(0).toUpperCase() + dominantEmotion.emotion.slice(1)}
                </p>
                <p className="text-sm text-muted-foreground">Émotion dominante</p>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Aucune donnée d'émotion disponible
            </div>
          )}
          
          <div className="w-full grid grid-cols-2 gap-2 mt-4">
            {emotions.map((emotion) => (
              <div key={emotion.emotion} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: emotion.color }}
                  ></div>
                  <span className="text-sm">{emotion.emotion.charAt(0).toUpperCase() + emotion.emotion.slice(1)}</span>
                </div>
                <span className="text-sm font-medium">{Math.round(emotion.percentage)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamEmotionCard;
