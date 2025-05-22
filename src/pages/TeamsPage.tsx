
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { UserIcon, Users, Activity, Calendar, ChevronRight, BuildingCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeamsPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Espace Équipes</h1>
          <p className="text-muted-foreground mb-6">
            Gérez vos équipes et suivez leur bien-être au quotidien
          </p>
        </motion.div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="members">Membres</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Membres actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end">
                    <div className="text-3xl font-bold">24</div>
                    <Badge variant="outline" className="ml-2 mb-1">+3 ce mois</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Score bien-être</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end">
                    <div className="text-3xl font-bold">78%</div>
                    <Badge className="ml-2 mb-1 bg-green-600">+5%</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sessions complétées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end">
                    <div className="text-3xl font-bold">182</div>
                    <Badge className="ml-2 mb-1 bg-green-600">+12%</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Minutes de bien-être</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end">
                    <div className="text-3xl font-bold">2340</div>
                    <Badge variant="outline" className="ml-2 mb-1">~98/membre</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Équipes actives</CardTitle>
                  <CardDescription>Équipes les plus engagées ce mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Développement', 'Marketing', 'Design', 'RH'].map((team, i) => (
                      <div key={team} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3`}>
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{team}</p>
                            <p className="text-sm text-muted-foreground">{8 - i} membres actifs</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <p className="font-medium">{95 - i * 5}%</p>
                            <p className="text-xs text-muted-foreground">Engagement</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sessions à venir</CardTitle>
                  <CardDescription>Prochains événements de bien-être</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Méditation guidée</p>
                          <p className="text-sm text-muted-foreground">Demain, 10:00</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-background -ml-2">
                          <AvatarFallback>MR</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground ml-1">+6 autres</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Cohésion d'équipe</p>
                          <p className="text-sm text-muted-foreground">Jeudi, 14:30</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-background -ml-2">
                          <AvatarFallback>CD</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground ml-1">+12 autres</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Voir toutes les sessions
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Membres de l'équipe</CardTitle>
                  <CardDescription>Gérez les membres et leurs accès</CardDescription>
                </div>
                <Button>Ajouter un membre</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {name: 'Sophie Martin', role: 'Manager', dept: 'Marketing', score: 86},
                    {name: 'Thomas Dubois', role: 'Designer', dept: 'Design', score: 92},
                    {name: 'Emma Leclerc', role: 'Développeur', dept: 'Tech', score: 78},
                    {name: 'Lucas Bernard', role: 'Analyste', dept: 'Données', score: 84},
                    {name: 'Julie Moreau', role: 'RH', dept: 'Ressources', score: 89},
                  ].map((member, i) => (
                    <div key={member.name} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role} • {member.dept}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">Score</div>
                          <div className={`text-sm ${member.score > 85 ? 'text-green-500' : 'text-amber-500'}`}>
                            {member.score}%
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Exporter</Button>
                <Button variant="outline" size="sm">Voir tous</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytiques d'équipe</CardTitle>
                <CardDescription>Tendances et métriques de bien-être</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <BuildingCog className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">Analytiques détaillées</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Accédez à des statistiques complètes sur le bien-être de votre équipe,
                    avec des graphiques d'évolution et des recommandations personnalisées.
                  </p>
                  <Button>Explorer les analytiques</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sessions d'équipe</CardTitle>
                <CardDescription>Planifiez et gérez les activités de bien-être</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">Planificateur de sessions</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Créez et programmez des activités de bien-être pour votre équipe,
                    suivez la participation et mesurez l'impact sur le bien-être collectif.
                  </p>
                  <Button>Planifier une session</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default TeamsPage;
