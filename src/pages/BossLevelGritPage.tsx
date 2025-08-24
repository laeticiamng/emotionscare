import React, { memo, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Gamepad2, Trophy, Star, Zap, Crown, Target, Medal, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';

const BossLevelGritPage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // State management pour les données de progression
  const [gameState, setGameState] = React.useState({
    currentLevel: 7,
    experience: 750,
    maxExperience: 1000,
    streak: 12,
    completedChallenges: 2,
    totalChallenges: 4
  });

  const challenges = useMemo(() => [
    { 
      id: 1, 
      title: 'Défi Matinal', 
      description: 'Méditation 10min avant 8h', 
      reward: 150, 
      completed: true,
      difficulty: 'Facile',
      icon: Target
    },
    { 
      id: 2, 
      title: 'Hydratation Power', 
      description: 'Boire 2L d\'eau aujourd\'hui', 
      reward: 100, 
      completed: false,
      difficulty: 'Moyen',
      icon: Zap
    },
    { 
      id: 3, 
      title: 'Gratitude Boss', 
      description: 'Noter 3 gratitudes', 
      reward: 200, 
      completed: false,
      difficulty: 'Facile',
      icon: Star
    },
    { 
      id: 4, 
      title: 'Mouvement Énergie', 
      description: '30min d\'activité physique', 
      reward: 250, 
      completed: true,
      difficulty: 'Difficile',
      icon: Trophy
    },
  ], []);

  const handleChallengeComplete = useCallback((challengeId: number) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
      setGameState(prev => ({
        ...prev,
        experience: prev.experience + challenge.reward,
        completedChallenges: prev.completedChallenges + 1
      }));
      
      toast.success(`🎉 Défi "${challenge.title}" terminé !`, {
        description: `+${challenge.reward} XP gagnés`
      });
    }
  }, [challenges]);

  const handleUnlockBossFinal = useCallback(() => {
    if (gameState.completedChallenges >= gameState.totalChallenges) {
      toast.success('🔓 Boss Final débloqué !', {
        description: 'Préparez-vous pour le défi ultime'
      });
      navigate('/boss-final');
    } else {
      toast.warning('🔒 Complétez tous les défis quotidiens d\'abord');
    }
  }, [gameState, navigate]);

  const progressPercentage = (gameState.experience / gameState.maxExperience) * 100;
  const canUnlockBoss = gameState.completedChallenges >= gameState.totalChallenges;

  const header = {
    title: 'Boss Level Grit',
    subtitle: 'Transformez vos défis en victoires épiques',
    description: 'Développez votre résilience mentale à travers des défis gamifiés et progressifs',
    icon: Crown,
    badge: 'Gamification Premium',
    stats: [
      { label: 'Niveau Boss', value: `${gameState.currentLevel}`, icon: Trophy, color: 'text-yellow-500' },
      { label: 'Jours de Suite', value: `${gameState.streak}`, icon: Flame, color: 'text-red-500' },
      { label: 'Points XP', value: `${gameState.experience}`, icon: Zap, color: 'text-purple-500' },
      { label: 'Défis Terminés', value: `${gameState.completedChallenges}/${gameState.totalChallenges}`, icon: Medal, color: 'text-green-500' }
    ],
    actions: [
      {
        label: 'Voir Historique',
        onClick: () => navigate('/activity-history'),
        variant: 'outline' as const,
        icon: Target
      },
      {
        label: 'Défis Personnalisés',
        onClick: () => toast.info('Création de défis personnalisés à venir'),
        variant: 'default' as const,
        icon: Star
      }
    ]
  };

  const tips = {
    title: 'Stratégies de Boss pour maximiser vos gains',
    items: [
      {
        title: 'Progression Constante',
        content: 'Complétez au moins un défi par jour pour maintenir votre streak',
        icon: Target
      },
      {
        title: 'Difficultés Équilibrées',
        content: 'Alternez entre défis faciles et difficiles pour éviter l\'épuisement',
        icon: Zap
      },
      {
        title: 'Récompenses Stratégiques',
        content: 'Utilisez vos XP pour débloquer de nouveaux défis premium',
        icon: Crown
      }
    ],
    cta: {
      label: 'Guide Complet Boss Level',
      onClick: () => navigate('/help-center')
    }
  };

  return (
    <PageLayout header={header} tips={tips}>
      <div className="space-y-8">
        {/* Barre de Progression Niveau */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto space-y-4 p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Niveau {gameState.currentLevel}</span>
            <span className="text-sm font-medium">Niveau {gameState.currentLevel + 1}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-4 bg-background/50"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{gameState.experience} XP</span>
            <span>{gameState.maxExperience} XP</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {gameState.maxExperience - gameState.experience} XP jusqu'au prochain niveau
          </p>
        </motion.div>

        {/* Défis Quotidiens */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Défis Boss du Jour
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => {
              const IconComponent = challenge.icon;
              return (
                <FeatureCard
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  icon={IconComponent}
                  gradient={challenge.completed 
                    ? 'from-green-500 to-emerald-500' 
                    : 'from-orange-500 to-red-500'
                  }
                  isPremium={challenge.difficulty === 'Difficile'}
                  isPopular={challenge.reward >= 200}
                  stats={[
                    { label: 'XP', value: `${challenge.reward}` },
                    { label: 'Difficulté', value: challenge.difficulty }
                  ]}
                  action={{
                    label: challenge.completed ? '✓ Boss Vaincu' : 'Relever le Défi',
                    onClick: () => handleChallengeComplete(challenge.id)
                  }}
                  index={index}
                  className={challenge.completed ? 'opacity-75' : ''}
                />
              );
            })}
          </div>
        </div>

        {/* Boss Final */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <FeatureCard
            title="Boss Final de la Semaine"
            description={canUnlockBoss 
              ? "Tous les défis sont terminés ! Affrontez le boss final pour des récompenses épiques."
              : "Complétez tous les défis quotidiens pour débloquer le boss final"
            }
            icon={Crown}
            gradient="from-purple-600 via-pink-600 to-red-600"
            isPremium={true}
            isPopular={canUnlockBoss}
            stats={canUnlockBoss ? [
              { label: 'Récompense', value: '1000 XP' },
              { label: 'Rareté', value: 'Légendaire' }
            ] : [
              { label: 'Progression', value: `${gameState.completedChallenges}/${gameState.totalChallenges}` },
              { label: 'Statut', value: 'Verrouillé' }
            ]}
            action={{
              label: canUnlockBoss ? '🔓 Affronter le Boss Final' : '🔒 Débloquer Boss Final',
              onClick: handleUnlockBossFinal
            }}
            className="max-w-lg mx-auto"
          />
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default memo(BossLevelGritPage);