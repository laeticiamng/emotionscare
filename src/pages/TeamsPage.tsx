
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, Settings, TrendingUp, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TeamsPage: React.FC = () => {
  const { toast } = useToast();

  const teams = [
    {
      id: 1,
      name: "Service Urgences",
      members: 24,
      avgWellbeing: 78,
      trend: 5,
      status: "good",
      lastScan: "Il y a 2h",
      manager: "Dr. Martin",
      riskLevel: "Faible"
    },
    {
      id: 2,
      name: "Équipe Chirurgie",
      members: 18,
      avgWellbeing: 65,
      trend: -8,
      status: "attention",
      lastScan: "Il y a 4h",
      manager: "Dr. Laurent",
      riskLevel: "Moyen"
    },
    {
      id: 3,
      name: "Personnel Administration",
      members: 32,
      avgWellbeing: 82,
      trend: 12,
      status: "excellent",
      lastScan: "Il y a 1h",
      manager: "Marie Dubois",
      riskLevel: "Très faible"
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Dr. Sarah Martin",
      role: "Chef de service",
      wellbeing: 85,
      lastActive: "Maintenant",
      status: "online",
      riskScore: 15
    },
    {
      id: 2,
      name: "Infirmier Paul",
      role: "Infirmier senior",
      wellbeing: 72,
      lastActive: "Il y a 1h",
      status: "away",
      riskScore: 28
    },
    {
      id: 3,
      name: "Julie Moreau",
      role: "Secrétaire médicale",
      wellbeing: 90,
      lastActive: "Il y a 30min",
      status: "online",
      riskScore: 8
    },
    {
      id: 4,
      name: "Dr. Marc Durand",
      role: "Médecin",
      wellbeing: 58,
      lastActive: "Il y a 3h",
      status: "offline",
      riskScore: 42
    }
  ];

  const interventions = [
    {
      id: 1,
      type: "Alerte",
      title: "Niveau de stress élevé détecté",
      team: "Service Urgences",
      severity: "high",
      time: "Il y a 30min",
      suggestion: "Organiser une session de debriefing"
    },
    {
      id: 2,
      type: "Recommandation",
      title: "Amélioration continue observée",
      team: "Administration",
      severity: "low",
      time: "Il y a 2h",
      suggestion: "Maintenir les pratiques actuelles"
    }
  ];

  const analytics = {
    totalEmployees: 186,
    activeToday: 134,
    avgTeamWellbeing: 75,
    riskAlerts: 3,
    monthlyImprovement: 8.5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6" data-testid="page-root">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Équipes</h1>
          <p className="text-gray-600">Tableau de bord du bien-être organisationnel</p>
        </div>

        {/* Analytics globales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.totalEmployees}</div>
              <p className="text-sm text-gray-600">Employés totaux</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{analytics.activeToday}</div>
              <p className="text-sm text-gray-600">Actifs aujourd'hui</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.avgTeamWellbeing}%</div>
              <p className="text-sm text-gray-600">Bien-être moyen</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{analytics.riskAlerts}</div>
              <p className="text-sm text-gray-600">Alertes actives</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-500 mr-1" />
                <span className="text-3xl font-bold text-green-600">+{analytics.monthlyImprovement}%</span>
              </div>
              <p className="text-sm text-gray-600">Amélioration mensuelle</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="teams" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="teams">Équipes</TabsTrigger>
            <TabsTrigger value="members">Membres</TabsTrigger>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Vue d'ensemble des équipes</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer une équipe
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.id} className={team.status === 'attention' ? 'border-orange-200 bg-orange-50' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <Badge 
                        variant={team.status === 'excellent' ? 'default' : team.status === 'attention' ? 'destructive' : 'secondary'}
                      >
                        {team.riskLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Bien-être moyen</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{team.avgWellbeing}%</span>
                        <span className={`text-xs ${team.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {team.trend >= 0 ? '+' : ''}{team.trend}%
                        </span>
                      </div>
                    </div>
                    
                    <Progress value={team.avgWellbeing} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Membres</span>
                        <p className="font-medium">{team.members}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Manager</span>
                        <p className="font-medium text-xs">{team.manager}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-1" />
                        Gérer
                      </Button>
                      <Button size="sm" className="flex-1">
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Membres de l'équipe</h2>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un membre
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50">
                      <Avatar>
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{member.name}</h3>
                          <div className={`w-2 h-2 rounded-full ${
                            member.status === 'online' ? 'bg-green-500' : 
                            member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-xs text-gray-500">{member.lastActive}</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold">{member.wellbeing}%</div>
                        <p className="text-xs text-gray-600">Bien-être</p>
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-lg font-bold ${
                          member.riskScore < 20 ? 'text-green-600' : 
                          member.riskScore < 35 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {member.riskScore}
                        </div>
                        <p className="text-xs text-gray-600">Score risque</p>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        Voir profil
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-6">
            <h2 className="text-2xl font-bold">Interventions & Recommandations</h2>
            
            <div className="space-y-4">
              {interventions.map((intervention) => (
                <Card key={intervention.id} className={intervention.severity === 'high' ? 'border-red-200 bg-red-50' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {intervention.severity === 'high' ? (
                          <AlertCircle className="h-6 w-6 text-red-500 mt-1" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{intervention.title}</h3>
                            <Badge variant={intervention.severity === 'high' ? 'destructive' : 'secondary'}>
                              {intervention.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{intervention.team}</p>
                          <p className="text-sm text-blue-600">{intervention.suggestion}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{intervention.time}</p>
                        <Button size="sm" className="mt-2">
                          Agir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics Avancées</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du bien-être par équipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Graphique d'évolution temporelle
                    <br />
                    (Intégration charts à venir)
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribution des scores de risque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Graphique de distribution
                    <br />
                    (Intégration charts à venir)
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
