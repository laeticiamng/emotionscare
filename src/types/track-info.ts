
export interface TrackInfoProps {
  title?: string;
  artist?: string;
  coverUrl?: string;
  track?: MusicTrack;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
  className?: string;
}
