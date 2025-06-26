
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, Search, UserPlus, Settings, BarChart3, Shield, Mail } from 'lucide-react';
import { toast } from 'sonner';

const TeamsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockTeams = [
    {
      id: 1,
      name: 'Équipe Cardiologie',
      members: 12,
      activeMembers: 8,
      status: 'active',
      lead: 'Dr. Martin Dubois',
      lastActivity: '2 heures',
      wellnessScore: 87
    },
    {
      id: 2,
      name: 'Service Urgences',
      members: 24,
      activeMembers: 18,
      status: 'active',
      lead: 'Pr. Sarah Leroy',
      lastActivity: '30 minutes',
      wellnessScore: 72
    },
    {
      id: 3,  
      name: 'Équipe Pédiatrie',
      members: 8,
      activeMembers: 6,
      status: 'active',
      lead: 'Dr. Claire Monet',
      lastActivity: '1 heure',
      wellnessScore: 91
    }
  ];

  const mockMembers = [
    { name: 'Dr. Martin Dubois', role: 'Chef de service', team: 'Cardiologie', status: 'online', lastSeen: 'En ligne' },
    { name: 'Inf. Julie Moreau', role: 'Infirmière', team: 'Cardiologie', status: 'away', lastSeen: '15 min' },
    { name: 'Pr. Sarah Leroy', role: 'Professeur', team: 'Urgences', status: 'online', lastSeen: 'En ligne' },
    { name: 'Dr. Claire Monet', role: 'Médecin', team: 'Pédiatrie', status: 'offline', lastSeen: '2 heures' }
  ];

  const handleInviteUser = () => {
    toast.success('Invitation envoyée avec succès !');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getWellnessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" data-testid="page-root">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Gestion des Équipes
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Organisez et supervisez vos équipes de soins
              </p>
            </div>
            <Button onClick={handleInviteUser} size="lg">
              <UserPlus className="h-4 w-4 mr-2" />
              Inviter un utilisateur
            </Button>
          </div>

          <Tabs defaultValue="teams" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="teams">Équipes</TabsTrigger>
              <TabsTrigger value="members">Membres</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="teams" className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une équipe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle équipe
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTeams.map((team) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: team.id * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                            {team.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          Dirigée par {team.lead}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Membres:</span>
                            <p className="font-semibold">{team.members}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Actifs:</span>
                            <p className="font-semibold">{team.activeMembers}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Dernière activité:</span>
                            <p className="font-semibold">{team.lastActivity}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Score bien-être:</span>
                            <p className={`font-semibold ${getWellnessColor(team.wellnessScore)}`}>
                              {team.wellnessScore}%
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="h-4 w-4 mr-2" />
                            Gérer
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Stats
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="space-y-4">
                {mockMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={`/api/placeholder/40/40`} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline">{member.team}</Badge>
                                <p className="text-sm text-muted-foreground mt-1">{member.lastSeen}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Shield className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Équipes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+2 ce mois</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Membres Actifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">156</div>
                    <p className="text-xs text-muted-foreground">85% de taux d'activité</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">83%</div>
                    <p className="text-xs text-muted-foreground">+5% vs mois dernier</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Engagements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,847</div>
                    <p className="text-xs text-muted-foreground">Sessions cette semaine</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamsPage;
