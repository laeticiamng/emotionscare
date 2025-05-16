
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Heart, HeartOff } from 'lucide-react';
import { MusicPlaylist } from '@/types/music';
import { motion } from 'framer-motion';

interface MoodBasedRecommendationsProps {
  mood?: string;
  playlists: MusicPlaylist[];
  onPlayPlaylist: (playlist: MusicPlaylist) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  favorites?: string[];
}

const MoodBasedRecommendations: React.FC<MoodBasedRecommendationsProps> = ({ 
  mood = "relaxed",
  playlists = [],
  onPlayPlaylist,
  onToggleFavorite,
  favorites = []
}) => {
  // Filter playlists based on the mood
  const filteredPlaylists = playlists.slice(0, 4);
  
  const isFavorite = (playlistId: string) => favorites.includes(playlistId);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recommandations pour vous</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {filteredPlaylists.map((playlist, index) => (
          <motion.div 
            key={playlist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full overflow-hidden">
              <div 
                className="h-32 bg-gradient-to-br from-indigo-500 to-purple-700 relative overflow-hidden"
                style={{
                  backgroundImage: playlist.cover_url ? `url(${playlist.cover_url})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    size="icon" 
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm"
                    onClick={() => onPlayPlaylist(playlist)}
                  >
                    <Play className="h-5 w-5 text-white" fill="white" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium line-clamp-1">
                      {playlist.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {playlist.tracks.length} morceaux
                    </p>
                  </div>
                  
                  {onToggleFavorite && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onToggleFavorite(playlist.id, !isFavorite(playlist.id))}
                    >
                      {isFavorite(playlist.id) ? (
                        <Heart className="h-4 w-4 text-red-500" fill="#ef4444" />
                      ) : (
                        <Heart className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MoodBasedRecommendations;
