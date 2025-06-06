
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, Volume2, Heart } from 'lucide-react';

const Music = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const playlists = [
    {
      id: 1,
      name: "Relaxation Profonde",
      tracks: 12,
      duration: "45 min",
      mood: "Calme"
    },
    {
      id: 2,
      name: "Focus & Concentration",
      tracks: 8,
      duration: "32 min", 
      mood: "Concentration"
    },
    {
      id: 3,
      name: "Méditation Guidée",
      tracks: 6,
      duration: "28 min",
      mood: "Méditation"
    }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Musique Thérapeutique</h1>
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span className="text-sm text-gray-600">3 favoris</span>
        </div>
      </div>

      {/* Lecteur audio principal */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Volume2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">
                {currentTrack ? currentTrack : "Sélectionnez une playlist"}
              </h3>
              <p className="text-sm text-gray-600">Musique de relaxation</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <SkipForward className="h-4 w-4 rotate-180" />
            </Button>
            <Button size="icon" onClick={handlePlayPause}>
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="icon">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Playlists recommandées */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Playlists Recommandées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{playlist.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>{playlist.tracks} pistes • {playlist.duration}</p>
                  <p className="text-blue-600 font-medium">Humeur: {playlist.mood}</p>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => {
                    setCurrentTrack(playlist.name);
                    setIsPlaying(true);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Écouter
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommandations basées sur l'humeur */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Recommandations personnalisées</h3>
        <p className="text-gray-700 text-sm mb-4">
          Basées sur votre journal émotionnel et vos préférences
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Relaxation
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Nature
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
            Méditation
          </span>
        </div>
      </div>
    </div>
  );
};

export default Music;
