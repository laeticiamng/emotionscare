import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssessmentExperience } from '@/components/assess/AssessmentExperience';
import { useAssessmentIntegration } from '@/hooks/useAssessmentIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wind, Brain, Heart, Sparkles, Play, Pause, RotateCcw } from 'lucide-react';

export function NyveePageEnhanced() {
  const [sessionPhase, setSessionPhase] = useState<'pre-assess' | 'cocon' | 'post-assess' | 'complete'>('pre-assess');
  const [coconProgress, setCoconProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [preAssessmentBadge, setPreAssessmentBadge] = useState<string | null>(null);
  const [showGroundingTechnique, setShowGroundingTechnique] = useState(false);

  const preAssess = useAssessmentIntegration({
    instrument: 'STAI6',
    context: 'pre',
    onBadgeUpdate: (badge, hints) => {
      setPreAssessmentBadge(badge);
      console.log('Badge pré-cocon:', badge, hints);
    }
  });

  const postAssess = useAssessmentIntegration({
    instrument: 'STAI6', 
    context: 'post',
    onBadgeUpdate: (badge, hints) => {
      console.log('Badge post-cocon:', badge, hints);
      
      // Logique post-assessment
      if (badge.includes('diminution') || badge.includes('calme')) {
        // Anxiété diminuée - suggérer des techniques d'ancrage
        setShowGroundingTechnique(true);
      } else {
        // Pas d'amélioration - proposer la technique 5-4-3-2-1
        setShowGroundingTechnique(false);
      }
    }
  });

  // Simulation de session cocon
  useEffect(() => {
    if (sessionPhase === 'cocon' && isPlaying) {
      const interval = setInterval(() => {
        setCoconProgress(prev => {
          if (prev >= 100) {
            setSessionPhase('post-assess');
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 150); // 15 secondes pour la démo

      return () => clearInterval(interval);
    }
  }, [sessionPhase, isPlaying]);

  const handlePreAssessmentComplete = () => {
    setSessionPhase('cocon');
  };

  const handlePostAssessmentComplete = () => {
    setSessionPhase('complete');
  };

  const startCocon = () => {
    setIsPlaying(true);
  };

  const pauseCocon = () => {
    setIsPlaying(false);
  };

  const restart = () => {
    setSessionPhase('pre-assess');
    setCoconProgress(0);
    setIsPlaying(false);
    setPreAssessmentBadge(null);
    setShowGroundingTechnique(false);
  };

  if (sessionPhase === 'pre-assess' && preAssess.shouldShow && preAssess.isEnabled) {
    return (
      <AssessmentExperience
        instrument="STAI6"
        title="Évaluation Pré-Cocon"
        description="Avant de commencer votre session de relaxation, évaluons votre niveau d'anxiété actuel."
        context="pre"
        theme="calm"
        onComplete={handlePreAssessmentComplete}
        immersive={true}
      />
    );
  }

  if (sessionPhase === 'post-assess') {
    return (
      <AssessmentExperience
        instrument="STAI6"
        title="Évaluation Post-Cocon"
        description="Comment vous sentez-vous après cette session de relaxation ?"
        context="post"
        theme="calm"
        onComplete={handlePostAssessmentComplete}
        immersive={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 dark:from-blue-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
      {/* Header */}
      <motion.div 
        className="p-6 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mb-4">
          <Wind className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Nyvée - Cocon de Sérénité</h1>
        
        {preAssessmentBadge && (
          <Badge variant="outline" className="mb-4">
            État initial: {preAssessmentBadge}
          </Badge>
        )}
      </motion.div>

      <div className="p-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {sessionPhase === 'cocon' && (
            <motion.div
              key="cocon"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="space-y-8"
            >
              {/* Visualisation du cocon */}
              <div className="relative">
                <motion.div
                  className="w-80 h-80 mx-auto rounded-full bg-gradient-to-br from-blue-200 to-teal-200 dark:from-blue-800 dark:to-teal-800 flex items-center justify-center relative overflow-hidden"
                  animate={isPlaying ? {
                    scale: [1, 1.02, 1],
                    rotate: [0, 1, 0]
                  } : {}}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Particules flottantes */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white/30 rounded-full"
                      style={{
                        left: `${20 + (i * 5)}%`,
                        top: `${30 + Math.sin(i) * 20}%`
                      }}
                      animate={isPlaying ? {
                        y: [-10, 10, -10],
                        opacity: [0.3, 0.8, 0.3]
                      } : {}}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}

                  <div className="text-center z-10">
                    <Brain className="w-12 h-12 text-white/80 mx-auto mb-4" />
                    <p className="text-white/90 text-lg font-medium">
                      {isPlaying ? 'Détente en cours...' : 'Prêt à commencer'}
                    </p>
                  </div>
                </motion.div>

                {/* Contrôles */}
                <div className="text-center mt-8 space-y-4">
                  <Progress value={coconProgress} className="w-64 mx-auto h-3" />
                  <p className="text-sm text-muted-foreground">
                    Progression: {Math.round(coconProgress)}%
                  </p>

                  <div className="flex justify-center gap-4">
                    {!isPlaying ? (
                      <Button
                        onClick={startCocon}
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        {coconProgress === 0 ? 'Commencer' : 'Reprendre'}
                      </Button>
                    ) : (
                      <Button
                        onClick={pauseCocon}
                        size="lg"
                        variant="outline"
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </Button>
                    )}

                    <Button
                      onClick={restart}
                      size="lg"
                      variant="outline"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Recommencer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Instructions respiratoires */}
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-center">Guide Respiratoire</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <motion.div
                    animate={isPlaying ? {
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7]
                    } : {}}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <p className="text-lg">
                      {isPlaying ? 'Inspirez... Expirez...' : 'Préparez-vous à respirer'}
                    </p>
                  </motion.div>
                  
                  <p className="text-sm text-muted-foreground">
                    Suivez le rythme visuel et laissez-vous porter par la détente
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {sessionPhase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
                Session Terminée !
              </h2>

              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Félicitations ! Vous avez terminé votre session de cocon Nyvée.
              </p>

              {/* Recommandations post-session */}
              {showGroundingTechnique ? (
                <Card className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <CardHeader>
                    <CardTitle className="text-center text-green-700 dark:text-green-400">
                      Techniques d'Ancrage Recommandées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm mb-4">
                      Votre relaxation s'est bien passée ! Explorez nos techniques de silence et d'ancrage.
                    </p>
                    <Button variant="outline" className="border-green-200">
                      Découvrir les techniques
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20">
                  <CardHeader>
                    <CardTitle className="text-center text-blue-700 dark:text-blue-400">
                      Technique 5-4-3-2-1
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm mb-4">
                      Continuons avec une technique d'ancrage sensoriel pour prolonger la détente.
                    </p>
                    <Button variant="outline" className="border-blue-200">
                      Essayer 5-4-3-2-1
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={restart}
                size="lg"
                variant="outline"
                className="mt-8"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Nouvelle Session
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}