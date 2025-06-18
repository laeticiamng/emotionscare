import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Music, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  Heart,
  Brain,
  Smile,
  CloudRain,
  Sun,
  Moon
} from 'lucide-react';

const MusicTherapyPage: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const moodPlaylists = [
    { name: 'Détente', icon: <CloudRain className="h-6 w-6" />, color: 'bg-blue-500', tracks: 24 },
    { name: 'Énergie', icon: <Sun className="h-6 w-6" />, color: 'bg-orange-500', tracks: 18 },
    { name: 'Concentration', icon: <Brain className="h-6 w-6" />, color: 'bg-purple-500', tracks: 32 },
    { name: 'Sommeil', icon: <Moon className="h-6 w-6" />, color: 'bg-indigo-500', tracks: 15 }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Musicothérapie
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Laissez la musique guider votre bien-être émotionnel avec nos playlists thérapeutiques personnalisées.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {moodPlaylists.map((playlist, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 mx-auto ${playlist.color} rounded-full flex items-center justify-center text-white mb-4`}>
                {playlist.icon}
              </div>
              <CardTitle>{playlist.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">{playlist.tracks} pistes disponibles</p>
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Écouter
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Music className="h-6 w-6" />
            <span>Lecteur Musical</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="sm">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button size="lg" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="outline" size="sm">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold">Musique de détente</h3>
              <p className="text-sm text-muted-foreground">Sons de la nature</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Volume2 className="h-4 w-4" />
              <Slider defaultValue={[50]} max={100} step={1} className="flex-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { MusicTherapyPage };
export default MusicTherapyPage;