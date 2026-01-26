// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, CheckCircle2, Music, LineChart, Share2,
  Trophy, Flame, Target, Download, Sparkles, ArrowRight,
  Heart, Wind, BookOpen, Calendar, Gift, Zap, Award, Copy
} from 'lucide-react';
import MoodBasedRecommendations from '@/components/music/MoodBasedRecommendations';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CompletionSectionProps {
  onFinish: () => void;
  onBack: () => void;
  emotion: string;
  responses: Record<string, any>;
  loading: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  xp: number;
  duration: string;
}

const firstChallenges: Challenge[] = [
  {
    id: 'breathing',
    title: 'Premier souffle',
    description: 'Complétez un exercice de respiration',
    icon: Wind,
    xp: 50,
    duration: '5 min'
  },
  {
    id: 'journal',
    title: 'Première réflexion',
    description: 'Écrivez votre première entrée de journal',
    icon: BookOpen,
    xp: 50,
    duration: '10 min'
  },
  {
    id: 'music',
    title: 'Première écoute',
    description: 'Écoutez une playlist personnalisée',
    icon: Music,
    xp: 30,
    duration: '15 min'
  },
  {
    id: 'checkin',
    title: 'Premier check-in',
    description: 'Faites un scan émotionnel complet',
    icon: Heart,
    xp: 40,
    duration: '3 min'
  },
];

const emotionEmojis: Record<string, string> = {
  joy: '😊',
  calm: '😌',
  focus: '🎯',
  energetic: '⚡',
  sad: '😔',
  anxiety: '😰',
  stress: '😓',
  tired: '😴',
  neutral: '😐',
};

