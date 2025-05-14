
import React, { useState, useEffect } from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCoach } from '@/contexts/CoachContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, Calendar, Smile, Music, VolumeX, Volume2 } from 'lucide-react';
import UnifiedEmotionCheckin from '@/components/scan/UnifiedEmotionCheckin';
import MusicPlayer from '@/components/music/MusicPlayer';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils';

const B2CDashboard: React.FC = () => {
  const { userMode, setUserMode } = useUserMode();
  const { user } = useAuth();
  const { recommendations, generateRecommendation } = useCoach();
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [latestEmotion, setLatestEmotion] = useState({ emotion: 'neutral', score: 0.5 });
  const [greeting, setGreeting] = useState('');
  const { toast } = useToast();
  
  // Ensure the user mode is set correctly
  useEffect(() => {
    setUserMode('b2c');
    
    // Generate time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
    
    // Generate initial recommendations
    generateRecommendation();
  }, [setUserMode, generateRecommendation]);
  
  const handleEmotionDetected = (emotion: string, result: any) => {
    setLatestEmotion(result);
    toast({
      title: "Émotion détectée",
      description: `Nous avons détecté que vous êtes ${emotion}`,
    });
  };
  
  const handleRefresh = () => {
    generateRecommendation();
    toast({
      title: "Mise à jour",
      description: "Vos recommandations ont été actualisées",
    });
  };
  
  const toggleMusic = () => {
    setIsPlayingMusic(!isPlayingMusic);
  };
  
  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{greeting}, {user?.name || 'Utilisateur'}</h1>
        <p className="text-muted-foreground">
          {formatDate(new Date(), 'full')} · Votre espace bien-être personnel
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Météo émotionnelle */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Votre météo émotionnelle</CardTitle>
              <CardDescription>
                Comment vous sentez-vous aujourd'hui ?
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </CardHeader>
          <CardContent>
            <UnifiedEmotionCheckin />
          </CardContent>
        </Card>
        
        {/* Recommendations */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Recommandations IA</CardTitle>
            <CardDescription>
              Suggestions personnalisées pour votre bien-être
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations && recommendations.length > 0 ? (
              recommendations.map(rec => (
                <div key={rec.id} className="p-3 rounded-lg bg-muted">
                  <h4 className="font-semibold">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Chargement des recommandations...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Ambiance musicale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ambiance sonore adaptative</CardTitle>
            <CardDescription>
              Musique générée en fonction de votre état émotionnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant={isPlayingMusic ? "default" : "outline"}
                  className="mr-3"
                  onClick={toggleMusic}
                >
                  {isPlayingMusic ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
                  {isPlayingMusic ? "Arrêter" : "Lancer"}
                </Button>
                <div>
                  <p className="font-medium">Ambiance "{latestEmotion.emotion}"</p>
                  <p className="text-sm text-muted-foreground">Intensité: {(latestEmotion.score * 100).toFixed(0)}%</p>
                </div>
              </div>
              <div className="flex items-center">
                {isPlayingMusic && (
                  <span className="flex items-center text-muted-foreground text-sm">
                    <Clock className="h-3 w-3 mr-1" /> En lecture
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Votre agenda émotionnel</CardTitle>
            <CardDescription>
              Aperçu de votre semaine
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-6 pb-8">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Consultez votre journal</p>
              <p className="text-sm text-muted-foreground mt-1">
                Voir les entrées récentes
              </p>
              <Button variant="outline" className="mt-4" size="sm">
                Ouvrir le journal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Modules recommandés */}
      <Card>
        <CardHeader>
          <CardTitle>Modules recommandés pour vous</CardTitle>
          <CardDescription>
            Basés sur vos interactions récentes et votre état émotionnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ModuleCard 
              title="Méditation guidée"
              description="Session de 5 minutes pour déstresser"
              icon={<Smile className="h-5 w-5" />}
              link="/b2c/vr"
            />
            <ModuleCard 
              title="Playlist apaisante"
              description="Musique relaxante personnalisée"
              icon={<Music className="h-5 w-5" />}
              link="/b2c/music"
            />
            <ModuleCard 
              title="Scan émotionnel"
              description="Analysez votre état actuel"
              icon={<RefreshCw className="h-5 w-5" />}
              link="/b2c/scan"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Music player (hidden but included for context) */}
      <div className="hidden">
        <MusicPlayer />
      </div>
    </div>
  );
};

// Module card component
const ModuleCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}> = ({ title, description, icon, link }) => {
  return (
    <Button variant="outline" asChild className="h-auto flex flex-col items-center justify-center p-6 text-center hover:bg-accent">
      <a href={link}>
        <div className="rounded-full bg-primary/10 p-3 mb-3">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </a>
    </Button>
  );
};

export default B2CDashboard;
