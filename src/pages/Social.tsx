
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Heart, Share2, Users, Search, Bell } from 'lucide-react';

const Social: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Social Cocoon</h1>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost">
            <Search className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <Bell className="h-5 w-5" />
          </Button>
          <Button>
            <MessageCircle className="h-4 w-4 mr-2" /> Nouveau message
          </Button>
        </div>
      </div>

      <Tabs defaultValue="feed">
        <TabsList>
          <TabsTrigger value="feed">Fil d'actualités</TabsTrigger>
          <TabsTrigger value="groups">Groupes</TabsTrigger>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="buddies">Buddies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="space-y-6 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3 items-center mb-4">
                <Avatar>
                  <AvatarImage src="/avatar-placeholder.jpg" />
                  <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Partagez quelque chose avec la communauté..." 
                    className="w-full p-2 bg-muted/50 rounded-full px-4"
                  />
                </div>
                <Button>Publier</Button>
              </div>
            </CardContent>
          </Card>
          
          {[1, 2, 3].map((post) => (
            <Card key={post}>
              <CardContent className="pt-6">
                <div className="flex gap-3 items-start">
                  <Avatar>
                    <AvatarImage src={`/avatar-placeholder-${post}.jpg`} />
                    <AvatarFallback>{post === 1 ? 'TM' : post === 2 ? 'LR' : 'SC'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {post === 1 ? 'Thomas Martin' : post === 2 ? 'Laura Renaud' : 'Simon Cohen'}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">Il y a {post === 1 ? '30 minutes' : post === 2 ? '2 heures' : '1 jour'}</div>
                    <p className="mb-4">
                      {post === 1 
                        ? "J'ai essayé la nouvelle séance de méditation guidée ce matin et je me sens vraiment détendu pour commencer la journée !" 
                        : post === 2 
                          ? "Aujourd'hui j'ai atteint mon objectif de 5 jours consécutifs de pratique ! Qui d'autre utilise les rappels quotidiens ?"
                          : "La session de groupe d'hier était incroyable. Merci à tous ceux qui ont participé !"}
                    </p>
                    
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" /> {post === 1 ? '12' : post === 2 ? '24' : '8'}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" /> {post === 1 ? '3' : post === 2 ? '5' : '2'}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="groups" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {title: "Méditation quotidienne", members: 128},
              {title: "Gestion du stress pro", members: 86},
              {title: "Bien-être & Nutrition", members: 204},
              {title: "Sommeil réparateur", members: 57},
              {title: "Pleine conscience", members: 93},
              {title: "Équilibre vie pro/perso", members: 142}
            ].map((group, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">{group.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{group.members} membres</p>
                  <Button variant="outline" className="w-full">Rejoindre</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Aucun événement n'est prévu pour le moment.
              </p>
              <div className="flex justify-center">
                <Button>Créer un événement</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="buddies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trouver un buddy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Un buddy est un partenaire qui vous accompagne dans votre parcours de bien-être. Trouvez quelqu'un qui partage vos objectifs !
              </p>
              <p className="text-center text-muted-foreground py-8">
                La fonctionnalité de buddies sera disponible prochainement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Social;
