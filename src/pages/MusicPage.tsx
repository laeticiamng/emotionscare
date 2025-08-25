import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { 
  Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, Heart, Download, Share, Zap, Library,
  Palette, Sliders, Headphones, AudioWaveform, Settings,
  Timer, Target, Users, Star, Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  mood: string;
  bpm: number;
  energy: number;
  valence: number;
  isLiked: boolean;
  isGenerated: boolean;
  audioUrl?: string;
  coverArt?: string;
}

interface GenerationParams {
  mood: string;
  genre: string;
  energy: number;
  tempo: 'slow' | 'medium' | 'fast';
  instruments: string[];
  description: string;
}

export const MusicPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('generator');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // États pour le générateur
  const [generationParams, setGenerationParams] = useState<GenerationParams>({
    mood: 'relaxed',
    genre: 'ambient',
    energy: 50,
    tempo: 'medium',
    instruments: ['piano'],
    description: ''
  });

  // Bibliothèque de musiques thérapeutiques
  const [musicLibrary] = useState<Track[]>([
    {
      id: '1',
      title: 'Océan Sérénité',
      artist: 'EmotionsCare AI',
      duration: 180,
      genre: 'Ambient',
      mood: 'Calme',
      bpm: 60,
      energy: 30,
      valence: 80,
      isLiked: false,
      isGenerated: true,
      coverArt: '🌊'
    },
    {
      id: '2',
      title: 'Énergie Matinale',
      artist: 'TherapyBeats',
      duration: 240,
      genre: 'Uplifting',
      mood: 'Énergique',
      bpm: 120,
      energy: 85,
      valence: 90,
      isLiked: true,
      isGenerated: false,
      coverArt: '☀️'
    },
    {
      id: '3',
      title: 'Méditation Profonde',
      artist: 'Zen Masters',
      duration: 300,
      genre: 'Meditation',
      mood: 'Zen',
      bpm: 40,
      energy: 15,
      valence: 70,
      isLiked: false,
      isGenerated: false,
      coverArt: '🧘'
    },
    {
      id: '4',
      title: 'Focus Flow',
      artist: 'ProductivitySounds',
      duration: 420,
      genre: 'Lo-fi',
      mood: 'Concentration',
      bpm: 85,
      energy: 60,
      valence: 65,
      isLiked: true,
      isGenerated: true,
      coverArt: '🎯'
    }
  ]);

  const [filteredLibrary, setFilteredLibrary] = useState(musicLibrary);
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');

  // Mood Mixer states
  const [mixerSettings, setMixerSettings] = useState({
    happiness: 70,
    energy: 60,
    calmness: 80,
    focus: 50
  });

  const moods = ['relaxed', 'energetic', 'focused', 'happy', 'melancholic', 'uplifting'];
  const genres = ['ambient', 'classical', 'electronic', 'nature', 'binaural', 'lo-fi'];
  const instruments = ['piano', 'guitar', 'flute', 'strings', 'synthesizer', 'nature-sounds'];

  // Générer une nouvelle piste
  const generateMusic = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    // Simulation de génération
    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      const newTrack: Track = {
        id: Date.now().toString(),
        title: `${generationParams.mood.charAt(0).toUpperCase() + generationParams.mood.slice(1)} ${generationParams.genre}`,
        artist: 'EmotionsCare AI',
        duration: Math.floor(Math.random() * 240) + 120,
        genre: generationParams.genre,
        mood: generationParams.mood,
        bpm: generationParams.tempo === 'slow' ? 60 : generationParams.tempo === 'medium' ? 100 : 140,
        energy: generationParams.energy,
        valence: Math.floor(Math.random() * 50) + 50,
        isLiked: false,
        isGenerated: true,
        coverArt: '🎵'
      };

      setCurrentTrack(newTrack);
      setIsGenerating(false);
      setGenerationProgress(0);
      
      toast({
        title: "Musique générée avec succès !",
        description: `"${newTrack.title}" est prête à être écoutée`,
      });
    }, 3000);
  };

  // Contrôles de lecture
  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    toast({
      title: "Lecture en cours",
      description: `${track.title} - ${track.artist}`,
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleLike = (trackId: string) => {
    const updatedLibrary = musicLibrary.map(track =>
      track.id === trackId ? { ...track, isLiked: !track.isLiked } : track
    );
    setFilteredLibrary(updatedLibrary);
  };

  // Filtrage de la bibliothèque
  useEffect(() => {
    let filtered = musicLibrary;
    
    if (searchQuery) {
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (moodFilter !== 'all') {
      filtered = filtered.filter(track => track.mood.toLowerCase() === moodFilter);
    }
    
    setFilteredLibrary(filtered);
  }, [searchQuery, moodFilter]);

  // Génération basée sur le Mood Mixer
  const generateFromMixer = () => {
    const dominantMood = Object.entries(mixerSettings)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    setGenerationParams({
      ...generationParams,
      mood: dominantMood === 'happiness' ? 'happy' : 
            dominantMood === 'energy' ? 'energetic' :
            dominantMood === 'calmness' ? 'relaxed' : 'focused'
    });
    
    generateMusic();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2">
          <Music className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Musicothérapie</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez le pouvoir thérapeutique de la musique personnalisée. 
          Générez des compositions uniques adaptées à votre état émotionnel.
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Générateur IA
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            Bibliothèque
          </TabsTrigger>
          <TabsTrigger value="mixer" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Mood Mixer
          </TabsTrigger>
        </TabsList>

        {/* Générateur de Musique */}
        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Générateur de Musique IA
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">PRO</Badge>
              </CardTitle>
              <CardDescription>
                Créez une musique thérapeutique personnalisée en quelques clics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Humeur souhaitée</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {moods.map(mood => (
                        <Button
                          key={mood}
                          variant={generationParams.mood === mood ? "default" : "outline"}
                          size="sm"
                          onClick={() => setGenerationParams({...generationParams, mood})}
                          className="capitalize"
                        >
                          {mood}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Genre musical</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {genres.map(genre => (
                        <Button
                          key={genre}
                          variant={generationParams.genre === genre ? "default" : "outline"}
                          size="sm"
                          onClick={() => setGenerationParams({...generationParams, genre})}
                          className="capitalize"
                        >
                          {genre}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Niveau d'énergie: {generationParams.energy}%</Label>
                    <Slider
                      value={[generationParams.energy]}
                      onValueChange={(value) => setGenerationParams({...generationParams, energy: value[0]})}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Tempo</Label>
                    <div className="flex gap-2 mt-2">
                      {(['slow', 'medium', 'fast'] as const).map(tempo => (
                        <Button
                          key={tempo}
                          variant={generationParams.tempo === tempo ? "default" : "outline"}
                          size="sm"
                          onClick={() => setGenerationParams({...generationParams, tempo})}
                          className="capitalize flex-1"
                        >
                          {tempo === 'slow' ? 'Lent' : tempo === 'medium' ? 'Modéré' : 'Rapide'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Instruments principaux</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {instruments.map(instrument => (
                        <Button
                          key={instrument}
                          variant={generationParams.instruments.includes(instrument) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newInstruments = generationParams.instruments.includes(instrument)
                              ? generationParams.instruments.filter(i => i !== instrument)
                              : [...generationParams.instruments, instrument];
                            setGenerationParams({...generationParams, instruments: newInstruments});
                          }}
                          className="capitalize text-xs"
                        >
                          {instrument.replace('-', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Description personnalisée (optionnel)</Label>
                <Textarea
                  placeholder="Décrivez l'ambiance ou l'émotion que vous souhaitez..."
                  value={generationParams.description}
                  onChange={(e) => setGenerationParams({...generationParams, description: e.target.value})}
                  className="mt-2"
                />
              </div>

              <Button 
                onClick={generateMusic} 
                disabled={isGenerating}
                className="w-full h-12 text-lg"
              >
                {isGenerating ? (
                  <>
                    <AudioWaveform className="h-5 w-5 mr-2 animate-pulse" />
                    Génération en cours... {Math.round(generationProgress)}%
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Générer ma Musique Thérapeutique
                  </>
                )}
              </Button>

              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={generationProgress} />
                  <p className="text-sm text-muted-foreground text-center">
                    L'IA compose votre musique personnalisée...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bibliothèque */}
        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Bibliothèque Musicale
              </CardTitle>
              <CardDescription>
                Collection de musiques thérapeutiques et vos créations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher une piste..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={moodFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMoodFilter('all')}
                  >
                    Toutes
                  </Button>
                  <Button
                    variant={moodFilter === 'calme' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMoodFilter('calme')}
                  >
                    Calme
                  </Button>
                  <Button
                    variant={moodFilter === 'énergique' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMoodFilter('énergique')}
                  >
                    Énergique
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredLibrary.map((track) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
                  >
                    <div className="text-2xl">{track.coverArt}</div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{track.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{track.genre}</Badge>
                        <Badge variant="secondary" className="text-xs">{track.mood}</Badge>
                        {track.isGenerated && (
                          <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            IA
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {formatTime(track.duration)}
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleLike(track.id)}
                      >
                        <Heart className={`h-4 w-4 ${track.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playTrack(track)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mood Mixer */}
        <TabsContent value="mixer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                Mood Mixer
              </CardTitle>
              <CardDescription>
                Ajustez les paramètres émotionnels pour créer la musique parfaite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(mixerSettings).map(([mood, value]) => (
                  <div key={mood} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="capitalize">{mood === 'happiness' ? 'Bonheur' : 
                                                      mood === 'energy' ? 'Énergie' : 
                                                      mood === 'calmness' ? 'Sérénité' : 'Focus'}</Label>
                      <span className="text-sm font-medium">{value}%</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(newValue) => setMixerSettings({...mixerSettings, [mood]: newValue[0]})}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="text-center space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
                  <h4 className="font-medium mb-2">Profil Émotionnel Actuel</h4>
                  <div className="flex justify-center gap-4 text-sm">
                    {Object.entries(mixerSettings).map(([mood, value]) => (
                      <div key={mood} className="flex items-center gap-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: mood === 'happiness' ? '#fbbf24' : 
                                            mood === 'energy' ? '#ef4444' : 
                                            mood === 'calmness' ? '#3b82f6' : '#8b5cf6',
                            opacity: value / 100
                          }}
                        />
                        <span className="capitalize text-xs">
                          {mood === 'happiness' ? 'Bonheur' : 
                           mood === 'energy' ? 'Énergie' : 
                           mood === 'calmness' ? 'Sérénité' : 'Focus'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={generateFromMixer}
                  className="w-full h-12"
                  disabled={isGenerating}
                >
                  <Palette className="h-5 w-5 mr-2" />
                  Créer la Musique Parfaite
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lecteur de musique */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4 z-50"
          >
            <div className="container mx-auto">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{currentTrack.coverArt}</div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{currentTrack.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={togglePlayPause}
                    className="h-10 w-10 rounded-full"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="ghost">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 min-w-0 flex-1 max-w-xs">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(Math.floor((progress / 100) * currentTrack.duration))}
                  </span>
                  <Progress value={progress} className="flex-1" />
                  <span className="text-xs text-muted-foreground">
                    {formatTime(currentTrack.duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => setVolume(value[0])}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} />
    </div>
  );
};

export default MusicPage;