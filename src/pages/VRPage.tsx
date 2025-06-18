
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Headphones, Play, Eye, Zap, Mountain, Waves } from 'lucide-react';

const VRPage: React.FC = () => {
  const [isVRActive, setIsVRActive] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);

  const environments = [
    {
      id: 'forest',
      name: 'Forêt Enchantée',
      description: 'Promenez-vous dans une forêt paisible avec des sons de la nature',
      icon: '🌲',
      duration: '15 min',
      benefits: ['Réduction du stress', 'Connexion avec la nature']
    },
    {
      id: 'beach',
      name: 'Plage Tropicale',
      description: 'Détendez-vous sur une plage paradisiaque au coucher du soleil',
      icon: '🏖️',
      duration: '20 min',
      benefits: ['Relaxation profonde', 'Méditation guidée']
    },
    {
      id: 'mountain',
      name: 'Sommet Montagneux',
      description: 'Méditez au sommet d\'une montagne avec vue panoramique',
      icon: '⛰️',
      duration: '25 min',
      benefits: ['Clarté mentale', 'Perspective élargie']
    },
    {
      id: 'space',
      name: 'Voyage Spatial',
      description: 'Explorez l\'espace et ressentez l\'immensité de l\'univers',
      icon: '🌌',
      duration: '30 min',
      benefits: ['Éveil spirituel', 'Lâcher-prise']
    }
  ];

  const handleStartVR = (envId: string) => {
    setSelectedEnvironment(envId);
    setIsVRActive(true);
    // Simulation de l'expérience VR
    setTimeout(() => {
      setIsVRActive(false);
      setSelectedEnvironment(null);
    }, 5000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Réalité Virtuelle Thérapeutique</h1>
        <p className="text-muted-foreground">
          Immergez-vous dans des environnements apaisants pour votre bien-être mental
        </p>
      </div>

      {isVRActive && selectedEnvironment ? (
        <Card className="mb-6 border-primary">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <Eye className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Expérience VR Active</h2>
              <p className="text-muted-foreground mb-4">
                Vous êtes actuellement dans l'environnement : {environments.find(e => e.id === selectedEnvironment)?.name}
              </p>
              <div className="w-full bg-muted h-2 rounded-full">
                <div className="bg-primary h-2 rounded-full w-1/4 animate-pulse"></div>
              </div>
              <p className="text-sm mt-2">Séance en cours...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="environments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="environments">Environnements</TabsTrigger>
            <TabsTrigger value="sessions">Mes Sessions</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="environments">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {environments.map((env) => (
                <Card key={env.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{env.icon}</span>
                      {env.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{env.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Durée:</span>
                        <span className="font-medium">{env.duration}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Bienfaits:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {env.benefits.map((benefit, index) => (
                            <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleStartVR(env.id)}
                      className="w-full"
                      disabled={isVRActive}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Démarrer l'expérience
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Historique de vos Sessions VR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌲</span>
                      <div>
                        <h4 className="font-medium">Forêt Enchantée</h4>
                        <p className="text-sm text-muted-foreground">Hier, 18:30</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">15 min</p>
                      <p className="text-sm text-green-600">Terminée</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏖️</span>
                      <div>
                        <h4 className="font-medium">Plage Tropicale</h4>
                        <p className="text-sm text-muted-foreground">Il y a 2 jours, 20:15</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">20 min</p>
                      <p className="text-sm text-green-600">Terminée</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statistiques VR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <h3 className="text-2xl font-bold text-primary">12</h3>
                    <p className="text-sm text-muted-foreground">Sessions totales</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <h3 className="text-2xl font-bold text-primary">4h 30m</h3>
                    <p className="text-sm text-muted-foreground">Temps total</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <h3 className="text-2xl font-bold text-primary">85%</h3>
                    <p className="text-sm text-muted-foreground">Amélioration du bien-être</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Configuration VR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Qualité graphique</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="quality" className="mr-2" />
                      Basse (pour appareils moins puissants)
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="quality" className="mr-2" defaultChecked />
                      Moyenne (recommandé)
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="quality" className="mr-2" />
                      Haute (nécessite un appareil puissant)
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Paramètres audio</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Volume principal</span>
                      <input type="range" className="w-32" defaultValue="75" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Audio spatial 3D</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Réduction du bruit</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Confort</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Réduction du mal des transports</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Pauses automatiques</span>
                      <input type="checkbox" />
                    </div>
                  </div>
                </div>

                <Button>Sauvegarder les paramètres</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default VRPage;
