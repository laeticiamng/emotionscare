
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Heart, Music, Headphones, Volume2, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

const MusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(45);
  
  const playlists = [
    {
      id: 'focus',
      name: 'Focus Profond',
      description: 'Musiques binaurales pour la concentration',
      tracks: 24,
      duration: '2h 15min',
      color: 'from-blue-500 to-blue-600',
      icon: '🧠',
      mood: 'Concentration'
    },
    {
      id: 'relax',
      name: 'Relaxation Totale',
      description: 'Sons de la nature et mélodies apaisantes',
      tracks: 18,
      duration: '1h 45min',
      color: 'from-green-500 to-green-600',
      icon: '🌿',
      mood: 'Détente'
    },
    {
      id: 'energy',
      name: 'Boost d\'Énergie',
      description: 'Rythmes stimulants pour se motiver',
      tracks: 32,
      duration: '2h 30min',
      color: 'from-orange-500 to-orange-600',
      icon: '⚡',
      mood: 'Énergie'
    },
    {
      id: 'sleep',
      name: 'Sommeil Réparateur',
      description: 'Fréquences pour un endormissement facile',
      tracks: 12,
      duration: '1h 20min',
      color: 'from-purple-500 to-purple-600',
      icon: '🌙',
      mood: 'Sommeil'
    }
  ];

  const currentPlaylist = [
    {
      title: 'Onde Alpha - Concentration',
      artist: 'NeuroMusic Lab',
      duration: '8:34',
      category: 'Binaural'
    },
    {
      title: 'Forêt Pluvieuse',
      artist: 'Nature Sounds',
      duration: '12:18',
      category: 'Nature'
    },
    {
      title: 'Méditation Tibétaine',
      artist: 'Healing Frequencies',
      duration: '15:42',
      category: 'Spiritual'
    },
    {
      title: 'Vagues Océaniques',
      artist: 'Ocean Therapy',
      duration: '20:00',
      category: 'Nature'
    }
  ];

  const moodBasedSuggestions = [
    { mood: 'Stressé', playlist: 'Relaxation Totale', reason: 'Réduire le stress avec des sons apaisants' },
    { mood: 'Fatigué', playlist: 'Boost d\'Énergie', reason: 'Stimuler votre énergie naturelle' },
    { mood: 'Anxieux', playlist: 'Sommeil Réparateur', reason: 'Calmer l\'esprit avec des fréquences douces' },
    { mood: 'Distrait', playlist: 'Focus Profond', reason: 'Améliorer la concentration avec les battements binauraux' }
  ];

  const sessionStats = {
    todaySessions: 3,
    totalTime: 124, // minutes
    favoriteMood: 'Relaxation',
    streakDays: 12
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Musicothérapie</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Améliorez votre bien-être avec des playlists thérapeutiques personnalisées
          </p>
        </motion.div>

        {/* Music Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <Music className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{currentPlaylist[currentTrack].title}</h3>
                    <p className="opacity-80">{currentPlaylist[currentTrack].artist}</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white">
                  {currentPlaylist[currentTrack].category}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{currentPlaylist[currentTrack].duration}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / 300) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-6 mb-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setCurrentTrack(Math.max(0, currentTrack - 1))}
                >
                  <SkipBack className="h-6 w-6" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-white/20 w-12 h-12"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setCurrentTrack(Math.min(currentPlaylist.length - 1, currentTrack + 1))}
                >
                  <SkipForward className="h-6 w-6" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-3">
                <Volume2 className="h-5 w-5" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm w-10">{volume[0]}%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="playlists" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="playlists">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {playlists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 bg-gradient-to-r ${playlist.color} rounded-lg flex items-center justify-center mr-4`}>
                            <span className="text-2xl">{playlist.icon}</span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{playlist.name}</CardTitle>
                            <CardDescription>{playlist.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline">{playlist.mood}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span>{playlist.tracks} morceaux</span>
                        <span>{playlist.duration}</span>
                      </div>
                      <Button className={`w-full bg-gradient-to-r ${playlist.color}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Écouter
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggestions">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Recommandations Basées sur Votre Humeur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moodBasedSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">Si vous êtes {suggestion.mood.toLowerCase()}</span>
                          <Badge variant="outline">{suggestion.mood}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Essayez "<strong>{suggestion.playlist}</strong>" - {suggestion.reason}
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Play className="h-3 w-3 mr-1" />
                          Écouter Maintenant
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Timer className="h-5 w-5 mr-2" />
                    Sessions d'Écoute Programmées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Session Focus Matinale</h3>
                          <p className="text-sm text-gray-600">Tous les jours à 9h00 - 30 minutes</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Pause Relaxation</h3>
                          <p className="text-sm text-gray-600">Lundi, Mercredi, Vendredi à 15h00 - 15 minutes</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Programmée</Badge>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibil">Sommeil Réparateur</h3>
                          <p className="text-sm text-gray-600">Tous les soirs à 22h30 - 45 minutes</p>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    Créer une Nouvelle Session
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Headphones className="h-5 w-5 mr-2" />
                    Statistiques d'Écoute
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{sessionStats.todaySessions}</div>
                        <div className="text-sm text-gray-600">Sessions Aujourd'hui</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{Math.floor(sessionStats.totalTime / 60)}h{sessionStats.totalTime % 60}m</div>
                        <div className="text-sm text-gray-600">Temps Total</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{sessionStats.favoriteMood}</div>
                        <div className="text-sm text-gray-600">Mood Préféré</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{sessionStats.streakDays}</div>
                        <div className="text-sm text-gray-600">Jours Consécutifs</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progression du Bien-être</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Réduction du Stress</span>
                        <span className="font-semibold">73%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Amélioration du Focus</span>
                        <span className="font-semibold">68%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Qualité du Sommeil</span>
                        <span className="font-semibold">81%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '81%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MusicPage;
