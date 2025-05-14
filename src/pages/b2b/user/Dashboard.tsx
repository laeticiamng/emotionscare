
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Smile, Frown, Meh, ChevronRight, Music, Activity, Calendar, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BUserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMode, setUserMode } = useUserMode();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentEmotion, setCurrentEmotion] = useState({ type: 'neutral', score: 0.6 });
  
  // Ensure the user mode is set correctly
  useEffect(() => {
    setUserMode('b2b-user');
  }, [setUserMode]);
  
  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };
  
  // Mock emotional data for visualization
  const emotionalData = [
    { day: 'Lun', score: 65, status: 'neutral' },
    { day: 'Mar', score: 75, status: 'good' },
    { day: 'Mer', score: 60, status: 'neutral' },
    { day: 'Jeu', score: 45, status: 'bad' },
    { day: 'Ven', score: 80, status: 'good' },
    { day: 'Sam', score: 70, status: 'good' },
    { day: 'Dim', score: 85, status: 'good' },
  ];
  
  // Recommendations based on current emotion
  const getRecommendations = () => {
    if (currentEmotion.score > 0.7) {
      return [
        { id: '1', title: 'Maintenez cette énergie', description: 'Profitez de cet état pour les tâches complexes', icon: <Activity className="h-5 w-5" /> },
        { id: '2', title: 'Musique focus', description: 'Musique adaptée pour maintenir votre concentration', icon: <Music className="h-5 w-5" /> },
      ];
    } else if (currentEmotion.score > 0.4) {
      return [
        { id: '3', title: 'Pause respiration', description: '2 minutes de respiration pour vous recentrer', icon: <Activity className="h-5 w-5" /> },
        { id: '4', title: 'Scan émotionnel express', description: 'Faites le point sur votre état émotionnel', icon: <Smile className="h-5 w-5" /> },
      ];
    } else {
      return [
        { id: '5', title: 'Micro-pause détente', description: '5 minutes pour vous ressourcer', icon: <Calendar className="h-5 w-5" /> },
        { id: '6', title: 'Musique apaisante', description: 'Écoutez une playlist pour vous apaiser', icon: <Music className="h-5 w-5" /> },
      ];
    }
  };
  
  // Get emotion icon based on type
  const getEmotionIcon = () => {
    switch (currentEmotion.type) {
      case 'positive':
        return <Smile className="h-8 w-8 text-green-500" />;
      case 'negative':
        return <Frown className="h-8 w-8 text-red-500" />;
      default:
        return <Meh className="h-8 w-8 text-amber-500" />;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        
        <Button className="mt-4 md:mt-0">
          Scan rapide
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>État émotionnel professionnel</CardTitle>
            <CardDescription>
              Suivi de votre bien-être au travail sur 7 jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={emotionalData}>
                <XAxis dataKey="day" />
                <YAxis hide />
                <Tooltip 
                  formatter={(value) => [`Score: ${value}`, 'Bien-être']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar 
                  dataKey="score" 
                  radius={[4, 4, 0, 0]}
                  fill="hsl(var(--primary))"
                  fillOpacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Aujourd'hui</CardTitle>
            <CardDescription>
              Votre humeur professionnelle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              {getEmotionIcon()}
              <div>
                <h3 className="font-medium">Équilibré</h3>
                <p className="text-sm text-muted-foreground">Score: {currentEmotion.score * 100}%</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Suggestions personnalisées</h4>
              {getRecommendations().map(recommendation => (
                <Button 
                  key={recommendation.id}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <div className="mr-2 text-primary">
                    {recommendation.icon}
                  </div>
                  <div className="flex flex-col items-start">
                    <span>{recommendation.title}</span>
                    <span className="text-xs text-muted-foreground">{recommendation.description}</span>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <Tabs defaultValue="modules">
          <TabsList className="mb-4">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="team">Mon équipe</TabsTrigger>
            <TabsTrigger value="challenges">Défis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ModuleCard 
              title="Journal Pro" 
              description="Journal émotionnel professionnel" 
              icon={<Calendar className="h-8 w-8" />}
              link="/b2b/user/journal"
            />
            <ModuleCard 
              title="Musique" 
              description="Playlists adaptées à votre travail" 
              icon={<Music className="h-8 w-8" />}
              link="/b2b/user/music"
            />
            <ModuleCard 
              title="Scan Express" 
              description="Analyse émotionnelle rapide" 
              icon={<Activity className="h-8 w-8" />}
              link="/b2b/user/scan"
            />
            <ModuleCard 
              title="Coach Pro" 
              description="Conseil et soutien personnalisé" 
              icon={<Activity className="h-8 w-8" />}
              link="/b2b/user/coach"
            />
            <ModuleCard 
              title="Pause VR" 
              description="Courtes pauses immersives" 
              icon={<Activity className="h-8 w-8" />}
              link="/b2b/user/vr"
            />
            <ModuleCard 
              title="Défis Pro" 
              description="Challenges de bien-être au travail" 
              icon={<Activity className="h-8 w-8" />}
              link="/b2b/user/gamification"
            />
          </TabsContent>
          
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Mon Équipe</CardTitle>
                <CardDescription>
                  Aperçu du bien-être collectif de votre équipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Fonctionnalité disponible bientôt
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="challenges">
            <Card>
              <CardHeader>
                <CardTitle>Défis Professionnels</CardTitle>
                <CardDescription>
                  Challenges de bien-être au travail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Fonctionnalité disponible bientôt
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statut journalier</CardTitle>
            <CardDescription>Votre journée en chiffres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">3/5</div>
                <div className="text-sm text-muted-foreground">Activités bien-être</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Défis complétés</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">15 min</div>
                <div className="text-sm text-muted-foreground">Temps de pause</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">+120</div>
                <div className="text-sm text-muted-foreground">Points bien-être</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sessions recommandées</CardTitle>
            <CardDescription>En fonction de votre état actuel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Pause respiration guidée</h3>
              <p className="text-sm text-muted-foreground mb-2">Recentrage rapide - 2 minutes</p>
              <Button variant="outline" size="sm" className="w-full">Démarrer maintenant</Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Playlist concentration</h3>
              <p className="text-sm text-muted-foreground mb-2">Musique adaptative pour focus</p>
              <Button variant="outline" size="sm" className="w-full">Écouter</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon, link }) => {
  return (
    <a href={link} className="block">
      <Card className="h-full transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 p-2 rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};

export default B2BUserDashboard;
