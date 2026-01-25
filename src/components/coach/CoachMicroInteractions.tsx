import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, ThumbsUp, Zap, Award, Flame } from 'lucide-react';

interface MicroInteraction {
  id: string;
  type: 'quick-check' | 'daily-challenge' | 'streak' | 'achievement';
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  reward?: number;
  emoji: string;
}

const MICRO_INTERACTIONS: MicroInteraction[] = [
  {
    id: '1',
    type: 'quick-check',
    title: 'Vérification rapide',
    description: 'Comment allez-vous en ce moment? Prenez 30 secondes pour partager',
    icon: <Heart className="w-6 h-6" />,
    action: 'Vérifier mon bien-être',
    reward: 5,
    emoji: '❓',
  },
  {
    id: '2',
    type: 'daily-challenge',
    title: 'Défi du jour',
    description: 'Pratiquez la gratitude: listez 3 choses pour lesquelles vous êtes reconnaissant',
    icon: <Zap className="w-6 h-6" />,
    action: 'Relever le défi',
    reward: 10,
    emoji: '⚡',
  },
  {
    id: '3',
    type: 'streak',
    title: 'Série en cours',
    description: 'Vous êtes à 7 jours consécutifs! Continuez!',
    icon: <Flame className="w-6 h-6" />,
    action: 'Maintenir la série',
    reward: undefined,
    emoji: '🔥',
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Nouvelle réalisation',
    description: 'Vous avez complété votre programme de respiration!',
    icon: <Award className="w-6 h-6" />,
    action: 'Voir la réalisation',
    reward: 25,
    emoji: '🏆',
  },
];

interface MicroInteractionStats {
  completedToday: number;
  totalCompleted: number;
  pointsToday: number;
  streakDays: number;
  level: number;
}

export const CoachMicroInteractions = () => {
  const [stats, setStats] = useState<MicroInteractionStats>({
    completedToday: 2,
    totalCompleted: 34,
    pointsToday: 15,
    streakDays: 7,
    level: 3,
  });

  const [selectedInteraction, setSelectedInteraction] = useState<MicroInteraction | null>(null);
  const [completedInteractions, setCompletedInteractions] = useState<string[]>([]);

  const handleCompleteInteraction = (id: string, reward?: number) => {
    if (!completedInteractions.includes(id)) {
      setCompletedInteractions([...completedInteractions, id]);
      if (reward) {
        setStats((prev) => ({
          ...prev,
          pointsToday: prev.pointsToday + reward,
          completedToday: prev.completedToday + 1,
          totalCompleted: prev.totalCompleted + 1,
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Micro-interactions 💫
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Petites actions quotidiennes pour renforcer votre bien-être
        </p>
      </div>

      {/* Stats du jour */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Complétées aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.completedToday}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              sur 4 proposées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Points du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.pointsToday}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              +0 à gain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Série 🔥
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.streakDays}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              jours consécutifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Niveau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.level}</div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grille d'interactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MICRO_INTERACTIONS.map((interaction) => {
          const isCompleted = completedInteractions.includes(interaction.id);

          return (
            <Dialog key={interaction.id}>
              <DialogTrigger asChild>
                <Card
                  className={`cursor-pointer hover:shadow-lg transition-all ${
                    isCompleted ? 'opacity-60 border-green-200 dark:border-green-800' : ''
                  }`}
                  onClick={() => setSelectedInteraction(interaction)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{interaction.emoji}</div>
                        <div>
                          <CardTitle className="text-base">{interaction.title}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {interaction.type === 'quick-check' && '⏱️ Rapide'}
                            {interaction.type === 'daily-challenge' && '🎯 Défi'}
                            {interaction.type === 'streak' && '🔥 Série'}
                            {interaction.type === 'achievement' && '🏆 Réalisation'}
                          </CardDescription>
                        </div>
                      </div>
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          ✓ Fait
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {interaction.description}
                    </p>

                    {interaction.reward && (
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-600">
                          +{interaction.reward} points
                        </span>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      variant={isCompleted ? 'outline' : 'default'}
                      disabled={isCompleted}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCompleted) {
                          handleCompleteInteraction(interaction.id, interaction.reward);
                        }
                      }}
                    >
                      {isCompleted ? '✓ Complété' : interaction.action}
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span className="text-3xl">{interaction.emoji}</span>
                    {interaction.title}
                  </DialogTitle>
                  <DialogDescription>{interaction.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      💡 <strong>Conseil:</strong> Cette micro-interaction prendra environ 2-3
                      minutes et aura un impact positif sur votre bien-être.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Bénéfices:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>Améliore votre bien-être émotionnel</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                        <span>Renforce votre habitude positive</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>Vous gagnez {interaction.reward} points</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      handleCompleteInteraction(interaction.id, interaction.reward);
                    }}
                    disabled={isCompleted}
                  >
                    {isCompleted ? '✓ Déjà complété' : `Commencer: ${interaction.action}`}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle>Historique d'aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {completedInteractions.length > 0 ? (
              completedInteractions.map((id) => {
                const interaction = MICRO_INTERACTIONS.find((i) => i.id === id);
                return (
                  <div key={id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm">{interaction?.title}</span>
                    </div>
                    {interaction?.reward && (
                      <span className="text-sm font-semibold text-yellow-600">+{interaction.reward}</span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Aucune micro-interaction complétée. Commencez-en une!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
