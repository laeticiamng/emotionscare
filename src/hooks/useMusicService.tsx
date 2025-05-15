
import { useState, useEffect } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';

interface UseMusicServiceProps {
  defaultEmotion?: string;
}

export const useMusicService = ({ defaultEmotion = 'calm' }: UseMusicServiceProps = {}) => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState(defaultEmotion);

  // Function to get tracks by emotion
  const getTracksByEmotion = (emotion: string | string[]) => {
    setLoading(true);
    
    // Handle array of emotions
    const normalizedEmotion = Array.isArray(emotion) 
      ? emotion[0].toLowerCase() 
      : emotion.toLowerCase();
    
    try {
      // This would be an API call in a real app
      setTimeout(() => {
        // Mock fetch response
        const filteredTracks = tracks.filter(track => 
          track.category?.toLowerCase().includes(normalizedEmotion)
        );
        setTracks(filteredTracks.length ? filteredTracks : tracks);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to fetch tracks by emotion');
      setLoading(false);
    }
  };

  // Function to get playlists by emotion
  const getPlaylistsByEmotion = (emotion: string | string[]) => {
    setLoading(true);
    
    // Handle array of emotions
    const normalizedEmotion = Array.isArray(emotion) 
      ? emotion[0].toLowerCase() 
      : emotion.toLowerCase();
    
    try {
      // This would be an API call in a real app
      setTimeout(() => {
        // Mock fetch response
        const filteredPlaylists = playlists.filter(playlist => 
          playlist.category?.toLowerCase().includes(normalizedEmotion)
        );
        setPlaylists(filteredPlaylists.length ? filteredPlaylists : playlists);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to fetch playlists by emotion');
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const fetchMusicData = async () => {
      setLoading(true);
      try {
        // This would be an API call in a real app
        setTimeout(() => {
          // Mock data - would come from the API
          setTracks([
            {
              id: '001',
              title: 'Calm Waters',
              artist: 'Ambient Sounds',
              duration: 180,
              url: '/audio/calm-waters.mp3',
              coverUrl: '/images/covers/calm-waters.jpg',
              category: 'calm'
            },
            {
              id: '002',
              title: 'Energy Flow',
              artist: 'Upbeat Tracks',
              duration: 210,
              url: '/audio/energy-flow.mp3',
              coverUrl: '/images/covers/energy-flow.jpg',
              category: 'energetic'
            }
          ]);
          
          setPlaylists([
            {
              id: 'playlist001',
              title: 'Meditation Collection',
              name: 'Meditation Collection',
              category: 'calm',
              description: 'Perfect for meditation sessions',
              tracks: []
            },
            {
              id: 'playlist002',
              title: 'Workout Mix',
              name: 'Workout Mix',
              category: 'energetic',
              description: 'Boost your workout performance',
              tracks: []
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch music data');
        setLoading(false);
      }
    };
    
    fetchMusicData();
  }, []);

  // Update data when emotion changes
  useEffect(() => {
    if (currentEmotion) {
      getTracksByEmotion(currentEmotion);
      getPlaylistsByEmotion(currentEmotion);
    }
  }, [currentEmotion]);

  return {
    tracks,
    playlists,
    loading,
    error,
    currentEmotion,
    setCurrentEmotion,
    getTracksByEmotion,
    getPlaylistsByEmotion
  };
};
