
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Edit, Settings, FileText, Heart, Calendar, Award, Upload } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Card className="w-full md:w-80">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/assets/user-avatar.jpg" alt="Avatar" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-2xl font-semibold">Utilisateur Test</h3>
              <p className="text-muted-foreground">utilisateur@example.com</p>
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                <Badge variant="secondary">Premium</Badge>
                <Badge variant="outline">Depuis Nov 2023</Badge>
              </div>
              <div className="w-full mt-6">
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Modifier le profil
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1 space-y-6 w-full">
            <Card>
              <CardHeader>
                <CardTitle>À propos</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <dt className="text-muted-foreground">Nom complet</dt>
                    <dd>Utilisateur Test</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>utilisateur@example.com</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <dt className="text-muted-foreground">Date d'inscription</dt>
                    <dd>15 novembre 2023</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <dt className="text-muted-foreground">Abonnement</dt>
                    <dd>Premium</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
                <CardDescription>Votre activité sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-semibold">12</p>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-semibold">5</p>
                    <p className="text-xs text-muted-foreground">Entrées journal</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-semibold">3</p>
                    <p className="text-xs text-muted-foreground">Badges</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-semibold">85%</p>
                    <p className="text-xs text-muted-foreground">Score bien-être</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs section */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Activité
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Journal
            </TabsTrigger>
            <TabsTrigger value="emotions" className="flex items-center gap-2">
              <Heart className="h-4 w-4" /> Émotions
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="h-4 w-4" /> Badges
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { date: "2023-11-15", activity: "Session de méditation terminée", duration: "10 min" },
                    { date: "2023-11-14", activity: "Journal ajouté", emotion: "Calme" },
                    { date: "2023-11-12", activity: "Badge débloqué", badge: "Méditant régulier" },
                    { date: "2023-11-10", activity: "Session de vidéothérapie", duration: "15 min" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{item.activity}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.duration || item.emotion || item.badge}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="journal">
            <Card>
              <CardHeader>
                <CardTitle>Journal personnel</CardTitle>
                <CardDescription>Vos entrées de journal récentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      date: "14 novembre 2023", 
                      content: "Aujourd'hui j'ai réussi à prendre du temps pour moi et j'ai ressenti un vrai moment de calme.",
                      emotion: "Calme"
                    },
                    { 
                      date: "10 novembre 2023", 
                      content: "Journée productive au travail, j'ai accompli toutes mes tâches et je me sens satisfait.",
                      emotion: "Satisfait"
                    },
                  ].map((entry, i) => (
                    <Card key={i}>
                      <CardHeader className="py-3">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{entry.date}</CardTitle>
                          <Badge>{entry.emotion}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-sm">{entry.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="text-center">
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" /> Voir toutes les entrées
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="emotions">
            <Card>
              <CardHeader>
                <CardTitle>Suivi des émotions</CardTitle>
                <CardDescription>Visualisation de vos émotions au fil du temps</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Graphique d'émotions (à implémenter)</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="badges">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { 
                  name: "Méditant régulier", 
                  description: "A complété 10 sessions de méditation", 
                  date: "12 novembre 2023",
                  icon: "🧘‍♂️"
                },
                { 
                  name: "Journal assidu", 
                  description: "A écrit dans son journal 5 jours consécutifs", 
                  date: "8 novembre 2023",
                  icon: "📝"
                },
                { 
                  name: "Expert en pleine conscience", 
                  description: "A pratiqué diverses techniques de pleine conscience", 
                  date: "5 novembre 2023",
                  icon: "🧠"
                }
              ].map((badge, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{badge.icon}</div>
                      <div>
                        <CardTitle className="text-base">{badge.name}</CardTitle>
                        <CardDescription className="text-xs">{badge.date}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions section */}
        <div className="flex justify-end">
          <Button variant="outline" className="mr-2">
            <Settings className="mr-2 h-4 w-4" /> Paramètres du compte
          </Button>
          <Button variant="destructive">Supprimer le compte</Button>
        </div>
      </div>
    </Shell>
  );
};

export default Profile;
