
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestMusicContext: React.FC = () => {
  const music = useMusic();
  
  // Test the context
  const handleTestPlay = () => {
    if (music.currentTrack) {
      music.togglePlay();
    } else if (music.playlist && music.playlist.tracks.length > 0) {
      music.playTrack(music.playlist.tracks[0]);
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
        <CardTitle>Test MusicContext</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Current State:</p>
            <ul className="list-disc pl-5 text-sm">
              <li>Initialized: {music.isInitialized ? 'Yes' : 'No'}</li>
              <li>Current Track: {music.currentTrack?.title || 'None'}</li>
              <li>Playing: {music.isPlaying ? 'Yes' : 'No'}</li>
              <li>Volume: {Math.round(music.volume * 100)}%</li>
              <li>Emotion: {music.emotion || 'None'}</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleTestPlay}>
              {music.isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={handleTestEmotion} variant="outline">
              Load Random Playlist
            </Button>
            <Button onClick={() => music.setOpenDrawer(true)} variant="outline">
              Open Drawer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestMusicContext;
