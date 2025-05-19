
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionalTeamViewProps } from '@/types/emotion'; 
import { Users, BarChart } from 'lucide-react';

const EmotionalTeamView: React.FC<EmotionalTeamViewProps> = ({
  teamId,
  period = 'week',
  anonymized = false,
  dateRange,
  showGraph = true,
  showMembers = true,
  className = '',
  showDetails = false
}) => {
  // Données simulées pour la démo
  const teamMood = 'positive';
  const teamScore = 78;
  const membersCount = 12;
  const activeToday = 9;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            <span>Bien-être de l'équipe</span>
          </div>
          {showGraph && <BarChart className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Équipe {teamId}</h3>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${teamMood === 'positive' ? 'bg-green-500' : teamMood === 'neutral' ? 'bg-yellow-500' : 'bg-red-500'} mr-2`}></div>
              <span className="text-sm font-medium">{teamScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Membres</p>
              <p className="text-xl font-medium">{membersCount}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Actifs aujourd'hui</p>
              <p className="text-xl font-medium">{activeToday}</p>
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Émotions dominantes</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Calme</span>
                  <div className="w-24 h-2 bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-xs">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Heureux</span>
                  <div className="w-24 h-2 bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-xs">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stressé</span>
                  <div className="w-24 h-2 bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <span className="text-xs">15%</span>
                </div>
              </div>
            </div>
          )}

          {showMembers && !anonymized && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Les plus actifs</h4>
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-primary/10 border border-background flex items-center justify-center text-xs font-medium">
                    {['JD', 'ML', 'AR', 'TP', 'SB'][i]}
                  </div>
                ))}
                {membersCount > 5 && (
                  <div className="w-8 h-8 rounded-full bg-muted border border-background flex items-center justify-center text-xs font-medium">
                    +{membersCount - 5}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalTeamView;
