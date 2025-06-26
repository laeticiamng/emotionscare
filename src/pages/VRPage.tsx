
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Camera, Clock, Star, TrendingUp, Users, Settings } from 'lucide-react';
import VREnvironmentSelector from '@/components/vr/VREnvironmentSelector';
import { useToast } from '@/hooks/use-toast';

const VRPage: React.FC = () => {
  const { toast } = useToast();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  // Mock VR session history
  const sessionHistory = [
    {
      id: '1',
      environment: 'Forêt Enchantée',
      duration: 15,
      date: '2024-01-15',
      rating: 5,
      mood: 'relaxed'
    },
    {
      id: '2',
      environment: 'Plage au Coucher de Soleil',
      duration: 20,
      date: '2024-01-14',
      rating: 4,
      mood: 'peaceful'
    },
    {
      id: '3',
      environment: 'Montagne Énergisante',
      duration: 12,
      date: '2024-01-13',
      rating: 5,
      mood: 'energized'
    }
  ];

  // Mock VR statistics
  const vrStats = {
    totalSessions: 24,
    totalTime: '6h 30min',
    averageRating: 4.6,
    favoriteEnvironment: 'Forêt Enchantée'
  };

  const handleStartSession = (environment: any) => {
    setIsSessionActive(true);
    toast({
      title: 'Session VR démarrée',
      description: `Immersion dans "${environment.name}" commencée.`,
    });
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    setSessionTime(0);
    toast({
      title: 'Session terminée',
      description: 'Votre session VR a été enregistrée avec succès.',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réalité Virtuelle</h1>
          <p className="text-muted-foreground">
            Immergez-vous dans des environnements apaisants et thérapeutiques
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configuration VR
          </Button>
          {isSessionActive && (
            <Badge variant="default" className="animate-pulse">
              Session active: {formatTime(sessionTime)}
            </Badge>
          )}
        </div>
      </div>

      {isSessionActive ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Session VR en cours</h2>
              <p className="text-muted-foreground">
                Profitez pleinement de votre expérience immersive
              </p>
              <div className="text-3xl font-mono font-bold text-primary">
                {formatTime(sessionTime)}
              </div>
              <Button 
                onClick={handleEndSession}
                variant="outline"
                size="lg"
              >
                Terminer la session
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="environments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="environments">Environnements</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="environments" className="space-y-6">
            <VREnvironmentSelector onSelectEnvironment={handleStartSession} />
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Sessions Guidées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Méditation Matinale', duration: '10 min', level: 'Débutant' },
                    { name: 'Relaxation Profonde', duration: '20 min', level: 'Intermédiaire' },
                    { name: 'Visualisation Créative', duration: '15 min', level: 'Avancé' }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{session.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {session.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {session.duration}
                          </span>
                        </div>
                      </div>
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Démarrer
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Sessions Populaires
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Forêt Mystique', participants: 1247, rating: 4.8 },
                    { name: 'Océan Tranquille', participants: 892, rating: 4.9 },
                    { name: 'Montagne Zen', participants: 654, rating: 4.7 }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{session.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {session.rating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {session.participants} participants
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Rejoindre
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Historique des Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessionHistory.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{session.environment}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.duration} min
                          </span>
                          <span>{new Date(session.date).toLocaleDateString('fr-FR')}</span>
                          <Badge variant="outline" className="text-xs">
                            {session.mood}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < session.rating 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Button size="sm" variant="ghost">
                          Rejouer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sessions totales</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{vrStats.totalSessions}</div>
                  <p className="text-xs text-muted-foreground">
                    Depuis le début
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Temps total</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{vrStats.totalTime}</div>
                  <p className="text-xs text-muted-foreground">
                    D'immersion VR
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{vrStats.averageRating}/5</div>
                  <p className="text-xs text-muted-foreground">
                    Satisfaction
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Environnement favori</CardTitle>
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold truncate">{vrStats.favoriteEnvironment}</div>
                  <p className="text-xs text-muted-foreground">
                    Le plus utilisé
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Progression et Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Bénéfices observés</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Réduction du stress de 25% après les sessions</li>
                      <li>• Amélioration de la qualité du sommeil</li>
                      <li>• Augmentation de la concentration</li>
                      <li>• Meilleure gestion des émotions</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Recommandations</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Essayez les sessions matinales pour plus d'énergie</li>
                      <li>• Alternez entre différents environnements</li>
                      <li>• Augmentez progressivement la durée des sessions</li>
                      <li>• Combinez VR avec de la musique adaptative</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default VRPage;
