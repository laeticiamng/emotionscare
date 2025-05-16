
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmotionMusicRecommendationsProps {
  emotion?: string;
  intensity?: number;
}

const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({
  emotion = "calm",
  intensity = 0.5
}) => {
  const { generateMusic, playlists, isGenerating, openDrawer } = useMusic();
  const { getEmotionMusicParams, getEmotionMusicDescription } = useMusicEmotionIntegration();

  const handleGenerateMusic = async () => {
    if (!emotion) return;
    
    const params = getEmotionMusicParams(emotion, intensity);
    await generateMusic(params);
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
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Génération en cours...
          </>
        ) : (
          <>
            <Headphones className="mr-2 h-4 w-4" />
            Générer une musique {emotion}
          </>
        )}
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
                    <h4 className="font-medium truncate">{playlist.name || playlist.title || "Playlist sans titre"}</h4>
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
