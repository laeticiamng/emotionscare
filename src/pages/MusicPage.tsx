
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Heart, Repeat, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState([30]);

  const tracks = [
    { title: "Méditation Océan", artist: "Nature Sounds", duration: "8:32", mood: "relaxant" },
    { title: "Focus Deep", artist: "Ambient Pro", duration: "12:45", mood: "concentration" },
    { title: "Énergie Positive", artist: "Wellness Music", duration: "6:18", mood: "énergisant" },
    { title: "Sommeil Paisible", artist: "Sleep Therapy", duration: "15:20", mood: "apaisant" },
  ];

  const moodColors = {
    relaxant: "bg-blue-100 text-blue-800",
    concentration: "bg-purple-100 text-purple-800", 
    énergisant: "bg-orange-100 text-orange-800",
    apaisant: "bg-green-100 text-green-800"
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Music className="h-10 w-10 text-indigo-500" />
            Musicothérapie
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Musique adaptée à votre état émotionnel
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Lecteur principal */}
            <Card>
              <CardHeader>
                <CardTitle>En cours de lecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="w-48 h-48 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Music className="h-24 w-24 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{tracks[currentTrack].title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{tracks[currentTrack].artist}</p>
                  <Badge className={`mt-2 ${moodColors[tracks[currentTrack].mood as keyof typeof moodColors]}`}>
                    {tracks[currentTrack].mood}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <Slider
                    value={progress}
                    onValueChange={setProgress}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>2:30</span>
                    <span>{tracks[currentTrack].duration}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button variant="ghost" size="icon">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <SkipBack className="h-6 w-6" />
                  </Button>
                  <Button 
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="rounded-full w-16 h-16"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <SkipForward className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Repeat className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3">
                  <Volume2 className="h-4 w-4" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 w-8">{volume[0]}</span>
                </div>
              </CardContent>
            </Card>

            {/* Playlist */}
            <Card>
              <CardHeader>
                <CardTitle>Playlist recommandée</CardTitle>
                <CardDescription>
                  Basée sur votre état émotionnel actuel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tracks.map((track, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        index === currentTrack 
                          ? 'bg-indigo-100 dark:bg-indigo-900' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setCurrentTrack(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{track.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{track.artist}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary"
                            className={moodColors[track.mood as keyof typeof moodColors]}
                          >
                            {track.mood}
                          </Badge>
                          <span className="text-sm text-gray-500">{track.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-6" variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Sauvegarder cette playlist
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recommandations par humeur */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Parcourir par humeur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-1">😌</span>
                  <span>Relaxation</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-1">🎯</span>
                  <span>Focus</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-1">⚡</span>
                  <span>Énergie</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-1">😴</span>
                  <span>Sommeil</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="ghost">← Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
