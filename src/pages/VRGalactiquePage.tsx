
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Rocket, Star, Play, Pause, Volume2 } from 'lucide-react';
import './immersive-styles.css';

const VRGalactiquePage: React.FC = () => {
  const [isExperienceActive, setIsExperienceActive] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [ambientSound, setAmbientSound] = useState(true);

  const scenes = [
    {
      name: "Nébuleuse Émotionnelle",
      description: "Voyage à travers vos émotions dans un paysage cosmique",
      duration: "8 min",
      mood: "contemplation"
    },
    {
      name: "Constellation du Bien-être",
      description: "Connectez-vous aux étoiles pour un équilibre intérieur",
      duration: "12 min", 
      mood: "sérénité"
    },
    {
      name: "Trou Noir Libérateur",
      description: "Libérez vos tensions dans l'immensité de l'espace",
      duration: "15 min",
      mood: "libération"
    }
  ];

  const startExperience = () => {
    setIsExperienceActive(true);
  };

  const stopExperience = () => {
    setIsExperienceActive(false);
    setCurrentScene(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative overflow-hidden" data-testid="page-root">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              VR Galactique
            </h1>
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explorez l'univers de vos émotions dans une expérience de réalité virtuelle cosmique
          </p>
          <Badge variant="secondary" className="mt-4 bg-purple-500/20 text-purple-300">
            Expérience Premium VR
          </Badge>
        </motion.div>

        {!isExperienceActive ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            {scenes.map((scene, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-purple-500/30 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    {scene.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-3">{scene.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="border-purple-400 text-purple-300">
                      {scene.duration}
                    </Badge>
                    <span className="text-sm text-gray-400 capitalize">{scene.mood}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Card className="bg-black/50 backdrop-blur-md border-purple-500/50 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {scenes[currentScene].name}
                </h2>
                <div className="w-full h-2 bg-gray-700 rounded-full mb-6">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 30, ease: "linear" }}
                  />
                </div>
                <p className="text-gray-300 mb-6">{scenes[currentScene].description}</p>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={stopExperience}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/20"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Arrêter
                  </Button>
                  <Button
                    onClick={() => setAmbientSound(!ambientSound)}
                    variant="outline"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    {ambientSound ? 'Son ON' : 'Son OFF'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!isExperienceActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Button
              onClick={startExperience}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Commencer l'Expérience VR
            </Button>
            
            <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Immersion Totale</h3>
                <p className="text-gray-400 text-sm">Expérience 360° dans l'espace cosmique</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Voyage Émotionnel</h3>
                <p className="text-gray-400 text-sm">Navigation guidée à travers vos ressentis</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm">
                <Rocket className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Transformation</h3>
                <p className="text-gray-400 text-sm">Éveil de votre potentiel intérieur</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VRGalactiquePage;
