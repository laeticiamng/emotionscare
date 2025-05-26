
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Headphones } from 'lucide-react';

const B2CMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(42);

  const playlists = [
    {
      id: 'relaxation',
      name: 'Relaxation Profonde',
      description: 'Sons apaisants pour la méditation',
      tracks: 12,
      duration: '45 min',
      color: 'from-blue-400 to-cyan-500',
      mood: 'Calme'
    },
    {
      id: 'energy',
      name: 'Boost d\'Énergie',
      description: 'Musiques motivantes pour se dynamiser',
      tracks: 8,
      duration: '32 min',
      color: 'from-orange-400 to-red-500',
      mood: 'Énergique'
    },
    {
      id: 'focus',
      name: 'Concentration',
      description: 'Ambiances pour améliorer la focus',
      tracks: 15,
      duration: '60 min',
      color: 'from-purple-400 to-indigo-500',
      mood: 'Concentré'
    },
    {
      id: 'healing',
      name: 'Guérison Émotionnelle',
      description: 'Thérapie musicale pour le bien-être',
      tracks: 10,
      duration: '38 min',
      color: 'from-green-400 to-teal-500',
      mood: 'Serein'
    }
  ];

  const currentPlaylist = playlists[0];
  const tracks = [
    { name: 'Waves of Serenity', artist: 'Ocean Sounds', duration: '4:23' },
    { name: 'Forest Meditation', artist: 'Nature Collective', duration: '5:17' },
    { name: 'Peaceful Mind', artist: 'Calm Studios', duration: '3:45' },
    { name: 'Breathing Space', artist: 'Wellness Music', duration: '6:12' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Music className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Musicothérapie
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Découvrez le pouvoir thérapeutique de la musique personnalisée
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Playlists */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Headphones className="h-5 w-5 mr-2 text-purple-500" />
                  Playlists Recommandées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {playlists.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <div className={`h-32 rounded-lg bg-gradient-to-br ${playlist.color} p-4 text-white relative overflow-hidden group-hover:scale-105 transition-transform`}>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        <div className="relative z-10">
                          <Badge variant="secondary" className="mb-2 bg-white/20 text-white">
                            {playlist.mood}
                          </Badge>
                          <h3 className="font-semibold mb-1">{playlist.name}</h3>
                          <p className="text-sm opacity-90">{playlist.tracks} pistes • {playlist.duration}</p>
                        </div>
                        <motion.div
                          className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="h-5 w-5 text-white" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Track List */}
            <Card>
              <CardHeader>
                <CardTitle>Pistes en cours</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentPlaylist.name} • {currentPlaylist.tracks} pistes
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tracks.map((track, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        index === currentTrack 
                          ? 'bg-purple-100 dark:bg-purple-900/30' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                        {index === currentTrack && isPlaying ? (
                          <Pause className="h-4 w-4 text-purple-600" />
                        ) : (
                          <Play className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{track.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{track.artist}</p>
                      </div>
                      <span className="text-sm text-gray-500">{track.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Player */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Music className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{tracks[currentTrack].name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tracks[currentTrack].artist}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1:23</span>
                      <span>{tracks[currentTrack].duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="ghost" size="icon">
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="w-12 h-12 bg-purple-600 hover:bg-purple-700"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <Volume2 className="h-4 w-4 text-gray-500" />
                    <Progress value={70} className="h-2 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mood Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                  Impact Émotionnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">+15%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Amélioration du bien-être
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Relaxation</span>
                    <span className="text-green-600">+20%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Concentration</span>
                    <span className="text-blue-600">+12%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Stress</span>
                    <span className="text-red-600">-8%</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Enregistrer ressenti
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CMusic;
