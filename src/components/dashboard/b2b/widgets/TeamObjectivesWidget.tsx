
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, Clock } from 'lucide-react';

export const TeamObjectivesWidget: React.FC = () => {
  const objectives = [
    {
      title: 'Bien-être collectif',
      description: 'Maintenir un score d\'équipe > 75%',
      current: 78,
      target: 75,
      status: 'achieved',
      deadline: '2 jours restants'
    },
    {
      title: 'Participation active',
      description: 'Atteindre 80% de participation aux scans',
      current: 72,
      target: 80,
      status: 'in_progress',
      deadline: '1 semaine restante'
    },
    {
      title: 'Engagement social',
      description: 'Interactions dans le Social Cocon',
      current: 45,
      target: 60,
      status: 'attention',
      deadline: '3 jours restants'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'attention': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'achieved': return Trophy;
      case 'in_progress': return Target;
      case 'attention': return Clock;
      default: return Target;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Objectifs d'Équipe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {objectives.map((obj, index) => {
          const StatusIcon = getStatusIcon(obj.status);
          const progress = (obj.current / obj.target) * 100;
          
          return (
            <div key={index} className="space-y-3 p-3 border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon className="h-4 w-4" />
                  <h4 className="font-medium text-sm">{obj.title}</h4>
                </div>
                <Badge className={`text-xs ${getStatusColor(obj.status)}`}>
                  {obj.current}/{obj.target}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground">{obj.description}</p>
              
              <div className="space-y-2">
                <Progress value={Math.min(progress, 100)} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(progress)}% complété</span>
                  <span>{obj.deadline}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
