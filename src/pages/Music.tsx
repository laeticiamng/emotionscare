
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Play, Pause, Volume2, Shuffle, Repeat, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MusicTrack {
  id: string;
  title: string;
  emotion: string;
  duration: number;
  audioUrl: string;
  isGenerated?: boolean;
}

const Music: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState([50]);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [playlist, setPlaylist] = useState<MusicTrack[]>([
    {
      id: '1',
      title: 'Calme océanique',
      emotion: 'relaxation',
      duration: 180,
      audioUrl: '/demo-audio.mp3'
    },
    {
      id: '2',
      title: 'Énergie matinale',
      emotion: 'motivation',
      duration: 220,
      audioUrl: '/demo-audio.mp3'
    },
    {
      id: '3',
      title: 'Méditation profonde',
      emotion: 'sérénité',
      duration: 300,
      audioUrl: '/demo-audio.mp3'
    }
  ]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const emotions = [
    { value: 'relaxation', label: 'Relaxation' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'joie', label: 'Joie' },
    { value: 'sérénité', label: 'Sérénité' },
    { value: 'concentration', label: 'Concentration' },
    { value: 'tristesse', label: 'Accompagnement tristesse' },
    { value: 'anxiété', label: 'Apaisement anxiété' },
    { value: 'colère', label: 'Gestion colère' }
  ];

  const generateMusic = async () => {
    if (!selectedEmotion && !customPrompt) {
      toast.error('Veuillez sélectionner une émotion ou décrire votre besoin');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = customPrompt || `Musique pour ${selectedEmotion}`;
      
      const { data, error } = await supabase.functions.invoke('music-generator', {
        body: { 
          prompt,
          emotion: selectedEmotion,
          duration: 120 // 2 minutes par défaut
        }
      });

      if (error) throw error;

      const newTrack: MusicTrack = {
        id: Date.now().toString(),
        title: data.title || `Musique générée - ${selectedEmotion}`,
        emotion: selectedEmotion,
        duration: data.duration || 120,
        audioUrl: data.audioUrl,
        isGenerated: true
      };

      setPlaylist(prev => [newTrack, ...prev]);
      setCurrentTrack(newTrack);
      toast.success('Musique générée avec succès !');
    } catch (error) {
      console.error('Erreur génération musique:', error);
      toast.error('Erreur lors de la génération musicale');
    } finally {
      setIsGenerating(false);
    }
  };

  const playTrack = (track: MusicTrack) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseMusic();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.play().catch(error => {
          console.error('Erreur lecture:', error);
          toast.error('Impossible de lire ce fichier audio');
        });
      }
    }
  };

  const pauseMusic = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Music className="h-8 w-8 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold">Musique Thérapeutique</h1>
            <p className="text-muted-foreground">
              Génération musicale adaptée à vos émotions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Générateur de musique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Générer une musique personnalisée</CardTitle>
            <CardDescription>
              Choisissez une émotion ou décrivez ce dont vous avez besoin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Émotion cible</label>
                <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une émotion" />
                  </SelectTrigger>
                  <SelectContent>
                    {emotions.map(emotion => (
                      <SelectItem key={emotion.value} value={emotion.value}>
                        {emotion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description personnalisée</label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ex: Musique douce pour méditer le soir"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <Button 
              onClick={generateMusic} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Générer la musique
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playlist */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Votre Playlist</CardTitle>
              <CardDescription>
                Musiques générées et recommandations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {playlist.map((track) => (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${
                      currentTrack?.id === track.id ? 'bg-accent border-primary' : ''
                    }`}
                    onClick={() => playTrack(track)}
                  >
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant={currentTrack?.id === track.id && isPlaying ? 'default' : 'outline'}
                      >
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {track.emotion} • {formatDuration(track.duration)}
                          {track.isGenerated && ' • Générée par IA'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lecteur */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Lecteur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentTrack ? (
                <>
                  <div className="text-center">
                    <h3 className="font-medium">{currentTrack.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {currentTrack.emotion}
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline">
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => playTrack(currentTrack)}
                      className="w-12 h-12"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Sélectionnez une musique pour commencer</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          toast.error('Erreur lors de la lecture audio');
        }}
      />
    </div>
  );
};

export default Music;
