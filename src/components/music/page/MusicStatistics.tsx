
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Clock, Trophy, Heart } from 'lucide-react';
import { useMusicStats } from '@/hooks/useMusicStats';

const MusicStatistics: React.FC = () => {
  const { stats, formatListeningTime, hasData } = useMusicStats();

  if (!hasData) {
    return (
      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle>Vos statistiques d'écoute</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Commencez à écouter de la musique pour voir vos statistiques apparaître ici.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos statistiques d'écoute</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Titre le plus écouté</p>
              <p className="font-medium">{stats.mostPlayedTrack}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Music className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Artiste préféré</p>
              <p className="font-medium">{stats.mostPlayedArtist}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Temps d'écoute total</p>
              <p className="font-medium">{formatListeningTime(stats.totalListeningTime)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ambiance favorite</p>
              <p className="font-medium capitalize">{stats.favoriteEmotion}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicStatistics;
