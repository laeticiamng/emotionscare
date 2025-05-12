
import React, { useState, useCallback } from 'react';
import Shell from '@/Shell';
import ARExperience from '@/components/ar/ARExperience';
import ARVoiceInterface from '@/components/ar/ARVoiceInterface';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, Zap, Music, Heart, Mic, Volume2 } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import MusicControls from '@/components/music/player/MusicControls';

const ARPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState('calm');
  const [intensity, setIntensity] = useState(50);
  const [completedExperiences, setCompletedExperiences] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const { toast } = useToast();
  const musicContext = useMusic();

  const handleExperienceComplete = () => {
    setCompletedExperiences(prev => prev + 1);
    toast({
      title: "Expérience complétée",
      description: "Félicitations pour avoir terminé cette expérience AR !",
    });
  };

  const emotions = [
    { id: 'calm', label: 'Calme', icon: <span className="text-blue-400">○</span> },
    { id: 'happy', label: 'Joie', icon: <span className="text-yellow-400">○</span> },
    { id: 'sad', label: 'Tristesse', icon: <span className="text-indigo-400">○</span> },
    { id: 'anxious', label: 'Anxiété', icon: <span className="text-purple-400">○</span> },
    { id: 'angry', label: 'Colère', icon: <span className="text-red-400">○</span> },
    { id: 'neutral', label: 'Neutre', icon: <span className="text-gray-400">○</span> }
  ];
  
  const handleVoiceCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase();
    
    if (cmd.includes('pause')) {
      musicContext.pauseTrack();
      toast({ title: "Musique en pause" });
    } 
    else if (cmd.includes('play') || cmd.includes('lecture')) {
      if (musicContext.currentTrack) {
        musicContext.playTrack(musicContext.currentTrack);
        toast({ title: "Lecture de la musique" });
      }
    }
    else if (cmd.includes('suivant')) {
      musicContext.nextTrack();
      toast({ title: "Piste suivante" });
    }
    else if (cmd.includes('précédent')) {
      musicContext.previousTrack();
      toast({ title: "Piste précédente" });
    }
    else if (cmd.includes('plus fort') || cmd.includes('volume plus')) {
      const newVolume = Math.min(1, (musicContext.volume || 0) + 0.1);
      musicContext.setVolume(newVolume);
      toast({ title: `Volume: ${Math.round(newVolume * 100)}%` });
    }
    else if (cmd.includes('moins fort') || cmd.includes('volume moins')) {
      const newVolume = Math.max(0, (musicContext.volume || 0) - 0.1);
      musicContext.setVolume(newVolume);
      toast({ title: `Volume: ${Math.round(newVolume * 100)}%` });
    }
    else if (cmd.includes('changer') && cmd.includes('environnement')) {
      // Changer aléatoirement d'environnement
      const emotionIds = emotions.map(e => e.id);
      const nextEmotion = emotionIds.filter(e => e !== selectedEmotion)[
        Math.floor(Math.random() * (emotionIds.length - 1))
      ];
      setSelectedEmotion(nextEmotion);
      toast({ 
        title: "Environnement changé", 
        description: `Nouvel environnement: ${emotions.find(e => e.id === nextEmotion)?.label}`
      });
    }
  }, [musicContext, selectedEmotion, emotions, toast]);

  return (
    <Shell>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Box className="h-8 w-8 text-primary" /> 
            Réalité Augmentée Immersive
          </h1>
          <p className="text-muted-foreground">
            Vivez des expériences immersives adaptées à votre état émotionnel grâce à notre technologie AR avancée
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="experience" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="experience" className="flex items-center gap-1">
                  <Box className="h-4 w-4" /> Expérience AR
                </TabsTrigger>
                <TabsTrigger value="music" className="flex items-center gap-1">
                  <Music className="h-4 w-4" /> Ambiance sonore
                </TabsTrigger>
                <TabsTrigger value="emotions" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> État émotionnel
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-1">
                  <Mic className="h-4 w-4" /> Interface vocale
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="experience" className="space-y-4">
                <ARExperience 
                  emotion={selectedEmotion}
                  intensity={intensity}
                  onComplete={handleExperienceComplete}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Comment utiliser la réalité augmentée ?</CardTitle>
                    <CardDescription>Suivez ces étapes simples pour une expérience optimale</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2 list-decimal pl-4">
                      <li>Assurez-vous d'être dans un environnement bien éclairé et avec suffisamment d'espace</li>
                      <li>Autorisez l'accès à votre caméra lorsque l'application le demande</li>
                      <li>Visez une surface plane avec votre appareil pour activer l'ancrage AR</li>
                      <li>Interagissez avec les éléments virtuels qui apparaissent dans votre environnement</li>
                      <li>Explorez l'espace et observez comment l'expérience s'adapte à votre environnement</li>
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="music" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ambiance sonore synchronisée</CardTitle>
                    <CardDescription>La musique s'adapte en temps réel à votre expérience AR</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Notre technologie combine l'expérience visuelle AR avec une ambiance sonore parfaitement synchronisée.
                      Chaque environnement dispose de sa propre composition musicale qui évolue et s'adapte à vos émotions.
                    </p>
                    
                    <div className="p-4 border rounded-lg bg-card">
                      <MusicControls />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg text-sm">
                      <span className="font-medium">Audio spatial</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => toast({
                          title: "Audio spatial activé",
                          description: "Utilisez un casque pour une expérience optimale"
                        })}
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        Activer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="emotions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Choisissez votre état émotionnel</CardTitle>
                    <CardDescription>L'expérience AR s'adaptera en fonction de votre choix</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {emotions.map(emotion => (
                        <Button 
                          key={emotion.id}
                          variant={selectedEmotion === emotion.id ? "default" : "outline"}
                          className="flex items-center gap-2 justify-start"
                          onClick={() => setSelectedEmotion(emotion.id)}
                        >
                          {emotion.icon} {emotion.label}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <label className="text-sm font-medium mb-2 block">
                        Intensité: {intensity}%
                      </label>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={intensity} 
                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="voice" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Commandes vocales</CardTitle>
                      <Button 
                        variant={voiceEnabled ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                      >
                        {voiceEnabled ? "Désactiver" : "Activer"}
                      </Button>
                    </div>
                    <CardDescription>
                      Contrôlez votre expérience AR à l'aide de commandes vocales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ARVoiceInterface 
                      onCommand={handleVoiceCommand}
                      enabled={voiceEnabled}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques AR</CardTitle>
                <CardDescription>Votre progression immersive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Expériences complétées</span>
                    <span className="font-medium">{completedExperiences}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Émotion actuelle</span>
                    <span className="font-medium capitalize">{selectedEmotion}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Intensité</span>
                    <span className="font-medium">{intensity}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Commande vocale</span>
                    <span className="font-medium">{voiceEnabled ? "Activée" : "Désactivée"}</span>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full" onClick={() => toast({
                      title: "Suggestion d'expérience",
                      description: "Essayez l'expérience 'Jardin ensoleillé' pour améliorer votre humeur"
                    })}>
                      <Zap className="h-4 w-4 mr-2" />
                      Obtenir une recommandation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default ARPage;
