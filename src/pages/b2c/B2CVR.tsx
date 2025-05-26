
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Headphones, Play, Clock, Users, Star, Settings } from 'lucide-react';

interface VRSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  rating: number;
  participants: number;
  image: string;
  environment: string;
}

const mockVRSessions: VRSession[] = [
  {
    id: '1',
    title: 'Méditation en Forêt Virtuelle',
    description: 'Plongez dans une forêt paisible pour une séance de méditation guidée',
    duration: 15,
    category: 'Méditation',
    difficulty: 'Débutant',
    rating: 4.8,
    participants: 1250,
    image: '/images/vr/forest.jpg',
    environment: 'calm'
  },
  {
    id: '2',
    title: 'Relaxation au Bord de la Mer',
    description: 'Détendez-vous sur une plage tropicale avec le bruit des vagues',
    duration: 20,
    category: 'Relaxation',
    difficulty: 'Débutant',
    rating: 4.9,
    participants: 890,
    image: '/images/vr/beach.jpg',
    environment: 'peaceful'
  },
  {
    id: '3',
    title: 'Voyage Spatial Méditatif',
    description: 'Explorez l\'espace tout en pratiquant la pleine conscience',
    duration: 25,
    category: 'Exploration',
    difficulty: 'Intermédiaire',
    rating: 4.7,
    participants: 567,
    image: '/images/vr/space.jpg',
    environment: 'wonder'
  },
  {
    id: '4',
    title: 'Temple de Sérénité',
    description: 'Méditez dans un temple ancien aux sonorités apaisantes',
    duration: 30,
    category: 'Méditation',
    difficulty: 'Avancé',
    rating: 4.9,
    participants: 723,
    image: '/images/vr/temple.jpg',
    environment: 'spiritual'
  }
];

const B2CVR: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<VRSession | null>(null);
  const [isInSession, setIsInSession] = useState(false);

  const handleStartSession = (session: VRSession) => {
    setSelectedSession(session);
    setIsInSession(true);
    // Ici, on démarrerait réellement la session VR
    console.log('Démarrage de la session VR:', session.title);
  };

  const handleEndSession = () => {
    setIsInSession(false);
    setSelectedSession(null);
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isInSession && selectedSession) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Headphones className="h-8 w-8 text-primary" />
              Session VR en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
              <Headphones className="h-16 w-16 text-primary" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">{selectedSession.title}</h3>
              <p className="text-muted-foreground">{selectedSession.description}</p>
            </div>

            <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(selectedSession.duration)}
              </div>
              <Badge className={getDifficultyColor(selectedSession.difficulty)}>
                {selectedSession.difficulty}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="w-full bg-secondary h-2 rounded-full">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: '45%' }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Session en cours... Laissez-vous guider par l'expérience
              </p>
            </div>

            <Button onClick={handleEndSession} variant="outline" size="lg">
              Terminer la session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Headphones className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Expériences VR Thérapeutiques</h1>
          <p className="text-muted-foreground">Immergez-vous dans des environnements apaisants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions VR */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Sessions Disponibles</h2>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Préférences VR
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockVRSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-3 flex items-center justify-center">
                    <Headphones className="h-12 w-12 text-primary/50" />
                  </div>
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {session.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(session.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {session.participants}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{session.rating}</span>
                      </div>
                      <Badge className={getDifficultyColor(session.difficulty)}>
                        {session.difficulty}
                      </Badge>
                    </div>
                    
                    <Button onClick={() => handleStartSession(session)} size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Démarrer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Informations et conseils */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Guide VR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Avant de commencer :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Trouvez un endroit calme</li>
                  <li>• Portez des écouteurs</li>
                  <li>• Installez-vous confortablement</li>
                  <li>• Fermez les yeux si souhaité</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vos Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sessions complétées</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Temps total</span>
                <span className="font-medium">4h 30min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Session favorite</span>
                <span className="font-medium">Forêt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Série actuelle</span>
                <span className="font-medium">7 jours</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Basé sur votre utilisation récente :
              </p>
              <Button variant="outline" size="sm" className="w-full mb-2">
                Session de relaxation
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Méditation guidée
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CVR;
