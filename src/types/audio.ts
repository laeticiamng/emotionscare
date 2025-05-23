
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: number;
  duration: number;
  url: string;
  audioUrl: string;
  coverUrl: string;
}
