
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Heart, Clock, Pause, Play, SkipBack, SkipForward, Volume2, List } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const B2CMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [volume, setVolume] = useState(70);
  const { toast } = useToast();
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Lecture en pause" : "Lecture en cours",
      description: isPlaying ? "La musique a été mise en pause" : "La musique commence à jouer",
    });
  };
  
  const handleMoodSelect = (mood: string) => {
    toast({
      title: `Ambiance "${mood}" sélectionnée`,
      description: "Génération d'une nouvelle composition musicale adaptée à votre humeur",
    });
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Musique thérapeutique</h1>
        <p className="text-muted-foreground">
          Des compositions musicales adaptées à votre état émotionnel
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Music player */}
          <Card className="w-full">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Lecteur musical</CardTitle>
                  <CardDescription>
                    Composition musicale personnalisée
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  3:24
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-48 h-48 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Music className="h-24 w-24 text-primary/50" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">Harmonie Apaisante</h3>
                  <p className="text-sm text-muted-foreground">Composition émotionnelle adaptative</p>
                </div>
                <div className="w-full max-w-md px-6">
                  <div className="h-1 w-full bg-primary/20 rounded-full">
                    <div className="h-1 bg-primary rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1:12</span>
                    <span>3:24</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" disabled>
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button 
                  variant="default" 
                  size="icon" 
                  className="h-12 w-12 rounded-full"
                  onClick={togglePlayback}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-1" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" disabled>
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
            <CardFooter className="pt-0 pb-4">
              <div className="flex items-center gap-2 w-full max-w-xs mx-auto">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                />
                <span className="w-8 text-xs text-muted-foreground">{volume}%</span>
              </div>
            </CardFooter>
          </Card>
          
          {/* Library */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Bibliothèque musicale</CardTitle>
              <CardDescription>
                Vos compositions générées et favorites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">Tous</TabsTrigger>
                  <TabsTrigger value="favorites" className="flex-1">Favoris</TabsTrigger>
                  <TabsTrigger value="generated" className="flex-1">Générés</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <div className="space-y-1">
                    <MusicItem active title="Harmonie Apaisante" duration="3:24" />
                    <MusicItem title="Méditation du soir" duration="5:12" />
                    <MusicItem title="Concentration profonde" duration="10:05" />
                    <MusicItem title="Éveil énergétique" duration="2:47" />
                    <MusicItem title="Relaxation sous la pluie" duration="7:30" />
                  </div>
                </TabsContent>
                
                <TabsContent value="favorites" className="mt-4">
                  <div className="space-y-1">
                    <MusicItem title="Méditation du soir" duration="5:12" />
                    <MusicItem title="Relaxation sous la pluie" duration="7:30" />
                  </div>
                </TabsContent>
                
                <TabsContent value="generated" className="mt-4">
                  <div className="space-y-1">
                    <MusicItem active title="Harmonie Apaisante" duration="3:24" />
                    <MusicItem title="Concentration profonde" duration="10:05" />
                    <MusicItem title="Éveil énergétique" duration="2:47" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Mood selector */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Générateur musical</CardTitle>
              <CardDescription>
                Créez de la musique selon votre humeur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <MoodButton mood="Calme" onClick={() => handleMoodSelect('Calme')} />
                <MoodButton mood="Énergique" onClick={() => handleMoodSelect('Énergique')} />
                <MoodButton mood="Concentré" onClick={() => handleMoodSelect('Concentré')} />
                <MoodButton mood="Joyeux" onClick={() => handleMoodSelect('Joyeux')} />
                <MoodButton mood="Mélancolique" onClick={() => handleMoodSelect('Mélancolique')} />
                <MoodButton mood="Zen" onClick={() => handleMoodSelect('Zen')} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Générer une nouvelle composition
              </Button>
            </CardFooter>
          </Card>
          
          {/* Settings */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
              <CardDescription>
                Personnalisez votre expérience musicale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Durée de la composition</label>
                <select className="w-full rounded-md border border-input px-3 py-1.5 bg-background">
                  <option>3 minutes</option>
                  <option>5 minutes</option>
                  <option>10 minutes</option>
                  <option>15 minutes</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Type d'instrumentation</label>
                <select className="w-full rounded-md border border-input px-3 py-1.5 bg-background">
                  <option>Acoustique</option>
                  <option>Électronique</option>
                  <option>Ambiance</option>
                  <option>Orchestral</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Enveloppement sonore</label>
                <select className="w-full rounded-md border border-input px-3 py-1.5 bg-background">
                  <option>Immersif (3D)</option>
                  <option>Stéréo</option>
                  <option>Mono</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const MusicItem: React.FC<{ title: string; duration: string; active?: boolean }> = ({ title, duration, active }) => {
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-md ${active ? 'bg-accent' : 'hover:bg-muted'}`}>
      <div className="flex items-center">
        {active ? (
          <div className="w-6 h-6 flex items-center justify-center text-primary">
            <Music className="h-4 w-4" />
          </div>
        ) : (
          <div className="w-6 h-6 flex items-center justify-center text-muted-foreground">
            <List className="h-4 w-4" />
          </div>
        )}
        <span className={`ml-2 ${active ? 'font-medium' : ''}`}>{title}</span>
      </div>
      <div className="flex items-center">
        <span className="text-xs text-muted-foreground mr-2">{duration}</span>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Heart className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

const MoodButton: React.FC<{ mood: string; onClick: () => void }> = ({ mood, onClick }) => {
  return (
    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center" onClick={onClick}>
      <div className="rounded-full bg-primary/10 p-2 mb-2">
        <Music className="h-4 w-4" />
      </div>
      <span className="text-sm">{mood}</span>
    </Button>
  );
};

export default B2CMusic;
