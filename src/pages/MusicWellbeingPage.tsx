import React, { useState, useEffect } from 'react';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { MusicTrack } from '@/types';
import { useMusicControls } from '@/hooks/useMusicControls';

const MusicWellbeingPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('player');
  const [duration, setDuration] = useState(300); // 5 minutes default
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<MusicTrack | null>(null);
  const [musicPreferences, setMusicPreferences] = useState({
    tempo: 70,
    energy: 30,
    complexity: 40,
    brightness: 60,
  });
  
  // Music player implementation
  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause logic
      setIsPlaying(false);
    } else {
      // Play logic
      setIsPlaying(true);
      
      // Show toast when music starts playing
      toast({
        title: "Musique démarrée",
        description: "Votre session musicale thérapeutique est en cours.",
      });
    }
  };
  
  const handleGenerateMusic = () => {
    // AI music generation logic would go here
    // For the demo, we're just simulating generation
    setCurrentMusic({
      id: 'generated-1',
      title: 'Méditation tranquille',
      artist: 'EmotionsAI',
      duration: duration,
      url: '#',
      cover: '/images/music/meditation.jpg',
      mood: 'calm',
    });
    
    // Show toast when music is generated
    toast({
      title: "Musique générée",
      description: "Votre musique personnalisée a été créée avec succès.",
    });
  };
  
  const handleSaveFavorite = () => {
    // Save current music to favorites
    
    toast({
      title: "Ajouté aux favoris",
      description: "Cette musique a été ajoutée à vos favoris.",
    });
  };

  return (
    <ProtectedLayoutWrapper>
      <div className="container mx-auto py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Musique thérapeutique</h1>
          <p className="text-muted-foreground">
            Utilisez la musique pour équilibrer votre état émotionnel et améliorer votre bien-être
          </p>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="player">Lecteur</TabsTrigger>
            <TabsTrigger value="create">Créer</TabsTrigger>
            <TabsTrigger value="library">Bibliothèque</TabsTrigger>
          </TabsList>
          
          <TabsContent value="player">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Lecteur musical</h2>
                      {currentMusic && (
                        <Badge variant="outline" className="bg-blue-50">
                          {currentMusic.mood}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {currentMusic ? (
                      <div className="space-y-6">
                        <div className="aspect-square max-w-xs mx-auto bg-muted rounded-lg overflow-hidden shadow-md">
                          {currentMusic.cover ? (
                            <img 
                              src={currentMusic.cover} 
                              alt={currentMusic.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                              <span className="text-3xl text-primary">♪</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-center">
                          <h3 className="text-xl font-medium">{currentMusic.title}</h3>
                          <p className="text-muted-foreground">{currentMusic.artist}</p>
                        </div>
                        
                        <div className="flex justify-center gap-4">
                          <Button 
                            size="lg"
                            onClick={handlePlayPause}
                            className="min-w-[120px]"
                          >
                            {isPlaying ? 'Pause' : 'Lecture'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={handleSaveFavorite}
                          >
                            Ajouter aux favoris
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-6">
                          Aucune musique sélectionnée. Veuillez créer une nouvelle musique ou choisir dans votre bibliothèque.
                        </p>
                        <Button 
                          onClick={() => setActiveTab('create')}
                          variant="default"
                        >
                          Créer une musique
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Recommandations</h2>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Basé sur votre état émotionnel actuel, nous recommandons:
                    </p>
                    
                    <div className="space-y-2">
                      <Button className="w-full justify-start" variant="outline" onClick={() => {
                        setCurrentMusic({
                          id: 'rec-1',
                          title: 'Méditation du matin',
                          artist: 'EmotionsAI',
                          duration: 300,
                          url: '#',
                          mood: 'calm',
                          genre: 'ambient',
                        } as MusicTrack);
                      }}>
                        Méditation du matin
                      </Button>
                      
                      <Button className="w-full justify-start" variant="outline" onClick={() => {
                        setCurrentMusic({
                          id: 'rec-2',
                          title: 'Focus productif',
                          artist: 'EmotionsAI',
                          duration: 600,
                          url: '#',
                          mood: 'focused',
                          genre: 'electronic',
                        } as MusicTrack);
                      }}>
                        Focus productif
                      </Button>
                      
                      <Button className="w-full justify-start" variant="outline" onClick={() => {
                        setCurrentMusic({
                          id: 'rec-3',
                          title: 'Relaxation profonde',
                          artist: 'EmotionsAI',
                          duration: 900,
                          url: '#',
                          mood: 'relaxed',
                          genre: 'nature',
                        } as MusicTrack);
                      }}>
                        Relaxation profonde
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Créer une musique</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tempo" className="mb-2 block">Tempo: {musicPreferences.tempo}</Label>
                      <Slider 
                        id="tempo"
                        min={40}
                        max={180}
                        step={1}
                        defaultValue={[musicPreferences.tempo]}
                        onValueChange={(value) => setMusicPreferences({
                          ...musicPreferences,
                          tempo: value[0]
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="energy" className="mb-2 block">Énergie: {musicPreferences.energy}%</Label>
                      <Slider 
                        id="energy"
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[musicPreferences.energy]}
                        onValueChange={(value) => setMusicPreferences({
                          ...musicPreferences,
                          energy: value[0]
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="complexity" className="mb-2 block">Complexité: {musicPreferences.complexity}%</Label>
                      <Slider 
                        id="complexity"
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[musicPreferences.complexity]}
                        onValueChange={(value) => setMusicPreferences({
                          ...musicPreferences,
                          complexity: value[0]
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="brightness" className="mb-2 block">Luminosité: {musicPreferences.brightness}%</Label>
                      <Slider 
                        id="brightness"
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[musicPreferences.brightness]}
                        onValueChange={(value) => setMusicPreferences({
                          ...musicPreferences,
                          brightness: value[0]
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Durée</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant={duration === 180 ? "default" : "outline"} 
                        onClick={() => setDuration(180)}
                      >
                        3 minutes
                      </Button>
                      <Button 
                        variant={duration === 300 ? "default" : "outline"} 
                        onClick={() => setDuration(300)}
                      >
                        5 minutes
                      </Button>
                      <Button 
                        variant={duration === 600 ? "default" : "outline"} 
                        onClick={() => setDuration(600)}
                      >
                        10 minutes
                      </Button>
                      <Button 
                        variant={duration === 900 ? "default" : "outline"} 
                        onClick={() => setDuration(900)}
                      >
                        15 minutes
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      size="lg" 
                      className="min-w-[200px]"
                      onClick={handleGenerateMusic}
                    >
                      Générer la musique
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="library">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Ma bibliothèque</h2>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-10">
                  Votre bibliothèque est vide. Commencez à créer et à enregistrer de la musique!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayoutWrapper>
  );
};

export default MusicWellbeingPage;
