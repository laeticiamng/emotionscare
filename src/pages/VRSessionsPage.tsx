
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Play, Clock, Heart, Brain } from 'lucide-react';

const VRSessionsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommended');
  
  // Sessions VR fictives
  const sessions = [
    {
      id: '1',
      title: 'Respiration Zen',
      description: 'Une séance de respiration consciente pour réduire votre stress',
      duration: '7 minutes',
      category: 'relaxation',
      image: 'https://images.unsplash.com/photo-1518707963169-21a3cc7077ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      recommended: true
    },
    {
      id: '2',
      title: 'Forêt Enchantée',
      description: 'Immersion dans une forêt paisible pour favoriser la détente',
      duration: '12 minutes',
      category: 'nature',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      recommended: true
    },
    {
      id: '3',
      title: 'Pause Océanique',
      description: "Sons et images de l'océan pour un moment de calme absolu",
      duration: '10 minutes',
      category: 'nature',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      recommended: false
    },
    {
      id: '4',
      title: 'Visualisation Positive',
      description: 'Exercices guidés pour visualiser des objectifs et renforcer la motivation',
      duration: '15 minutes',
      category: 'mindfulness',
      image: 'https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      recommended: false
    },
  ];

  // Filtrer les sessions selon l'onglet actif
  const filteredSessions = sessions.filter(session => {
    if (activeTab === 'recommended') return session.recommended;
    if (activeTab === 'all') return true;
    return session.category === activeTab;
  });

  const handleSessionClick = (sessionId: string) => {
    navigate(`/vr-sessions/${sessionId}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Micro-pauses VR</h1>
        <Button variant="outline" onClick={() => navigate('/vr-analytics')} className="hidden md:flex">
          Historique des sessions
        </Button>
      </div>

      <p className="mb-6 text-muted-foreground">
        Prenez un moment pour vous ressourcer avec nos sessions immersives conçues pour réduire le stress et améliorer votre bien-être.
      </p>
      
      <Tabs defaultValue="recommended" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="recommended">Recommandés</TabsTrigger>
          <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
          <TabsTrigger value="nature">Nature</TabsTrigger>
          <TabsTrigger value="all">Tous</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSessionClick(session.id)}>
                <div className="h-40 w-full overflow-hidden">
                  <img 
                    src={session.image} 
                    alt={session.title} 
                    className="h-full w-full object-cover" 
                    onError={(e) => {
                      // Fallback image if the original fails to load
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{session.description}</p>
                  <div className="flex items-center mt-3 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{session.duration}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="px-2 py-1">
                    Démarrer <Play className="ml-1 h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-rose-500" />
            Bienfaits des micro-pauses VR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/60 rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-indigo-500" />
                Réduction du stress
              </h3>
              <p className="text-sm text-muted-foreground">
                Des études montrent que 10 minutes d'immersion en réalité virtuelle peuvent réduire significativement les niveaux de cortisol.
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-indigo-500" />
                Amélioration de la concentration
              </h3>
              <p className="text-sm text-muted-foreground">
                Les micro-pauses régulières augmentent la productivité et la capacité à rester concentré sur des tâches complexes.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="px-0" onClick={() => navigate('/vr-analytics')}>
            En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VRSessionsPage;
