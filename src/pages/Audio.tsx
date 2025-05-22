
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, Mic } from 'lucide-react';

const Audio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTab, setCurrentTab] = useState('player');
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(80);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const handleRecordingToggle = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audio</h1>
          <p className="text-muted-foreground">
            Écoutez et enregistrez des contenus audio pour votre bien-être émotionnel
          </p>
        </div>
      </div>

      <Tabs defaultValue="player" value={currentTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="player">Lecteur</TabsTrigger>
          <TabsTrigger value="recorder">Enregistreur</TabsTrigger>
          <TabsTrigger value="library">Bibliothèque</TabsTrigger>
        </TabsList>

        <TabsContent value="player" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lecteur audio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full max-w-md aspect-square bg-muted/40 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-4xl font-bold text-muted-foreground">
                    {isPlaying ? "▶️" : "⏸️"}
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="font-medium text-lg">Méditation Guidée</h3>
                  <p className="text-sm text-muted-foreground">Relaxation profonde - 10:32</p>
                </div>
                
                <div className="w-full max-w-md bg-muted/20 h-1 rounded-full">
                  <div className="bg-primary h-1 w-1/3 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-center gap-4 w-full max-w-md">
                  <Button variant="ghost" size="icon">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={handlePlayPause}
                    className="h-12 w-12 rounded-full"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-3 w-full max-w-md">
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommandations pour vous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {["Réduire l\'anxiété", "Améliorer le sommeil", "Focus au travail", "Relaxation profonde"].map((title) => (
                  <Card key={title} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-square bg-muted/20 rounded-md flex items-center justify-center">
                        <Play className="h-10 w-10 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recorder" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Enregistreur audio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                <div className="w-full max-w-md aspect-square bg-muted/40 rounded-lg flex items-center justify-center mb-4">
                  <div className={`h-32 w-32 rounded-full border-4 ${isRecording ? 'border-red-500 animate-pulse' : 'border-muted-foreground'} flex items-center justify-center`}>
                    <Mic className={`h-16 w-16 ${isRecording ? 'text-red-500' : 'text-muted-foreground'}`} />
                  </div>
                </div>
                
                <div>
                  <p className="text-center text-muted-foreground mb-2">
                    {isRecording 
                      ? "Enregistrement en cours... 00:23" 
                      : "Appuyez sur le bouton pour commencer l'enregistrement"}
                  </p>
                  <Button 
                    onClick={handleRecordingToggle}
                    variant={isRecording ? "destructive" : "default"}
                    className="w-full"
                  >
                    {isRecording ? "Arrêter l'enregistrement" : "Commencer l'enregistrement"}
                  </Button>
                </div>
                
                <div className="w-full space-y-2">
                  <h3 className="font-medium">Précédents enregistrements</h3>
                  <div className="space-y-2">
                    <p className="text-center text-muted-foreground py-4">
                      Aucun enregistrement disponible
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ma bibliothèque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {["Méditation guidée 10min", "Relaxation profonde", "Exercice de respiration", "Visualisation"].map((title, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-3 hover:bg-muted/20 rounded-md cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted/40 rounded-md flex items-center justify-center">
                        <Play className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{title}</div>
                        <div className="text-xs text-muted-foreground">
                          {index === 0 ? "10:23" : index === 1 ? "15:45" : index === 2 ? "5:30" : "12:15"}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Catégories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {["Méditation", "Relaxation", "Focus", "Sommeil", "Motivation", "Énergie", "Stress", "Guidé"].map((category, index) => (
                  <div 
                    key={index}
                    className="bg-muted/20 rounded-md p-3 text-center hover:bg-muted/40 cursor-pointer"
                  >
                    {category}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Audio;
