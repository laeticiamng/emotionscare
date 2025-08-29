import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/hooks/useSupabase';
import { Heart, Brain, Headphones, Camera, Gamepad2, Users } from 'lucide-react';

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'in_progress' | 'completed';
  category: 'wellness' | 'emotion' | 'music' | 'social';
}

export default function Dashboard() {
  const { safeQuery } = useSupabase();
  const [modules] = useState<ModuleCard[]>([
    {
      id: 'flash-glow',
      title: 'Flash Glow',
      description: 'Techniques de respiration guidée pour la relaxation',
      icon: <Heart className="h-6 w-6" />,
      status: 'available',
      category: 'wellness'
    },
    {
      id: 'emotion-scan',
      title: 'Scan Émotionnel',
      description: 'Analyse des émotions via reconnaissance faciale',
      icon: <Camera className="h-6 w-6" />,
      status: 'available',
      category: 'emotion'
    },
    {
      id: 'bubble-beat',
      title: 'Bubble Beat',
      description: 'Cohérence cardiaque avec capteur Bluetooth',
      icon: <Heart className="h-6 w-6" />,
      status: 'available',
      category: 'wellness'
    },
    {
      id: 'mood-mixer',
      title: 'Mood Mixer',
      description: 'Musique thérapeutique personnalisée',
      icon: <Headphones className="h-6 w-6" />,
      status: 'available',
      category: 'music'
    },
    {
      id: 'bounce-battle',
      title: 'Bounce-Back Battle',
      description: 'Coaching IA pour développer la résilience',
      icon: <Gamepad2 className="h-6 w-6" />,
      status: 'available',
      category: 'wellness'
    },
    {
      id: 'vr-breath',
      title: 'VR Respiration',
      description: 'Méditation immersive en réalité virtuelle',
      icon: <Brain className="h-6 w-6" />,
      status: 'available',
      category: 'wellness'
    }
  ]);

  const [userProgress, setUserProgress] = useState({
    streak: 0,
    level: 'Débutant',
    completedSessions: 0
  });

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    // Simuler les données utilisateur
    setUserProgress({
      streak: 3,
      level: 'Motivé',
      completedSessions: 12
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wellness': return 'bg-blue-500/10 text-blue-700';
      case 'emotion': return 'bg-purple-500/10 text-purple-700';
      case 'music': return 'bg-green-500/10 text-green-700';
      case 'social': return 'bg-orange-500/10 text-orange-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return <Badge variant="outline" className="text-green-600">Disponible</Badge>;
      case 'in_progress': return <Badge variant="outline" className="text-blue-600">En cours</Badge>;
      case 'completed': return <Badge variant="outline" className="text-purple-600">Terminé</Badge>;
      default: return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête avec progression */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          <p className="text-muted-foreground text-lg">
            Votre parcours de bien-être personnalisé
          </p>
          
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userProgress.streak}</div>
              <div className="text-sm text-muted-foreground">jours consécutifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userProgress.level}</div>
              <div className="text-sm text-muted-foreground">niveau actuel</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userProgress.completedSessions}</div>
              <div className="text-sm text-muted-foreground">sessions terminées</div>
            </div>
          </div>
        </div>

        {/* Grille des modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${getCategoryColor(module.category)}`}>
                    {module.icon}
                  </div>
                  {getStatusBadge(module.status)}
                </div>
                <div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-2">
                    {module.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full group-hover:scale-105 transition-transform"
                  variant={module.status === 'available' ? 'default' : 'outline'}
                  disabled={module.status !== 'available'}
                >
                  {module.status === 'available' ? 'Commencer' : 'Bientôt disponible'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section d'activité récente */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Activité récente
            </CardTitle>
            <CardDescription>
              Vos dernières sessions et progrès
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune activité récente</p>
              <p className="text-sm mt-2">Commencez une session pour voir vos progrès ici</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}