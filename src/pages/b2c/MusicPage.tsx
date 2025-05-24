
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Play, 
  Pause, 
  Download, 
  Music, 
  Wand2, 
  Volume2,
  Clock,
  Headphones
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '@/utils/analytics';

interface GeneratedTrack {
  id: string;
  title: string;
  duration: number;
  url: string;
  prompt: string;
  created_at: string;
}

const B2CMusicPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState([30]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<GeneratedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateMusic = async () => {
    if (!prompt.trim() || !user) return;

    setIsGenerating(true);
    
    // Track analytics
    analytics.musicGenerationStarted(user.id, {
      prompt: prompt.trim(),
      duration: duration[0]
    });

    try {
      const response = await fetch('/api/music/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          duration: duration[0],
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const data = await response.json();
      
      const newTrack: GeneratedTrack = {
        id: crypto.randomUUID(),
        title: `Musique générée - ${prompt.slice(0, 30)}...`,
        duration: duration[0],
        url: data.audioUrl,
        prompt: prompt.trim(),
        created_at: new Date().toISOString(),
      };

      setGeneratedTracks(prev => [newTrack, ...prev]);
      setPrompt('');
      
      analytics.musicGenerationFinished(user.id, {
        trackId: newTrack.id,
        success: true,
        duration: duration[0]
      });

      toast({
        title: "Musique générée !",
        description: "Votre composition personnalisée est prête à écouter.",
      });

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      
      analytics.musicGenerationFinished(user.id, {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      toast({
        title: "Erreur",
        description: "Impossible de générer la musique. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playTrack = (track: GeneratedTrack) => {
    if (audioRef.current) {
      if (currentTrack?.id === track.id && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = track.url;
        audioRef.current.play();
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const suggestedPrompts = [
    "Musique relaxante pour méditation avec sons de la nature",
    "Ambiance apaisante pour concentration au travail",
    "Sons binauraux pour réduction du stress",
    "Mélodie douce pour améliorer le sommeil",
    "Composition énergisante pour motivation matinale"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Musique thérapeutique</h1>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          <Music className="w-4 h-4 mr-1" />
          IA Generative
        </Badge>
      </div>
      
      <p className="text-muted-foreground">
        Créez des compositions musicales personnalisées pour votre bien-être émotionnel.
      </p>

      {/* Generation Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wand2 className="mr-2 h-5 w-5" />
            Générer une composition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Décrivez l'ambiance souhaitée
            </label>
            <Input
              placeholder="Ex: Musique relaxante avec des sons d'océan pour méditation..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">
              Durée: {duration[0]} secondes
            </label>
            <Slider
              value={duration}
              onValueChange={setDuration}
              max={180}
              min={15}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15s</span>
              <span>3 minutes</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Suggestions populaires:</label>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(suggestion)}
                  disabled={isGenerating}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={generateMusic}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                />
                Génération en cours... ({Math.floor(Math.random() * 25) + 5}s restantes)
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Générer la musique
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Audio Player */}
      {currentTrack && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={togglePlayPause}
                className="h-12 w-12 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              
              <div className="flex-1">
                <h3 className="font-medium">{currentTrack.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentTrack.prompt}
                </p>
                <div className="mt-2 bg-white/50 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Tracks Library */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Headphones className="mr-2 h-5 w-5" />
          Vos compositions ({generatedTracks.length})
        </h2>
        
        {generatedTracks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Aucune composition encore</h3>
              <p className="text-muted-foreground">
                Commencez par générer votre première composition musicale personnalisée.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {generatedTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium line-clamp-2 flex-1">
                          {track.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => playTrack(track)}
                          className="flex-shrink-0 ml-2"
                        >
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {track.prompt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDuration(track.duration)}
                        </div>
                        <span>
                          {new Date(track.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => {
          if (currentTrack) {
            const audio = e.currentTarget;
            setProgress((audio.currentTime / audio.duration) * 100);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default B2CMusicPage;
