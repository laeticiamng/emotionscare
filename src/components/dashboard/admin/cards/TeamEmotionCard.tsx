
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TeamEmotionCard: React.FC = () => {
  const emotionalScore = 76;
  const positivePercentage = 65;
  const neutralPercentage = 25;
  const negativePercentage = 10;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Climat Émotionnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Score global</h3>
            <div className="flex items-baseline mt-1">
              <span className="text-3xl font-bold">{emotionalScore}</span>
              <span className="text-sm text-muted-foreground ml-1">/100</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Score positif à maintenir
            </p>
          </div>
          
          <div className="w-24 h-24">
            <CircularProgressbar
              value={emotionalScore}
              text={`${emotionalScore}%`}
              styles={buildStyles({
                textSize: '16px',
                pathColor: emotionalScore > 70 ? '#10B981' : emotionalScore > 50 ? '#F59E0B' : '#EF4444',
                textColor: '#6B7280',
                trailColor: '#E5E7EB',
              })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Émotions positives</span>
              <span>{positivePercentage}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${positivePercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Émotions neutres</span>
              <span>{neutralPercentage}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-400 rounded-full" 
                style={{ width: `${neutralPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Émotions négatives</span>
              <span>{negativePercentage}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${negativePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamEmotionCard;
