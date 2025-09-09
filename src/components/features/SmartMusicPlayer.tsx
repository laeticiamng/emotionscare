import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Music, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Heart,
  Brain,
  Sparkles,
  Radio,
  Headphones,
  Waves,
  Shuffle,
  Repeat,
  Download
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  category: 'relaxation' | 'focus' | 'energie' | 'meditation' | 'sommeil';
  mood: string;
  bpm: number;
  cover: string;
  audioUrl: string;
  aiGenerated?: boolean;
}

interface PlaylistRecommendation {
  name: string;
  description: string;
  tracks: Track[];
  matchScore: number;
  icon: React.ElementType;
  color: string;
}

const SmartMusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const mockTracks: Track[] = [
    {
      id: '1',
      title: 'Sérénité Matinale',
      artist: 'IA EmotionsCare',
      duration: 240,
      category: 'relaxation',
      mood: 'calme',
      bpm: 60,
      cover: '/api/placeholder/300/300',
      audioUrl: '/audio/serenite-matinale.mp3',
      aiGenerated: true
    },
    {
      id: '2',
      title: 'Focus Profond',
      artist: 'IA EmotionsCare',
      duration: 360,
      category: 'focus',
      mood: 'concentré',
      bpm: 90,
      cover: '/api/placeholder/300/300',
      audioUrl: '/audio/focus-profond.mp3',
      aiGenerated: true
    },
    {
      id: '3',
      title: 'Énergie Positive',
      artist: 'IA EmotionsCare',
      duration: 180,
      category: 'energie',
      mood: 'joyeux',
      bpm: 120,
      cover: '/api/placeholder/300/300',
      audioUrl: '/audio/energie-positive.mp3',
      aiGenerated: true
    }
  ];

  const recommendations: PlaylistRecommendation[] = [
    {
      name: 'Boost Matinal',
      description: 'Commencez la journée avec énergie',
      tracks: mockTracks.filter(t => t.category === 'energie'),
      matchScore: 95,
      icon: Sparkles,
      color: 'text-yellow-500'
    },
    {
      name: 'Concentration IA',
      description: 'Musique optimisée pour votre productivité',
      tracks: mockTracks.filter(t => t.category === 'focus'),
      matchScore: 87,
      icon: Brain,
      color: 'text-blue-500'
    },
    {
      name: 'Relaxation Profonde',
      description: 'Détente et récupération émotionnelle',
      tracks: mockTracks.filter(t => t.category === 'relaxation'),
      matchScore: 92,
      icon: Heart,
      color: 'text-green-500'
    }
  ];

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const generatePersonalizedTrack = async () => {
    setIsGenerating(true);
    
    // Simulation de génération IA
    setTimeout(() => {
      const newTrack: Track = {
        id: Date.now().toString(),
        title: `Composition Personnalisée ${new Date().getHours()}:${new Date().getMinutes()}`,
        artist: 'IA EmotionsCare',
        duration: 300,
        category: 'meditation',
        mood: 'personnalisé',
        bpm: 70,
        cover: '/api/placeholder/300/300',
        audioUrl: '/audio/generated-track.mp3',
        aiGenerated: true
      };
      
      setCurrentTrack(newTrack);
      setIsGenerating(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Lecteur principal */}
      <Card className="overflow-hidden bg-gradient-to-br from-purple-500/5 via-background to-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-purple-500" />
            Lecteur Intelligent IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentTrack ? (
            <div className="space-y-4">
              {/* Artwork et infos */}
              <div className="flex items-center gap-4">
                <motion.div 
                  className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                >
                  <Music className="h-8 w-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold">{currentTrack.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {currentTrack.aiGenerated && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        IA Généré
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs capitalize">
                      {currentTrack.mood}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contrôles */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <Button variant="ghost" size="icon">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={handlePlayPause}
                    size="lg"
                    className="rounded-full w-12 h-12"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Barre de progression */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={currentTrack.duration}
                    step={1}
                    className="w-full"
                    onValueChange={(value) => setCurrentTime(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(currentTrack.duration)}</span>
                  </div>
                </div>

                {/* Contrôles supplémentaires */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={volume}
                      max={100}
                      step={1}
                      className="w-24"
                      onValueChange={setVolume}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Radio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aucune musique sélectionnée</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choisissez une piste ou générez-en une personnalisée
              </p>
            </div>
          )}

          {/* Génération IA */}
          <div className="border-t pt-4">
            <Button 
              onClick={generatePersonalizedTrack}
              disabled={isGenerating}
              className="w-full gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Générer une musique personnalisée
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Recommandations Personnalisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border bg-gradient-to-r from-background to-muted/20 hover:to-muted/40 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <rec.icon className={`h-6 w-6 ${rec.color}`} />
                    <div>
                      <h4 className="font-semibold">{rec.name}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {rec.matchScore}% compatible
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {rec.tracks.slice(0, 3).map((track) => (
                    <Button 
                      key={track.id}
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleTrackSelect(track)}
                      className="text-xs"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {track.title}
                    </Button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audio element (caché) */}
      <audio ref={audioRef} />
    </div>
  );
};

export default SmartMusicPlayer;