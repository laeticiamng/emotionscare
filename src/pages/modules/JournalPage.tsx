import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Flower,
  PenTool,
  Trash2,
  Save
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { getOptimizedUniverse } from '@/data/universes/config';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { ClinicalOptIn } from '@/components/consent/ClinicalOptIn';
import { useClinicalConsent } from '@/hooks/useClinicalConsent';

interface JournalEntry {
  id: string;
  text: string;
  createdAt: Date;
  flowerColor: string;
}

const flowerColors = [
  'hsl(320, 60%, 70%)', // Rose
  'hsl(280, 50%, 65%)', // Violet
  'hsl(200, 60%, 70%)', // Bleu
  'hsl(140, 50%, 65%)', // Vert
  'hsl(40, 70%, 70%)',  // Jaune
];

const JournalPage: React.FC = () => {
  const { toast } = useToast();

  // Get optimized universe config
  const universe = getOptimizedUniverse('journal');

  // Universe state
  const [isEntering, setIsEntering] = useState(true);
  const [universeEntered, setUniverseEntered] = useState(false);

  // Journal state
  const [currentText, setCurrentText] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [savedEntry, setSavedEntry] = useState<JournalEntry | null>(null);
  const [flowerGrowth, setFlowerGrowth] = useState(0);
  const panasConsent = useClinicalConsent('PANAS');

  // Optimized animations
  const { entranceVariants, cleanupAnimation } = useOptimizedAnimation({
    enableComplexAnimations: true,
    useCSSAnimations: true,
  });

  // Handle universe entrance
  const handleUniverseEnterComplete = () => {
    setUniverseEntered(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAnimation();
    };
  }, [cleanupAnimation]);

  // Animate flower growth based on text length
  useEffect(() => {
    if (currentText.length > 0) {
      const growth = Math.min(currentText.length / 100, 1); // Max growth at 100 chars
      setFlowerGrowth(growth);
    } else {
      setFlowerGrowth(0);
    }
  }, [currentText]);

  const startWriting = () => {
    setIsWriting(true);
    setCurrentText('');
  };

  const saveEntry = () => {
    if (currentText.trim().length < 5) {
      toast({
        title: "Écris un peu plus",
        description: "Quelques mots de plus pour faire éclore ta fleur 🌸",
        variant: "destructive",
      });
      return;
    }

    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      text: currentText.trim(),
      createdAt: new Date(),
      flowerColor: flowerColors[Math.floor(Math.random() * flowerColors.length)]
    };

    setSavedEntry(entry);
    setShowReward(true);
    
    toast({
      title: "Belle expression ✨",
      description: "Tes mots se transforment en fleur lumineuse",
    });
  };

  const burnEntry = () => {
    setCurrentText('');
    setIsWriting(false);
    
    toast({
      title: "Libération douce",
      description: "Tes mots s'évaporent en poussière d'étoile ✨",
    });
  };

  const handleRewardComplete = () => {
    setShowReward(false);
    setIsWriting(false);
    setCurrentText('');
    setSavedEntry(null);
  };

  if (showReward && savedEntry) {
    return (
      <RewardSystem
        reward={{
          type: 'flower',
          name: 'Fleur de mots',
          description: universe.artifacts.description,
          moduleId: 'journal'
        }}
        badgeText="Belle expression 🌸"
        onComplete={handleRewardComplete}
      />
    );
  }

  return (
    <UniverseEngine
      universe={universe}
      isEntering={isEntering}
      onEnterComplete={handleUniverseEnterComplete}
      enableParticles={true}
      enableAmbianceSound={false}
      className="min-h-screen"
    >
      {/* Header */}
      <header className="relative z-50 p-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/app" 
            className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Retour</span>
          </Link>
          
          <div className="flex items-center space-x-2 text-foreground">
            <Flower className="h-6 w-6 text-pink-500" />
            <h1 className="text-xl font-light tracking-wide">{universe.name}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12 space-y-12">
        {panasConsent.shouldPrompt && (
          <ClinicalOptIn
            title="Activer l'humeur PANAS"
            description="Quelques mots sur vos émotions nous aident à nourrir le journal. Votre choix est mémorisé et reste modifiable dans les paramètres."
            acceptLabel="Oui, me guider"
            declineLabel="Non merci"
            onAccept={panasConsent.grantConsent}
            onDecline={panasConsent.declineConsent}
            isProcessing={panasConsent.isSaving}
            error={panasConsent.error}
            className="bg-white/10 border-white/20 backdrop-blur-md"
          />
        )}
        <AnimatePresence mode="wait">
          {!isWriting ? (
            <motion.div
              key="welcome"
              variants={entranceVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-12 text-center"
            >
              {/* Introduction */}
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{ 
                    background: `linear-gradient(135deg, ${universe.ambiance.colors.primary}, ${universe.ambiance.colors.accent})` 
                  }}
                >
                  <PenTool className="h-10 w-10 text-white" />
                </motion.div>
                
                <h2 className="text-4xl font-light text-foreground tracking-wide">
                  Jardin des Mots
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                  Écris une ligne, une pensée, un ressenti. 
                  Chaque mot que tu poses ici devient une fleur qui s'illumine dans ton jardin personnel.
                </p>
              </div>

              {/* Writing prompt */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="max-w-md mx-auto"
              >
                <Card className="bg-card/90 backdrop-blur-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="text-center space-y-4">
                      <Flower className="w-12 h-12 text-pink-500 mx-auto animate-pulse" />
                      <h3 className="text-lg font-medium">Que ressens-tu aujourd'hui ?</h3>
                      <p className="text-sm text-muted-foreground">
                        Une ligne suffit pour faire naître une fleur
                      </p>
                      <Button 
                        onClick={startWriting}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        <PenTool className="h-4 w-4 mr-2" />
                        Commencer à écrire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="writing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              {/* Writing interface */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-light text-foreground mb-2">
                  Laisse tes mots fleurir
                </h2>
                <p className="text-muted-foreground">
                  Écris ce qui te traverse l'esprit, une ligne à la fois
                </p>
              </div>

              {/* Growing flower visualization */}
              <div className="text-center mb-6">
                <motion.div
                  className="inline-block"
                  animate={{ 
                    scale: 1 + flowerGrowth * 0.5,
                    rotate: flowerGrowth * 10
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Flower 
                    className="w-16 h-16 text-pink-500"
                    style={{ 
                      opacity: 0.3 + flowerGrowth * 0.7,
                      filter: `hue-rotate(${flowerGrowth * 60}deg)` 
                    }}
                  />
                </motion.div>
                <p className="text-xs text-muted-foreground mt-2">
                  Ta fleur grandit à mesure que tu écris
                </p>
              </div>

              {/* Text area */}
              <Card className="bg-card/90 backdrop-blur-md">
                <CardContent className="p-6">
                  <Textarea
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    placeholder="Écris ici tes pensées, tes ressentis, tes rêves..."
                    className="min-h-32 border-none bg-transparent resize-none focus:ring-0 text-lg leading-relaxed"
                    autoFocus
                  />
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-xs text-muted-foreground">
                      {currentText.length} caractères
                    </span>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={burnEntry}
                        className="text-orange-500 hover:text-orange-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Brûler
                      </Button>
                      
                      <Button
                        onClick={saveEntry}
                        size="sm"
                        disabled={currentText.trim().length < 5}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Faire fleurir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Writing tips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <p className="text-xs text-muted-foreground italic">
                  "Brûler" tes mots les transforme en poussière d'étoile libératrice ✨
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </UniverseEngine>
  );
};

export default JournalPage;