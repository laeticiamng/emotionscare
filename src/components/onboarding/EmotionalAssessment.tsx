// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, Sparkles, Heart, Frown, Smile, Meh, 
  Zap, Moon, Brain, Wind, Cloud,
  AlertCircle, CheckCircle2, Lightbulb, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmotionalAssessmentProps {
  onContinue: () => void;
  onBack: () => void;
  onResponse: (key: string, value: any) => void;
  loading: boolean;
}

interface Emotion {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  suggestions: string[];
}

const emotions: Emotion[] = [
  { 
    id: 'joy', 
    label: 'Joie', 
    icon: Smile, 
    color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    description: 'Sentiment de bonheur et de satisfaction',
    suggestions: ['Partager cette énergie', 'Journal de gratitude', 'Activité créative']
  },
  { 
    id: 'calm', 
    label: 'Calme', 
    icon: Wind, 
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    description: 'État de tranquillité et de paix intérieure',
    suggestions: ['Méditation prolongée', 'Lecture', 'Musique douce']
  },
  { 
    id: 'focus', 
    label: 'Concentration', 
    icon: Brain, 
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    description: 'Capacité à se concentrer sur une tâche',
    suggestions: ['Deep work', 'Musique focus', 'Pomodoro']
  },
  { 
    id: 'energetic', 
    label: 'Énergie', 
    icon: Zap, 
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    description: 'Sensation de vitalité et de dynamisme',
    suggestions: ['Exercice physique', 'Projet stimulant', 'Musique motivante']
  },
  { 
    id: 'sad', 
    label: 'Tristesse', 
    icon: Frown, 
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
    description: 'Sentiment de mélancolie ou de chagrin',
    suggestions: ['Respiration profonde', 'Appeler un proche', 'Promenade']
  },
  { 
    id: 'anxiety', 
    label: 'Anxiété', 
    icon: AlertCircle, 
    color: 'text-red-500 bg-red-500/10 border-red-500/30',
    description: 'Sentiment d\'inquiétude ou de nervosité',
    suggestions: ['Exercice 4-7-8', 'Grounding', 'Sons apaisants']
  },
  { 
    id: 'stress', 
    label: 'Stress', 
    icon: Cloud, 
    color: 'text-gray-500 bg-gray-500/10 border-gray-500/30',
    description: 'Tension liée à une pression externe',
    suggestions: ['Pause de 5 min', 'Body scan', 'Marche']
  },
  { 
    id: 'tired', 
    label: 'Fatigue', 
    icon: Moon, 
    color: 'text-slate-500 bg-slate-500/10 border-slate-500/30',
    description: 'Besoin de repos et de récupération',
    suggestions: ['Micro-sieste', 'Yoga doux', 'Hydratation']
  },
  { 
    id: 'neutral', 
    label: 'Neutre', 
    icon: Meh, 
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
    description: 'État émotionnel équilibré',
    suggestions: ['Check-in corps', 'Journaling', 'Étirements']
  }
];

const contextQuestions = [
  { id: 'sleep', question: 'Qualité du sommeil', icon: Moon },
  { id: 'energy', question: 'Niveau d\'énergie', icon: Zap },
  { id: 'social', question: 'Interactions sociales', icon: Heart },
];

