
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bell, Calendar, CheckCircle, ChevronRight, MessageSquare, Settings, Users, PlusCircle } from 'lucide-react';

const B2BAdminSocialPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('announcements');
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-2" 
            onClick={() => navigate('/b2b/admin/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold">Social Cocoon</h1>
          <p className="text-muted-foreground">
            Gérez l'environnement social de votre organisation
          </p>
        </div>
        
        <Button 
          onClick={() => {}}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Nouvelle annonce
        </Button>
      </div>
      
      <Tabs defaultValue="announcements" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Annonces</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Groupes</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Événements</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle>Annonces d'entreprise</CardTitle>
              <CardDescription>
                Communiquez des informations importantes à tous les collaborateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Initiative bien-être</CardTitle>
                        <CardDescription>15/05/2025</CardDescription>
                      </div>
                      <Badge>Important</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Nous sommes heureux de lancer notre nouvelle initiative de bien-être
                      avec une série d'ateliers et d'activités pour tous les collaborateurs.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Publié</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Retours du sondage émotionnel</CardTitle>
                        <CardDescription>10/05/2025</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Nous avons analysé vos retours du dernier sondage émotionnel.
                      Découvrez les résultats et les actions qui seront mises en place.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Publié</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Créer une annonce
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Groupes de discussion</CardTitle>
              <CardDescription>
                Créez et gérez des espaces de discussion thématiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Bien-être au travail</CardTitle>
                    <CardDescription>28 membres</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">
                      Discussions autour du bien-être professionnel et de l'équilibre vie privée/vie professionnelle.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Consulter
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Gestion du stress</CardTitle>
                    <CardDescription>15 membres</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">
                      Techniques et conseils pour gérer efficacement le stress au quotidien.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Consulter
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Activités sportives</CardTitle>
                    <CardDescription>32 membres</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">
                      Organisation d'activités sportives entre collaborateurs.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Consulter
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Créer un nouveau groupe
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des événements</CardTitle>
              <CardDescription>
                Planifiez des activités de bien-être pour vos collaborateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">Séance de méditation guidée</CardTitle>
                        <Badge variant="outline">À venir</Badge>
                      </div>
                      <CardDescription>20 Mai 2025, 12:30</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Session de 30 minutes de méditation guidée accessible à tous les niveaux,
                        animée par Marie Lefèvre.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">15 participants</div>
                      <Button size="sm">Modifier</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">Atelier gestion du stress</CardTitle>
                        <Badge variant="outline">À venir</Badge>
                      </div>
                      <CardDescription>25 Mai 2025, 14:00</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Apprenez des techniques pratiques pour gérer efficacement le stress
                        au quotidien dans votre environnement professionnel.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">8 participants</div>
                      <Button size="sm">Modifier</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Planifier un événement
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de l'espace social</CardTitle>
              <CardDescription>
                Configurez les options de l'environnement social
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Cette fonctionnalité est en cours de développement et sera disponible prochainement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminSocialPage;
