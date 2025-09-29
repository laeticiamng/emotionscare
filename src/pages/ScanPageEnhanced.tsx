import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssessmentExperience } from '@/components/assess/AssessmentExperience';
import { useAssessmentIntegration } from '@/hooks/useAssessmentIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Meh, Frown, Zap, Wind, Heart, Sparkles, Activity } from 'lucide-react';

export function ScanPageEnhanced() {
  const [showAssessment, setShowAssessment] = useState(false);
  const [currentMood, setCurrentMood] = useState<{valence: number, arousal: number} | null>(null);
  const [uiColor, setUiColor] = useState('from-blue-500 to-purple-500');
  const [microGesture, setMicroGesture] = useState<string | null>(null);

  const { isEnabled, shouldShow, currentBadge, triggerAssessment } = useAssessmentIntegration({
    instrument: 'SAM',
    context: 'adhoc',
    onBadgeUpdate: (badge, hints) => {
      console.log('Badge SAM mis à jour:', badge, hints);
      
      // Publier un événement pour colorer l'UI
      const event = new CustomEvent('mood.updated', {
        detail: { badge, hints }
      });
      window.dispatchEvent(event);
      
      // Adapter la couleur de l'UI
      if (badge.includes('rayonnante') || badge.includes('positive')) {
        setUiColor('from-yellow-400 to-orange-500');
        setMicroGesture('Prenez une inspiration profonde et souriez');
      } else if (badge.includes('soutenir') || badge.includes('négative')) {
        setUiColor('from-blue-400 to-teal-500');
        setMicroGesture('Faites une expiration longue et douce');
      } else {
        setUiColor('from-green-400 to-blue-500');
        setMicroGesture('Respirez naturellement, vous êtes en équilibre');
      }
    }
  });

  // Écouter les événements de mood pour adapter l'interface
  useEffect(() => {
    const handleMoodUpdate = (event: CustomEvent) => {
      const { badge, hints } = event.detail;
      console.log('Interface adaptée au mood:', badge);
      
      // Adapter d'autres éléments de l'interface selon le mood
      const body = document.body;
      body.classList.remove('mood-positive', 'mood-negative', 'mood-neutral');
      
      if (badge.includes('rayonnante')) {
        body.classList.add('mood-positive');
      } else if (badge.includes('soutenir')) {
        body.classList.add('mood-negative');
      } else {
        body.classList.add('mood-neutral');
      }
    };

    window.addEventListener('mood.updated', handleMoodUpdate as EventListener);
    return () => window.removeEventListener('mood.updated', handleMoodUpdate as EventListener);
  }, []);

  const handleStartScan = () => {
    setShowAssessment(true);
  };

  const handleAssessmentComplete = () => {
    setShowAssessment(false);
  };

  if (showAssessment) {
    return (
      <AssessmentExperience
        instrument="SAM"
        title="Scan Émotionnel Instantané"
        description="Évaluez votre état émotionnel actuel avec nos pictos visuels. Cette évaluation instantanée nous aide à adapter l'expérience."
        context="adhoc"
        theme="creative"
        onComplete={handleAssessmentComplete}
        immersive={true}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${uiColor.replace('from-', 'from-').replace('to-', 'to-')}/10 transition-all duration-1000`}>
      {/* Header */}
      <motion.div 
        className="p-6 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${uiColor} rounded-full mb-4 transition-all duration-500`}>
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Scan Émotionnel</h1>
        <p className="text-muted-foreground">Évaluez votre état du moment</p>
        
        {currentBadge && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 mt-4"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <Badge variant="outline" className="px-3 py-1">
              {currentBadge}
            </Badge>
          </motion.div>
        )}
      </motion.div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Bouton de scan principal */}
        {isEnabled && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <Card className="max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-2 border-white/20">
              <CardHeader className="text-center">
                <div className={`mx-auto w-20 h-20 bg-gradient-to-r ${uiColor} rounded-full flex items-center justify-center mb-4 transition-all duration-500`}>
                  <Activity className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl">Scan Instantané</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Évaluez votre humeur et votre niveau d'énergie en temps réel
                </p>
                
                {/* Pictos d'aperçu */}
                <div className="flex justify-center gap-4 py-4">
                  <motion.div
                    className="text-2xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    😊
                  </motion.div>
                  <motion.div
                    className="text-2xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      y: [0, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    ⚡
                  </motion.div>
                  <motion.div
                    className="text-2xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    😌
                  </motion.div>
                </div>

                <Button 
                  onClick={handleStartScan}
                  size="lg"
                  className={`bg-gradient-to-r ${uiColor} hover:opacity-90 text-white transition-all duration-300`}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Commencer le Scan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Micro-geste adaptatif */}
        <AnimatePresence>
          {microGesture && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-center"
            >
              <Card className="max-w-md mx-auto bg-gradient-to-br from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-800/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
                    <Wind className="w-5 h-5" />
                    Micro-Geste Recommandé
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm mb-4">{microGesture}</p>
                  <div className="flex justify-center">
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-r ${uiColor} rounded-full flex items-center justify-center`}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Wind className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Historique récent */}
        {currentBadge && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-center">État Actuel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge 
                    variant="outline" 
                    className="text-lg px-4 py-2 mb-4"
                  >
                    {currentBadge}
                  </Badge>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Smile className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <p className="text-xs text-muted-foreground">Plaisir</p>
                    </div>
                    <div className="text-center">
                      <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <p className="text-xs text-muted-foreground">Énergie</p>
                    </div>
                    <div className="text-center">
                      <Wind className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-xs text-muted-foreground">Calme</p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={handleStartScan}
                    variant="outline"
                    size="sm"
                  >
                    Nouveau Scan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}