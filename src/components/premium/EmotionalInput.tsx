/**
 * EmotionalInput - Écran d'entrée émotionnelle premium
 * Espace de dépose, sélecteurs élégants, slider lisible
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface EmotionalInputProps {
  onSubmit?: (data: EmotionalData) => void;
  isLoading?: boolean;
}

interface EmotionalData {
  text: string;
  emotion: string | null;
  intensity: number;
}

// Émotions simplifiées et non-agressives
const EMOTIONS = [
  { id: 'stressed', label: 'Tendu·e', emoji: '😰', color: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800' },
  { id: 'anxious', label: 'Anxieux·se', emoji: '😟', color: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800' },
  { id: 'sad', label: 'Triste', emoji: '😢', color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' },
  { id: 'tired', label: 'Épuisé·e', emoji: '😴', color: 'bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800' },
  { id: 'overwhelmed', label: 'Submergé·e', emoji: '🌊', color: 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800' },
  { id: 'neutral', label: 'Neutre', emoji: '😐', color: 'bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800' },
];

const INTENSITY_LABELS = ['Légère', 'Modérée', 'Forte', 'Intense'];

const EmotionalInput: React.FC<EmotionalInputProps> = ({ onSubmit, isLoading = false }) => {
  const [text, setText] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(50);

  const intensityLabel = INTENSITY_LABELS[Math.floor((intensity / 100) * (INTENSITY_LABELS.length - 1))];

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit({ text, emotion: selectedEmotion, intensity });
    }
  }, [onSubmit, text, selectedEmotion, intensity]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-background to-[hsl(var(--calm-mist))] dark:to-background pb-32"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container-mobile pt-8">
        {/* Header */}
        <motion.header variants={itemVariants} className="mb-8">
          <h1 className="font-premium text-2xl font-semibold text-foreground mb-2">
            Qu'est-ce qui te traverse ?
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Exprime-toi librement. Cet espace t'appartient.
          </p>
        </motion.header>

        {/* Zone de texte - Espace de dépose */}
        <motion.div variants={itemVariants} className="mb-8">
          <label className="block text-sm font-medium text-foreground mb-3">
            Dépose tes mots ici
          </label>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ce que tu ressens, ce qui te pèse, ce qui tourne dans ta tête..."
              className="textarea-emotional w-full min-h-[160px] resize-none"
              maxLength={1000}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground/50">
              {text.length}/1000
            </div>
          </div>
          
          {/* Microcopy rassurant */}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground/70">
            <Lock className="h-3 w-3" />
            <span>Ces mots restent confidentiels et ne sont jamais partagés.</span>
          </div>
        </motion.div>

        {/* Sélection d'émotion */}
        <motion.div variants={itemVariants} className="mb-8">
          <label className="block text-sm font-medium text-foreground mb-3">
            Comment te sens-tu ?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => setSelectedEmotion(emotion.id === selectedEmotion ? null : emotion.id)}
                className={`
                  relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200
                  ${emotion.color}
                  ${selectedEmotion === emotion.id 
                    ? 'ring-2 ring-primary ring-offset-2 scale-[1.02]' 
                    : 'hover:scale-[1.01]'
                  }
                `}
                type="button"
              >
                <span className="text-xl" role="img" aria-label={emotion.label}>
                  {emotion.emoji}
                </span>
                <span className="text-xs font-medium text-foreground/80">
                  {emotion.label}
                </span>
                
                <AnimatePresence>
                  {selectedEmotion === emotion.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                    >
                      <ChevronRight className="h-3 w-3 text-primary-foreground rotate-90" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Slider d'intensité */}
        <AnimatePresence>
          {selectedEmotion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="p-5 bg-card rounded-2xl border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-foreground">
                    Intensité du ressenti
                  </label>
                  <span className="text-sm font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">
                    {intensityLabel}
                  </span>
                </div>
                
                <Slider
                  value={[intensity]}
                  onValueChange={([value]) => setIntensity(value)}
                  max={100}
                  step={1}
                  className="w-full"
                  aria-label="Intensité de l'émotion"
                />
                
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Légère</span>
                  <span>Intense</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      <div className="bottom-bar-mobile px-4 pt-4 pb-2">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          size="lg"
          className="w-full h-14 text-base font-medium rounded-2xl shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <motion.div
                className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Analyse en cours...
            </span>
          ) : (
            'Analyser mon état'
          )}
        </Button>
        
        <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground/60">
          <Shield className="h-3 w-3" />
          <span>Analyse bienveillante, sans jugement</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionalInput;
