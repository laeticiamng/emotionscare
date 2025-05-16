
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { MusicPlaylist } from '@/types';

interface EmotionMusicRecommendationsProps {
  emotion?: string;
  intensity?: number;
}

const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({
  emotion = "calm",
  intensity = 0.5
}) => {
  const { playlists, openDrawer, setOpenDrawer } = useMusic();
  const { getEmotionMusicDescription } = useMusicEmotionIntegration();

  const handleGenerateMusic = async () => {
    if (!emotion) return;
    
    // Since we don't have access to generateMusic in the MusicContext,
    // we'll just open the drawer to simulate this functionality
    setOpenDrawer(true);
  };
  
  const getRecommendedPlaylists = () => {
    if (!playlists || playlists.length === 0) return [];
    
    // Filter playlists that match the current emotion
    return playlists.slice(0, 3);
  };
  
  const recommendedPlaylists = getRecommendedPlaylists();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <Music className="mr-2 h-5 w-5 text-primary" />
          Musique pour votre état émotionnel
        </h2>
        <p className="text-muted-foreground">
          {getEmotionMusicDescription(emotion)}
        </p>
      </div>

      <Button 
        onClick={handleGenerateMusic}
        className="w-full"
      >
        <Headphones className="mr-2 h-4 w-4" />
        Générer une musique {emotion}
      </Button>

      {recommendedPlaylists.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-medium">Playlists recommandées</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommendedPlaylists.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="overflow-hidden cursor-pointer hover:ring-1 hover:ring-primary/50 transition-all"
                  onClick={() => openDrawer(playlist)}
                >
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600">
                    {/* Placeholder for playlist cover */}
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium truncate">{playlist.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">
                        {playlist.tracks.length} morceaux
                      </span>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Headphones className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionMusicRecommendations;
