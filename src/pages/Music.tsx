
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Download, Music as MusicIcon, Loader2, Heart, Volume2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GeneratedTrack {
  id: string;
  title: string;
  url: string;
  duration: number;
  mood: string;
  created_at: Date;
}

const Music: React.FC = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [mood, setMood] = useState('relaxing');
  const [duration, setDuration] = useState([30]);
  const [tracks, setTracks] = useState<GeneratedTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<GeneratedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const moods = [
    { value: 'relaxing', label: 'Relaxant', color: 'bg-blue-100 text-blue-800' },
    { value: 'energetic', label: 'Énergique', color: 'bg-orange-100 text-orange-800' },
    { value: 'meditative', label: 'Méditatif', color: 'bg-purple-100 text-purple-800' },
    { value: 'happy', label: 'Joyeux', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'focus', label: 'Concentration', color: 'bg-green-100 text-green-800' }
  ];

  const generateMusic = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez saisir une description');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: { 
          prompt,
          mood,
          duration: duration[0]
        }
      });

      if (error) throw error;

      const newTrack: GeneratedTrack = {
        id: Date.now().toString(),
        title: prompt,
        url: data.audio_url,
        duration: duration[0],
        mood,
        created_at: new Date()
      };

      setTracks(prev => [newTrack, ...prev]);
      toast.success('Musique générée avec succès !');
    } catch (error) {
      console.error('Erreur génération musique:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const playTrack = (track: GeneratedTrack) => {
    if (currentTrack?.id === track.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.play();
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    }
  };

  const downloadTrack = (track: GeneratedTrack) => {
    const link = document.createElement('a');
    link.href = track.url;
    link.download = `${track.title}.mp3`;
    link.click();
    toast.success('Téléchargement lancé !');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Musicothérapie</h1>
          <p className="text-muted-foreground">
            Générez des musiques personnalisées pour votre bien-être
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Générateur */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MusicIcon className="h-5 w-5" />
                  Créer votre musique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Description
                  </label>
                  <Input
                    placeholder="Ex: musique douce pour méditer"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Ambiance
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((m) => (
                      <Badge
                        key={m.value}
                        variant={mood === m.value ? "default" : "outline"}
                        className={`cursor-pointer ${mood === m.value ? m.color : ''}`}
                        onClick={() => setMood(m.value)}
                      >
                        {m.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Durée: {duration[0]} secondes
                  </label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    max={120}
                    min={10}
                    step={10}
                  />
                </div>

                <Button 
                  onClick={generateMusic}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MusicIcon className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? 'Génération...' : 'Générer'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Liste des pistes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Vos créations musicales</CardTitle>
                <CardDescription>
                  {tracks.length} piste{tracks.length > 1 ? 's' : ''} générée{tracks.length > 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tracks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MusicIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune musique générée pour le moment</p>
                    <p className="text-sm">Commencez par créer votre première piste !</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tracks.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{track.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={moods.find(m => m.value === track.mood)?.color}
                            >
                              {moods.find(m => m.value === track.mood)?.label}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {track.duration}s
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => playTrack(track)}
                          >
                            {currentTrack?.id === track.id && isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => downloadTrack(track)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lecteur audio caché */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
            toast.error('Erreur lors de la lecture');
          }}
        />
      </div>
    </div>
  );
};

export default Music;
