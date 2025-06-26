
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Brain, Leaf, Zap, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const MusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(240); // 4 minutes

  const musicCategories = [
    {
      id: 'calm',
      name: 'Sérénité',
      icon: <Leaf className="h-5 w-5" />,
      color: 'from-green-500 to-blue-500',
      description: 'Musiques apaisantes pour la relaxation',
      tracks: [
        { title: 'Forêt Mystique', artist: 'Nature Sounds', duration: '4:30' },
        { title: 'Vagues Océaniques', artist: 'Ambient Ocean', duration: '5:15' },
        { title: 'Méditation Profonde', artist: 'Zen Master', duration: '6:00' }
      ]
    },
    {
      id: 'energy',
      name: 'Énergie',
      icon: <Zap className="h-5 w-5" />,
      color: 'from-orange-500 to-red-500',
      description: 'Musiques dynamisantes pour l\'activité',
      tracks: [
        { title: 'Réveil Matinal', artist: 'Energy Boost', duration: '3:45' },
        { title: 'Motivation Power', artist: 'Workout Music', duration: '4:20' },
        { title: 'Focus Intense', artist: 'Productivity Sounds', duration: '5:00' }
      ]
    },
    {
      id: 'focus',
      name: 'Concentration',
      icon: <Brain className="h-5 w-5" />,
      color: 'from-purple-500 to-indigo-500',
      description: 'Musiques pour améliorer la concentration',
      tracks: [
        { title: 'Ondes Alpha', artist: 'Brainwave Music', duration: '8:00' },
        { title: 'Concentration Flow', artist: 'Study Sounds', duration: '6:30' },
        { title: 'Productivité Zen', artist: 'Work Ambience', duration: '7:15' }
      ]
    },
    {
      id: 'sleep',
      name: 'Sommeil',
      icon: <Moon className="h-5 w-5" />,
      color: 'from-indigo-500 to-purple-500',
      description: 'Musiques douces pour l\'endormissement',
      tracks: [
        { title: 'Berceuse Étoilée', artist: 'Sleep Therapy', duration: '10:00' },
        { title: 'Pluie Nocturne', artist: 'Night Sounds', duration: '12:00' },
        { title: 'Rêves Paisibles', artist: 'Dream Music', duration: '9:30' }
      ]
    }
  ];

  const [activeCategory, setActiveCategory] = useState('calm');
  const currentCategory = musicCategories.find(cat => cat.id === activeCategory);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (currentCategory) {
      setCurrentTrack((prev) => (prev + 1) % currentCategory.tracks.length);
      setCurrentTime(0);
    }
  };

  const prevTrack = () => {
    if (currentCategory) {
      setCurrentTrack((prev) => (prev - 1 + currentCategory.tracks.length) % currentCategory.tracks.length);
      setCurrentTime(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Musicothérapie Adaptative
            </h1>
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez des compositions musicales personnalisées pour harmoniser votre état émotionnel
          </p>
        </motion.div>

        {/* Music Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {musicCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'ring-2 ring-purple-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Music Player */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Controls */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-purple-600" />
                  Lecteur Musical
                </CardTitle>
                <CardDescription>
                  {currentCategory?.name} - {currentCategory?.tracks[currentTrack]?.title || 'Aucun titre sélectionné'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Album Art */}
                <div className="relative mb-6">
                  <div className={`w-full h-64 rounded-xl bg-gradient-to-br ${currentCategory?.color} flex items-center justify-center mb-4`}>
                    <div className="text-center text-white">
                      <Music className="h-16 w-16 mx-auto mb-2" />
                      <p className="text-lg font-semibold">
                        {currentCategory?.tracks[currentTrack]?.title}
                      </p>
                      <p className="text-sm opacity-90">
                        {currentCategory?.tracks[currentTrack]?.artist}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevTrack}
                    className="rounded-full"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    onClick={togglePlay}
                    size="lg"
                    className="rounded-full w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextTrack}
                    className="rounded-full"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3">
                  <Volume2 className="h-4 w-4 text-gray-600" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-12">{volume[0]}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Playlist */}
          <div>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">
                  Playlist - {currentCategory?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentCategory?.tracks.map((track, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        index === currentTrack
                          ? 'bg-purple-100 border-l-4 border-purple-600'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentTrack(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{track.title}</p>
                          <p className="text-xs text-gray-600">{track.artist}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {track.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emotional Benefits */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Bienfaits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Réduction du stress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Amélioration de la concentration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Relaxation profonde</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Boost d'énergie</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
