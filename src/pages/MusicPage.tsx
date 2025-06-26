import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Shuffle, Repeat, Search, Filter, Download, Settings, Music, Headphones, Radio, Mic, Zap, Brain, TrendingUp, Star, Users, Clock, Calendar, BarChart3, Target, Award, Trophy, Sparkles, ChevronRight, Plus, X } from 'lucide-react';
import MusicPlayer from '@/components/music/player/MusicPlayer';
import { EmotionMusicRecommendations } from '@/components/music/EmotionMusicRecommendations';
import { RecommendedPresets } from '@/components/music/RecommendedPresets';
import TrackList from '@/components/music/TrackList';
import { MusicMiniPlayer } from '@/components/music/MusicMiniPlayer';
import { useMusic } from '@/contexts/MusicContext';

const MusicPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('calm');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(70);
  const [playbackMode, setPlaybackMode] = useState('normal');
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [biofeedbackEnabled, setBiofeedbackEnabled] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const { play, pause, toggle, currentTrack: contextTrack } = useMusic();

  const emotions = [
    { id: 'calm', name: 'Calme', color: 'bg-blue-500', icon: '😌' },
    { id: 'energetic', name: 'Énergique', color: 'bg-orange-500', icon: '⚡' },
    { id: 'focused', name: 'Concentré', color: 'bg-purple-500', icon: '🎯' },
    { id: 'happy', name: 'Joyeux', color: 'bg-yellow-500', icon: '😊' },
    { id: 'relaxed', name: 'Détendu', color: 'bg-green-500', icon: '🌿' },
    { id: 'motivated', name: 'Motivé', color: 'bg-red-500', icon: '🔥' }
  ];

  const adaptiveFeatures = [
    { name: 'Rythme cardiaque', enabled: true, status: 'Actif' },
    { name: 'Activité cérébrale', enabled: false, status: 'Inactif' },
    { name: 'Réponse émotionnelle', enabled: true, status: 'En cours' },
    { name: 'Contexte environnemental', enabled: true, status: 'Détecté' }
  ];

  const userStats = {
    totalListeningTime: 1247,
    favoriteGenre: 'Ambient',
    emotionalBalance: 78,
    focusImprovement: 23,
    stressReduction: 45,
    sleepQuality: 87
  };

  const aiRecommendations = [
    {
      type: 'Routine matinale',
      description: 'Playlist énergisante pour démarrer la journée',
      emotion: 'energetic',
      duration: '25 min',
      effectiveness: 92
    },
    {
      type: 'Concentration profonde',
      description: 'Sons binauraux pour la productivité',
      emotion: 'focused',
      duration: '45 min',
      effectiveness: 89
    },
    {
      type: 'Détente soirée',
      description: 'Mélodies apaisantes pour se détendre',
      emotion: 'relaxed',
      duration: '30 min',
      effectiveness: 95
    }
  ];

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Musicothérapie Adaptative
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Découvrez la puissance de la musique personnalisée pour votre bien-être
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Brain className="h-4 w-4 mr-1" />
                IA Adaptative
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Headphones className="h-4 w-4 mr-1" />
                Audio HD
              </Badge>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Temps d'écoute</p>
                  <p className="text-2xl font-bold text-purple-600">{userStats.totalListeningTime}h</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Équilibre émotionnel</p>
                  <p className="text-2xl font-bold text-green-600">{userStats.emotionalBalance}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Réduction stress</p>
                  <p className="text-2xl font-bold text-blue-600">{userStats.stressReduction}%</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Qualité sommeil</p>
                  <p className="text-2xl font-bold text-indigo-600">{userStats.sleepQuality}%</p>
                </div>
                <Award className="h-8 w-8 text-indigo-500" />
              </div>
            </Card>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Découvrir
            </TabsTrigger>
            <TabsTrigger value="adaptive" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Adaptatif
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Bibliothèque
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Emotion Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Sélection par émotion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {emotions.map((emotion) => (
                    <Button
                      key={emotion.id}
                      variant={selectedEmotion === emotion.id ? "default" : "outline"}
                      className={`h-20 flex flex-col items-center justify-center gap-2 ${
                        selectedEmotion === emotion.id ? emotion.color : ''
                      }`}
                      onClick={() => handleEmotionSelect(emotion.id)}
                    >
                      <span className="text-2xl">{emotion.icon}</span>
                      <span className="text-xs">{emotion.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmotionMusicRecommendations emotion={selectedEmotion} />
              <RecommendedPresets />
            </div>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Recommandations IA personnalisées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiRecommendations.map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${emotions.find(e => e.id === rec.emotion)?.color || 'bg-gray-400'}`} />
                        <div>
                          <h4 className="font-medium">{rec.type}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">{rec.duration}</span>
                            <Badge variant="secondary" className="text-xs">
                              {rec.effectiveness}% efficace
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Écouter
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Adaptive Tab */}
          <TabsContent value="adaptive" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Adaptive Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    Mode Adaptatif
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="adaptive-mode">Adaptation automatique</Label>
                    <Switch
                      id="adaptive-mode"
                      checked={adaptiveMode}
                      onCheckedChange={setAdaptiveMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="biofeedback">Biofeedback en temps réel</Label>
                    <Switch
                      id="biofeedback"
                      checked={biofeedbackEnabled}
                      onCheckedChange={setBiofeedbackEnabled}
                    />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Capteurs actifs</h4>
                    {adaptiveFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm">{feature.name}</span>
                        <Badge variant={feature.enabled ? "default" : "secondary"}>
                          {feature.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Adaptation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-green-500" />
                    Adaptation en temps réel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rythme cardiaque</span>
                        <span>72 BPM</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Niveau de stress</span>
                        <span>Faible</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Concentration</span>
                        <span>Élevée</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Relaxation</span>
                        <span>Modérée</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      🎵 Musique adaptée automatiquement pour maintenir votre état de concentration optimal
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Rechercher dans votre bibliothèque..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80"
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une playlist
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrackList />
              <MusicPlayer />
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Amélioration du focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">+{userStats.focusImprovement}%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Depuis le mois dernier</p>
                  <Progress value={userStats.focusImprovement} className="mt-4" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Réduction du stress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">-{userStats.stressReduction}%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Niveau de stress moyen</p>
                  <Progress value={100 - userStats.stressReduction} className="mt-4" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Qualité du sommeil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{userStats.sleepQuality}%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Score moyen</p>
                  <Progress value={userStats.sleepQuality} className="mt-4" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historique d'écoute</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: 'Aujourd\'hui', duration: '2h 15min', mood: 'Calme', effectiveness: 92 },
                    { date: 'Hier', duration: '1h 45min', mood: 'Énergique', effectiveness: 88 },
                    { date: 'Il y a 2 jours', duration: '3h 20min', mood: 'Concentré', effectiveness: 95 },
                    { date: 'Il y a 3 jours', duration: '1h 30min', mood: 'Détendu', effectiveness: 89 }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{session.date}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {session.duration} • {session.mood}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {session.effectiveness}% efficace
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres audio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="volume">Volume principal</Label>
                    <Slider
                      id="volume"
                      min={0}
                      max={100}
                      step={1}
                      value={[volume]}
                      onValueChange={(value) => setVolume(value[0])}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>0%</span>
                      <span>{volume}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Mode de lecture</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={playbackMode === 'normal' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPlaybackMode('normal')}
                      >
                        Normal
                      </Button>
                      <Button
                        variant={playbackMode === 'shuffle' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPlaybackMode('shuffle')}
                      >
                        <Shuffle className="h-4 w-4 mr-1" />
                        Aléatoire
                      </Button>
                      <Button
                        variant={playbackMode === 'repeat' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPlaybackMode('repeat')}
                      >
                        <Repeat className="h-4 w-4 mr-1" />
                        Répéter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Paramètres avancés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="advanced-settings">Afficher les paramètres avancés</Label>
                    <Switch
                      id="advanced-settings"
                      checked={showAdvancedSettings}
                      onCheckedChange={setShowAdvancedSettings}
                    />
                  </div>

                  {showAdvancedSettings && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="crossfade">Fondu enchaîné</Label>
                        <Switch id="crossfade" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="normalize">Normalisation audio</Label>
                        <Switch id="normalize" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="spatial">Audio spatial</Label>
                        <Switch id="spatial" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Mini Player */}
        <div className="fixed bottom-4 right-4">
          <MusicMiniPlayer />
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
