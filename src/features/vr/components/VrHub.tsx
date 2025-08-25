import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  VrHeadset, 
  Play, 
  Pause, 
  RotateCcw,
  Settings,
  Eye,
  Headphones,
  Clock,
  Star
} from 'lucide-react';
import { useNavAction } from '@/hooks/useNavAction';

export function VrHub() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isInVr, setIsInVr] = useState(false);
  const navAction = useNavAction();

  const vrExperiences = [
    {
      id: 'forest-meditation',
      title: 'Forêt Enchantée',
      description: 'Méditation guidée dans une forêt mystique',
      duration: 15,
      difficulty: 'Débutant',
      category: 'Méditation',
      rating: 4.8,
      participants: 1247,
      thumbnail: '/vr/forest.jpg'
    },
    {
      id: 'ocean-depths',
      title: 'Profondeurs Océaniques',
      description: 'Plongée relaxante dans les abysses',
      duration: 20,
      difficulty: 'Intermédiaire',
      category: 'Relaxation',
      rating: 4.9,
      participants: 892,
      thumbnail: '/vr/ocean.jpg'
    },
    {
      id: 'space-journey',
      title: 'Voyage Galactique',
      description: 'Exploration apaisante de l\'espace',
      duration: 25,
      difficulty: 'Avancé',
      category: 'Exploration',
      rating: 4.7,
      participants: 654,
      thumbnail: '/vr/space.jpg'
    },
    {
      id: 'zen-garden',
      title: 'Jardin Zen',
      description: 'Méditation dans un jardin japonais',
      duration: 10,
      difficulty: 'Débutant',
      category: 'Mindfulness',
      rating: 4.6,
      participants: 1534,
      thumbnail: '/vr/zen.jpg'
    }
  ];

  const handleStartVr = (experienceId: string) => {
    setActiveSession(experienceId);
    setIsInVr(true);
  };

  const handleStopVr = () => {
    setActiveSession(null);
    setIsInVr(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <VrHeadset className="h-8 w-8 text-primary" />
            Réalité Virtuelle
          </h1>
          <p className="text-muted-foreground">
            Expériences immersives pour votre bien-être mental
          </p>
        </div>
        {isInVr && (
          <Badge variant="secondary" className="px-3 py-2">
            <Eye className="w-4 h-4 mr-2" />
            En VR
          </Badge>
        )}
      </div>

      {/* VR Status */}
      {isInVr && activeSession && (
        <Card className="border-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Session Active</h3>
                <p className="text-muted-foreground">
                  {vrExperiences.find(exp => exp.id === activeSession)?.title}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    5:30 / 15:00
                  </div>
                  <div className="flex items-center gap-1">
                    <Headphones className="w-4 h-4" />
                    Audio 3D activé
                  </div>
                </div>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button variant="destructive" size="sm" onClick={handleStopVr}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Arrêter
                </Button>
              </div>
            </div>
            <Progress value={37} className="mt-4" />
          </CardContent>
        </Card>
      )}

      {/* VR Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vrExperiences.map((experience) => (
          <Card 
            key={experience.id} 
            className={`hover:shadow-lg transition-all cursor-pointer ${
              activeSession === experience.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
              <VrHeadset className="h-16 w-16 text-white" />
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{experience.title}</CardTitle>
                  <CardDescription>{experience.description}</CardDescription>
                </div>
                <Badge variant="outline">{experience.category}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {experience.duration} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {experience.rating}
                  </div>
                </div>
                <span>{experience.participants} participants</span>
              </div>

              <div className="flex items-center justify-between">
                <Badge 
                  variant={
                    experience.difficulty === 'Débutant' ? 'secondary' :
                    experience.difficulty === 'Intermédiaire' ? 'default' : 'destructive'
                  }
                  className="text-xs"
                >
                  {experience.difficulty}
                </Badge>
                
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navAction({ 
                      type: 'modal', 
                      id: 'vr-preview', 
                      payload: { experienceId: experience.id } 
                    })}
                  >
                    Aperçu
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleStartVr(experience.id)}
                    disabled={isInVr}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Lancer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* VR Setup & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuration VR</CardTitle>
            <CardDescription>
              Vérifiez et ajustez vos paramètres VR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navAction({ type: 'modal', id: 'vr-calibration' })}
            >
              <Settings className="w-4 h-4 mr-2" />
              Calibrer le casque
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navAction({ type: 'modal', id: 'vr-comfort' })}
            >
              <Eye className="w-4 h-4 mr-2" />
              Paramètres de confort
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navAction({ type: 'modal', id: 'vr-tutorial' })}
            >
              <VrHeadset className="w-4 h-4 mr-2" />
              Tutoriel VR
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mes Sessions</CardTitle>
            <CardDescription>
              Historique de vos expériences VR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center text-sm text-muted-foreground py-8">
              <VrHeadset className="w-12 h-12 mx-auto mb-2 opacity-50" />
              Aucune session enregistrée
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={() => navAction({ type: 'modal', id: 'vr-recommendations' })}
        >
          <Star className="w-4 h-4 mr-2" />
          Expériences recommandées
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'vr-community' })}
        >
          <Eye className="w-4 h-4 mr-2" />
          Communauté VR
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'vr-help' })}
        >
          <Settings className="w-4 h-4 mr-2" />
          Aide & Support
        </Button>
      </div>
    </div>
  );
}