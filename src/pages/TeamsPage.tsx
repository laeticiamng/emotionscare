
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageSquare, UserPlus, BarChart2, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
}

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = React.useState<Team[]>([
    {
      id: '1',
      name: 'Équipe marketing',
      description: 'Équipe responsable des campagnes marketing et de la communication',
      members: [
        { id: '1', name: 'Sophie Martin', role: 'Responsable marketing', status: 'online' },
        { id: '2', name: 'Thomas Durand', role: 'Graphiste', status: 'offline', lastActive: 'Il y a 2h' },
        { id: '3', name: 'Julie Petit', role: 'Community manager', status: 'away', lastActive: 'Il y a 30m' },
      ],
      createdAt: '12/01/2025'
    },
    {
      id: '2',
      name: 'Équipe développement',
      description: 'Équipe responsable du développement de produits',
      members: [
        { id: '4', name: 'Antoine Dupont', role: 'Lead developer', status: 'online' },
        { id: '5', name: 'Camille Blanc', role: 'UX Designer', status: 'online' },
        { id: '6', name: 'Lucas Moreau', role: 'Backend developer', status: 'away', lastActive: 'Il y a 1h' },
      ],
      createdAt: '18/02/2025'
    },
  ]);

  return (
    <UnifiedLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Gestion des équipes
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos équipes et leurs membres
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus size={16} />
            Nouvelle équipe
          </Button>
        </motion.div>

        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="teams">Équipes</TabsTrigger>
            <TabsTrigger value="members">Membres</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-6">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{team.name}</CardTitle>
                    <CardDescription>{team.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <Users className="h-4 w-4" /> Membres ({team.members.length})
                        </h3>
                        <div className="flex flex-col gap-2">
                          {team.members.map(member => (
                            <div key={member.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{member.name}</p>
                                  <p className="text-xs text-muted-foreground">{member.role}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  member.status === 'online' ? 'bg-green-500' : 
                                  member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-300'
                                }`} />
                                <span className="text-xs text-muted-foreground">
                                  {member.status === 'online' ? 'En ligne' : 
                                   member.status === 'away' ? member.lastActive : 'Hors ligne'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-col gap-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                              <Calendar className="h-4 w-4" /> Créée le
                            </h3>
                            <p className="text-sm">{team.createdAt}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                              <BarChart2 className="h-4 w-4" /> Statistiques
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-muted p-2 rounded-md">
                                <p className="text-xs text-muted-foreground">Sessions</p>
                                <p className="text-lg font-semibold">23</p>
                              </div>
                              <div className="bg-muted p-2 rounded-md">
                                <p className="text-xs text-muted-foreground">Activités</p>
                                <p className="text-lg font-semibold">47</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            Message
                          </Button>
                          <Button size="sm">Gérer</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Tous les membres</CardTitle>
                <CardDescription>
                  Liste complète des membres de toutes les équipes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teams.flatMap(team => team.members).map(member => (
                    <div key={member.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Voir profil</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytiques d'équipe</CardTitle>
                <CardDescription>
                  Métriques et statistiques des performances d'équipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total des équipes</h3>
                    <p className="text-3xl font-bold">{teams.length}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total des membres</h3>
                    <p className="text-3xl font-bold">{teams.reduce((acc, team) => acc + team.members.length, 0)}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Taux d'activité</h3>
                    <p className="text-3xl font-bold">78%</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-4">Activité hebdomadaire</h3>
                  <div className="h-48 bg-muted/50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Graphique d'activité hebdomadaire</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
};

export default TeamsPage;
