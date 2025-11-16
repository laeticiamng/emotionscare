/**
 * CommunityEngagement - Engagement communautaire avec défis et leaderboards
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Flame,
  Users,
  Target,
  Medal,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  progress: number;
  icon: React.ReactNode;
  color: string;
  reward: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  streak: number;
  avatar: string;
  badge?: string;
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Semaine de bien-être',
    description: '7 sessions de scan émotionnel consécutives',
    participants: 3421,
    progress: 65,
    icon: <Flame className="h-5 w-5" />,
    color: 'bg-orange-500',
    reward: '+100 points',
  },
  {
    id: '2',
    title: 'Mélomane IA',
    description: 'Écoutez 10 compositions musicales différentes',
    participants: 2156,
    progress: 42,
    icon: <Heart className="h-5 w-5" />,
    color: 'bg-pink-500',
    reward: '+80 points',
  },
  {
    id: '3',
    title: 'Conversation avec Nyvée',
    description: 'Ayez 5 conversations avec votre coach IA',
    participants: 1847,
    progress: 78,
    icon: <Sparkles className="h-5 w-5" />,
    color: 'bg-purple-500',
    reward: '+90 points',
  },
];

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Alex C.', points: 4850, streak: 45, avatar: '/avatars/avatar-1.jpg', badge: '👑' },
  { rank: 2, name: 'Jordan M.', points: 4620, streak: 38, avatar: '/avatars/avatar-2.jpg' },
  { rank: 3, name: 'Sam L.', points: 4390, streak: 32, avatar: '/avatars/avatar-3.jpg' },
  { rank: 4, name: 'Casey R.', points: 4120, streak: 28, avatar: '/avatars/avatar-4.jpg' },
  { rank: 5, name: 'Taylor P.', points: 3950, streak: 24, avatar: '/avatars/avatar-5.jpg' },
];

const CommunityEngagement: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-muted/10">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <Badge variant="outline" className="justify-center">
              <Users className="h-3 w-3 mr-2" />
              Communauté
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold">
              Relevez des défis ensemble
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Motivez-vous mutuellement, participez à des défis collectifs et gagnez des récompenses
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Challenges */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Défis actifs
              </h3>

              <div className="space-y-3">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Card
                      className={cn(
                        'cursor-pointer hover:shadow-lg transition-all border-l-4 overflow-hidden',
                        selectedChallenge === challenge.id
                          ? 'border-l-primary bg-primary/5'
                          : 'border-l-muted hover:border-l-primary'
                      )}
                      onClick={() => setSelectedChallenge(selectedChallenge === challenge.id ? null : challenge.id)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2.5 rounded-lg ${challenge.color} text-white`}>
                              {challenge.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm">{challenge.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {challenge.description}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {challenge.reward}
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{challenge.progress}% complété</span>
                            <span className="text-muted-foreground">{challenge.participants} participants</span>
                          </div>
                          <Progress value={challenge.progress} className="h-2" />
                        </div>

                        {/* Join Button */}
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: selectedChallenge === challenge.id ? 1 : 0,
                            height: selectedChallenge === challenge.id ? 'auto' : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <Button className="w-full mt-2" size="sm" variant="outline">
                            Rejoindre le défi
                            <ArrowRight className="h-3 w-3 ml-2" />
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Classement
              </h3>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Top 5 cette semaine</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      En direct
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg transition-all',
                        index === 0
                          ? 'bg-yellow-500/10 border border-yellow-500/20'
                          : index === 1
                          ? 'bg-gray-500/10 border border-gray-500/20'
                          : index === 2
                          ? 'bg-orange-500/10 border border-orange-500/20'
                          : 'bg-muted/50'
                      )}
                    >
                      {/* Rank Medal */}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index === 0 && <span>🥇</span>}
                        {index === 1 && <span>🥈</span>}
                        {index === 2 && <span>🥉</span>}
                        {index > 2 && <span className="text-muted-foreground">{entry.rank}</span>}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{entry.name}</span>
                          {entry.badge && <span className="text-lg">{entry.badge}</span>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Flame className="h-3 w-3" />
                          <span>{entry.streak} jours</span>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-sm">{entry.points}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* CTA */}
              <Button className="w-full" size="sm" variant="outline">
                Voir le classement complet
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Community Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: '👥', label: 'Membres actifs', value: '25K+' },
              { icon: '🎯', label: 'Défis complétés', value: '150K+' },
              { icon: '🏆', label: 'Récompenses distribuées', value: '5M+' },
              { icon: '🌟', label: 'Groupes communautaires', value: '500+' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-4 rounded-lg bg-muted/30 border border-border/50"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Helper function
function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default CommunityEngagement;
