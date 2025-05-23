
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Heart, Brain, Waves } from 'lucide-react';

const MusicPage: React.FC = () => {
  const musicCategories = [
    {
      title: 'Relaxation',
      description: 'Musiques apaisantes pour se détendre',
      icon: Heart,
      color: 'bg-blue-500',
      tracks: 45
    },
    {
      title: 'Concentration',
      description: 'Sons binauraux pour la productivité',
      icon: Brain,
      color: 'bg-purple-500',
      tracks: 32
    },
    {
      title: 'Méditation',
      description: 'Ambiances pour la pleine conscience',
      icon: Waves,
      color: 'bg-green-500',
      tracks: 28
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <Music className="h-16 w-16 text-purple-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Musicothérapie</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Des musiques adaptées à vos émotions pour un bien-être optimal
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {musicCategories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
                <p className="text-sm text-slate-500">{category.tracks} pistes disponibles</p>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Écouter
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Lecteur musical</CardTitle>
            <CardDescription className="text-center">
              Interface de lecture en cours de développement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-8 min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <Music className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Lecteur musical avec recommandations IA
                </p>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Démarrer la lecture
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MusicPage;
