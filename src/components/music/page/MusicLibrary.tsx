
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Music, Heart } from 'lucide-react';
import { MusicTrack, MusicPlaylist, MusicLibraryProps } from '@/types/music';

const MusicLibrary: React.FC<MusicLibraryProps> = ({ 
  playlists = [],
  onSelectTrack,
  onSelectPlaylist
}) => {
  // Mock data for empty state or testing
  const mockPlaylists = [
    {
      id: 'focus',
      name: 'Focus',
      title: 'Focus',
      description: 'Une collection pour la concentration',
      cover_url: '/images/playlists/focus.jpg',
      tracks: [
        {
          id: 'track1',
          title: 'Deep Work',
          artist: 'Mind Lab',
          duration: 240,
          track_url: '/audio/deep-work.mp3'
        }
      ]
    },
    {
      id: 'calm',
      name: 'Calme',
      title: 'Calme',
      description: 'Sons apaisants pour la relaxation',
      cover_url: '/images/playlists/calm.jpg',
      tracks: [
        {
          id: 'track2',
          title: 'Ocean Waves',
          artist: 'Nature Sounds',
          duration: 360,
          track_url: '/audio/ocean-waves.mp3'
        }
      ]
    },
    {
      id: 'energy',
      name: 'Énergie',
      title: 'Énergie',
      description: 'Stimulez votre motivation',
      cover_url: '/images/playlists/energy.jpg',
      tracks: [
        {
          id: 'track3',
          title: 'Morning Boost',
          artist: 'Energy Masters',
          duration: 180,
          track_url: '/audio/morning-boost.mp3'
        }
      ]
    },
    {
      id: 'sleep',
      name: 'Sommeil',
      title: 'Sommeil',
      description: 'Sons relaxants pour bien dormir',
      cover_url: '/images/playlists/sleep.jpg',
      tracks: [
        {
          id: 'track4',
          title: 'Deep Sleep',
          artist: 'Dream Studio',
          duration: 600,
          track_url: '/audio/deep-sleep.mp3'
        }
      ]
    }
  ];

  const displayPlaylists = playlists?.length > 0 ? playlists : mockPlaylists;
  
  // Featured tracks for quick access
  const featuredTracks = [
    {
      id: 'featured1',
      title: 'Méditation guidée',
      artist: 'MindfulApp',
      duration: 660,
      track_url: '/audio/meditation.mp3',
      cover_url: '/images/tracks/meditation.jpg'
    },
    {
      id: 'featured2',
      title: 'Focus intense',
      artist: 'ConcentrationLab',
      duration: 480,
      track_url: '/audio/focus-deep.mp3',
      cover_url: '/images/tracks/focus.jpg'
    }
  ];

  // Format duration in mm:ss
  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaylistClick = (playlist: MusicPlaylist) => {
    if (onSelectPlaylist) {
      onSelectPlaylist(playlist);
    }
  };

  const handleTrackClick = (track: MusicTrack) => {
    if (onSelectTrack) {
      onSelectTrack(track);
    }
  };

  return (
    <div className="space-y-8">
      {/* Playlists Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Playlists recommandées</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayPlaylists.map((playlist) => (
            <Card 
              key={playlist.id}
              className="overflow-hidden hover:shadow-md transition-all cursor-pointer"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <div className="relative aspect-square">
                <img 
                  src={playlist.cover_url || '/images/placeholder-playlist.jpg'} 
                  alt={playlist.name} 
                  className="w-full h-full object-cover"
                />
                <Button 
                  size="icon"
                  variant="secondary" 
                  className="absolute right-2 bottom-2 opacity-90 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (playlist.tracks.length > 0 && onSelectTrack) {
                      onSelectTrack(playlist.tracks[0]);
                    }
                  }}
                >
                  <Play className="h-5 w-5" />
                </Button>
              </div>
              <CardContent className="p-3">
                <h4 className="font-medium line-clamp-1">{playlist.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {playlist.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Tracks Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Titres du moment</h3>
        <div className="bg-muted/40 rounded-md overflow-hidden">
          {featuredTracks.map((track, index) => (
            <div 
              key={track.id}
              className={`flex items-center py-2 px-3 hover:bg-muted cursor-pointer ${
                index < featuredTracks.length - 1 ? 'border-b border-border' : ''
              }`}
              onClick={() => handleTrackClick(track)}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden mr-3">
                <img 
                  src={track.cover_url || '/images/placeholder-track.jpg'} 
                  alt={track.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-medium line-clamp-1">{track.title}</h4>
                <p className="text-xs text-muted-foreground">{track.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(track.duration)}</span>
                </Badge>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Collection Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Votre collection</h3>
          <Button variant="outline" size="sm">
            <Music className="h-4 w-4 mr-2" />
            Voir tout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {displayPlaylists.slice(0, 4).map((playlist) => (
            <Button 
              key={playlist.id}
              variant="outline" 
              className="h-auto justify-start py-3 px-4"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center mr-3">
                <Music className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium line-clamp-1">{playlist.name}</p>
                <p className="text-xs text-muted-foreground">{playlist.tracks.length} titres</p>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicLibrary;
