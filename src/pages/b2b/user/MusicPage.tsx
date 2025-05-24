
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Music, Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const MusicPage: React.FC = () => {
  const navigate = useNavigate();

  const playlists = [
    {
      title: 'Focus Productif',
      description: 'Musique pour la concentration',
      tracks: 24,
      duration: '1h 32min',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Détente Bureau',
      description: 'Sons apaisants pour réduire le stress',
      tracks: 18,
      duration: '58min',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Énergie Matinale',
      description: 'Boost pour commencer la journée',
      tracks: 15,
      duration: '45min',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Pause Créative',
      description: 'Stimulez votre créativité',
      tracks: 20,
      duration: '1h 15min',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/b2b/user/dashboard')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Music className="h-12 w-12 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Musicothérapie Professionnelle
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Musique adaptée à votre environnement de travail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {playlists.map((playlist, index) => (
              <motion.div
                key={playlist.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${playlist.color} mr-3`} />
                          {playlist.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {playlist.description}
                        </CardDescription>
                      </div>
                      <Button size="sm" variant="ghost" className="text-purple-500">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{playlist.tracks} pistes</span>
                      <span>{playlist.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Music className="mr-3 h-6 w-6" />
                Lecteur Audio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-medium">Aucune piste en cours</p>
                  <p className="text-purple-100">Sélectionnez une playlist pour commencer</p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <SkipForward className="h-5 w-5 rotate-180" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Play className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4" />
                  <div className="flex-1 bg-white/20 h-1 rounded-full">
                    <div className="bg-white h-1 rounded-full w-2/3"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MusicPage;
