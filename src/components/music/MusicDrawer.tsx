
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/contexts/music';
import { MusicDrawerProps, MusicTrack } from '@/types/music';
import { X, Play, Pause, Music } from 'lucide-react';

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  open,
  onClose,
  onOpenChange,
  isOpen = open,
  playlist,
  currentTrack,
  children,
  side = 'right'
}) => {
  const { playTrack, isPlaying, togglePlay, currentTrack: activeTrack } = useMusic();
  const [filter, setFilter] = useState('');

  const handlePlayTrack = (track: MusicTrack) => {
    playTrack(track);
  };

  const filteredTracks = playlist?.tracks.filter(track => 
    track.title.toLowerCase().includes(filter.toLowerCase()) || 
    (track.artist && track.artist.toLowerCase().includes(filter.toLowerCase()))
  ) || [];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange || onClose} side={side}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="mb-4">
          <div className="flex justify-between items-center">
            <SheetTitle>
              {playlist?.name || 'Music Library'}
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        {children || (
          <>
            {playlist && (
              <div className="mb-6">
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 bg-muted-foreground/10 rounded-md overflow-hidden">
                    {playlist.coverUrl ? (
                      <img 
                        src={playlist.coverUrl} 
                        alt={playlist.name}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground">{playlist.tracks.length} tracks</p>
                    {playlist.description && (
                      <p className="text-sm text-muted-foreground">{playlist.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <input 
              type="text"
              placeholder="Filter tracks..."
              className="w-full p-2 mb-4 border rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            
            <div className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {filteredTracks.map(track => (
                  <li 
                    key={track.id}
                    className={`p-2 rounded-md flex items-center gap-3 cursor-pointer hover:bg-accent ${
                      activeTrack?.id === track.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => handlePlayTrack(track)}
                  >
                    <div className="w-10 h-10 bg-muted-foreground/10 rounded overflow-hidden">
                      {track.coverUrl ? (
                        <img 
                          src={track.coverUrl} 
                          alt={track.title}
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeTrack?.id === track.id) {
                          togglePlay();
                        } else {
                          handlePlayTrack(track);
                        }
                      }}
                    >
                      {activeTrack?.id === track.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </li>
                ))}
                {filteredTracks.length === 0 && (
                  <li className="text-center py-4 text-muted-foreground">
                    No tracks found
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
