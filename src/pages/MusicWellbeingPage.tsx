
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import MusicPlayer from '@/components/music/MusicPlayer';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockEmotions = ['calm', 'focus', 'energy', 'joy', 'relax'];

const mockPresets = [
  { id: '1', name: 'Méditation matinale', category: 'calm', duration: 10 },
  { id: '2', name: 'Focus intense', category: 'focus', duration: 25 },
  { id: '3', name: 'Boost d\'énergie', category: 'energy', duration: 15 },
  { id: '4', name: 'Détente complète', category: 'relax', duration: 30 },
  { id: '5', name: 'Joie et optimisme', category: 'joy', duration: 20 },
];

const mockTracks = [
  { id: '101', title: 'Calm Waters', artist: 'Nature Sounds', duration: 183, category: 'calm' },
  { id: '102', title: 'Deep Focus', artist: 'BrainBeats', duration: 240, category: 'focus' },
  { id: '103', title: 'Energy Flow', artist: 'BeatMaster', duration: 195, category: 'energy' },
  { id: '104', title: 'Peaceful Mind', artist: 'Mindfulness', duration: 306, category: 'relax' },
  { id: '105', title: 'Happy Days', artist: 'PositiveVibes', duration: 210, category: 'joy' },
];

// Types
interface Preset {
  id: string;
  name: string;
  category: string;
  duration: number;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  category: string;
}

interface MusicParameters {
  tempo: number;
  harmony: number;
  brightness: number;
  complexity: number;
}

const MusicWellbeingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('presets');
  const [selectedEmotion, setSelectedEmotion] = useState('calm');
  const [activePreset, setActivePreset] = useState<Preset | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [parameters, setParameters] = useState<MusicParameters>({
    tempo: 50,
    harmony: 70,
    brightness: 40,
    complexity: 30,
  });
  
  const { toast } = useToast();

  // Filter presets based on selected emotion
  const filteredPresets = mockPresets.filter(
    (preset) => preset.category === selectedEmotion
  );

  // Filter tracks based on selected emotion
  const filteredTracks = mockTracks.filter(
    (track) => track.category === selectedEmotion
  );

  // Play a preset
  const handlePlayPreset = (preset: Preset) => {
    setActivePreset(preset);
    // Find a track that matches the preset category
    const trackToPlay = mockTracks.find((track) => track.category === preset.category);
    if (trackToPlay) {
      setCurrentTrack(trackToPlay);
      setIsPlaying(true);
      toast({
        title: 'Lecture démarrée',
        description: `Lecture de "${preset.name}"`,
      });
    }
  };

  // Play a track
  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Find a preset that matches the track category
    const matchingPreset = mockPresets.find((p) => p.category === track.category);
    setActivePreset(matchingPreset || null);
    toast({
      title: 'Lecture démarrée',
      description: `Lecture de "${track.title}"`,
    });
  };

  // Generate custom music based on parameters
  const handleGenerateCustom = () => {
    // Simulate music generation
    const generatedTrack: Track = {
      id: `generated-${Date.now()}`,
      title: `Musique personnalisée - ${selectedEmotion}`,
      artist: 'AI Composer',
      duration: Math.floor(Math.random() * 300) + 120, // Random duration between 2-7 minutes
      category: selectedEmotion,
    };
    
    setCurrentTrack(generatedTrack);
    setIsPlaying(true);
    toast({
      title: 'Musique générée',
      description: 'Votre musique personnalisée est prête',
    });
  };

  // Format duration in minutes:seconds
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle parameter change
  const handleParameterChange = (
    paramName: keyof MusicParameters,
    value: number[]
  ) => {
    setParameters((prev) => ({
      ...prev,
      [paramName]: value[0],
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Musique & Bien-être</h1>
      <p className="text-muted-foreground mb-6">
        Écoutez et générez de la musique adaptée à votre état émotionnel
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Choisissez une émotion</h2>
        <div className="flex flex-wrap gap-2">
          {mockEmotions.map((emotion) => (
            <Badge
              key={emotion}
              variant={selectedEmotion === emotion ? 'default' : 'outline'}
              className="cursor-pointer text-sm py-1 px-3 capitalize"
              onClick={() => setSelectedEmotion(emotion)}
            >
              {emotion}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="presets">Préréglages</TabsTrigger>
              <TabsTrigger value="library">Bibliothèque</TabsTrigger>
              <TabsTrigger value="custom">Personnaliser</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-4">
              {filteredPresets.length > 0 ? (
                filteredPresets.map((preset) => (
                  <Card key={preset.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="w-3 bg-primary" />
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium">{preset.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {preset.duration} minutes - {preset.category}
                            </p>
                          </div>
                          <Button
                            onClick={() => handlePlayPreset(preset)}
                            variant={
                              activePreset?.id === preset.id && isPlaying
                                ? 'secondary'
                                : 'default'
                            }
                          >
                            {activePreset?.id === preset.id && isPlaying
                              ? 'En lecture'
                              : 'Écouter'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p>Aucun préréglage disponible pour cette émotion</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="library" className="space-y-4">
              {filteredTracks.length > 0 ? (
                filteredTracks.map((track) => (
                  <Card key={track.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{track.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {track.artist} - {formatDuration(track.duration)}
                          </p>
                        </div>
                        <Button
                          onClick={() => handlePlayTrack(track)}
                          variant={
                            currentTrack?.id === track.id && isPlaying
                              ? 'secondary'
                              : 'default'
                          }
                          size="sm"
                        >
                          {currentTrack?.id === track.id && isPlaying
                            ? 'En lecture'
                            : 'Écouter'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p>Aucun morceau disponible pour cette émotion</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom">
              <Card>
                <CardHeader>
                  <CardTitle>Personnaliser votre musique</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="tempo">Tempo</Label>
                      <span>{parameters.tempo}%</span>
                    </div>
                    <Slider
                      id="tempo"
                      min={0}
                      max={100}
                      step={1}
                      value={[parameters.tempo]}
                      onValueChange={(value) =>
                        handleParameterChange('tempo', value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="harmony">Harmonie</Label>
                      <span>{parameters.harmony}%</span>
                    </div>
                    <Slider
                      id="harmony"
                      min={0}
                      max={100}
                      step={1}
                      value={[parameters.harmony]}
                      onValueChange={(value) =>
                        handleParameterChange('harmony', value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="brightness">Luminosité</Label>
                      <span>{parameters.brightness}%</span>
                    </div>
                    <Slider
                      id="brightness"
                      min={0}
                      max={100}
                      step={1}
                      value={[parameters.brightness]}
                      onValueChange={(value) =>
                        handleParameterChange('brightness', value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="complexity">Complexité</Label>
                      <span>{parameters.complexity}%</span>
                    </div>
                    <Slider
                      id="complexity"
                      min={0}
                      max={100}
                      step={1}
                      value={[parameters.complexity]}
                      onValueChange={(value) =>
                        handleParameterChange('complexity', value)
                      }
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleGenerateCustom}
                  >
                    Générer ma musique
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Lecteur</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              {currentTrack ? (
                <div className="flex-grow flex flex-col">
                  <div className="text-center mb-4 flex-grow flex flex-col items-center justify-center">
                    <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-4">
                      <span className="text-4xl">🎵</span>
                    </div>
                    <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                    <p className="text-muted-foreground">{currentTrack.artist}</p>
                  </div>
                  <MusicPlayer
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    duration={currentTrack.duration}
                  />
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center text-center">
                  <div>
                    <p className="text-muted-foreground mb-4">
                      Sélectionnez un morceau pour commencer
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (filteredPresets.length > 0) {
                          handlePlayPreset(filteredPresets[0]);
                        }
                      }}
                      disabled={filteredPresets.length === 0}
                    >
                      Lecture aléatoire
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MusicWellbeingPage;
