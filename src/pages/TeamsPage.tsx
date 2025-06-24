
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Users, UserPlus, Search, Filter, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const TeamsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const teams = [
    {
      id: '1',
      name: 'Équipe Marketing',
      members: 12,
      manager: 'Sophie Dubois',
      wellnessScore: 78,
      activeMembers: 10,
      riskLevel: 'low',
      lastActivity: '2024-01-24'
    },
    {
      id: '2',
      name: 'Développement',
      members: 8,
      manager: 'Thomas Martin',
      wellnessScore: 65,
      activeMembers: 6,
      riskLevel: 'medium',
      lastActivity: '2024-01-23'
    },
    {
      id: '3',
      name: 'Support Client',
      members: 15,
      manager: 'Marie Leroy',
      wellnessScore: 42,
      activeMembers: 11,
      riskLevel: 'high',
      lastActivity: '2024-01-24'
    },
    {
      id: '4',
      name: 'Direction',
      members: 5,
      manager: 'Pierre Durand',
      wellnessScore: 85,
      activeMembers: 5,
      riskLevel: 'low',
      lastActivity: '2024-01-24'
    }
  ];

  const teamMembers = [
    { id: '1', name: 'Sophie Dubois', role: 'Manager', status: 'active', lastSession: '2024-01-24', wellnessScore: 82 },
    { id: '2', name: 'Jean Martin', role: 'Développeur', status: 'active', lastSession: '2024-01-24', wellnessScore: 75 },
    { id: '3', name: 'Emma Leroy', role: 'Designer', status: 'inactive', lastSession: '2024-01-20', wellnessScore: 65 },
    { id: '4', name: 'Lucas Petit', role: 'Marketeur', status: 'at-risk', lastSession: '2024-01-18', wellnessScore: 45 },
  ];

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Faible risque</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Risque modéré</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Risque élevé</Badge>;
      default:
        return <Badge variant="outline">Non évalué</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'at-risk':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Users className="w-8 h-8 mr-3" />
              Gestion des Équipes
            </h1>
            <p className="text-muted-foreground">Suivi du bien-être et de l'engagement de vos équipes</p>
          </div>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Inviter un membre
          </Button>
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Équipes</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Membres</p>
                  <p className="text-2xl font-bold">{teams.reduce((acc, team) => acc + team.members, 0)}</p>
                </div>
                <UserPlus className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Score Moyen</p>
                  <p className="text-2xl font-bold">{Math.round(teams.reduce((acc, team) => acc + team.wellnessScore, 0) / teams.length)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Équipes à Risque</p>
                  <p className="text-2xl font-bold text-red-500">{teams.filter(team => team.riskLevel === 'high').length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="members">Membres</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recherche et filtres */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher une équipe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>

            {/* Liste des équipes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teams.map((team) => (
                <Card key={team.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      {getRiskBadge(team.riskLevel)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Manager</span>
                      <span className="font-medium">{team.manager}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Membres</span>
                      <span className="font-medium">{team.activeMembers}/{team.members} actifs</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Score de bien-être</span>
                        <span className="font-medium">{team.wellnessScore}%</span>
                      </div>
                      <Progress value={team.wellnessScore} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Dernière activité</span>
                      <span>{team.lastActivity}</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Voir détails
                      </Button>
                      <Button size="sm" className="flex-1">
                        Contacter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Membres de l'équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{member.name}</h3>
                            {getStatusIcon(member.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Score: </span>
                          <span className="font-medium">{member.wellnessScore}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Dernière session: {member.lastSession}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendances d'engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Graphique d'engagement (à implémenter avec Recharts)
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Histogramme des scores (à implémenter avec Recharts)
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamsPage;
