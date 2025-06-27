
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MusicPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const emotionTracks = [
    {
      title: "Sérénité Matinale",
      artist: "EmotionsCare AI",
      emotion: "Calme",
      duration: "4:32",
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "Énergie Positive",
      artist: "EmotionsCare AI", 
      emotion: "Joie",
      duration: "3:45",
      color: "from-yellow-400 to-orange-400"
    },
    {
      title: "Focus Profond",
      artist: "EmotionsCare AI",
      emotion: "Concentration",
      duration: "6:18",
      color: "from-purple-400 to-pink-400"
    },
    {
      title: "Apaisement Nocturne",
      artist: "EmotionsCare AI",
      emotion: "Détente",
      duration: "5:12",
      color: "from-indigo-400 to-blue-400"
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-6 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Musique Thérapeutique
            </h1>
            <p className="text-xl text-gray-600">
              Musiques personnalisées selon votre état émotionnel
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lecteur principal */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 mb-6">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${emotionTracks[currentTrack].color} flex items-center justify-center mb-4`}>
                      <Music className="h-16 w-16 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {emotionTracks[currentTrack].title}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {emotionTracks[currentTrack].artist}
                    </p>
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {emotionTracks[currentTrack].emotion}
                    </Badge>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-6">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-1/3 transition-all duration-300" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1:23</span>
                      <span>{emotionTracks[currentTrack].duration}</span>
                    </div>
                  </div>

                  {/* Contrôles */}
                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setCurrentTrack(Math.max(0, currentTrack - 1))}
                    >
                      <SkipBack className="h-6 w-6" />
                    </Button>
                    <Button 
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full w-16 h-16"
                    >
                      {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setCurrentTrack(Math.min(emotionTracks.length - 1, currentTrack + 1))}
                    >
                      <SkipForward className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Volume2 className="h-4 w-4 text-gray-400" />
                    <div className="w-24 h-1 bg-gray-200 rounded-full">
                      <div className="w-3/4 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Playlist */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle>Playlist Personnalisée</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {emotionTracks.map((track, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          index === currentTrack 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setCurrentTrack(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${track.color} flex items-center justify-center`}>
                              <Music className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{track.title}</h4>
                              <p className="text-sm text-gray-600">{track.artist}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-1">
                              {track.emotion}
                            </Badge>
                            <p className="text-xs text-gray-500">{track.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommandations */}
            <div>
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Basé sur votre humeur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-2">Humeur détectée</h4>
                      <p className="text-sm text-blue-700">
                        Joie (85%) - Énergie positive élevée
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-2">Recommandation</h4>
                      <p className="text-sm text-green-700">
                        Musiques énergisantes pour maintenir votre bonne humeur
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle>Genres Populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {['Ambient', 'Lo-Fi', 'Nature', 'Classique', 'Jazz', 'Méditation'].map((genre) => (
                      <Badge 
                        key={genre} 
                        variant="outline" 
                        className="justify-center py-2 cursor-pointer hover:bg-blue-50"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MusicPage;
