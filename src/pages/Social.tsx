
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Share2, Users, Bell, Globe, User, Search, PlusCircle } from 'lucide-react';

const Social: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Social Cocoon</h1>
          <p className="text-muted-foreground mt-1">
            Connectez-vous avec des personnes partageant les mêmes intérêts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <Button>
            Créer une publication
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="relative">
                <Input
                  placeholder="Qu'avez-vous en tête aujourd'hui ?"
                  className="pr-20 pl-12"
                />
                <Avatar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6">
                  <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Button className="absolute right-1 top-1/2 transform -translate-y-1/2" size="sm">
                  Publier
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="forYou">
            <TabsList>
              <TabsTrigger value="forYou">Pour vous</TabsTrigger>
              <TabsTrigger value="following">Abonnements</TabsTrigger>
              <TabsTrigger value="trending">Tendances</TabsTrigger>
            </TabsList>

            <TabsContent value="forYou" className="mt-6 space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="p-4 pb-0 flex flex-row items-start gap-3">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{
                            i === 1 ? "Marie Dupont" : i === 2 ? "Thomas Richard" : "Sophie Martin"
                          }</p>
                          <p className="text-xs text-muted-foreground">Il y a {i === 1 ? "2 heures" : i === 2 ? "1 jour" : "3 jours"}</p>
                        </div>
                      </div>
                      <p className="mt-2">
                        {i === 1 
                          ? "J'ai découvert cette technique de méditation qui m'aide beaucoup contre l'anxiété. Quelqu'un l'a déjà essayée ?" 
                          : i === 2 
                          ? "Merci à tous pour vos conseils sur la gestion du stress. J'ai pu mettre en pratique plusieurs techniques et je me sens déjà mieux !" 
                          : "Je partage avec vous cet article très intéressant sur les bienfaits de la pleine conscience dans la vie quotidienne."
                        }
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    {i === 3 && (
                      <div className="bg-accent/10 rounded-md p-4 border mb-4">
                        <p className="text-sm font-medium">Les bienfaits de la pleine conscience</p>
                        <p className="text-xs text-muted-foreground mt-1">psychologie-positive.com</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Heart className="h-4 w-4 mr-1" />
                      {i * 5 + 3}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {i * 2 + 1}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share2 className="h-4 w-4 mr-1" />
                      Partager
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="following">
              <div className="mt-6 text-center p-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">Suivez plus de personnes</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  Commencez à suivre des personnes pour voir leur contenu ici
                </p>
                <Button>Découvrir des personnes</Button>
              </div>
            </TabsContent>

            <TabsContent value="trending">
              <div className="mt-6 text-center p-12">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">Tendances en chargement</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  Les sujets populaires seront bientôt disponibles
                </p>
                <Button variant="outline">Actualiser</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
              <CardDescription>Personnes que vous pourriez connaître</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((id) => (
                <div key={id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${id + 15}`} />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {id === 1 ? "Jean Lambert" : id === 2 ? "Claire Moreau" : "Pierre Dubois"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {id === 1 ? "Conseiller bien-être" : id === 2 ? "Professeur de yoga" : "Thérapeute"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="h-4 w-4 mr-1" /> Suivre
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-primary">
                Voir plus
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Groupes populaires</CardTitle>
              <CardDescription>Rejoignez des communautés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {name: "Méditation quotidienne", members: "1.2k membres"},
                {name: "Bien-être au travail", members: "843 membres"},
                {name: "Gestion du stress", members: "2.1k membres"}
              ].map((group, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{group.name}</p>
                      <p className="text-xs text-muted-foreground">{group.members}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Rejoindre
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Social;
