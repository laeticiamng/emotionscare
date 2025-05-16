
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Music } from 'lucide-react';
import { MusicTrack, MusicLibraryProps } from '@/types/music';

const MusicLibrary: React.FC<MusicLibraryProps> = ({
  tracks = [],
  onTrackSelect,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'calm', name: 'Calme' },
    { id: 'focus', name: 'Concentration' },
    { id: 'energy', name: 'Énergie' },
    { id: 'sleep', name: 'Sommeil' }
  ];
  
  // Sample tracks if none provided
  const defaultTracks: MusicTrack[] = [
    {
      id: '1',
      title: 'Méditation matinale',
      artist: 'Zen Dreams',
      duration: 180,
      url: '/path/to/audio1.mp3',
      coverUrl: '/images/cover1.jpg',
    },
    {
      id: '2',
      title: 'Concentration profonde',
      artist: 'Focus Mind',
      duration: 240,
      url: '/path/to/audio2.mp3',
      coverUrl: '/images/cover2.jpg',
    },
    {
      id: '3',
      title: 'Énergie positive',
      artist: 'Good Vibes',
      duration: 200,
      url: '/path/to/audio3.mp3',
      coverUrl: '/images/cover3.jpg',
    },
    {
      id: '4',
      title: 'Sommeil réparateur',
      artist: 'Dream State',
      duration: 300,
      url: '/path/to/audio4.mp3',
      coverUrl: '/images/cover4.jpg',
    },
  ];
  
  const displayTracks: MusicTrack[] = tracks.length > 0 ? tracks : defaultTracks;
  
  // Filter tracks by search and category
  const filteredTracks = displayTracks.filter(track => {
    const matchesSearch = 
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = activeCategory === 'all' ? true : 
      (track.emotion === activeCategory);
      
    return matchesSearch && matchesCategory;
  });
  
  const handleTrackSelect = (track: MusicTrack) => {
    if (onTrackSelect) {
      onTrackSelect(track);
    }
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par titre ou artiste..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex overflow-auto pb-2 gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTracks.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <Music className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">Aucune musique ne correspond à votre recherche</p>
          </div>
        ) : (
          filteredTracks.map(track => (
            <div 
              key={track.id}
              className="flex items-center gap-3 p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => handleTrackSelect(track)}
            >
              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {track.coverUrl ? (
                  <img 
                    src={track.coverUrl} 
                    alt={track.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <p className="font-medium truncate">{track.title}</p>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
              </div>
            </div>
          ))
        )}
      </div>
      
      {filteredTracks.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-2">
          Affichage de {filteredTracks.length} morceaux
        </p>
      )}
    </div>
  );
};

export default MusicLibrary;
