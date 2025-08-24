
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Headphones, Eye, Mountain, Waves, TreePine, Sunset, Star, Clock, Settings } from 'lucide-react';
import { toast } from 'sonner';

const B2CVR: React.FC = () => {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);

  const vrEnvironments = [
    {
      id: '1',
      title: 'Forêt enchantée',
      description: 'Promenade apaisante dans une forêt mystique avec des sons de la nature',
      duration: '10-30 min',
      difficulty: 'Débutant',
      benefits: ['Réduction du stress', 'Connexion nature', 'Méditation guidée'],
      image: '/api/placeholder/300/200',
      icon: <TreePine className="h-5 w-5" />,
      popular: true
    },
    {
      id: '2',
      title: 'Plage tropicale',
      description: 'Détente sur une plage paradisiaque avec le bruit des vagues',
      duration: '15-45 min',
      difficulty: 'Tous niveaux',
      benefits: ['Relaxation profonde', 'Visualisation positive', 'Évasion mentale'],
      image: '/api/placeholder/300/200',
      icon: <Waves className="h-5 w-5" />
    },
    {
      id: '3',
      title: 'Montagne sereine',
      description: 'Méditation au sommet d\'une montagne avec vue panoramique',
      duration: '20-60 min',
      difficulty: 'Intermédiaire',
      benefits: ['Méditation profonde', 'Concentration', 'Perspective'],
      image: '/api/placeholder/300/200',
      icon: <Mountain className="h-5 w-5" />
    },
    {
      id: '4',
      title: 'Coucher de soleil',
      description: 'Contemplation d\'un coucher de soleil magique en pleine nature',
      duration: '5-20 min',
      difficulty: 'Débutant',
      benefits: ['Gratitude', 'Pleine conscience', 'Apaisement'],
      image: '/api/placeholder/300/200',
      icon: <Sunset className="h-5 w-5" />
    }
  ];

  const guidedSessions = [
    {
      id: '1',
      title: 'Respiration océanique',
      instructor: 'Sarah Martinez',
      duration: '12 min',
      type: 'Respiration',
      environment: 'Plage tropicale'
    },
    {
      id: '2', 
      title: 'Marche consciente en forêt',
      instructor: 'Thomas Chen',
      duration: '25 min',
      type: 'Méditation active',
      environment: 'Forêt enchantée'
    },
    {
      id: '3',
      title: 'Gratitude au sommet',
      instructor: 'Marie Dubois',
      duration: '18 min',
      type: 'Gratitude',
      environment: 'Montagne sereine'
    }
  ];

  const recentSessions = [
    { environment: 'Forêt enchantée', duration: '15 min', date: 'Aujourd\'hui' },
    { environment: 'Plage tropicale', duration: '22 min', date: 'Hier' },
    { environment: 'Montagne sereine', duration: '30 min', date: 'Il y a 2 jours' }
  ];

  const startVRSession = (environmentId: string) => {
    setActiveSession(environmentId);
    setSessionTime(0);
    toast.success('Session VR démarrée ! Mettez votre casque VR.');
    
    // Simulation d'une session
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    // Arrêter après 30 secondes pour la démo
    setTimeout(() => {
      clearInterval(timer);
      setActiveSession(null);
      setSessionTime(0);
      toast.success('Session VR terminée !');
    }, 30000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Réalité Virtuelle</h1>
          <p className="text-muted-foreground">
            Immergez-vous dans des environnements apaisants pour réduire le stress et améliorer votre bien-être.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Réglages VR
          </Button>
          {activeSession && (
            <Badge variant="secondary" className="animate-pulse">
              En cours: {formatTime(sessionTime)}
            </Badge>
          )}
        </div>
      </div>

      {/* Message d'information VR */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Casque VR requis</p>
              <p className="text-sm text-muted-foreground">
                Pour une expérience optimale, utilisez un casque VR compatible (Oculus, HTC Vive, etc.)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="environments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="environments">Environnements</TabsTrigger>
          <TabsTrigger value="guided">Sessions guidées</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="environments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vrEnvironments.map((env) => (
              <Card key={env.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-6xl text-primary/30">{env.icon}</div>
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {env.icon}
                      {env.title}
                    </CardTitle>
                    {env.popular && <Badge>Populaire</Badge>}
                  </div>
                  <CardDescription>{env.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {env.duration}
                    </div>
                    <Badge variant="outline">{env.difficulty}</Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Bénéfices:</p>
                    <div className="flex flex-wrap gap-1">
                      {env.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => startVRSession(env.id)}
                    disabled={activeSession !== null}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {activeSession === env.id ? 'En cours...' : 'Commencer la session'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guided">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Sessions guidées
              </CardTitle>
              <CardDescription>
                Expériences VR avec accompagnement vocal personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {guidedSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Par {session.instructor} • {session.duration}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{session.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Environnement: {session.environment}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline"
                        onClick={() => startVRSession(session.id)}
                        disabled={activeSession !== null}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Démarrer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des sessions</CardTitle>
              <CardDescription>
                Suivez votre progression et vos sessions VR récentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Eye className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{session.environment}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.duration} • {session.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Rejouer
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Statistiques cette semaine</span>
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">67</p>
                    <p className="text-xs text-muted-foreground">Minutes totales</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">3</p>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">22</p>
                    <p className="text-xs text-muted-foreground">Min moyenne</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CVR;
