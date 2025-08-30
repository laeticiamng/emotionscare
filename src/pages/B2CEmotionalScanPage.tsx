/**
 * B2C Scan Émotionnel - Nommer sans effort
 * Pitch : Tu poses un mot sur ce que tu ressens, même sans caméra, et tu repars avec un micro-geste qui aide.
 * Boucle cœur : Selfie ou cartes abstraites → 1 étiquette + 1 micro-geste → bouton "faire maintenant".
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, Circle, Square, Triangle, Star, Hexagon, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const EmotionCards = [
  { id: 'calm', label: 'Calme', color: 'hsl(210, 40%, 70%)', icon: Circle },
  { id: 'happy', label: 'Joie', color: 'hsl(45, 80%, 70%)', icon: Star },
  { id: 'tired', label: 'Fatigue', color: 'hsl(240, 20%, 60%)', icon: Square },
  { id: 'anxious', label: 'Anxiété', color: 'hsl(25, 60%, 65%)', icon: Triangle },
  { id: 'focused', label: 'Focus', color: 'hsl(160, 50%, 65%)', icon: Hexagon },
  { id: 'confused', label: 'Confusion', color: 'hsl(290, 40%, 70%)', icon: Circle },
];

const MicroGestures = {
  calm: "3 respirations lentes, mâchoire détendue",
  happy: "Sourire et étirement des bras vers le ciel",
  tired: "Massage des tempes, 30 secondes",
  anxious: "5-4-3-2-1 ancrage (5 objets, 4 sons, 3 textures...)",
  focused: "Redresser le dos, respirer par le nez",
  confused: "Poser les mains sur le cœur, respirer profond",
};

export default function B2CEmotionalScanPage() {
  const [scanMode, setScanMode] = useState<'cards' | 'camera' | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showGesture, setShowGesture] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraEnabled(true);
      setScanMode('camera');
      // Simulation de détection - on arrête le stream immédiatement
      stream.getTracks().forEach(track => track.stop());
      setTimeout(() => {
        setSelectedEmotion('focused');
      }, 2000);
    } catch (error) {
      console.warn('Camera access denied');
      setScanMode('cards');
    }
  };

  const handleCardSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    // Micro-son tactile (vibration légère)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleStartGesture = () => {
    setShowGesture(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/20 to-background p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Scan Émotionnel
          </h1>
          <p className="text-muted-foreground text-sm">
            Nomme ce que tu ressens, reçois un micro-geste
          </p>
        </motion.div>

        {/* Mode Selection */}
        {!scanMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <Button
              onClick={handleStartCamera}
              className="w-full h-16 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
              variant="outline"
            >
              <Camera className="w-5 h-5 mr-3" />
              Selfie (détection automatique)
            </Button>
            
            <Button
              onClick={() => setScanMode('cards')}
              className="w-full h-16 bg-muted/50 hover:bg-muted/80 text-foreground"
              variant="outline"
            >
              <Heart className="w-5 h-5 mr-3" />
              Cartes abstraites (sans caméra)
            </Button>
          </motion.div>
        )}

        {/* Camera Mode */}
        {scanMode === 'camera' && !selectedEmotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-32 h-32 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-12 h-12 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground">Analyse en cours...</p>
          </motion.div>
        )}

        {/* Cards Mode */}
        {scanMode === 'cards' && !selectedEmotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-4"
          >
            {EmotionCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-transparent hover:border-primary/30"
                    style={{ backgroundColor: `${card.color}20` }}
                    onClick={() => handleCardSelect(card.id)}
                  >
                    <div className="text-center">
                      <Icon 
                        className="w-8 h-8 mx-auto mb-3" 
                        style={{ color: card.color }}
                      />
                      <p className="text-sm font-medium text-foreground">
                        {card.label}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Result & Gesture */}
        <AnimatePresence>
          {selectedEmotion && !showGesture && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <div className="mb-6">
                <p className="text-lg text-muted-foreground mb-2">Tu ressens</p>
                <h2 className="text-3xl font-semibold text-foreground capitalize">
                  {EmotionCards.find(c => c.id === selectedEmotion)?.label}
                </h2>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-3">Micro-geste suggéré</p>
                <p className="text-foreground font-medium">
                  {MicroGestures[selectedEmotion as keyof typeof MicroGestures]}
                </p>
              </div>

              <Button
                onClick={handleStartGesture}
                className="w-full h-12 bg-primary hover:bg-primary/90"
              >
                <Play className="w-4 h-4 mr-2" />
                Faire maintenant
              </Button>
            </motion.div>
          )}

          {showGesture && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-10 h-10 text-primary" />
                </motion.div>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-4">
                C'est parti !
              </h3>
              <p className="text-muted-foreground mb-6">
                {MicroGestures[selectedEmotion as keyof typeof MicroGestures]}
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSelectedEmotion(null);
                    setShowGesture(false);
                    setScanMode(null);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Nouveau scan
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}