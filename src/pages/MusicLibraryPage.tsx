import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, ArrowLeft, Play, Pause, Plus, Search, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  audio_url?: string;
  image_url?: string;
  tags?: string;
  duration?: number;
  created_at: string;
  prompt?: string;
}

export default function MusicLibraryPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // TODO: Charger les tracks depuis la base de données
    // Pour l'instant, affichage d'une bibliothèque vide
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      // Placeholder - À remplacer par un vrai appel API
      const mockTracks: Track[] = [];
      setTracks(mockTracks);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger votre bibliothèque',
        variant: 'destructive',
      });
    }
  };

  const togglePlay = (trackId: string, audioUrl?: string) => {
    if (!audioUrl) {
      toast({
        title: 'Indisponible',
        description: 'Cette piste audio n\'est pas encore disponible',
        variant: 'destructive',
      });
      return;
    }

    if (currentPlaying === trackId) {
      audioElement?.pause();
      setCurrentPlaying(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setCurrentPlaying(null);
      setAudioElement(audio);
      setCurrentPlaying(trackId);
    }
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.tags?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Ma Bibliothèque</h1>
                <p className="text-muted-foreground">
                  {tracks.length} composition{tracks.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <Button onClick={() => navigate('/app/music/generate')} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Nouvelle composition
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans votre bibliothèque..."
              className="pl-10"
            />
          </div>
        </header>

        {filteredTracks.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Music className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">
                {searchQuery ? 'Aucun résultat' : 'Votre bibliothèque est vide'}
              </h2>
              <p className="mb-6 max-w-md text-muted-foreground">
                {searchQuery
                  ? 'Aucune composition ne correspond à votre recherche'
                  : 'Commencez à créer votre première composition musicale personnalisée'}
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate('/app/music/generate')} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Créer ma première composition
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTracks.map((track) => (
              <Card key={track.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  {track.image_url ? (
                    <img
                      src={track.image_url}
                      alt={track.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <Music className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="mb-1 font-semibold line-clamp-1">{track.title}</h3>
                    {track.tags && (
                      <div className="flex flex-wrap gap-1">
                        {track.tags.split(',').slice(0, 2).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(track.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(track.created_at)}
                    </div>
                  </div>

                  <Button
                    onClick={() => togglePlay(track.id, track.audio_url)}
                    variant={currentPlaying === track.id ? 'default' : 'outline'}
                    className="w-full"
                    size="sm"
                  >
                    {currentPlaying === track.id ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        En lecture
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Écouter
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