const EmotionalAssessment: React.FC<EmotionalAssessmentProps> = ({ 
  onContinue, 
  onBack,
  onResponse,
  loading
}) => {
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [emotionIntensity, setEmotionIntensity] = useState<number>(50);
  const [secondaryEmotions, setSecondaryEmotions] = useState<string[]>([]);
  const [contextScores, setContextScores] = useState<Record<string, number>>({
    sleep: 50,
    energy: 50,
    social: 50,
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [assessmentProgress, setAssessmentProgress] = useState(0);

  const selectedEmotionData = emotions.find(e => e.id === selectedEmotion);

  const updateProgress = () => {
    let progress = 0;
    if (selectedEmotion) progress += 40;
    if (journalEntry.length > 10) progress += 30;
    if (Object.keys(contextScores).length > 0) progress += 30;
    setAssessmentProgress(progress);
  };

  React.useEffect(() => {
    updateProgress();
  }, [selectedEmotion, journalEntry, contextScores]);

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    onResponse('primary_emotion', emotionId);
    setShowSuggestions(true);
  };

  const toggleSecondaryEmotion = (emotionId: string) => {
    if (emotionId === selectedEmotion) return;
    setSecondaryEmotions(prev => {
      const newSecondary = prev.includes(emotionId)
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId].slice(0, 2);
      onResponse('secondary_emotions', newSecondary);
      return newSecondary;
    });
  };

  const handleContextChange = (id: string, value: number) => {
    setContextScores(prev => ({
      ...prev,
      [id]: value
    }));
    onResponse(`context_${id}`, value);
  };
  
  const handleSubmit = () => {
    onResponse('emotional_assessment', {
      journal_entry: journalEntry,
      self_reported_emotion: selectedEmotion,
      self_reported_intensity: emotionIntensity,
      secondary_emotions: secondaryEmotions,
      context_scores: contextScores,
      timestamp: new Date().toISOString(),
    });
    
    onContinue();
  };

  const getIntensityLabel = () => {
    if (emotionIntensity < 30) return 'Légère';
    if (emotionIntensity < 70) return 'Modérée';
    return 'Intense';
  };

  const getIntensityColor = () => {
    if (emotionIntensity < 30) return 'text-green-500';
    if (emotionIntensity < 70) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Badge variant="secondary" className="mb-2">
            <Heart className="h-3 w-3 mr-1" />
            Profil émotionnel
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Comment vous sentez-vous ?
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Cette évaluation nous permet de personnaliser votre expérience
          </p>
          
          {/* Progress indicator */}
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Évaluation</span>
              <span>{assessmentProgress}%</span>
            </div>
            <Progress value={assessmentProgress} className="h-2" />
          </div>
        </motion.div>

        {/* Emotion Wheel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Émotion principale
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Sélectionnez l'émotion qui décrit le mieux votre état actuel
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {emotions.map((emotion) => (
                  <Tooltip key={emotion.id}>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEmotionSelect(emotion.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${emotion.color} ${
                          selectedEmotion === emotion.id 
                            ? 'ring-2 ring-primary ring-offset-2' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <emotion.icon className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium text-sm">{emotion.label}</p>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{emotion.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Suggestions based on emotion */}
        <AnimatePresence>
          {showSuggestions && selectedEmotionData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium mb-2">
                        Suggestions pour "{selectedEmotionData.label}"
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmotionData.suggestions.map((suggestion, idx) => (
                          <Badge key={idx} variant="outline" className="bg-background">
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Intensity Slider */}
        {selectedEmotion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">
                      Intensité de cette émotion
                    </Label>
                    <Badge className={getIntensityColor()}>
                      {getIntensityLabel()} ({emotionIntensity}%)
                    </Badge>
                  </div>
                  <Slider 
                    min={0} 
                    max={100}
                    step={1}
                    value={[emotionIntensity]}
                    onValueChange={(values) => {
                      setEmotionIntensity(values[0]);
                      onResponse('emotion_intensity', values[0]);
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>😌 Faible</span>
                    <span>😐 Moyenne</span>
                    <span>😰 Élevée</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Secondary Emotions */}
        {selectedEmotion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Émotions secondaires</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Optionnel: sélectionnez jusqu'à 2 autres émotions présentes
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {emotions
                    .filter(e => e.id !== selectedEmotion)
                    .map((emotion) => (
                      <Badge
                        key={emotion.id}
                        variant={secondaryEmotions.includes(emotion.id) ? 'default' : 'outline'}
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => toggleSecondaryEmotion(emotion.id)}
                      >
                        <emotion.icon className="h-3 w-3 mr-1" />
                        {emotion.label}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Context Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Contexte
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Quelques facteurs qui peuvent influencer votre humeur
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {contextQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <question.icon className="h-4 w-4 text-muted-foreground" />
                      <Label>{question.question}</Label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {contextScores[question.id]}%
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[contextScores[question.id]]}
                    onValueChange={(values) => handleContextChange(question.id, values[0])}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Journal Entry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Expression libre</CardTitle>
              <p className="text-sm text-muted-foreground">
                Optionnel: partagez vos pensées pour une analyse plus précise
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Décrivez librement ce que vous ressentez, ce qui s'est passé aujourd'hui..."
                className="min-h-24 resize-none"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Cette information reste entièrement confidentielle
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-between"
        >
          <Button variant="outline" onClick={onBack}>
            Retour
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || !selectedEmotion}
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Analyse...
              </>
            ) : (
              'Continuer'
            )}
          </Button>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default EmotionalAssessment;
