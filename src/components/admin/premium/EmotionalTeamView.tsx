import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionalTeamViewProps } from '@/types/emotion'; 
import { Users, BarChart, Shield, AlertTriangle } from 'lucide-react';

const EmotionalTeamView: React.FC<EmotionalTeamViewProps> = ({
  showGraph = true,
  className = '',
  showDetails = false
}) => {
  // Données 100% anonymisées et agrégées (minimum 5 personnes)
  const teamMood = 'positive';
  const teamScore = 68;
  const membersCount = 12; // Toujours ≥ 5 pour respecter RGPD
  const activeToday = 9;

  if (membersCount < 5) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center text-orange-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Données insuffisantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pour respecter la confidentialité, les statistiques d'équipe ne sont affichées 
            que lorsqu'au moins 5 collaborateurs participent.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            <span>Bien-être collectif (anonymisé)</span>
          </div>
          <div className="flex items-center">
            <Shield className="mr-2 h-4 w-4 text-blue-500" />
            {showGraph && <BarChart className="h-4 w-4 text-muted-foreground" />}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Statistiques agrégées</h3>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${teamMood === 'positive' ? 'bg-green-500' : teamMood === 'neutral' ? 'bg-yellow-500' : 'bg-red-500'} mr-2`}></div>
              <span className="text-sm font-medium">{teamScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Participants</p>
              <p className="text-xl font-medium">{membersCount}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Actifs aujourd'hui</p>
              <p className="text-xl font-medium">{activeToday}</p>
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Tendances émotionnelles agrégées</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bien-être général</span>
                  <div className="w-24 h-2 bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-xs">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Engagement</span>
                  <div className="w-24 h-2 bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs">75%</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <div className="flex items-start">
              <Shield className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Données 100% anonymisées
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Aucune information individuelle accessible. 
                  Statistiques agrégées uniquement (min. 5 participants).
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalTeamView;
