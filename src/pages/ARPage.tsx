
import React, { useState } from 'react';
import Shell from '@/Shell';
import ARExperience from '@/components/ar/ARExperience';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cube, Zap, Music, Heart } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import MusicControls from '@/components/music/player/MusicControls';

const ARPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState('calm');
  const [intensity, setIntensity] = useState(50);
  const [completedExperiences, setCompletedExperiences] = useState(0);
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

  return (
    <Shell>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Cube className="h-8 w-8 text-primary" /> 
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
                  <Cube className="h-4 w-4" /> Expérience AR
                </TabsTrigger>
                <TabsTrigger value="music" className="flex items-center gap-1">
                  <Music className="h-4 w-4" /> Ambiance sonore
                </TabsTrigger>
                <TabsTrigger value="emotions" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> État émotionnel
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
