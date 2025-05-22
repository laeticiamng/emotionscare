
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Star, Sparkles, Zap, Clock, Lock, Check } from 'lucide-react';

const FeatureHub: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hub de fonctionnalités</h1>
          <p className="text-muted-foreground mt-1">
            Découvrez toutes les fonctionnalités disponibles
          </p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="new">Nouveautés</TabsTrigger>
          <TabsTrigger value="popular">Populaires</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Journal émotionnel",
                description: "Suivez et visualisez vos émotions au fil du temps",
                icon: <Sparkles className="h-5 w-5 text-yellow-500" />,
                path: "/journal",
                new: false,
                premium: false
              },
              {
                title: "Sessions VR",
                description: "Immergez-vous dans des environnements apaisants",
                icon: <Star className="h-5 w-5 text-purple-500" />,
                path: "/vr",
                new: false,
                premium: true
              },
              {
                title: "Musicothérapie",
                description: "Des playlists adaptées à votre humeur",
                icon: <Zap className="h-5 w-5 text-blue-500" />,
                path: "/music",
                new: false,
                premium: false
              },
              {
                title: "Coach IA",
                description: "Votre assistant personnel de bien-être",
                icon: <Sparkles className="h-5 w-5 text-green-500" />,
                path: "/coach",
                new: true,
                premium: false
              },
              {
                title: "Social Cocoon",
                description: "Rejoignez une communauté bienveillante",
                icon: <Star className="h-5 w-5 text-pink-500" />,
                path: "/social",
                new: false,
                premium: false
              },
              {
                title: "Analyse du sommeil",
                description: "Optimisez votre cycle de sommeil",
                icon: <Zap className="h-5 w-5 text-indigo-500" />,
                path: "/sleep",
                new: true,
                premium: true
              },
              {
                title: "Audio personnalisé",
                description: "Créez votre propre ambiance sonore",
                icon: <Star className="h-5 w-5 text-cyan-500" />,
                path: "/audio",
                new: false,
                premium: false
              },
              {
                title: "Sessions guidées",
                description: "Séances avec des professionnels",
                icon: <Sparkles className="h-5 w-5 text-amber-500" />,
                path: "/sessions",
                new: false,
                premium: true
              },
              {
                title: "Rapports d'équipe",
                description: "Analyses pour votre organisation",
                icon: <Zap className="h-5 w-5 text-rose-500" />,
                path: "/team",
                new: true,
                premium: true
              }
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {feature.icon}
                    </div>
                    <div className="flex gap-2">
                      {feature.new && (
                        <Badge variant="secondary" className="font-normal bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                          Nouveau
                        </Badge>
                      )}
                      {feature.premium && (
                        <Badge variant="secondary" className="font-normal bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant={feature.premium && false ? "outline" : "default"}
                    className="w-full"
                    onClick={() => {/* navigation logic */}}
                    disabled={feature.premium && false}
                  >
                    {feature.premium && false ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" /> Débloquer
                      </>
                    ) : (
                      <>
                        Accéder <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Filtrer pour n'afficher que les nouvelles fonctionnalités */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-green-500" />
                  </div>
                  <Badge variant="secondary" className="font-normal bg-blue-500/10 text-blue-500">
                    Nouveau
                  </Badge>
                </div>
                <CardTitle className="mt-4">Coach IA</CardTitle>
                <CardDescription>Votre assistant personnel de bien-être</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  Accéder <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="font-normal bg-blue-500/10 text-blue-500">
                      Nouveau
                    </Badge>
                    <Badge variant="secondary" className="font-normal bg-amber-500/10 text-amber-500">
                      Premium
                    </Badge>
                  </div>
                </div>
                <CardTitle className="mt-4">Analyse du sommeil</CardTitle>
                <CardDescription>Optimisez votre cycle de sommeil</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" /> Débloquer
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-5 w-5 text-rose-500" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="font-normal bg-blue-500/10 text-blue-500">
                      Nouveau
                    </Badge>
                    <Badge variant="secondary" className="font-normal bg-amber-500/10 text-amber-500">
                      Premium
                    </Badge>
                  </div>
                </div>
                <CardTitle className="mt-4">Rapports d'équipe</CardTitle>
                <CardDescription>Analyses pour votre organisation</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" /> Débloquer
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Onglets restants construits de manière similaire... */}
        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                  </div>
                  <Badge variant="outline" className="font-normal">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                    4.9
                  </Badge>
                </div>
                <CardTitle className="mt-4">Journal émotionnel</CardTitle>
                <CardDescription>Suivez et visualisez vos émotions au fil du temps</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  Accéder <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-500" />
                  </div>
                  <Badge variant="outline" className="font-normal">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                    4.8
                  </Badge>
                </div>
                <CardTitle className="mt-4">Musicothérapie</CardTitle>
                <CardDescription>Des playlists adaptées à votre humeur</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  Accéder <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Star className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-normal">
                      <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                      4.7
                    </Badge>
                    <Badge variant="secondary" className="font-normal bg-amber-500/10 text-amber-500">
                      Premium
                    </Badge>
                  </div>
                </div>
                <CardTitle className="mt-4">Sessions VR</CardTitle>
                <CardDescription>Immergez-vous dans des environnements apaisants</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  Accéder <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="premium" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Fonctionnalités Premium</CardTitle>
                <Badge variant="destructive" className="font-normal">Non abonné</Badge>
              </div>
              <CardDescription>
                Débloquez toutes les fonctionnalités premium pour une expérience optimale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <p className="text-sm">Sessions VR illimitées</p>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <p className="text-sm">Analyse du sommeil personnalisée</p>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <p className="text-sm">Sessions guidées avec des professionnels</p>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <p className="text-sm">Rapports d'équipe détaillés</p>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <p className="text-sm">Accès prioritaire aux nouvelles fonctionnalités</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">S'abonner maintenant</Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Star className="h-5 w-5 text-purple-500" />
                  </div>
                  <Badge variant="secondary" className="font-normal bg-amber-500/10 text-amber-500">
                    Premium
                  </Badge>
                </div>
                <CardTitle className="mt-4">Sessions VR</CardTitle>
                <CardDescription>Immergez-vous dans des environnements apaisants</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" /> Débloquer
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="font-normal bg-blue-500/10 text-blue-500">
                      Nouveau
                    </Badge>
                    <Badge variant="secondary" className="font-normal bg-amber-500/10 text-amber-500">
                      Premium
                    </Badge>
                  </div>
                </div>
                <CardTitle className="mt-4">Analyse du sommeil</CardTitle>
                <CardDescription>Optimisez votre cycle de sommeil</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" /> Débloquer
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                  </div>
                  <Badge variant="secondary" className="font-normal bg-amber-500/10 text-amber-500">
                    Premium
                  </Badge>
                </div>
                <CardTitle className="mt-4">Sessions guidées</CardTitle>
                <CardDescription>Séances avec des professionnels</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" /> Débloquer
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-5 w-5 text-rose-500" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="font-normal bg-blue-500/10 text-blue-500">
                      Nouveau
                    </Badge>
                    <Badge variant="secondary" className="font-normal bg-amber-500/10 text-amber-500">
                      Premium
                    </Badge>
                  </div>
                </div>
                <CardTitle className="mt-4">Rapports d'équipe</CardTitle>
                <CardDescription>Analyses pour votre organisation</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" /> Débloquer
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureHub;
