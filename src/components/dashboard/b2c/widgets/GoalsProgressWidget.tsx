// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle } from 'lucide-react';

export const GoalsProgressWidget: React.FC = () => {
  const goals = [
    {
      title: 'Scans quotidiens',
      current: 5,
      target: 7,
      color: 'blue'
    },
    {
      title: 'Minutes de méditation',
      current: 120,
      target: 150,
      color: 'green'
    },
    {
      title: 'Entrées journal',
      current: 4,
      target: 5,
      color: 'purple'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Objectifs de la Semaine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          const isCompleted = goal.current >= goal.target;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {goal.title}
                </span>
                <span className="text-sm text-muted-foreground">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <Progress 
                value={Math.min(progress, 100)} 
                className="h-2"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
