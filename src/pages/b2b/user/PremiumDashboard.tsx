
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Calendar, MessageCircle, Music, ChevronRight, Activity, Smile, SmilePlus, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/utils/analytics';

const B2BUserPremiumDashboard: React.FC = () => {
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [userName, setUserName] = useState('Marie');
  const [isLoading, setIsLoading] = useState(true);
  const [emotionalScore, setEmotionalScore] = useState(78);
  const [activities, setActivities] = useState<{
    id: string; 
    title: string;
    description: string;
    icon: React.ReactNode;
    progress: number;
  }[]>([]);
  
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) setTimeOfDay('morning');
    else if (hours >= 12 && hours < 18) setTimeOfDay('afternoon');
    else if (hours >= 18 && hours < 22) setTimeOfDay('evening');
    else setTimeOfDay('night');
    
    // Simulate API loading
    setTimeout(() => {
      setActivities([
        {
          id: 'meditation',
          title: 'Méditation guidée',
          description: 'Exercice de 5 min pour réduire le stress',
          icon: <Smile className="h-5 w-5 text-blue-500" />,
          progress: 60
        },
        {
          id: 'emotional-checkin',
          title: 'Check-in émotionnel',
          description: 'Votre suivi quotidien',
          icon: <Activity className="h-5 w-5 text-green-500" />,
          progress: 100
        },
        {
          id: 'team-mood',
          title: 'Ambiance équipe',
          description: 'Participez au baromètre collectif',
          icon: <SmilePlus className="h-5 w-5 text-purple-500" />,
          progress: 30
        },
        {
          id: 'music-therapy',
          title: 'Musicothérapie',
          description: 'Séance personnalisée à votre humeur',
          icon: <Music className="h-5 w-5 text-amber-500" />,
          progress: 0
        }
      ]);
      setIsLoading(false);
    }, 1000);
    
    trackEvent('View B2B User Dashboard', { properties: { variant: 'premium' } });
  }, []);
  
  const getGreeting = () => {
    switch(timeOfDay) {
      case 'morning': return 'Bonjour';
      case 'afternoon': return 'Bon après-midi';
      case 'evening': return 'Bonsoir';
      case 'night': return 'Bonne nuit';
      default: return 'Bonjour';
    }
  };
  
  const handleEmotionalCheck = () => {
    toast.success('Merci pour votre check-in émotionnel !');
    trackEvent('Emotional Check Completed', {
      properties: { userType: 'b2b_user' }
    });
  };

  return (
    <div className={`min-h-screen bg-${timeOfDay}`}>
      {/* Header with greeting and profile */}
      <header className="glass-card border-b px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                <span className="text-white font-bold">EC</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold">
                {getGreeting()}, <span className="text-primary">{userName}</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Votre espace collaborateur
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            </button>
            
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://i.pravatar.cc/100?img=5" alt={userName} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      {/* Main dashboard content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Emotional score */}
          <Card className="glass-card md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Votre score émotionnel</span>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
              <CardDescription>Suivi quotidien de votre bien-être</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-primary">{emotionalScore}</p>
                    <p className="text-sm text-muted-foreground">Score équilibré</p>
                  </div>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center">
                      <Smile className="h-10 w-10 text-green-500" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Aujourd'hui</span>
                    <span className="font-medium">{emotionalScore}%</span>
                  </div>
                  <Progress value={emotionalScore} className="h-2" />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Stress</span>
                    <span>Équilibre</span>
                    <span>Épanouissement</span>
                  </div>
                </div>
                
                <Button onClick={handleEmotionalCheck} className="w-full">
                  Faire mon check-in émotionnel
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick links */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Accès rapides</CardTitle>
              <CardDescription>Vos outils quotidiens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="animate-pulse flex items-center p-2 rounded-md">
                      <div className="rounded-full bg-muted h-8 w-8"></div>
                      <div className="flex-1 ml-4 space-y-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {activities.map((activity) => (
                    <Link 
                      key={activity.id}
                      to={`#${activity.id}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {activity.icon}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Team mood and upcoming events */}
          <Card className="glass-card md:col-span-2">
            <Tabs defaultValue="mood">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Espace Équipe</CardTitle>
                  <TabsList>
                    <TabsTrigger value="mood">Ambiance</TabsTrigger>
                    <TabsTrigger value="events">Événements</TabsTrigger>
                    <TabsTrigger value="stats">Statistiques</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="mood" className="m-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Ambiance d'équipe</h3>
                      <p className="text-sm text-muted-foreground">Mise à jour il y a 2h</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-background rounded-lg">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <Smile className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">68%</p>
                        <p className="text-sm text-muted-foreground">Heureux</p>
                      </div>
                      
                      <div className="text-center p-4 bg-background rounded-lg">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                          <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">82%</p>
                        <p className="text-sm text-muted-foreground">Productif</p>
                      </div>
                      
                      <div className="text-center p-4 bg-background rounded-lg">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                          <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">73%</p>
                        <p className="text-sm text-muted-foreground">Présence</p>
                      </div>
                      
                      <div className="text-center p-4 bg-background rounded-lg">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                          <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">91%</p>
                        <p className="text-sm text-muted-foreground">Communication</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="events" className="m-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Événements à venir</h3>
                      <Button variant="outline" size="sm">
                        Voir tout
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-3 bg-background rounded-lg">
                        <div className="text-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                          <p className="text-sm font-medium">MAI</p>
                          <p className="text-xl font-bold">24</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Atelier gestion du stress</h4>
                          <p className="text-sm text-muted-foreground">10:00 - 11:30 • Salle Harmonie</p>
                          <div className="mt-2 flex gap-2">
                            <Button variant="outline" size="sm">Je participe</Button>
                            <Button variant="ghost" size="sm">En savoir plus</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-3 bg-background rounded-lg">
                        <div className="text-center p-2 bg-green-100 dark:bg-green-900/30 rounded">
                          <p className="text-sm font-medium">MAI</p>
                          <p className="text-xl font-bold">28</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Séance de méditation collective</h4>
                          <p className="text-sm text-muted-foreground">12:30 - 13:00 • Espace détente</p>
                          <div className="mt-2 flex gap-2">
                            <Button variant="outline" size="sm">Je participe</Button>
                            <Button variant="ghost" size="sm">En savoir plus</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="stats" className="m-0">
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">Statistiques détaillées</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Les statistiques détaillées seront disponibles prochainement
                    </p>
                    <Button variant="outline" className="mt-4">
                      Activer les notifications
                    </Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          
          {/* Recommended activities */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
              <CardDescription>Activités personnalisées pour vous</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((item) => (
                      <div key={item} className="h-24 bg-muted rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/20 to-green-500/20 p-4">
                      <h4 className="font-medium flex items-center">
                        <Music className="h-4 w-4 mr-2" />
                        Session de musique relaxante
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        15 min pour retrouver votre calme
                      </p>
                      <Button size="sm" className="mt-2 w-full">
                        Commencer
                      </Button>
                    </div>
                    
                    <div className="mt-4 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4">
                      <h4 className="font-medium flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        Exercice de respiration
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        5 min pour retrouver votre focus
                      </p>
                      <Button size="sm" className="mt-2 w-full">
                        Commencer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default B2BUserPremiumDashboard;
