
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Music as MusicIcon, Play, Pause, Download, Heart, Volume2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MusicTrack {
  id: string;
  title: string;
  duration: number;
  audioUrl: string;
  emotion?: string;
  mood?: string;
  isPlaying?: boolean;
}

const Music: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [emotion, setEmotion] = useState('');
  const [generatedTrack, setGeneratedTrack] = useState<MusicTrack | null>(null);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [savedTracks, setSavedTracks] = useState<MusicTrack[]>([]);

  const emotions = [
    'Calme', 'Énergique', 'Joyeux', 'Mélancolique', 
    'Motivant', 'Relaxant', 'Concentré', 'Créatif'
  ];

  const generateMusic = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez décrire la musique que vous souhaitez');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: { 
          prompt: prompt,
          emotion: emotion || 'calme',
          duration: 60
        }
      });

      if (error) throw error;

      const newTrack: MusicTrack = {
        id: `gen-${Date.now()}`,
        title: data.title || `Musique générée: ${prompt.slice(0, 30)}...`,
        duration: data.duration || 60,
        audioUrl: data.audioUrl || '/audio/generated-sample.mp3',
        emotion: emotion,
        mood: prompt
      };

      setGeneratedTrack(newTrack);
      toast.success('Musique générée avec succès !');
    } catch (error) {
      console.error('Erreur génération musique:', error);
      toast.error('Erreur lors de la génération musicale');
    } finally {
      setIsGenerating(false);
    }
  };

  const playTrack = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
      toast.info('Lecture de la musique...');
    }
  };

  const saveTrack = (track: MusicTrack) => {
    setSavedTracks(prev => [...prev, { ...track, id: `saved-${Date.now()}` }]);
    toast.success('Musique sauvegardée !');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
          <MusicIcon className="h-8 w-8 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Musique Thérapeutique</h1>
          <p className="text-muted-foreground">Générez de la musique adaptée à votre état émotionnel</p>
        </div>
      </div>

      {/* Générateur de musique */}
      <Card>
        <CardHeader>
          <CardTitle>Générer de la musique</CardTitle>
          <CardDescription>
            Décrivez la musique que vous souhaitez et choisissez une émotion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Description de la musique</label>
            <Textarea
              placeholder="Ex: Une mélodie douce au piano avec des sons de nature pour la méditation..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Émotion souhaitée</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {emotions.map((emo) => (
                <Badge
                  key={emo}
                  variant={emotion === emo ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setEmotion(emotion === emo ? '' : emo)}
                >
                  {emo}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            onClick={generateMusic} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? 'Génération en cours...' : 'Générer la musique'}
          </Button>
        </CardContent>
      </Card>

      {/* Musique générée */}
      {generatedTrack && (
        <Card>
          <CardHeader>
            <CardTitle>Musique générée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => playTrack(generatedTrack.id)}
                >
                  {playingTrack === generatedTrack.id ? 
                    <Pause className="h-4 w-4" /> : 
                    <Play className="h-4 w-4" />
                  }
                </Button>
                <div>
                  <h4 className="font-medium">{generatedTrack.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Volume2 className="h-3 w-3" />
                    <span>{formatDuration(generatedTrack.duration)}</span>
                    {generatedTrack.emotion && (
                      <Badge variant="secondary" className="text-xs">
                        {generatedTrack.emotion}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => saveTrack(generatedTrack)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Musiques sauvegardées */}
      {savedTracks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mes musiques sauvegardées</CardTitle>
            <CardDescription>
              {savedTracks.length} musique{savedTracks.length > 1 ? 's' : ''} dans votre bibliothèque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedTracks.map((track) => (
                <div key={track.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => playTrack(track.id)}
                    >
                      {playingTrack === track.id ? 
                        <Pause className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </Button>
                    <div>
                      <h4 className="font-medium">{track.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Volume2 className="h-3 w-3" />
                        <span>{formatDuration(track.duration)}</span>
                        {track.emotion && (
                          <Badge variant="secondary" className="text-xs">
                            {track.emotion}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Music;
