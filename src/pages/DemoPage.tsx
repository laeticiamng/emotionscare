import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Pause, RotateCcw, Brain, Heart, Music, 
  Zap, Users, Trophy, Sparkles, ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDemo, setCurrentDemo] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const demoFeatures = [
    {
      id: 'emotional-ai',
      title: 'Scanner Émotionnel IA',
      description: 'Analysez vos émotions en temps réel avec notre IA avancée',
      icon: Brain,
      color: 'text-purple-500',
      simulation: 'Simulation d\'analyse émotionnelle...',
      result: 'Émotion détectée: Curiosité (85% de confiance)'
    },
    {
      id: 'music-therapy',
      title: 'Musicothérapie Adaptive',
      description: 'Musique personnalisée selon votre état émotionnel',
      icon: Music,
      color: 'text-green-500',
      simulation: 'Génération de playlist personnalisée...',
      result: 'Playlist "Détente Focus" créée avec 12 pistes'
    },
    {
      id: 'biometric-sync',
      title: 'Synchronisation Biométrique',
      description: 'Connexion avec vos appareils de santé',
      icon: Heart,
      color: 'text-red-500',
      simulation: 'Synchronisation des données biométriques...',
      result: 'Rythme cardiaque: 72 BPM | Stress: Faible'
    },
    {
      id: 'gamification',
      title: 'Gamification du Bien-être',
      description: 'Transformez votre développement personnel en jeu',
      icon: Trophy,
      color: 'text-yellow-500',
      simulation: 'Calcul des points d\'expérience...',
      result: 'Niveau 15 atteint! +250 XP | Nouveau badge débloqué'
    }
  ];

  const handleStartDemo = () => {
    setIsPlaying(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          toast({
            title: "Démo terminée!",
            description: demoFeatures[currentDemo].result,
            duration: 4000
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleResetDemo = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const handleNextDemo = () => {
    if (currentDemo < demoFeatures.length - 1) {
      setCurrentDemo(currentDemo + 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handlePrevDemo = () => {
    if (currentDemo > 0) {
      setCurrentDemo(currentDemo - 1);
      setProgress(0);  
      setIsPlaying(false);
    }
  };

  const currentFeature = demoFeatures[currentDemo];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl border border-primary/20">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Démo Interactive
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Découvrez les fonctionnalités d'EmotionsCare en action
          </p>
        </motion.div>

        {/* Demo Navigation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center space-x-2 bg-black/20 rounded-full p-2 backdrop-blur-xl">
            {demoFeatures.map((feature, index) => (
              <Button
                key={feature.id}
                variant={currentDemo === index ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentDemo(index)}
                className={`rounded-full ${currentDemo === index ? 'bg-primary' : 'text-white hover:bg-white/10'}`}
              >
                <feature.icon className="h-4 w-4 mr-2" />
                {index + 1}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Main Demo Card */}
        <motion.div
          key={currentDemo}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20">
            <CardHeader className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center ${currentFeature.color}`}>
                <currentFeature.icon className="h-10 w-10" />
              </div>
              
              <CardTitle className="text-3xl text-white mb-2">
                {currentFeature.title}
              </CardTitle>
              <p className="text-purple-200 text-lg">
                {currentFeature.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Progress Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-white">
                  <span>{isPlaying ? currentFeature.simulation : 'Prêt à démarrer'}</span>
                  <Badge variant="outline" className="text-white border-white/30">
                    {progress}%
                  </Badge>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleStartDemo}
                  disabled={isPlaying}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isPlaying ? 'En cours...' : 'Démarrer la démo'}
                </Button>
                
                <Button
                  onClick={handleResetDemo}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  onClick={handlePrevDemo}
                  disabled={currentDemo === 0}
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  ← Précédent
                </Button>
                
                <div className="text-white text-sm">
                  {currentDemo + 1} / {demoFeatures.length}
                </div>
                
                <Button
                  onClick={handleNextDemo}
                  disabled={currentDemo === demoFeatures.length - 1}
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  Suivant →
                </Button>
              </div>

              {/* Result Display */}
              {progress === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center"
                >
                  <p className="text-green-300 font-medium">
                    {currentFeature.result}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">
              Prêt à commencer votre parcours ?
            </h3>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => navigate('/choose-mode')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
              >
                <Zap className="mr-2 h-5 w-5" />
                Commencer maintenant
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoPage;