
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Music, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EmotionsCareSongCard from './EmotionsCareSongCard';
import EmotionsCarePlayerWithLyrics from './EmotionsCarePlayerWithLyrics';

interface EmotionsCareSong {
  id: string;
  title: string;
  suno_audio_id: string;
  meta: any;
  lyrics: any;
  created_at: string;
  isLiked?: boolean;
  inLibrary?: boolean;
}

const EmotionsCareLibrary: React.FC = () => {
  const [songs, setSongs] = useState<EmotionsCareSong[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<EmotionsCareSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSong, setCurrentSong] = useState<EmotionsCareSong | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserLibrary();
  }, []);

  useEffect(() => {
    // Filtrer les chansons selon le terme de recherche
    const filtered = songs.filter(song =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSongs(filtered);
  }, [songs, searchTerm]);

  const fetchUserLibrary = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour voir votre bibliothèque",
          variant: "destructive"
        });
        return;
      }

      // Récupérer les chansons de la bibliothèque utilisateur avec les infos de like
      const { data: libraryData, error } = await supabase
        .from('emotionscare_user_songs')
        .select(`
          created_at,
          song_id,
          emotionscare_songs (
            id,
            title,
            suno_audio_id,
            meta,
            lyrics,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur fetch library:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre bibliothèque",
          variant: "destructive"
        });
        return;
      }

      // Récupérer les likes de l'utilisateur
      const { data: likesData } = await supabase
        .from('emotionscare_song_likes')
        .select('song_id')
        .eq('user_id', user.id);

      const likedSongIds = new Set(likesData?.map(like => like.song_id) || []);

      // Formater les données
      const formattedSongs: EmotionsCareSong[] = libraryData?.map(item => ({
        id: item.emotionscare_songs.id,
        title: item.emotionscare_songs.title,
        suno_audio_id: item.emotionscare_songs.suno_audio_id,
        meta: item.emotionscare_songs.meta,
        lyrics: item.emotionscare_songs.lyrics,
        created_at: item.emotionscare_songs.created_at,
        isLiked: likedSongIds.has(item.emotionscare_songs.id),
        inLibrary: true
      })) || [];

      setSongs(formattedSongs);
    } catch (error) {
      console.error('Erreur générale:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (song: EmotionsCareSong) => {
    setCurrentSong(song);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setCurrentSong(null);
  };

  const handleLibraryChange = () => {
    // Recharger la bibliothèque après un changement
    fetchUserLibrary();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-4">
          <Music className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Chargement de votre bibliothèque EmotionsCare...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-6 h-6 text-primary" />
            Ma Bibliothèque EmotionsCare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans ma bibliothèque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4" />
              <span>{songs.filter(s => s.isLiked).length} favoris</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des chansons */}
      {filteredSongs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {songs.length === 0 ? "Bibliothèque vide" : "Aucun résultat"}
            </h3>
            <p className="text-muted-foreground">
              {songs.length === 0 
                ? "Ajoutez des chansons EmotionsCare à votre bibliothèque pour les retrouver ici"
                : "Aucune chanson ne correspond à votre recherche"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSongs.map(song => (
            <EmotionsCareSongCard
              key={song.id}
              song={song}
              onPlay={handlePlay}
              onLibraryChange={handleLibraryChange}
            />
          ))}
        </div>
      )}

      {/* Player Modal */}
      {showPlayer && currentSong && (
        <EmotionsCarePlayerWithLyrics
          song={currentSong}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default EmotionsCareLibrary;
