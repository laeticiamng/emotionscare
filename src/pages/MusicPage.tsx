import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Shuffle, Repeat, Search, Filter, Download, Settings, Music, Headphones, Radio, Mic, Star, Clock, TrendingUp, Users, Calendar } from 'lucide-react';
import MusicPlayer from '@/components/music/player/MusicPlayer';
import { EmotionMusicRecommendations } from '@/components/music/EmotionMusicRecommendations';
import RecommendedPresets from '@/components/music/RecommendedPresets';
import TrackList from '@/components/music/TrackList';
import { MusicMiniPlayer } from '@/components/music/MusicMiniPlayer';
import { useMusic } from '@/hooks/useMusic';

const MusicPage: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    shuffle,
    repeat,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    currentPlaylist,
    loadPlaylist,
    isLoading,
    error,
  } = useMusic();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState('calm');

  useEffect(() => {
    // Load a default playlist when the component mounts
    loadPlaylist('default');
  }, [loadPlaylist]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
  };

  if (isLoading) {
    return <p>Loading music...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel: Music Player & Emotion Recommendations */}
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Lecture en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <MusicPlayer />
            </CardContent>
          </Card>

          <EmotionMusicRecommendations emotion={selectedMood} className="mb-6" />
        </div>

        {/* Right Panel: Recommended Presets & Track List */}
        <div>
          <RecommendedPresets className="mb-6" currentMood={selectedMood} />
        </div>
      </div>

      {/* Mini Player */}
      <MusicMiniPlayer />
    </div>
  );
};

export default MusicPage;
