
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestMusicContext: React.FC = () => {
  const music = useMusic();
  
  // Test de base du context
  const handleTestPlay = () => {
    if (music.currentTrack) {
      music.togglePlay();
    } else if (music.playlists && music.playlists.length > 0 && music.playlists[0].tracks.length > 0) {
      music.playTrack(music.playlists[0].tracks[0]);
    } else {
      console.error('No tracks available');
    }
  };
  
  const handleTestEmotion = async () => {
    const emotions = ['calm', 'happy', 'focused', 'energetic', 'relaxed'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    try {
      const playlist = await music.loadPlaylistForEmotion(randomEmotion);
      console.log(`Loaded playlist for emotion ${randomEmotion}:`, playlist);
    } catch (error) {
      console.error('Error loading emotion playlist:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test du MusicContext</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-medium">État actuel:</p>
            <ul className="list-disc pl-5 text-sm">
              <li>Initialisé: {music.isInitialized ? 'Oui' : 'Non'}</li>
              <li>Piste actuelle: {music.currentTrack?.title || 'Aucune'}</li>
              <li>Lecture: {music.isPlaying ? 'En cours' : 'Arrêtée'}</li>
              <li>Volume: {Math.round(music.volume * 100)}%</li>
              <li>Playlists: {music.playlists?.length || 0}</li>
              <li>Émotion: {music.emotion || 'Aucune'}</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleTestPlay}>
              {music.isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={handleTestEmotion} variant="outline">
              Charger playlist aléatoire
            </Button>
            <Button onClick={() => music.setOpenDrawer(true)} variant="outline">
              Ouvrir drawer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestMusicContext;
