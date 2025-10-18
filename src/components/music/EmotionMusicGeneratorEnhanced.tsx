import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Music, Heart, TrendingUp, Clock, Sparkles, Play, History, BarChart3 } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Track {
  title: string;
  artist: string;
  genre: string;
  duration: string;
  therapeutic_effect: string;
  bpm: string;
}

interface Playlist {
  name: string;
  description: string;
  emotion_match: string;
  tracks: Track[];
}

interface Recommendations {
  listening_tips: string;
  best_time: string;
  complementary_activities: string[];
}

const EMOTIONS = [
  { value: 'calme', label: 'Calme 😌', color: 'bg-blue-500' },
  { value: 'joyeux', label: 'Joyeux 😊', color: 'bg-yellow-500' },
  { value: 'anxieux', label: 'Anxieux 😰', color: 'bg-orange-500' },
  { value: 'triste', label: 'Triste 😢', color: 'bg-indigo-500' },
  { value: 'énergique', label: 'Énergique ⚡', color: 'bg-green-500' },
  { value: 'stressé', label: 'Stressé 😤', color: 'bg-red-500' },
];

const MOODS = [
  'détendu', 'concentré', 'créatif', 'mélancolique', 'motivé', 'contemplatif'
];

export const EmotionMusicGeneratorEnhanced: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState('calme');
  const [intensity, setIntensity] = useState([5]);
  const [selectedMood, setSelectedMood] = useState('détendu');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
    loadAnalytics();
  }, []);

  const loadHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('emotion-music-generator', {
        body: { action: 'history' }
      });

      if (error) throw error;
      if (data?.playlists) {
        setHistory(data.playlists);
      }
    } catch (error) {
      logger.error('Erreur chargement historique', error as Error, 'UI');
    }
  };

  const loadAnalytics = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('emotion-music-generator', {
        body: { action: 'analytics' }
      });

      if (error) throw error;
      if (data?.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      logger.error('Erreur chargement analytics', error as Error, 'UI');
    }
  };

  const generatePlaylist = async () => {
    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Non authentifié",
          description: "Veuillez vous connecter pour générer une playlist",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('emotion-music-generator', {
        body: {
          action: 'generate',
          emotion: selectedEmotion,
          intensity: intensity[0],
          mood: selectedMood
        }
      });

      if (error) throw error;

      if (data?.playlist) {
        setCurrentPlaylist(data.playlist);
        setRecommendations(data.recommendations);
        await loadHistory();
        await loadAnalytics();
        
        toast({
          title: "Playlist générée ! 🎵",
          description: `"${data.playlist.name}" est prête à être écoutée`,
        });
      }
    } catch (error: any) {
      logger.error('Erreur génération', error as Error, 'UI');
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer la playlist",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const loadPlaylist = (playlist: any) => {
    setCurrentPlaylist(playlist.playlist_data);
    setRecommendations(playlist.recommendations);
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Music className="h-6 w-6 text-primary" />
            Générateur de Playlists Émotionnelles
          </CardTitle>
          <CardDescription>
            Playlists personnalisées basées sur vos émotions avec l'IA
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">
            <Sparkles className="h-4 w-4 mr-2" />
            Générer
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comment vous sentez-vous ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">Émotion principale</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {EMOTIONS.map((emotion) => (
                    <Button
                      key={emotion.value}
                      variant={selectedEmotion === emotion.value ? "default" : "outline"}
                      onClick={() => setSelectedEmotion(emotion.value)}
                      className="h-auto py-3"
                    >
                      {emotion.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">
                  Intensité: {intensity[0]}/10
                </label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">État d'esprit</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((mood) => (
                    <Badge
                      key={mood}
                      variant={selectedMood === mood ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedMood(mood)}
                    >
                      {mood}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={generatePlaylist}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer ma playlist
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {currentPlaylist && (
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  {currentPlaylist.name}
                </CardTitle>
                <CardDescription>{currentPlaylist.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Correspondance émotionnelle:</strong> {currentPlaylist.emotion_match}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Morceaux ({currentPlaylist.tracks.length})</h4>
                  <ScrollArea className="h-[400px] pr-4">
                    {currentPlaylist.tracks.map((track, index) => (
                      <div
                        key={index}
                        className="p-4 mb-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium">{track.title}</h5>
                            <p className="text-sm text-muted-foreground">{track.artist}</p>
                          </div>
                          <Badge variant="outline">{track.genre}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {track.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {track.bpm} BPM
                          </div>
                        </div>
                        <p className="text-sm mt-2 text-muted-foreground">
                          💡 {track.therapeutic_effect}
                        </p>
                      </div>
                    ))}
                  </ScrollArea>
                </div>

                {recommendations && (
                  <div className="space-y-4 p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Heart className="h-4 w-4 text-primary" />
                      Recommandations
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Conseils d'écoute:</strong> {recommendations.listening_tips}</p>
                      <p><strong>Meilleur moment:</strong> {recommendations.best_time}</p>
                      <div>
                        <strong>Activités complémentaires:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {recommendations.complementary_activities.map((activity, i) => (
                            <li key={i}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des playlists</CardTitle>
              <CardDescription>Vos {history.length} dernières playlists générées</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => loadPlaylist(item)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.playlist_data.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.playlist_data.description}
                          </p>
                        </div>
                        <Badge>{item.emotion}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{item.playlist_data.tracks.length} morceaux</span>
                        <span>Intensité: {item.intensity}/10</span>
                        <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-6">
            {stats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Sessions totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.totalSessions}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Émotion principale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold capitalize">{stats.mostFrequentEmotion}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Intensité moyenne</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.averageIntensity}/10</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribution des émotions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.emotionDistribution).map(([emotion, count]: [string, any]) => (
                        <div key={emotion} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{emotion}</span>
                            <span className="text-muted-foreground">{count} sessions</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${(count / stats.totalSessions) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmotionMusicGeneratorEnhanced;
