
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Play, Volume2, Headphones, Clock, Calendar } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const B2BUserVR: React.FC = () => {
  const { user } = useAuth();
  const [volume, setVolume] = useState(70);
  
  // Sample VR sessions data
  const vrSessions = {
    quick: [
      { id: '1', title: 'Respiration minute', duration: '1 min', level: 'Débutant', image: '/images/vr-banner-bg.jpg' },
      { id: '2', title: 'Recentrage express', duration: '2 min', level: 'Intermédiaire', image: '/images/vr-banner-bg.jpg' },
      { id: '3', title: 'Focus instantané', duration: '3 min', level: 'Tous niveaux', image: '/images/vr-banner-bg.jpg' },
    ],
    medium: [
      { id: '4', title: 'Pause méditative', duration: '5 min', level: 'Débutant', image: '/images/vr-banner-bg.jpg' },
      { id: '5', title: 'Visualisation positive', duration: '7 min', level: 'Intermédiaire', image: '/images/vr-banner-bg.jpg' },
      { id: '6', title: 'Ancrage professionnel', duration: '8 min', level: 'Avancé', image: '/images/vr-banner-bg.jpg' },
    ],
    long: [
      { id: '7', title: 'Immersion complète', duration: '10 min', level: 'Intermédiaire', image: '/images/vr-banner-bg.jpg' },
      { id: '8', title: 'Voyage de déconnexion', duration: '12 min', level: 'Avancé', image: '/images/vr-banner-bg.jpg' },
      { id: '9', title: 'Session régénération', duration: '15 min', level: 'Expert', image: '/images/vr-banner-bg.jpg' },
    ]
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Pause Immersive</h1>
      <p className="text-muted-foreground mb-8">
        Des sessions de respiration guidée, méditation et visualisation pour réduire le stress et améliorer votre concentration au travail.
      </p>
      
      <div className="relative rounded-lg overflow-hidden mb-8 h-64 bg-gradient-to-r from-blue-600 to-indigo-800">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img 
          src="/images/vr-banner-bg.jpg" 
          alt="VR Experience" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-center items-center p-6 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Session Recommandée</h2>
          <p className="mb-4">Recentrage professionnel - 5 minutes</p>
          <p className="text-sm mb-6 max-w-md">
            Idéale pour retrouver calme et clarté en milieu de journée professionnelle intense.
          </p>
          <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90">
            <Play className="mr-2 h-4 w-4" />
            Démarrer maintenant
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Sessions Express
            </CardTitle>
            <CardDescription>1-3 minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vrSessions.quick.map(session => (
              <VRSessionCard key={session.id} session={session} />
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Pauses Standard
            </CardTitle>
            <CardDescription>5-8 minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vrSessions.medium.map(session => (
              <VRSessionCard key={session.id} session={session} />
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Immersions Complètes
            </CardTitle>
            <CardDescription>10-15 minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vrSessions.long.map(session => (
              <VRSessionCard key={session.id} session={session} />
            ))}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres audio</CardTitle>
            <CardDescription>Ajustez votre expérience sonore</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Volume</Label>
                <span className="text-sm text-muted-foreground">{volume}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={(values) => setVolume(values[0])}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Type d'audio</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <Headphones className="mr-2 h-4 w-4" />
                  <span>Stéréo</span>
                </Button>
                <Button variant="outline" className="justify-start">
                  <Headphones className="mr-2 h-4 w-4" />
                  <span>Binaural</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Journal des sessions</CardTitle>
            <CardDescription>Vos dernières pauses immersives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Respiration minute</h3>
                  <p className="text-sm text-muted-foreground">Aujourd'hui, 10:35</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">1 min</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Pause méditative</h3>
                  <p className="text-sm text-muted-foreground">Hier, 15:20</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">5 min</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Ancrage professionnel</h3>
                  <p className="text-sm text-muted-foreground">Lundi, 09:15</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">8 min</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Voir l'historique complet</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

interface VRSession {
  id: string;
  title: string;
  duration: string;
  level: string;
  image: string;
}

interface VRSessionCardProps {
  session: VRSession;
}

const VRSessionCard: React.FC<VRSessionCardProps> = ({ session }) => {
  return (
    <div className="border rounded-lg overflow-hidden flex">
      <div className="w-1/3 h-24 bg-blue-100 relative">
        <img 
          src={session.image} 
          alt={session.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-2/3 p-3">
        <h3 className="font-medium text-sm">{session.title}</h3>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{session.duration}</span>
          <span>{session.level}</span>
        </div>
        <Button size="sm" className="w-full">Démarrer</Button>
      </div>
    </div>
  );
};

interface LabelProps {
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children }) => {
  return (
    <p className="text-sm font-medium mb-1.5">{children}</p>
  );
};

export default B2BUserVR;
