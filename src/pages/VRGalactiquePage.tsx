
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Rocket, Stars, Globe, Play, Pause, Volume2 } from 'lucide-react';

const VRGalactiquePage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(0);

  const experiences = [
    {
      title: "Voyage vers les Étoiles",
      description: "Explorez les confins de l'univers dans une expérience méditative unique",
      duration: "25 min",
      difficulty: "Débutant",
      theme: "Exploration"
    },
    {
      title: "Nébuleuse Apaisante",
      description: "Flottez parmi les nuages cosmiques pour une relaxation profonde",
      duration: "30 min",
      difficulty: "Intermédiaire",
      theme: "Relaxation"
    },
    {
      title: "Station Spatiale Zen",
      description: "Méditez en apesanteur avec une vue imprenable sur la Terre",
      duration: "20 min",
      difficulty: "Avancé",
      theme: "Méditation"
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Rocket className="h-12 w-12 text-purple-400 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              VR Galactique
            </h1>
            <Stars className="h-12 w-12 text-purple-400 ml-4" />
          </div>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Voyagez à travers l'univers pour une expérience de bien-être cosmique unique
          </p>
        </motion.div>

        {/* Contrôles de lecture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-4"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <div className="text-center">
                  <p className="text-sm text-purple-300">État actuel</p>
                  <p className="font-semibold">{isPlaying ? "En cours" : "En pause"}</p>
                </div>
                <Volume2 className="h-6 w-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expériences disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`bg-black/40 border-purple-500/30 backdrop-blur-lg cursor-pointer transition-all hover:border-purple-400/50 ${
                  selectedExperience === index ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedExperience(index)}
              >
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    {exp.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                      {exp.duration}
                    </Badge>
                    <Badge variant="secondary" className="bg-pink-600/20 text-pink-300">
                      {exp.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="bg-indigo-600/20 text-indigo-300">
                      {exp.theme}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Separator className="bg-purple-500/30 my-8" />

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Commencer l'Expérience
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-purple-500 text-purple-300 hover:bg-purple-600/20"
            >
              Personnaliser
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VRGalactiquePage;
