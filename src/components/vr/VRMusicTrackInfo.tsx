
import React from 'react';
import { MusicTrack } from '@/types/music';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Music } from 'lucide-react';

interface VRMusicTrackInfoProps {
  track: MusicTrack | null;
  showControls?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
}

const VRMusicTrackInfo: React.FC<VRMusicTrackInfoProps> = ({ 
  track, 
  showControls = false,
  onPlay,
  onPause, 
  isPlaying = false
}) => {
  if (!track) return null;

  return (
    <Card className="max-w-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Music Track</CardTitle>
        <CardDescription>Now playing in VR environment</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-3">
          {track.coverUrl ? (
            <img 
              src={track.coverUrl} 
              alt={track.title} 
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            <div className="w-16 h-16 bg-primary/20 rounded flex items-center justify-center">
              <Music className="h-8 w-8 text-primary" />
            </div>
          )}
          <div>
            <p className="font-medium">{track.title}</p>
            {track.artist && <p className="text-sm text-muted-foreground">{track.artist}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              {track.emotion && `Emotion: ${track.emotion}`}
            </p>
          </div>
        </div>
        {showControls && (
          <div className="mt-3 flex justify-center gap-2">
            {isPlaying ? (
              <button onClick={onPause} className="px-4 py-1 bg-primary text-primary-foreground rounded">
                Pause
              </button>
            ) : (
              <button onClick={onPlay} className="px-4 py-1 bg-primary text-primary-foreground rounded">
                Play
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRMusicTrackInfo;
