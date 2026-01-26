import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Wand2, Loader2, Heart, History, Star, Share2, Clock, Sparkles, Play, BarChart3, Settings
} from 'lucide-react';
import { useMusicGeneration } from '@/hooks/useMusicGeneration';
import { useMusicControls } from '@/hooks/useMusicControls';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useMusicSettings } from '@/hooks/music/useMusicSettings';

interface GenerationHistory {
  id: string;
  emotion: string;
  prompt: string;
  timestamp: Date;
  duration: number;
  isFavorite: boolean;
  playCount: number;
  rating?: number;
}

interface GenrePreference {
  id: string;
  label: string;
  selected: boolean;
}

interface EmotionGeneratorData {
  history: GenerationHistory[];
  favorites: GenerationHistory[];
  stats: { totalGenerations: number; totalDuration: number; favoriteEmotion: string; streak: number };
  genres: GenrePreference[];
}

const EmotionMusicGenerator: React.FC = () => {
  const { value: savedData, setValue: setSavedData } = useMusicSettings<EmotionGeneratorData>({
    key: 'music:emotion-generator',
    defaultValue: {
      history: [],
      favorites: [],
      stats: { totalGenerations: 0, totalDuration: 0, favoriteEmotion: '', streak: 0 },
      genres: [
        { id: 'ambient', label: 'Ambient', selected: false },
        { id: 'classical', label: 'Classique', selected: false },
        { id: 'electronic', label: 'Électronique', selected: false },
        { id: 'jazz', label: 'Jazz', selected: false },
        { id: 'lofi', label: 'Lo-Fi', selected: false },
        { id: 'nature', label: 'Sons naturels', selected: false },
      ]
    }
  });

  const [selectedEmotion, setSelectedEmotion] = useState('calm');
  const [customPrompt, setCustomPrompt] = useState('');
  const [intensity, setIntensity] = useState([50]);
  const [duration, setDuration] = useState([60]);
  const [activeTab, setActiveTab] = useState('generate');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Utiliser les données persistées
  const history = savedData.history;
  const favorites = savedData.favorites;
  const stats = savedData.stats;
  const genres = savedData.genres;
  
  const setHistory = (newHistory: GenerationHistory[] | ((prev: GenerationHistory[]) => GenerationHistory[])) => {
    setSavedData(prev => ({
      ...prev,
      history: typeof newHistory === 'function' ? newHistory(prev.history) : newHistory
    }));
  };
  
  const setFavorites = (newFavorites: GenerationHistory[] | ((prev: GenerationHistory[]) => GenerationHistory[])) => {
    setSavedData(prev => ({
      ...prev,
      favorites: typeof newFavorites === 'function' ? newFavorites(prev.favorites) : newFavorites
    }));
  };
  
  const setStats = (newStats: typeof stats | ((prev: typeof stats) => typeof stats)) => {
    setSavedData(prev => ({
      ...prev,
      stats: typeof newStats === 'function' ? newStats(prev.stats) : newStats
    }));
  };
  
  const setGenres = (newGenres: GenrePreference[] | ((prev: GenrePreference[]) => GenrePreference[])) => {
    setSavedData(prev => ({
      ...prev,
      genres: typeof newGenres === 'function' ? newGenres(prev.genres) : newGenres
    }));
  };
  
  const { generateMusic, isGenerating, error } = useMusicGeneration();
  const { loadTrack } = useMusicControls();

  const emotions = [
    { value: 'calm', label: 'Calme', icon: '🧘', color: 'bg-blue-500/20 text-blue-600' },
    { value: 'energetic', label: 'Énergique', icon: '⚡', color: 'bg-yellow-500/20 text-yellow-600' },
    { value: 'happy', label: 'Joyeux', icon: '😊', color: 'bg-green-500/20 text-green-600' },
    { value: 'focused', label: 'Concentré', icon: '🎯', color: 'bg-purple-500/20 text-purple-600' },
    { value: 'relaxed', label: 'Détendu', icon: '🌊', color: 'bg-cyan-500/20 text-cyan-600' },
    { value: 'motivated', label: 'Motivé', icon: '🚀', color: 'bg-orange-500/20 text-orange-600' },
    { value: 'melancholic', label: 'Mélancolique', icon: '🌧️', color: 'bg-slate-500/20 text-slate-600' },
    { value: 'romantic', label: 'Romantique', icon: '💕', color: 'bg-pink-500/20 text-pink-600' },
    { value: 'creative', label: 'Créatif', icon: '🎨', color: 'bg-indigo-500/20 text-indigo-600' },
    { value: 'peaceful', label: 'Paisible', icon: '🕊️', color: 'bg-emerald-500/20 text-emerald-600' },
    { value: 'confident', label: 'Confiant', icon: '💪', color: 'bg-rose-500/20 text-rose-600' },
    { value: 'nostalgic', label: 'Nostalgique', icon: '📻', color: 'bg-amber-500/20 text-amber-600' },
  ];

  // Presets rapides pour génération en un clic
  const quickPresets = [
    { name: 'Méditation', emotion: 'calm', intensity: 30, duration: 120, genres: ['ambient', 'nature'] },
    { name: 'Workout', emotion: 'energetic', intensity: 90, duration: 60, genres: ['electronic'] },
    { name: 'Focus', emotion: 'focused', intensity: 50, duration: 90, genres: ['lofi', 'ambient'] },
    { name: 'Sommeil', emotion: 'relaxed', intensity: 20, duration: 180, genres: ['ambient', 'nature'] },
  ];

  const applyPreset = (preset: typeof quickPresets[0]) => {
    setSelectedEmotion(preset.emotion);
    setIntensity([preset.intensity]);
    setDuration([preset.duration]);
    setGenres(prev => prev.map(g => ({ ...g, selected: preset.genres.includes(g.id) })));
    toast.success(`Preset "${preset.name}" appliqué`);
  };

  const handleGenerate = async () => {
    const selectedGenres = genres.filter(g => g.selected).map(g => g.label).join(', ');
    const fullPrompt = [
      customPrompt,
      selectedGenres && `Genre: ${selectedGenres}`,
      `Intensité: ${intensity[0]}%`,
      `Durée: ${duration[0]}s`
    ].filter(Boolean).join('. ');

    const track = await generateMusic(selectedEmotion, fullPrompt);
    if (track) {
      loadTrack(track);
      
      const newEntry: GenerationHistory = {
        id: Date.now().toString(),
        emotion: selectedEmotion,
        prompt: customPrompt || 'Sans description',
        timestamp: new Date(),
        duration: duration[0],
        isFavorite: false,
        playCount: 1,
      };
      
      setHistory(prev => [newEntry, ...prev.slice(0, 49)]);
      setStats(prev => ({
        ...prev,
        totalGenerations: prev.totalGenerations + 1,
        totalDuration: prev.totalDuration + duration[0],
        streak: prev.streak + 1,
      }));
      
      toast.success('Musique générée avec succès !');
    }
  };

  const toggleFavorite = (entry: GenerationHistory) => {
    if (entry.isFavorite) {
      setFavorites(prev => prev.filter(f => f.id !== entry.id));
    } else {
      setFavorites(prev => [{ ...entry, isFavorite: true }, ...prev]);
    }
    setHistory(prev => 
      prev.map(h => h.id === entry.id ? { ...h, isFavorite: !h.isFavorite } : h)
    );
  };

  const rateTrack = (entryId: string, rating: number) => {
    setHistory(prev => 
      prev.map(h => h.id === entryId ? { ...h, rating } : h)
    );
    toast.success(`Note ${rating}/5 enregistrée`);
  };

  const shareGeneration = async (entry: GenerationHistory) => {
    const emotion = emotions.find(e => e.value === entry.emotion);
    const text = `🎵 J'ai généré une musique ${emotion?.label || entry.emotion} sur EmotionsCare ! ${entry.prompt}`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Ma création musicale', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Lien copié dans le presse-papier');
    }
  };

  const toggleGenre = (genreId: string) => {
    setGenres(prev => 
      prev.map(g => g.id === genreId ? { ...g, selected: !g.selected } : g)
    );
  };

  const selectedEmotionData = emotions.find(e => e.value === selectedEmotion);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Générateur de musique
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {stats.totalGenerations} créations
            </Badge>
            {stats.streak > 2 && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 gap-1">
                🔥 {stats.streak} streak
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="generate" className="gap-1">
              <Wand2 className="h-4 w-4" />
              Créer
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-1">
              <Heart className="h-4 w-4" />
              Favoris
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-1">
              <BarChart3 className="h-4 w-4" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            {/* Quick Presets */}
            <div>
              <Label className="mb-3 block">Presets rapides</Label>
              <div className="flex flex-wrap gap-2">
                {quickPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    className="gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Emotion Grid */}
            <div>
              <Label className="mb-3 block">Émotion cible</Label>
              <div className="grid grid-cols-4 gap-2">
                {emotions.map((emotion) => (
                  <motion.button
                    key={emotion.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedEmotion(emotion.value)}
                    className={cn(
                      'p-3 rounded-xl border-2 transition-all text-center',
                      selectedEmotion === emotion.value
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <span className="text-2xl block mb-1">{emotion.icon}</span>
                    <span className="text-xs font-medium">{emotion.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Intensité émotionnelle</Label>
                <Badge variant="secondary">{intensity[0]}%</Badge>
              </div>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtil</span>
                <span>Modéré</span>
                <span>Intense</span>
              </div>
            </div>

            {/* Duration Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Durée</Label>
                <Badge variant="secondary">{duration[0]}s</Badge>
              </div>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={30}
                max={180}
                step={15}
                className="w-full"
              />
            </div>

            {/* Advanced Options */}
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="mb-3"
              >
                <Settings className="h-4 w-4 mr-2" />
                Options avancées
                <motion.span
                  animate={{ rotate: showAdvanced ? 180 : 0 }}
                  className="ml-2"
                >
                  ▼
                </motion.span>
              </Button>
              
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {/* Genres */}
                    <div>
                      <Label className="mb-2 block">Genres préférés</Label>
                      <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                          <Badge
                            key={genre.id}
                            variant={genre.selected ? 'default' : 'outline'}
                            className="cursor-pointer transition-all"
                            onClick={() => toggleGenre(genre.id)}
                          >
                            {genre.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Custom Prompt */}
                    <div>
                      <Label htmlFor="prompt">Description personnalisée</Label>
                      <Input
                        id="prompt"
                        placeholder="ex: musique douce avec piano et violons..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full h-12 text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Générer ma musique {selectedEmotionData?.icon}
                </>
              )}
            </Button>

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <Progress value={66} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  L'IA compose votre musique personnalisée...
                </p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <ScrollArea className="h-80">
              {history.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune génération pour le moment</p>
                  <p className="text-sm">Créez votre première musique !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => {
                    const emotion = emotions.find(e => e.value === entry.emotion);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{emotion?.icon}</span>
                            <div>
                              <p className="font-medium">{emotion?.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {entry.prompt}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {entry.duration}s
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(entry.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {/* Rating */}
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => rateTrack(entry.id, star)}
                                  className="p-0.5"
                                >
                                  <Star
                                    className={cn(
                                      'h-3 w-3',
                                      entry.rating && entry.rating >= star
                                        ? 'fill-yellow-500 text-yellow-500'
                                        : 'text-muted-foreground'
                                    )}
                                  />
                                </button>
                              ))}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => toggleFavorite(entry)}
                            >
                              <Heart
                                className={cn(
                                  'h-4 w-4',
                                  entry.isFavorite && 'fill-red-500 text-red-500'
                                )}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => shareGeneration(entry)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="favorites">
            <ScrollArea className="h-80">
              {favorites.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun favori pour le moment</p>
                  <p className="text-sm">Ajoutez des ❤️ à vos créations préférées</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((entry) => {
                    const emotion = emotions.find(e => e.value === entry.emotion);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-lg border bg-gradient-to-r from-red-500/5 to-pink-500/5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{emotion?.icon}</span>
                            <div>
                              <p className="font-medium">{emotion?.label}</p>
                              <p className="text-xs text-muted-foreground">{entry.prompt}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => shareGeneration(entry)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="text-3xl font-bold text-primary">
                  {stats.totalGenerations}
                </div>
                <p className="text-sm text-muted-foreground">Créations totales</p>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(stats.totalDuration / 60)}min
                </div>
                <p className="text-sm text-muted-foreground">Durée totale</p>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                <div className="text-3xl font-bold text-orange-600">
                  {stats.streak}
                </div>
                <p className="text-sm text-muted-foreground">Streak actuel</p>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                <div className="text-3xl font-bold text-purple-600">
                  {favorites.length}
                </div>
                <p className="text-sm text-muted-foreground">Favoris</p>
              </Card>
            </div>

            {/* Top Emotions */}
            <Card className="mt-4 p-4">
              <h4 className="font-medium mb-3">Émotions les plus générées</h4>
              <div className="space-y-2">
                {Object.entries(
                  history.reduce((acc, h) => {
                    acc[h.emotion] = (acc[h.emotion] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([emotion, count]) => {
                    const emo = emotions.find(e => e.value === emotion);
                    const percentage = (count / history.length) * 100;
                    return (
                      <div key={emotion} className="flex items-center gap-3">
                        <span className="text-xl">{emo?.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{emo?.label}</span>
                            <span className="text-muted-foreground">{count}x</span>
                          </div>
                          <Progress value={percentage} className="h-1.5" />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmotionMusicGenerator;
