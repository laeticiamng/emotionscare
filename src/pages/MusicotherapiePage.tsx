import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Brain, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MusicotherapiePage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [emotionalState, setEmotionalState] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const therapyModes = [
    {
      id: 'relaxation',
      name: 'Relaxation profonde',
      description: 'Sons apaisants pour réduire le stress',
      icon: Heart,
      color: 'from-blue-400 to-cyan-400',
      tracks: [
        { name: 'Océan paisible', duration: '10:30', frequency: '432 Hz' },
        { name: 'Forêt enchantée', duration: '8:45', frequency: '528 Hz' },
        { name: 'Méditation tibétaine', duration: '12:15', frequency: '396 Hz' }
      ]
    },
    {
      id: 'focus',
      name: 'Concentration',
      description: 'Stimulation cognitive et focus mental',
      icon: Brain,
      color: 'from-purple-400 to-pink-400',
      tracks: [
        { name: 'Ondes Alpha', duration: '15:00', frequency: '10 Hz' },
        { name: 'Focus binaural', duration: '20:30', frequency: '40 Hz' },
        { name: 'Productivité zen', duration: '18:20', frequency: '14 Hz' }
      ]
    },
    {
      id: 'energy',
      name: 'Énergie positive',
      description: 'Stimulation et motivation',
      icon: Zap,
      color: 'from-orange-400 to-red-400',
      tracks: [
        { name: 'Réveil énergique', duration: '6:40', frequency: '963 Hz' },
        { name: 'Motivation matinale', duration: '9:15', frequency: '741 Hz' },
        { name: 'Boost créatif', duration: '11:30', frequency: '852 Hz' }
      ]
    }
  ];

  const emotions = [
    { name: 'Stressé', value: 'stress', color: 'bg-red-100 text-red-700' },
    { name: 'Anxieux', value: 'anxiety', color: 'bg-orange-100 text-orange-700' },
    { name: 'Fatigué', value: 'tired', color: 'bg-blue-100 text-blue-700' },
    { name: 'Triste', value: 'sad', color: 'bg-gray-100 text-gray-700' },
    { name: 'Joyeux', value: 'happy', color: 'bg-green-100 text-green-700' },
    { name: 'Motivé', value: 'motivated', color: 'bg-purple-100 text-purple-700' }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleEmotionSelect = (emotion: string) => {
    setEmotionalState(emotion);
    toast({
      title: "Playlist adaptée",
      description: `Musique sélectionnée pour votre état : ${emotions.find(e => e.value === emotion)?.name}`,
    });
  };

  const generatePersonalizedPlaylist = () => {
    toast({
      title: "Playlist générée",
      description: "Votre playlist personnalisée est prête basée sur votre profil émotionnel",
    });
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Musicothérapie</h1>
          <p className="text-muted-foreground">
            Thérapie par la musique personnalisée selon votre état émotionnel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lecteur principal */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Lecteur Thérapeutique</CardTitle>
                <CardDescription>
                  Contrôles avancés pour votre session de musicothérapie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visualisation audio */}
                <div className="h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full ${
                          isPlaying ? 'animate-pulse' : ''
                        }`}
                        style={{
                          height: `${Math.random() * 40 + 10}px`,
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Informations du track */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Océan paisible</h3>
                  <p className="text-muted-foreground">Fréquence thérapeutique: 432 Hz</p>
                  <div className="text-sm text-muted-foreground">
                    2:30 / 10:30
                  </div>
                </div>

                {/* Contrôles de lecture */}
                <div className="flex justify-center items-center gap-4">
                  <Button variant="outline" size="icon">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button onClick={handlePlayPause} size="icon" className="h-12 w-12">
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3">
                  <Volume2 className="h-4 w-4" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-10">
                    {volume[0]}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Modes de thérapie */}
            <Tabs defaultValue="relaxation" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                {therapyModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <TabsTrigger key={mode.id} value={mode.id} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{mode.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {therapyModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <TabsContent key={mode.id} value={mode.id}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          {mode.name}
                        </CardTitle>
                        <CardDescription>{mode.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mode.tracks.map((track, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                                currentTrack === index ? 'bg-primary/10 border-primary' : ''
                              }`}
                              onClick={() => setCurrentTrack(index)}
                            >
                              <div>
                                <p className="font-medium">{track.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {track.frequency} • {track.duration}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlayPause();
                                }}
                              >
                                {isPlaying && currentTrack === index ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>

          {/* Panel latéral */}
          <div className="space-y-6">
            {/* Sélection d'émotion */}
            <Card>
              <CardHeader>
                <CardTitle>État Émotionnel</CardTitle>
                <CardDescription>
                  Comment vous sentez-vous maintenant ?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {emotions.map((emotion) => (
                    <Button
                      key={emotion.value}
                      variant={emotionalState === emotion.value ? "default" : "outline"}
                      className={`${emotion.color} ${
                        emotionalState === emotion.value ? '' : 'bg-background'
                      }`}
                      onClick={() => handleEmotionSelect(emotion.value)}
                    >
                      {emotion.name}
                    </Button>
                  ))}
                </div>
                {emotionalState && (
                  <Button
                    onClick={generatePersonalizedPlaylist}
                    className="w-full mt-4"
                  >
                    Générer playlist adaptée
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Statistiques de session */}
            <Card>
              <CardHeader>
                <CardTitle>Session Actuelle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durée:</span>
                    <span className="font-medium">15:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fréquence:</span>
                    <span className="font-medium">432 Hz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">BPM:</span>
                    <span className="font-medium">60</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficacité:</span>
                    <span className="font-medium text-green-600">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historique */}
            <Card>
              <CardHeader>
                <CardTitle>Sessions Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Relaxation matinale', date: 'Aujourd\'hui', duration: '20 min' },
                    { name: 'Focus travail', date: 'Hier', duration: '45 min' },
                    { name: 'Méditation soir', date: '2 jours', duration: '15 min' }
                  ].map((session, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{session.name}</p>
                        <p className="text-muted-foreground">{session.date}</p>
                      </div>
                      <span className="text-muted-foreground">{session.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <audio ref={audioRef} loop>
          <source src="/audio/ocean-peaceful.mp3" type="audio/mpeg" />
          Votre navigateur ne supporte pas l'élément audio.
        </audio>
      </div>
    </main>
  );
};

export default MusicotherapiePage;