const CompletionSection: React.FC<CompletionSectionProps> = ({
  onFinish,
  onBack,
  emotion,
  responses,
  loading
}) => {
  const { toast } = useToast();
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const features = responses.selected_features || [];
  const preferences = responses.personalization_preferences || {};
  const wellnessGoals = responses.wellness_goals || [];
  const preferredActivities = responses.preferred_activities || [];

  // Trigger celebration on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCelebration(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#4CAF50', '#2196F3', '#9C27B0'],
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  const getSummary = () => {
    switch (emotion) {
      case 'joy':
      case 'energetic':
        return "Votre profil énergique suggère une excellente disposition pour explorer pleinement les fonctionnalités d'EmotionsCare !";
      case 'calm':
      case 'focus':
        return "Votre profil serein indique une excellente disposition pour une utilisation réfléchie et concentrée d'EmotionsCare.";
      case 'sad':
      case 'anxiety':
      case 'stress':
        return "EmotionsCare est là pour vous accompagner. Nous avons préparé des fonctionnalités adaptées pour vous aider à retrouver plus de sérénité.";
      default:
        return "Votre profil émotionnel nous permet de vous offrir une expérience personnalisée pour répondre à vos besoins spécifiques.";
    }
  };

  const getPersonalizedStats = () => {
    return {
      totalGoals: wellnessGoals.length,
      totalActivities: preferredActivities.length,
      weeklyMinutes: preferences.weeklyGoalMinutes || 30,
      notificationFreq: preferences.notificationFrequency || 'moderate',
    };
  };

  const stats = getPersonalizedStats();

  const handleShare = async (platform: 'copy' | 'twitter' | 'facebook') => {
    const shareText = `🎉 Je viens de rejoindre EmotionsCare pour prendre soin de mon bien-être émotionnel! Mon objectif: ${stats.weeklyMinutes} minutes de pratique par semaine. #BienEtre #EmotionsCare`;
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Copié!', description: 'Texte copié dans le presse-papier' });
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`, '_blank');
    }
    
    setShowShareDialog(false);
  };

  const downloadSummary = () => {
    const summary = {
      date: new Date().toISOString(),
      emotionalProfile: emotion,
      wellnessGoals,
      preferredActivities,
      preferences: {
        weeklyGoal: `${stats.weeklyMinutes} minutes`,
        notifications: stats.notificationFreq,
        theme: preferences.colorTheme,
        musicStyle: preferences.musicPreference,
      }
    };
    
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emotionscare-profil.json';
    a.click();
    
    toast({ title: 'Téléchargé!', description: 'Votre profil a été exporté' });
  };
  
  return (
    <div className="space-y-6">
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
              />
              <div className="relative">
                <Trophy className="h-20 w-20 mx-auto text-yellow-500 mb-4" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="h-3 w-3 mr-1" />
          Configuration terminée
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Bienvenue dans EmotionsCare! 🎉
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          {getSummary()}
        </p>
      </motion.div>

      {/* Profile Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center text-4xl shadow-lg">
                  {emotionEmojis[emotion] || '😊'}
                </div>
                <div>
                  <h2 className="text-xl font-bold">Votre profil</h2>
                  <p className="text-muted-foreground capitalize">
                    Émotion principale: {emotion}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Vérifié
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Target className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{stats.totalGoals}</p>
                <p className="text-xs text-muted-foreground">Objectifs</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Heart className="h-5 w-5 mx-auto mb-1 text-pink-500" />
                <p className="text-2xl font-bold">{stats.totalActivities}</p>
                <p className="text-xs text-muted-foreground">Activités</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <p className="text-2xl font-bold">{stats.weeklyMinutes}</p>
                <p className="text-xs text-muted-foreground">Min/semaine</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Award className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Badge gagné</p>
              </div>
            </div>

            {/* Wellness Goals */}
            {wellnessGoals.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Vos objectifs bien-être</p>
                <div className="flex flex-wrap gap-2">
                  {wellnessGoals.map((goal: string) => (
                    <Badge key={goal} variant="outline" className="bg-primary/5">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Checklist */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Profil émotionnel créé</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Objectifs définis</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Préférences configurées</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Notifications personnalisées</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* First Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Vos premiers défis
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Gagnez des XP en complétant ces défis de démarrage
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {firstChallenges.map((challenge) => (
                <motion.button
                  key={challenge.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedChallenge(challenge)}
                  className="p-4 rounded-lg border text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <challenge.icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      +{challenge.xp} XP
                    </Badge>
                  </div>
                  <p className="font-medium text-sm">{challenge.title}</p>
                  <p className="text-xs text-muted-foreground">{challenge.duration}</p>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Music Recommendations */}
      {features.includes('music') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MoodBasedRecommendations 
            mood={emotion}
            intensity={70}
            standalone={true}
          />
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Button variant="outline" onClick={() => setShowShareDialog(true)}>
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
        <Button variant="outline" onClick={downloadSummary}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center py-6"
      >
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto">
            <LineChart className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -right-1 -bottom-1 left-1/2 transform translate-x-4">
            <div className="bg-green-500 rounded-full p-1.5">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          Prêt à commencer votre voyage ! 🚀
        </h2>
        
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Votre espace EmotionsCare est configuré et personnalisé.
          Explorez vos nouvelles fonctionnalités !
        </p>
        
        <Button 
          size="lg" 
          onClick={onFinish}
          disabled={loading}
          className="min-w-64 h-14 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Finalisation...
            </>
          ) : (
            <>
              Accéder à mon espace
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </motion.div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Partager votre profil
            </DialogTitle>
            <DialogDescription>
              Partagez votre nouveau voyage bien-être avec vos proches
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-3 pt-4">
            <Button variant="outline" className="flex-col h-auto py-4" onClick={() => handleShare('copy')}>
              <Copy className="h-6 w-6 mb-2" />
              <span className="text-xs">Copier</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-4" onClick={() => handleShare('twitter')}>
              <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-xs">Twitter</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-4" onClick={() => handleShare('facebook')}>
              <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-xs">Facebook</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Challenge Dialog */}
      <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedChallenge && <selectedChallenge.icon className="h-5 w-5 text-primary" />}
              {selectedChallenge?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedChallenge?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-yellow-500" />
                <span>Récompense</span>
              </div>
              <Badge className="bg-yellow-500/10 text-yellow-500">
                +{selectedChallenge?.xp} XP
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Durée estimée: {selectedChallenge?.duration}</span>
            </div>
          </div>
          
          <Button onClick={() => {
            setSelectedChallenge(null);
            toast({
              title: 'Défi accepté!',
              description: `Complétez "${selectedChallenge?.title}" pour gagner ${selectedChallenge?.xp} XP`,
            });
          }}>
            <Zap className="h-4 w-4 mr-2" />
            Commencer ce défi
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompletionSection;
