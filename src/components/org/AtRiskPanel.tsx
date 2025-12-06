// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { OrgWeekly } from '@/store/org.store';

interface AtRiskPanelProps {
  data: OrgWeekly;
}

/**
 * Panel listant les équipes nécessitant une attention particulière
 * Utilise un langage neutre et bienveillant
 */
export const AtRiskPanel: React.FC<AtRiskPanelProps> = ({ data }) => {
  const eligibleTeams = data.teams.filter(team => team.eligible);

  // Identifie les équipes avec plusieurs jours consécutifs "low"
  const atRiskTeams = eligibleTeams.filter(team => {
    if (!team.days || team.days.length < 2) return false;
    
    const lastTwoDays = team.days.slice(-2);
    return lastTwoDays.every(day => day.bucket === 'low');
  });

  // Équipes avec tendance "down"
  const decliningTeams = eligibleTeams.filter(team => 
    team.trend === 'down' && !atRiskTeams.find(r => r.team_id === team.team_id)
  );

  if (atRiskTeams.length === 0 && decliningTeams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Situation générale
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Aucune équipe ne nécessite d'attention particulière pour le moment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Équipes à accompagner
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Équipes à risque élevé */}
        {atRiskTeams.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-amber-800 mb-2">
              Besoin d'attention immédiate
            </h4>
            <div className="space-y-2">
              {atRiskTeams.map(team => (
                <div 
                  key={team.team_id}
                  className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {team.team_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Plusieurs jours en mode calme
                    </p>
                  </div>
                  <Badge variant="outline" className="text-amber-700 border-amber-300">
                    Priorité
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Équipes en déclin */}
        {decliningTeams.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-blue-800 mb-2">
              Tendance à surveiller
            </h4>
            <div className="space-y-2">
              {decliningTeams.map(team => (
                <div 
                  key={team.team_id}
                  className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {team.team_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Évolution en baisse récente
                    </p>
                  </div>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    Suivi
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conseils d'accompagnement */}
        <Alert>
          <AlertDescription className="text-xs">
            <strong>Conseils :</strong> Organiser un point équipe informel, 
            proposer des activités collectives ou vérifier la charge de travail.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};