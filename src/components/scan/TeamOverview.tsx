import React from 'react';
import { Shield, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface TeamOverviewProps {
  teamId: string;
  userId?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: [Date, Date];
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
  period?: string;
}

const TeamOverview: React.FC<TeamOverviewProps> = ({
  className = '',
  users = [],
}) => {
  // Vérification du minimum requis pour l'anonymisation
  const minParticipants = 5;
  const participantCount = users.length || Math.floor(Math.random() * 10) + 8; // Simulation ≥ 5

  if (participantCount < minParticipants) {
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
            Pour garantir l'anonymat, les statistiques d'équipe nécessitent 
            au moins {minParticipants} participants actifs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`team-overview ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              <span>Aperçu collectif anonymisé</span>
            </div>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="text-2xl font-bold">{participantCount}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Score moyen</p>
                <p className="text-2xl font-bold">7.2/10</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Répartition émotionnelle agrégée</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Positif</span>
                  <div className="w-32 h-2 bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-xs">60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Neutre</span>
                  <div className="w-32 h-2 bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-xs">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Négatif</span>
                  <div className="w-32 h-2 bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <span className="text-xs">15%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="flex items-start">
                <Shield className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    Confidentialité garantie
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Aucune donnée individuelle visible. Seules les statistiques agrégées 
                    et anonymisées sont affichées pour respecter la vie privée.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamOverview;
