
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';

const B2CMusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(45);

  const playlists = [
    {
      name: "Détente & Méditation",
      tracks: 12,
      duration: "45 min",
      color: "bg-blue-500"
    },
    {
      name: "Énergie Positive",
      tracks: 8,
      duration: "32 min", 
      color: "bg-green-500"
    },
    {
      name: "Focus & Concentration",
      tracks: 15,
      duration: "1h 02min",
      color: "bg-purple-500"
    }
  ];

  const currentPlaylist = [
    { title: "Sérénité Matinale", artist: "Nature Sounds", duration: "4:32" },
    { title: "Méditation Douce", artist: "Zen Masters", duration: "6:15" },
    { title: "Rivière Tranquille", artist: "Ambiance", duration: "8:42" },
    { title: "Forêt Paisible", artist: "Nature", duration: "5:18" }
  ];

  return (
    <>
      <Helmet>
        <title>Musique thérapeutique - EmotionsCare</title>
        <meta name="description" content="Découvrez la musique adaptée à votre bien-être émotionnel" />
      </Helmet>
      
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Musique thérapeutique</h1>
          <p className="text-gray-600">
            Découvrez des playlists personnalisées pour votre bien-être
          </p>
        </div>

        {/* Current Player */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center">
                <Heart className="h-12 w-12 text-white" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">
                  {currentPlaylist[currentTrack]?.title}
                </h3>
                <p className="text-gray-600">
                  {currentPlaylist[currentTrack]?.artist}
                </p>
              </div>

              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>2:15</span>
                  <span>{currentPlaylist[currentTrack]?.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Button variant="ghost" size="lg">
                  <SkipBack className="h-6 w-6" />
                </Button>
                
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="rounded-full w-16 h-16"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
                
                <Button variant="ghost" size="lg">
                  <SkipForward className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <Progress value={70} className="w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Playlists */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Playlists recommandées</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playlists.map((playlist, index) => (
              <Card key={playlist.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className={`w-full h-32 ${playlist.color} rounded-lg flex items-center justify-center`}>
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{playlist.name}</h3>
                      <p className="text-sm text-gray-600">
                        {playlist.tracks} titres • {playlist.duration}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Playlist */}
        <Card>
          <CardHeader>
            <CardTitle>Playlist actuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentPlaylist.map((track, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentTrack ? 'bg-primary/10' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentTrack(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {index === currentTrack && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{track.title}</h4>
                      <p className="text-sm text-gray-600">{track.artist}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{track.duration}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default B2CMusicPage;
