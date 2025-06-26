
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import EnhancedMusicVisualizer from '@/components/music/EnhancedMusicVisualizer';

const MusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [mood, setMood] = useState('calm');

  const playlists = [
    {
      id: 'calm',
      name: 'Détente & Sérénité',
      description: 'Musiques apaisantes pour la relaxation',
      mood: 'calm',
      color: 'bg-blue-500',
      tracks: ['Océan Paisible', 'Forêt Enchantée', 'Méditation Douce']
    },
    {
      id: 'energetic',
      name: 'Énergie & Motivation',
      description: 'Rythmes entraînants pour se dynamiser',
      mood: 'energetic',
      color: 'bg-red-500',
      tracks: ['Réveil Matinal', 'Force Intérieure', 'Élan Créatif']
    },
    {
      id: 'focus',
      name: 'Concentration & Focus',
      description: 'Sons pour améliorer la productivité',
      mood: 'focus',
      color: 'bg-green-500',
      tracks: ['Ondes Binaurales', 'Pluie Douce', 'Café Studieux']
    },
    {
      id: 'happy',
      name: 'Joie & Bonheur',
      description: 'Mélodies pour égayer votre journée',
      mood: 'happy',
      color: 'bg-yellow-500',
      tracks: ['Sourire du Matin', 'Danse des Émotions', 'Rayons de Soleil']
    }
  ];

  const currentPlaylist = playlists.find(p => p.mood === mood) || playlists[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
            <Music className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Musicothérapie Adaptative
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Musique personnalisée basée sur votre état émotionnel
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Music Player */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-purple-500" />
                    Lecture en cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                      <Music className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">
                      {currentPlaylist.tracks[currentTrack]}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentPlaylist.name}
                    </p>
                  </div>

                  {/* Visualizer */}
                  <div className="mb-6">
                    <EnhancedMusicVisualizer
                      intensity={0.7}
                      volume={isPlaying ? 0.6 : 0}
                      height={120}
                      showControls={true}
                      mood={mood}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Button variant="outline" size="icon">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <Button variant="outline" size="icon">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>2:34</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-1/3"></div>
                    </div>
                    <span>5:42</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Playlist */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Playlist actuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentPlaylist.tracks.map((track, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          index === currentTrack 
                            ? 'bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setCurrentTrack(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${index === currentTrack ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                            <span className={index === currentTrack ? 'font-semibold text-purple-700 dark:text-purple-300' : ''}>{track}</span>
                          </div>
                          {index === currentTrack && (
                            <div className="flex items-center gap-1 text-purple-500">
                              <Volume2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Mood Selection */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-green-500" />
                    Choisir votre humeur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {playlists.map((playlist) => (
                      <div
                        key={playlist.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          mood === playlist.mood
                            ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setMood(playlist.mood)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-4 h-4 rounded-full ${playlist.color}`}></div>
                          <h4 className="font-medium">{playlist.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{playlist.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emotional State */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>État émotionnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl mb-2">😌</div>
                    <p className="font-semibold text-lg mb-1">Détendu</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Musique adaptée à votre état
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Scanner à nouveau
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
