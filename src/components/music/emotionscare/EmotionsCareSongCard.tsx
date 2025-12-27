import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Check, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface EmotionsCareSong {
  id: string;
  title: string;
  suno_audio_id: string;
  meta: {
    image_url?: string;
    duration?: number;
  };
  lyrics: any;
  created_at: string;
  isLiked?: boolean;
  inLibrary?: boolean;
}

interface EmotionsCareSongCardProps {
  song: EmotionsCareSong;
  onPlay?: (song: EmotionsCareSong) => void;
  onLibraryChange?: () => void;
}

const EmotionsCareSongCard: React.FC<EmotionsCareSongCardProps> = ({ 
  song, 
  onPlay,
  onLibraryChange 
}) => {
  const [liked, setLiked] = useState(song.isLiked || false);
  const [inLibrary, setInLibrary] = useState(song.inLibrary || false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour aimer une chanson",
          variant: "destructive"
        });
        return;
      }

      if (liked) {
        await supabase
          .from('emotionscare_song_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('song_id', song.id);
      } else {
        await supabase
          .from('emotionscare_song_likes')
          .insert({
            user_id: user.id,
            song_id: song.id
          });
      }
      
      setLiked(!liked);
      toast({
        title: liked ? "Like retiré" : "Chanson aimée",
        description: liked ? "Retiré de vos favoris" : "Ajouté à vos favoris"
      });
    } catch (error) {
      logger.error('Erreur toggle like:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le like",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLibrary = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour ajouter à votre bibliothèque",
          variant: "destructive"
        });
        return;
      }

      if (inLibrary) {
        await supabase
          .from('emotionscare_user_songs')
          .delete()
          .eq('user_id', user.id)
          .eq('song_id', song.id);
      } else {
        await supabase
          .from('emotionscare_user_songs')
          .insert({
            user_id: user.id,
            song_id: song.id
          });
      }
      
      setInLibrary(!inLibrary);
      onLibraryChange?.();
      toast({
        title: inLibrary ? "Retiré de la bibliothèque" : "Ajouté à la bibliothèque",
        description: inLibrary ? "Chanson retirée de votre profil" : "Chanson ajoutée à votre profil"
      });
    } catch (error) {
      logger.error('Erreur toggle library:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la bibliothèque",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    onPlay?.(song);
  };

  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary">
          {song.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {/* Miniature */}
          <div className="relative group">
            <img 
              src={song.meta.image_url || '/placeholder.svg'} 
              alt={song.title}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePlay}
              aria-label="Lire le morceau"
            >
              <Play className="w-6 h-6" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLike}
              disabled={loading}
              className="hover:bg-pink-100"
              aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart 
                className={`w-5 h-5 ${liked ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} 
              />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLibrary}
              disabled={loading}
              className="hover:bg-green-100"
              aria-label={inLibrary ? "Retirer de la bibliothèque" : "Ajouter à la bibliothèque"}
            >
              {inLibrary ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Plus className="w-5 h-5 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        {/* Durée si disponible */}
        {song.meta.duration && (
          <div className="mt-2 text-xs text-muted-foreground">
            Durée: {Math.floor(song.meta.duration / 60)}:{(song.meta.duration % 60).toString().padStart(2, '0')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionsCareSongCard;
