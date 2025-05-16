
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MusicTrack, MusicPlaylist, MusicLibraryProps } from '@/types/music';
import { useMusic } from '@/contexts/music';
import { Search, Music } from 'lucide-react';

const MusicLibrary: React.FC<MusicLibraryProps> = ({
  onTrackSelect,
  currentTrack,
  isPlaying,
  searchTerm: externalSearchTerm,
  onSearchChange,
  tracks: providedTracks,
  playlists: providedPlaylists
}) => {
  const { playlists: contextPlaylists, playTrack } = useMusic();
  
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm || '');
  const [filteredTracks, setFilteredTracks] = useState<MusicTrack[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Use provided data or context data
  const allPlaylists = providedPlaylists || contextPlaylists || [];
  
  // Extract all tracks from playlists if no tracks provided
  const allTracks: MusicTrack[] = providedTracks || 
    allPlaylists.reduce((acc: MusicTrack[], playlist) => {
      return [...acc, ...playlist.tracks];
    }, []);
  
  useEffect(() => {
    if (externalSearchTerm !== undefined) {
      setSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);
  
  useEffect(() => {
    // Filter tracks based on search term and active tab
    const filtered = allTracks.filter(track => {
      const matchesSearch = searchTerm 
        ? track.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          track.artist.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      const matchesTab = activeTab === 'all' ? true : track.category === activeTab || track.mood === activeTab;
      
      return matchesSearch && matchesTab;
    });
    
    setFilteredTracks(filtered);
  }, [searchTerm, allTracks, activeTab]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (onSearchChange) {
      onSearchChange(newSearchTerm);
    }
  };
  
  const handleTrackSelect = (track: MusicTrack) => {
    // Make sure we have the required url field
    const completeTrack: MusicTrack = {
      ...track,
      url: track.url || track.audioUrl || track.track_url || ''
    };
    
    if (onTrackSelect) {
      onTrackSelect(completeTrack);
    } else if (playTrack) {
      playTrack(completeTrack);
    }
  };
  
  const renderMusicCategories = () => {
    // Extract unique categories/moods
    const categories = new Set<string>();
    allTracks.forEach(track => {
      if (track.category) categories.add(track.category);
      if (track.mood) categories.add(track.mood);
    });
    
    return Array.from(categories).map(category => (
      <TabsTrigger key={category} value={category} className="capitalize">
        {category}
      </TabsTrigger>
    ));
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher de la musique..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start overflow-auto">
            <TabsTrigger value="all">Tous</TabsTrigger>
            {renderMusicCategories()}
          </TabsList>
          
          <TabsContent value={activeTab} className="pt-4">
            {filteredTracks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Music className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Aucun morceau trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTracks.map((track) => (
                  <MusicTrackCard 
                    key={track.id} 
                    track={track}
                    isPlaying={isPlaying && currentTrack?.id === track.id}
                    isActive={currentTrack?.id === track.id}
                    onClick={() => handleTrackSelect(track)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface MusicTrackCardProps {
  track: MusicTrack;
  isPlaying?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const MusicTrackCard: React.FC<MusicTrackCardProps> = ({ track, isPlaying, isActive, onClick }) => {
  const coverUrl = track.coverUrl || track.cover_url || '/images/music/default-cover.jpg';
  
  // Ensure track has all required properties
  const completeTrack: MusicTrack = {
    ...track,
    url: track.url || track.track_url || track.audioUrl || ''
  };
  
  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };
  
  return (
    <div 
      className={`
        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
        ${isActive ? 'bg-primary/10' : 'hover:bg-muted'}
      `}
      onClick={onClick}
    >
      <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
        <img 
          src={coverUrl} 
          alt={track.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/music/default-cover.jpg';
          }}
        />
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{track.title}</p>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
      </div>
      <span className="text-xs text-muted-foreground">
        {formatDuration(track.duration)}
      </span>
    </div>
  );
};

export default MusicLibrary;
