/**
 * B2C Coach IA Premium - La décision micro
 * Pitch : Une phrase claire et une carte 1-minute quand tu n'as plus d'énergie pour décider.
 * Boucle cœur : Question → réponse ≤ 7 mots → carte 1-minute (3 pas) → "fait / plus tard".
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Lightbulb, CheckCircle, Clock, Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useOpenAI } from '@/hooks/useOpenAI';

interface MicroCard {
  id: string;
  title: string;
  steps: string[];
  duration: string;
  type: 'ancrage' | 'compassion' | 'defusion';
}

const MicroCardTemplates: MicroCard[] = [
  {
    id: 'ancrage-1',
    title: 'Ancrage 5-4-3',
    steps: [
      '5 choses que tu vois',
      '4 choses que tu touches',
      '3 choses que tu entends'
    ],
    duration: '60s',
    type: 'ancrage'
  },
  {
    id: 'compassion-1',
    title: 'Douceur express',
    steps: [
      'Main sur le cœur',
      '"Je fais de mon mieux"',
      'Respiration bienveillante'
    ],
    duration: '45s',
    type: 'compassion'
  },
  {
    id: 'defusion-1',
    title: 'Observateur curieux',
    steps: [
      'Observer la pensée',
      '"C\'est juste une pensée"',
      'Revenir au présent'
    ],
    duration: '30s',
    type: 'defusion'
  }
];

export default function B2CAICoachMicroPage() {
  const [question, setQuestion] = useState('');
  const [shortAnswer, setShortAnswer] = useState('');
  const [microCard, setMicroCard] = useState<MicroCard | null>(null);
  const [cardCompleted, setCardCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInSession, setIsInSession] = useState(false);
  
  const { generateText, isLoading } = useOpenAI();

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;

    const prompt = `
Tu es un coach IA bienveillant. L'utilisateur te pose cette question : "${question}"

Réponds en MAXIMUM 7 mots, puis suggère un type de micro-pratique.

Format de réponse :
REPONSE: [ta réponse courte ≤7 mots]
TYPE: [ancrage|compassion|defusion]

Exemples :
- Si stress/anxiété → ancrage
- Si auto-critique → compassion  
- Si rumination → defusion

Sois direct, bienveillant, sans jargon.
`;

    try {
      const response = await generateText({ prompt });
      if (!response) return;

      const reponseMatch = response.match(/REPONSE:\s*(.+)/);
      const typeMatch = response.match(/TYPE:\s*(ancrage|compassion|defusion)/);

      if (reponseMatch) {
        setShortAnswer(reponseMatch[1].trim());
      }

      if (typeMatch) {
        const type = typeMatch[1] as 'ancrage' | 'compassion' | 'defusion';
        const template = MicroCardTemplates.find(t => t.type === type) || MicroCardTemplates[0];
        setMicroCard(template);
      }
    } catch (error) {
      console.error('Erreur coach IA:', error);
      setShortAnswer('Respire, un pas à la fois');
      setMicroCard(MicroCardTemplates[0]);
    }
  };

  const handleStartCard = () => {
    setIsInSession(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (microCard && currentStep < microCard.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsInSession(false);
      setCardCompleted(true);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setShortAnswer('');
    setMicroCard(null);
    setCardCompleted(false);
    setCurrentStep(0);
    setIsInSession(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Coach IA
          </h1>
          <p className="text-muted-foreground text-sm">
            La décision micro en 7 mots ou moins
          </p>
        </motion.div>

        {/* Question Input */}
        {!shortAnswer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="relative">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Pose ta question en quelques mots..."
                className="pr-12"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuestion()}
              />
              <Button
                onClick={handleSubmitQuestion}
                disabled={!question.trim() || isLoading}
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {isLoading && (
              <div className="text-center text-muted-foreground text-sm">
                Réflexion...
              </div>
            )}
          </motion.div>
        )}

        {/* Short Answer */}
        <AnimatePresence>
          {shortAnswer && !isInSession && !cardCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-primary/10 border-primary/30">
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <p className="text-lg font-medium text-foreground">
                    {shortAnswer}
                  </p>
                </div>
              </Card>

              {microCard && (
                <Card className="p-6">
                  <div className="text-center">
                    <Lightbulb className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {microCard.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Carte {microCard.duration} • {microCard.steps.length} étapes
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {microCard.steps.map((step, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {index + 1}. {step}
                        </div>
                      ))}
                    </div>

                    <Button onClick={handleStartCard} className="w-full">
                      Commencer la carte
                    </Button>
                  </div>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Session */}
        <AnimatePresence>
          {isInSession && microCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-2xl font-bold text-primary">
                      {currentStep + 1}
                    </span>
                  </motion.div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {microCard.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Étape {currentStep + 1} sur {microCard.steps.length}
                </p>
              </div>

              <Card className="p-8 mb-6 bg-gradient-to-br from-primary/10 to-primary/20">
                <p className="text-lg text-foreground font-medium">
                  {microCard.steps[currentStep]}
                </p>
              </Card>

              <Button
                onClick={handleNextStep}
                size="lg"
                className="w-full h-12"
              >
                {currentStep < microCard.steps.length - 1 ? 'Étape suivante' : 'Terminer'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion */}
        <AnimatePresence>
          {cardCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Bien joué !
              </h3>
              <p className="text-muted-foreground mb-6">
                Tu veux aplanir avec 60s de respiration ?
              </p>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Clock className="w-4 h-4 mr-2" />
                  60s de respiration
                </Button>
                
                <Button onClick={handleReset} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Nouvelle question
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}