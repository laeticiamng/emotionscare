
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  VolumeX, 
  Volume2, 
  Settings, 
  Headphones,
  Eye,
  Waves,
  Mountain,
  Trees,
  Sunrise,
  Moon,
  Star,
  Heart,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface VRExperience {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: 'relaxation' | 'meditation' | 'adventure' | 'healing';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  icon: React.ReactElement;
  benefits: string[];
  isActive?: boolean;
}

const VRPage: React.FC = () => {
  const [isVRActive, setIsVRActive] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<VRExperience | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [duration, setDuration] = useState(0);

  const vrExperiences: VRExperience[] = [
    {
      id: '1',
      title: 'Forêt Enchantée',
      description: 'Promenez-vous dans une forêt magique aux sons apaisants de la nature',
      duration: 15,
      category: 'relaxation',
      difficulty: 'beginner',
      thumbnail: '/images/forest-vr.jpg',
      icon: <Trees className="h-6 w-6" />,
      benefits: ['Réduction du stress', 'Connexion à la nature', 'Relaxation profonde']
    },
    {
      id: '2',
      title: 'Océan Zen',
      description: 'Méditation au bord de l\'océan avec les vagues comme guide respiratoire',
      duration: 20,
      category: 'meditation',
      difficulty: 'intermediate',
      thumbnail: '/images/ocean-vr.jpg',
      icon: <Waves className="h-6 w-6" />,
      benefits: ['Méditation guidée', 'Respiration consciente', 'Lâcher-prise']
    },
    {
      id: '3',
      title: 'Montagne Sacrée',
      description: 'Ascension spirituelle vers un temple de montagne pour la contemplation',
      duration: 25,
      category: 'meditation',
      difficulty: 'advanced',
      thumbnail: '/images/mountain-vr.jpg',
      icon: <Mountain className="h-6 w-6" />,
      benefits: ['Méditation avancée', 'Développement spirituel', 'Focus mental']
    },
    {
      id: '4',
      title: 'Aurore Boréale',
      description: 'Contemplation des aurores boréales pour une expérience transcendante',
      duration: 18,
      category: 'healing',
      difficulty: 'beginner',
      thumbnail: '/images/aurora-vr.jpg',
      icon: <Star className="h-6 w-6" />,
      benefits: ['Émerveillement', 'Guérison émotionnelle', 'Inspiration']
    },
    {
      id: '5',
      title: 'Jardin Zen',
      description: 'Espace de méditation dans un jardin japonais traditionnel',
      duration: 12,
      category: 'meditation',
      difficulty: 'beginner',
      thumbnail: '/images/zen-garden-vr.jpg',
      icon: <Sunrise className="h-6 w-6" />,
      benefits: ['Paix intérieure', 'Mindfulness', 'Clarté mentale']
    },
    {
      id: '6',
      title: 'Nuit Étoilée',
      description: 'Observation des étoiles pour une méditation cosmique profonde',
      duration: 30,
      category: 'adventure',
      difficulty: 'intermediate',
      thumbnail: '/images/starry-night-vr.jpg',
      icon: <Moon className="h-6 w-6" />,
      benefits: ['Perspective cosmique', 'Méditation profonde', 'Connexion universelle']
    }
  ];

  const categoryColors = {
    relaxation: 'bg-green-100 text-green-800',
    meditation: 'bg-purple-100 text-purple-800',
    adventure: 'bg-blue-100 text-blue-800',
    healing: 'bg-pink-100 text-pink-800'
  };

  const difficultyColors = {
    beginner: 'bg-gray-100 text-gray-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentExperience) {
      interval = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          const totalSeconds = currentExperience.duration * 60;
          setProgress((newDuration / totalSeconds) * 100);
          
          if (newDuration >= totalSeconds) {
            setIsPlaying(false);
            setProgress(100);
            toast.success('Expérience VR terminée !');
            return 0;
          }
          return newDuration;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentExperience]);

  const startExperience = (experience: VRExperience) => {
    setCurrentExperience(experience);
    setIsVRActive(true);
    setIsPlaying(true);
    setProgress(0);
    setDuration(0);
    toast.success(`Expérience "${experience.title}" démarrée !`);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast.info(isPlaying ? 'Expérience en pause' : 'Expérience reprise');
  };

  const stopExperience = () => {
    setIsVRActive(false);
    setCurrentExperience(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    toast.info('Expérience VR arrêtée');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Eye className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Réalité Virtuelle Thérapeutique
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Immergez-vous dans des environnements apaisants conçus pour votre bien-être mental et émotionnel.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* VR Player */}
          <AnimatePresence>
            {isVRActive && currentExperience && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-8"
              >
                <Card className="shadow-2xl border-0 bg-black text-white overflow-hidden">
                  <div className="relative h-96 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <motion.div
                      animate={{ 
                        scale: isPlaying ? [1, 1.05, 1] : 1,
                        rotate: isPlaying ? [0, 1, -1, 0] : 0
                      }}
                      transition={{ duration: 4, repeat: isPlaying ? Infinity : 0 }}
                      className="relative z-10 text-center"
                    >
                      <div className="mb-4">{currentExperience.icon}</div>
                      <h2 className="text-3xl font-bold mb-2">{currentExperience.title}</h2>
                      <p className="text-white/80 mb-6">{currentExperience.description}</p>
                      
                      {/* Simulation d'immersion */}
                      <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
                        <motion.div
                          animate={{ opacity: isPlaying ? [0.3, 1, 0.3] : 0.3 }}
                          transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                          className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
                        >
                          <Waves className="h-6 w-6" />
                        </motion.div>
                        <motion.div
                          animate={{ opacity: isPlaying ? [0.5, 1, 0.5] : 0.5 }}
                          transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, delay: 0.5 }}
                          className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
                        >
                          <Heart className="h-6 w-6" />
                        </motion.div>
                        <motion.div
                          animate={{ opacity: isPlaying ? [0.2, 1, 0.2] : 0.2 }}
                          transition={{ duration: 2.5, repeat: isPlaying ? Infinity : 0, delay: 1 }}
                          className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
                        >
                          <Star className="h-6 w-6" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <CardContent className="p-6 bg-gray-900">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {formatTime(duration)} / {formatTime(currentExperience.duration * 60)}
                        </span>
                        <span className="text-sm text-gray-400">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      
                      <Progress value={progress} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={togglePlayPause}
                            variant="ghost"
                            size="lg"
                            className="text-white hover:bg-white/10"
                          >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                          </Button>
                          
                          <Button
                            onClick={stopExperience}
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Arrêter
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <VolumeX className="h-4 w-4 text-gray-400" />
                            <Slider
                              value={volume}
                              onValueChange={setVolume}
                              max={100}
                              step={1}
                              className="w-20"
                            />
                            <Volume2 className="h-4 w-4 text-gray-400" />
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/10"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Experience Grid */}
          {!isVRActive && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {vrExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-t-lg flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative z-10 text-white"
                      >
                        {experience.icon}
                      </motion.div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{experience.title}</h3>
                        <Badge className={categoryColors[experience.category]}>
                          {experience.category}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {experience.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Durée:</span>
                          <span className="font-medium">{experience.duration} min</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={difficultyColors[experience.difficulty]}>
                            {experience.difficulty}
                          </Badge>
                          <Button
                            onClick={() => startExperience(experience)}
                            className="bg-indigo-500 hover:bg-indigo-600"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Commencer
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Bienfaits:</h4>
                        <div className="flex flex-wrap gap-1">
                          {experience.benefits.map((benefit, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Usage Tips */}
          {!isVRActive && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-indigo-600" />
                  Conseils pour une meilleure expérience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                      <Headphones className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Audio de qualité</h3>
                    <p className="text-sm text-gray-600">Utilisez un casque pour une immersion totale</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                      <Eye className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Environnement calme</h3>
                    <p className="text-sm text-gray-600">Trouvez un espace tranquille sans distractions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Position confortable</h3>
                    <p className="text-sm text-gray-600">Asseyez-vous ou allongez-vous confortablement</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
                      <Star className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Régularité</h3>
                    <p className="text-sm text-gray-600">Pratiquez régulièrement pour de meilleurs résultats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VRPage;
