import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDailyChallenges } from '@/hooks/useDailyChallenges';
import { useWellnessStreak } from '@/hooks/useWellnessStreak';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Flame, 
  Target, 
  CheckCircle2, 
  Clock, 
  Zap,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * Page des défis quotidiens avec système de streaks
 * Affiche les défis personnalisés par profil émotionnel
 */
export default function DailyChallengesPage() {
  const navigate = useNavigate();
  const [emotionalProfile, setEmotionalProfile] = useState<string>('all');
  const { challenges, progress, loading, updateProgress, generateNewChallenges } = useDailyChallenges(emotionalProfile);
  const { streak, hasCheckedInToday, checkin } = useWellnessStreak();

  useEffect(() => {
    // Load user's emotional profile from localStorage
    const savedProfile = localStorage.getItem('emotional-profile');
    if (savedProfile) {
      setEmotionalProfile(savedProfile);
    }
  }, []);

  const handleCompleteChallenge = async (challengeId: string) => {
    await updateProgress(challengeId, 1, 1);
  };

  const profileColors = {
    stress: 'from-blue-500/20 to-purple-500/20 border-blue-500/30',
    energy: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
    creativity: 'from-pink-500/20 to-purple-500/20 border-pink-500/30',
    calm: 'from-green-500/20 to-blue-500/20 border-green-500/30',
    social: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
    all: 'from-primary/20 to-accent/20 border-primary/30',
  };

  const getRewardIcon = (rewardType: string) => {
    switch (rewardType) {
      case 'badge_boost': return <Zap className="h-4 w-4" />;
      case 'theme_unlock': return <Sparkles className="h-4 w-4" />;
      case 'avatar_unlock': return <Trophy className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getRewardLabel = (rewardType: string) => {
    switch (rewardType) {
      case 'badge_boost': return 'Boost de badges';
      case 'theme_unlock': return 'Thème débloqué';
      case 'avatar_unlock': return 'Avatar débloqué';
      default: return 'Récompense';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/app/emotional-park')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au parc
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Défis Quotidiens
              </h1>
              <p className="text-muted-foreground mt-2">
                Complète tes défis personnalisés pour gagner des récompenses
              </p>
            </div>

            {/* Streak Display */}
            {streak && (
              <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
                <div className="flex items-center gap-3">
                  <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
                  <div>
                    <p className="text-2xl font-bold">{streak.currentStreak}</p>
                    <p className="text-sm text-muted-foreground">jours d'affilée</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Profile Selector */}
        <Tabs value={emotionalProfile} onValueChange={setEmotionalProfile} className="mb-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="stress">Stress</TabsTrigger>
            <TabsTrigger value="energy">Énergie</TabsTrigger>
            <TabsTrigger value="creativity">Créativité</TabsTrigger>
            <TabsTrigger value="calm">Calme</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Challenges Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {challenges.length === 0 ? (
            <Card className="col-span-2 p-12 text-center">
              <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Aucun défi disponible</h3>
              <p className="text-muted-foreground mb-4">
                Les défis sont générés automatiquement chaque jour à minuit
              </p>
              <Button onClick={generateNewChallenges} variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                Générer des défis de test
              </Button>
            </Card>
          ) : (
            challenges.map((challenge) => {
              const challengeProgress = progress[challenge.id];
              const isCompleted = challengeProgress?.completed || false;
              const currentProgress = challengeProgress?.progress?.current || 0;
              const targetProgress = challengeProgress?.progress?.target || 1;
              const progressPercent = (currentProgress / targetProgress) * 100;
              const streakDays = challengeProgress?.streak_days || 0;

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className={cn(
                      'relative overflow-hidden border-2 transition-all duration-300',
                      isCompleted ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/50' : `bg-gradient-to-br ${profileColors[challenge.emotional_profile as keyof typeof profileColors]}`,
                      'hover:shadow-lg hover:scale-[1.02]'
                    )}
                  >
                    {/* Completion Overlay */}
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-10">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', duration: 0.6 }}
                        >
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </motion.div>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Challenge Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-2 capitalize">
                            {challenge.type.replace('_', ' ')}
                          </Badge>
                          <h3 className="text-lg font-semibold mb-2">
                            {challenge.objective}
                          </h3>
                        </div>
                      </div>

                      {/* Streak Display */}
                      {streakDays > 0 && (
                        <div className="flex items-center gap-2 mb-4 p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                          <Flame className="h-5 w-5 text-orange-500" />
                          <span className="text-sm font-medium">
                            {streakDays} jour{streakDays > 1 ? 's' : ''} consécutif{streakDays > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                          <span>Progression</span>
                          <span className="font-medium">
                            {currentProgress} / {targetProgress}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>

                      {/* Reward Info */}
                      <div className="flex items-center gap-2 mb-4 p-3 bg-accent/5 rounded-lg border border-accent/20">
                        {getRewardIcon(challenge.reward_type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {getRewardLabel(challenge.reward_type)}
                          </p>
                          {challenge.reward_value?.boost && (
                            <p className="text-xs text-muted-foreground">
                              +{(challenge.reward_value.boost * 100).toFixed(0)}% de boost
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      {!isCompleted && (
                        <Button
                          onClick={() => handleCompleteChallenge(challenge.id)}
                          className="w-full"
                          variant="default"
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Marquer comme complété
                        </Button>
                      )}

                      {isCompleted && (
                        <Button
                          className="w-full"
                          variant="outline"
                          disabled
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Défi complété !
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Daily Check-in */}
        {!hasCheckedInToday && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Flame className="h-10 w-10 text-orange-500" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      N'oublie pas ton check-in quotidien !
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Continue ta série pour débloquer plus de récompenses
                    </p>
                  </div>
                </div>
                <Button onClick={checkin} size="lg">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Check-in
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
