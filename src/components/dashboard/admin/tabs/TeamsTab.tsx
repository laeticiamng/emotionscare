
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui';
import { Progress } from '@/components/ui';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, ArrowUpRight } from 'lucide-react';

// Exemple de données fictives pour le tableau de bord des équipes
const teamData = [
  {
    id: '1',
    name: 'Équipe Innovation',
    members: 8,
    activities: 42,
    engagementScore: 78,
    trend: 'up',
    lastActive: '2h'
  },
  {
    id: '2',
    name: 'Marketing',
    members: 12,
    activities: 36,
    engagementScore: 65,
    trend: 'stable',
    lastActive: '4h'
  },
  {
    id: '3',
    name: 'Développement',
    members: 15,
    activities: 89,
    engagementScore: 92,
    trend: 'up',
    lastActive: '30m'
  },
  {
    id: '4',
    name: 'Support Client',
    members: 7,
    activities: 23,
    engagementScore: 54,
    trend: 'down',
    lastActive: '1j'
  }
];

const TeamsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* En-tête avec KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">{teamData.length}</div>
              <div className="bg-primary/10 p-1.5 rounded-full">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Membres Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">
                {teamData.reduce((sum, team) => sum + team.members, 0)}
              </div>
              <Badge variant="outline" className="whitespace-nowrap">
                <TrendingUp className="h-3.5 w-3.5 text-success mr-1" />
                <span>+12%</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">
                {Math.round(teamData.reduce((sum, team) => sum + team.engagementScore, 0) / teamData.length)}%
              </div>
              <div className="bg-primary/10 p-1.5 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tableau des équipes */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu des équipes</CardTitle>
          <CardDescription>Statistiques d'utilisation et d'engagement par équipe</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="text-right">Membres</TableHead>
                <TableHead className="text-right">Activités</TableHead>
                <TableHead className="text-right">Engagement</TableHead>
                <TableHead className="text-center">Tendance</TableHead>
                <TableHead className="text-right">Dernière activité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamData.map(team => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell className="text-right">{team.members}</TableCell>
                  <TableCell className="text-right">{team.activities}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Progress 
                        value={team.engagementScore} 
                        className="h-2 w-16"
                        style={{
                          backgroundColor: team.engagementScore > 75 
                            ? 'var(--success-light)' 
                            : team.engagementScore > 50 
                              ? 'var(--warning-light)' 
                              : 'var(--error-light)',
                          color: team.engagementScore > 75 
                            ? 'var(--success)' 
                            : team.engagementScore > 50 
                              ? 'var(--warning)' 
                              : 'var(--error)'
                        }}
                      />
                      <span>{team.engagementScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {team.trend === 'up' && <TrendingUp className="h-4 w-4 text-success mx-auto" />}
                    {team.trend === 'down' && <TrendingUp className="h-4 w-4 text-error transform rotate-180 mx-auto" />}
                    {team.trend === 'stable' && <span className="text-muted-foreground">―</span>}
                  </TableCell>
                  <TableCell className="text-right">{team.lastActive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamsTab;
