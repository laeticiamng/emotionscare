/**
 * ScannerResults - Affichage des résultats du scan émotionnel
 * Score global, roue des émotions et recommandations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { EmotionWheel, calculateEmotionData } from './EmotionWheel';
import { ScannerAnswers } from './QuestionnaireScanner';
import { 
  Wind, BookOpen, Brain, Music, Heart, 
  TrendingUp, Calendar, RefreshCw, Sparkles,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanResult {
  score: number; // 0-100
  dominantEmotion: string;
  recommendations: Recommendation[];
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  priority: 'high' | 'medium' | 'low';
}

interface ScannerResultsProps {
  answers: ScannerAnswers;
  onNewScan: () => void;
  onViewHistory: () => void;
}

// Calculer le score de bien-être global (0-100)
const calculateWellbeingScore = (answers: ScannerAnswers): number => {
  const {
    physical_state,
    energy_level,
    sleep_quality,
    physical_tension,
    negative_thoughts,
    social_support,
    emotional_state,
  } = answers;

  // Poids des facteurs
  const weights = {
    physical: 0.15,
    energy: 0.15,
    sleep: 0.15,
    tension: 0.15, // inversé
    thoughts: 0.15, // inversé
    support: 0.15,
    emotions: 0.10,
  };

  // Scores normalisés (0-10 -> 0-100)
  const physicalScore = physical_state * 10;
  const energyScore = energy_level * 10;
  const sleepScore = sleep_quality * 10;
  const tensionScore = (11 - physical_tension) * 10; // Inversé
  const thoughtsScore = (11 - negative_thoughts) * 10; // Inversé
  const supportScore = social_support * 10;

  // Score émotionnel basé sur les émotions positives/négatives
  const positiveEmotions = ['serene', 'joyful', 'neutral'];
  const negativeEmotions = ['stressed', 'sad', 'angry', 'anxious', 'tired'];
  
  const positiveCount = emotional_state.filter(e => positiveEmotions.includes(e)).length;
  const negativeCount = emotional_state.filter(e => negativeEmotions.includes(e)).length;
  const emotionScore = emotional_state.length > 0
    ? ((positiveCount - negativeCount * 0.5) / emotional_state.length + 1) * 50
    : 50;

  const totalScore =
    physicalScore * weights.physical +
    energyScore * weights.energy +
    sleepScore * weights.sleep +
    tensionScore * weights.tension +
    thoughtsScore * weights.thoughts +
    supportScore * weights.support +
    emotionScore * weights.emotions;

  return Math.round(Math.max(0, Math.min(100, totalScore)));
};

// Déterminer l'émotion dominante
const getDominantEmotion = (answers: ScannerAnswers): string => {
  const emotionData = calculateEmotionData(answers.emotional_state, {
    physical: answers.physical_state,
    energy: answers.energy_level,
    sleep: answers.sleep_quality,
    tension: answers.physical_tension,
    thoughts: answers.negative_thoughts,
    support: answers.social_support,
  });

  return emotionData[0]?.emotion || 'neutral';
};

// Générer des recommandations personnalisées
const generateRecommendations = (answers: ScannerAnswers, score: number): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Si stress ou anxiété élevés -> respiration
  if (
    answers.emotional_state.includes('stressed') ||
    answers.emotional_state.includes('anxious') ||
    answers.physical_tension >= 7
  ) {
    recommendations.push({
      id: 'breathing',
      title: 'Exercice de respiration',
      description: 'Une séance de cohérence cardiaque pour réduire le stress',
      icon: Wind,
      link: '/app/breath',
      priority: 'high',
    });
  }

  // Si fatigue ou mauvais sommeil -> relaxation
  if (answers.energy_level <= 4 || answers.sleep_quality <= 4) {
    recommendations.push({
      id: 'relaxation',
      title: 'Séance de relaxation',
      description: 'Détends-toi avec une méditation guidée',
      icon: Heart,
      link: '/app/relaxation',
      priority: 'high',
    });
  }

  // Si pensées négatives -> journal
  if (answers.negative_thoughts >= 6) {
    recommendations.push({
      id: 'journal',
      title: 'Écriture thérapeutique',
      description: 'Exprime tes pensées dans ton journal',
      icon: BookOpen,
      link: '/app/journal',
      priority: 'medium',
    });
  }

  // Si manque de soutien social
  if (answers.social_support <= 4) {
    recommendations.push({
      id: 'community',
      title: 'Connexion sociale',
      description: 'Rejoins la communauté EmotionsCare',
      icon: Heart,
      link: '/app/community',
      priority: 'medium',
    });
  }

  // Toujours proposer la musique si score moyen
  if (score < 70) {
    recommendations.push({
      id: 'music',
      title: 'Musicothérapie',
      description: 'Écoute une playlist adaptée à ton humeur',
      icon: Music,
      link: '/app/music',
      priority: 'low',
    });
  }

  // Coach IA si score bas
  if (score < 50) {
    recommendations.push({
      id: 'coach',
      title: 'Parler au Coach IA',
      description: 'Discute avec notre assistant bien-être',
      icon: Brain,
      link: '/app/coach',
      priority: 'high',
    });
  }

  return recommendations.slice(0, 3); // Max 3 recommandations
};

const getScoreColor = (score: number): string => {
  if (score >= 70) return 'text-success';
  if (score >= 40) return 'text-warning';
  return 'text-destructive';
};

const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Bon';
  if (score >= 40) return 'Moyen';
  if (score >= 20) return 'Faible';
  return 'Préoccupant';
};

const getScoreMessage = (score: number, emotion: string): string => {
  if (score >= 70) {
    return 'Tu sembles être dans un bon état émotionnel. Continue comme ça !';
  }
  if (score >= 50) {
    return 'Quelques ajustements pourraient t\'aider à te sentir mieux.';
  }
  return 'Nous te recommandons de prendre soin de toi. Voici quelques suggestions.';
};

export const ScannerResults: React.FC<ScannerResultsProps> = ({
  answers,
  onNewScan,
  onViewHistory,
}) => {
  const score = calculateWellbeingScore(answers);
  const dominantEmotion = getDominantEmotion(answers);
  const recommendations = generateRecommendations(answers, score);

  const emotionData = calculateEmotionData(answers.emotional_state, {
    physical: answers.physical_state,
    energy: answers.energy_level,
    sleep: answers.sleep_quality,
    tension: answers.physical_tension,
    thoughts: answers.negative_thoughts,
    support: answers.social_support,
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Score global */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Score de bien-être</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div
              className={cn('text-6xl font-bold', getScoreColor(score))}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {score}
            </motion.div>
            <p className="text-lg font-medium mt-1">{getScoreLabel(score)}</p>
            <Progress value={score} className="mt-4 h-3" />
            <p className="text-sm text-muted-foreground mt-4">
              {getScoreMessage(score, dominantEmotion)}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Roue des émotions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Ton profil émotionnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmotionWheel
              emotions={emotionData}
              dominantEmotion={dominantEmotion}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommandations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recommandations personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((rec, index) => {
                const Icon = rec.icon;
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Link to={rec.link}>
                      <div className={cn(
                        'flex items-center gap-4 p-4 rounded-lg border transition-all',
                        'hover:border-primary hover:bg-primary/5 cursor-pointer',
                        rec.priority === 'high' && 'border-primary/50 bg-primary/5'
                      )}>
                        <div className={cn(
                          'p-3 rounded-lg',
                          rec.priority === 'high' ? 'bg-primary/20' : 'bg-muted'
                        )}>
                          <Icon className={cn(
                            'h-5 w-5',
                            rec.priority === 'high' ? 'text-primary' : 'text-muted-foreground'
                          )} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                        {rec.priority === 'high' && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                            Recommandé
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button onClick={onNewScan} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Nouveau scan
        </Button>
        <Button onClick={onViewHistory} variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Voir mon historique
        </Button>
      </motion.div>
    </div>
  );
};

export { calculateWellbeingScore, getDominantEmotion, generateRecommendations };
export default ScannerResults;
