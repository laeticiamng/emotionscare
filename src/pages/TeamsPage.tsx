
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, UserCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

// Mock data
const teams = [
  { 
    id: '1', 
    name: 'Développement', 
    members: 8, 
    wellbeingScore: 78,
    description: 'Équipe en charge du développement logiciel',
    leader: 'Jean Dupont',
    activeUsers: 6
  },
  { 
    id: '2', 
    name: 'Marketing', 
    members: 6, 
    wellbeingScore: 82,
    description: 'Équipe en charge du marketing et de la communication',
    leader: 'Marie Martin',
    activeUsers: 5
  },
  { 
    id: '3', 
    name: 'Design', 
    members: 4, 
    wellbeingScore: 75,
    description: 'Équipe en charge du design et de l'UX/UI',
    leader: 'Sophie Petit',
    activeUsers: 4
  }
];

const members = [
  { id: '1', name: 'Jean Dupont', role: 'Chef de projet', team: 'Développement', lastActive: '3h' },
  { id: '2', name: 'Marie Martin', role: 'Marketing manager', team: 'Marketing', lastActive: '1j' },
  { id: '3', name: 'Paul Bernard', role: 'Développeur', team: 'Développement', lastActive: '2h' },
  { id: '4', name: 'Sophie Petit', role: 'Designer', team: 'Design', lastActive: '5h' },
  { id: '5', name: 'Thomas Roux', role: 'Développeur', team: 'Développement', lastActive: '1h' },
  { id: '6', name: 'Claire Dubois', role: 'Marketeur digital', team: 'Marketing', lastActive: '30m' },
];

const TeamsPage: React.FC = () => {
  return (
    <UnifiedLayout>
      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Équipes</h1>
            <p className="text-muted-foreground">
              Gérez vos équipes et suivez leur bien-être émotionnel
            </p>
          </div>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Nouvelle équipe
          </Button>
        </div>
        
        <Tabs defaultValue="teams">
          <TabsList className="mb-6">
            <TabsTrigger value="teams" className="flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              Équipes
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center">
              <UserCircle2 className="mr-2 h-4 w-4" />
              Membres
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-medium">{team.name}</CardTitle>
                          <CardDescription>{team.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {team.members} membres
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Score de bien-être</span>
                          <span className="font-medium">{team.wellbeingScore}%</span>
                        </div>
                        
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${team.wellbeingScore >= 80 ? 'bg-green-500' : team.wellbeingScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${team.wellbeingScore}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{team.activeUsers}</span>/{team.members} actifs
                          </div>
                          <Button size="sm" variant="ghost">
                            Détails <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: teams.length * 0.1 }}
              >
                <Card className="border-dashed flex items-center justify-center h-full">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Building2 className="h-10 w-10 text-muted-foreground mb-4" />
                    <Button variant="secondary">
                      Ajouter une équipe
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Membres de l'organisation</CardTitle>
                <CardDescription>
                  {members.length} membres répartis dans différentes équipes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src="" />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-4">{member.team}</Badge>
                        <div className="text-sm text-muted-foreground">
                          Actif il y a <span className="font-medium">{member.lastActive}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
