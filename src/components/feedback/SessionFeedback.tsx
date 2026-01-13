/**
 * Composant de feedback post-session enrichi
 * Collecte satisfaction, notes et émotions
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, Minus, MessageSquare, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SessionFeedbackProps {
  moduleName: string;
  sessionDuration?: number;
  score?: number;
  xpEarned?: number;
  onSubmit: (feedback: FeedbackData) => void;
  onSkip?: () => void;
}

export interface FeedbackData {
  satisfaction: 'positive' | 'neutral' | 'negative';
  rating: number; // 1-5
  comment?: string;
  emotions?: string[];
  wouldRecommend?: boolean;
}

const EMOTION_OPTIONS = [
  { id: 'relaxed', label: 'Détendu', emoji: '😌' },
  { id: 'energized', label: 'Énergisé', emoji: '⚡' },
  { id: 'focused', label: 'Concentré', emoji: '🎯' },
  { id: 'happy', label: 'Joyeux', emoji: '😊' },
  { id: 'calm', label: 'Calme', emoji: '🧘' },
  { id: 'inspired', label: 'Inspiré', emoji: '✨' },
];

export const SessionFeedback: React.FC<SessionFeedbackProps> = ({
  moduleName,
  sessionDuration,
  score,
  xpEarned,
  onSubmit,
  onSkip
}) => {
  const [step, setStep] = useState<'satisfaction' | 'rating' | 'emotions' | 'comment'>('satisfaction');
  const [satisfaction, setSatisfaction] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSatisfactionSelect = (value: 'positive' | 'neutral' | 'negative') => {
    setSatisfaction(value);
    setStep('rating');
  };

  const handleRatingSelect = (value: number) => {
    setRating(value);
    setStep('emotions');
  };

  const toggleEmotion = (emotionId: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotionId) 
        ? prev.filter(e => e !== emotionId)
        : [...prev, emotionId]
    );
  };

  const handleEmotionsContinue = () => {
    setStep('comment');
  };

  const handleSubmit = async () => {
    if (!satisfaction) return;
    
    setIsSubmitting(true);
    
    const feedbackData: FeedbackData = {
      satisfaction,
      rating: rating || 3,
      comment: comment.trim() || undefined,
      emotions: selectedEmotions.length > 0 ? selectedEmotions : undefined,
      wouldRecommend: satisfaction === 'positive' && rating >= 4
    };

    await onSubmit(feedbackData);
    setIsSubmitting(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Session terminée !</CardTitle>
        </div>
        
        {/* Session stats */}
        <div className="flex justify-center gap-4 text-sm">
          {sessionDuration !== undefined && (
            <Badge variant="secondary">
              ⏱️ {formatDuration(sessionDuration)}
            </Badge>
          )}
          {score !== undefined && (
            <Badge variant="secondary">
              🎯 {score} pts
            </Badge>
          )}
          {xpEarned !== undefined && (
            <Badge variant="outline" className="bg-primary/10">
              ✨ +{xpEarned} XP
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Quick Satisfaction */}
          {step === 'satisfaction' && (
            <motion.div
              key="satisfaction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <p className="text-center text-muted-foreground">
                Comment vous sentez-vous après cette session ?
              </p>
              
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-20 flex-col gap-2 hover:bg-green-500/10 hover:border-green-500"
                  onClick={() => handleSatisfactionSelect('positive')}
                >
                  <ThumbsUp className="h-6 w-6 text-green-500" />
                  <span className="text-sm">Bien</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-20 flex-col gap-2 hover:bg-yellow-500/10 hover:border-yellow-500"
                  onClick={() => handleSatisfactionSelect('neutral')}
                >
                  <Minus className="h-6 w-6 text-yellow-500" />
                  <span className="text-sm">Neutre</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-20 flex-col gap-2 hover:bg-red-500/10 hover:border-red-500"
                  onClick={() => handleSatisfactionSelect('negative')}
                >
                  <ThumbsDown className="h-6 w-6 text-red-500" />
                  <span className="text-sm">Difficile</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Star Rating */}
          {step === 'rating' && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <p className="text-center text-muted-foreground">
                Notez cette session de {moduleName}
              </p>
              
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleRatingSelect(star)}
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= (hoveredStar || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              <p className="text-center text-sm text-muted-foreground">
                {hoveredStar === 1 && 'À améliorer'}
                {hoveredStar === 2 && 'Passable'}
                {hoveredStar === 3 && 'Correct'}
                {hoveredStar === 4 && 'Très bien'}
                {hoveredStar === 5 && 'Excellent !'}
              </p>
            </motion.div>
          )}

          {/* Step 3: Emotions */}
          {step === 'emotions' && (
            <motion.div
              key="emotions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <p className="text-center text-muted-foreground">
                Quelles émotions ressentez-vous ? (optionnel)
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                {EMOTION_OPTIONS.map((emotion) => (
                  <Button
                    key={emotion.id}
                    variant={selectedEmotions.includes(emotion.id) ? 'default' : 'outline'}
                    size="sm"
                    className="h-auto py-3 flex-col gap-1"
                    onClick={() => toggleEmotion(emotion.id)}
                  >
                    <span className="text-xl">{emotion.emoji}</span>
                    <span className="text-xs">{emotion.label}</span>
                  </Button>
                ))}
              </div>

              <Button onClick={handleEmotionsContinue} className="w-full">
                Continuer
              </Button>
            </motion.div>
          )}

          {/* Step 4: Optional Comment */}
          {step === 'comment' && (
            <motion.div
              key="comment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">Un commentaire ? (optionnel)</span>
              </div>
              
              <Textarea
                placeholder="Partagez votre expérience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Passer
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4" />
                  Envoyer
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip option (only on first step) */}
        {step === 'satisfaction' && onSkip && (
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Passer le feedback
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionFeedback;
