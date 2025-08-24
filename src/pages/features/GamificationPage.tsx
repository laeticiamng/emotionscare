
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Award, TrendingUp, Calendar, Star, Users, BarChart3, Gamepad2 } from 'lucide-react';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const GamificationPage: React.FC = () => {
  const navigate = useNavigate();
  const achievements = [
    { title: "Premier Pas", description: "Première séance complétée", icon: "🎯", unlocked: true },
    { title: "Régularité", description: "7 jours consécutifs", icon: "📅", unlocked: true },
    { title: "Explorateur", description: "5 modules différents testés", icon: "🧭", unlocked: false },
    { title: "Maître Zen", description: "50 séances de méditation", icon: "🧘", unlocked: false }
  ];

  const challenges = [
    { title: "Défi du Mois", description: "Méditer 20 minutes par jour", progress: 65, reward: "Badge Sérénité" },
    { title: "Exploration", description: "Essayer 3 nouveaux modules", progress: 33, reward: "Points XP x2" },
    { title: "Constance", description: "15 jours sans interruption", progress: 80, reward: "Avatar Doré" }
  ];

  const rewards = [
    {
      title: 'Thème Premium',
      description: 'Interface personnalisée exclusive',
      icon: <span className="text-4xl">🎨</span>,
      cost: '500 XP',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Module VR Bonus',
      description: 'Accès à des expériences exclusives',
      icon: <span className="text-4xl">🔮</span>,
      cost: '800 XP',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Statut VIP',
      description: 'Avantages exclusifs pendant 1 mois',
      icon: <span className="text-4xl">👑</span>,
      cost: '1200 XP',
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  return (
    <PageLayout
      header={{
        title: 'Gamification',
        subtitle: 'Transformez votre bien-être en aventure',
        description: 'Gagnez des points, débloquez des succès et relevez des défis pour maintenir votre motivation au quotidien.',
        icon: Trophy,
        gradient: 'from-yellow-500/20 to-orange-500/5',
        badge: 'Système de Récompenses',
        stats: [
          {
            label: 'Points XP',
            value: '1.250',
            icon: Trophy,
            color: 'text-yellow-500'
          },
          {
            label: 'Niveau',
            value: '8',
            icon: Target,
            color: 'text-blue-500'
          },
          {
            label: 'Badges',
            value: '12',
            icon: Award,
            color: 'text-purple-500'
          },
          {
            label: 'Série',
            value: '24j',
            icon: TrendingUp,
            color: 'text-green-500'
          }
        ],
        actions: [
          {
            label: 'Nouvelle Mission',
            onClick: () => navigate('/gamification/missions'),
            variant: 'default',
            icon: Target
          },
          {
            label: 'Classement',
            onClick: () => navigate('/gamification/leaderboard'),
            variant: 'outline',
            icon: BarChart3
          }
        ]
      }}
      tips={{
        title: 'Maximisez vos récompenses',
        items: [
          {
            title: 'Constance',
            content: 'Maintenez votre série quotidienne pour des bonus XP',
            icon: Calendar
          },
          {
            title: 'Variété',
            content: 'Explorez différents modules pour débloquer plus de succès',
            icon: Target
          },
          {
            title: 'Défis',
            content: 'Participez aux défis communautaires pour des récompenses exclusives',
            icon: Users
          }
        ],
        cta: {
          label: 'Guide de la gamification',
          onClick: () => navigate('/help-center#gamification-guide')
        }
      }}
    >
      <div className="space-y-8">
        {/* Succès et Défis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Succès */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-purple-500" />
                Succès Débloqués ({achievements.filter(a => a.unlocked).length}/{achievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`flex items-center p-4 rounded-lg ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800' 
                      : 'bg-muted opacity-60'
                  }`}
                >
                  <div className="text-2xl mr-4">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Star className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Défis actuels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-6 w-6 text-blue-500" />
                Défis en Cours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {challenges.map((challenge, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{challenge.title}</h4>
                    <span className="text-sm text-blue-600 dark:text-blue-400">{challenge.progress}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Récompense: {challenge.reward}</span>
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Boutique de récompenses */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Boutique de Récompenses</h2>
          <p className="text-muted-foreground">Échangez vos points XP contre des récompenses exclusives</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rewards.map((reward, index) => (
              <FeatureCard
                key={index}
                title={reward.title}
                description={reward.description}
                icon={reward.icon}
                gradient={reward.gradient}
                metadata={[{ label: 'Coût', value: reward.cost }]}
                action={{
                  label: 'Échanger',
                  onClick: () => navigate('/gamification/exchange')
                }}
              />
            ))}
          </div>
        </div>

        {/* Progression détaillée */}
        <Card>
          <CardHeader>
            <CardTitle>Progression vers le Niveau 9</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>1.250 / 1.500 XP</span>
                <span>83%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500" style={{ width: '83%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground">Plus que 250 XP pour atteindre le niveau Maître !</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default GamificationPage;
