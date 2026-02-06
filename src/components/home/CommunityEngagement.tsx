/**
 * CommunityEngagement - Engagement communautaire avec framing interventionnel
 * Vision: Pas de défis "wellness", mais des rituels de régulation collective
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
  Heart,
  ArrowRight,
  StopCircle,
  Moon,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title: string;
  situation: string; // Moment vécu, pas description technique
  participants: number;
  progress: number;
  icon: React.ReactNode;
  color: string;
  effect: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  sessions: number;
  streak: number;
  badge?: string;
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Protocole matin',
    situation: '7 jours de reset au réveil',
    participants: 3421,
    progress: 65,
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-amber-500',
    effect: 'Démarrer sans brouillard mental',
  },
  {
    id: '2',
    title: 'Arrêt nocturne',
    situation: '5 sessions avant de dormir',
    participants: 2156,
    progress: 42,
    icon: <Moon className="h-5 w-5" />,
    color: 'bg-indigo-500',
    effect: 'Couper le cerveau le soir',
  },
  {
    id: '3',
    title: 'Stop crise',
    situation: '3 interventions en urgence',
    participants: 1847,
    progress: 78,
    icon: <StopCircle className="h-5 w-5" />,
    color: 'bg-red-500',
    effect: 'Savoir se stopper quand ça monte',
  },
];

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Alex C.', sessions: 45, streak: 45, badge: '👑' },
  { rank: 2, name: 'Jordan M.', sessions: 38, streak: 38 },
  { rank: 3, name: 'Sam L.', sessions: 32, streak: 32 },
  { rank: 4, name: 'Casey R.', sessions: 28, streak: 28 },
  { rank: 5, name: 'Taylor P.', sessions: 24, streak: 24 },
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
          {/* Header - Framing interventionnel */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <Badge variant="outline" className="justify-center">
              <Users className="h-3 w-3 mr-2" aria-hidden="true" />
              Rituels collectifs
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Vous n'êtes pas seul à lutter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des professionnels de santé utilisent les mêmes protocoles que vous.
              <span className="text-foreground font-medium"> Ensemble, on crée des rituels qui tiennent.</span>
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Challenges/Rituels */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Protocoles en cours
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
                                {challenge.situation}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {challenge.participants.toLocaleString()} actifs
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{challenge.progress}% de ton objectif</span>
                          </div>
                          <Progress value={challenge.progress} className="h-2" />
                        </div>

                        {/* Effect + Join Button */}
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: selectedChallenge === challenge.id ? 1 : 0,
                            height: selectedChallenge === challenge.id ? 'auto' : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-foreground/80 py-2 border-t border-border/50 mb-2">
                            <span className="text-primary font-medium">Effet :</span> {challenge.effect}
                          </p>
                          <Button 
                            className="w-full" 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = '/signup?join=' + challenge.id;
                            }}
                          >
                            Rejoindre le protocole
                            <ArrowRight className="h-3 w-3 ml-2" />
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Leaderboard - Sessions pas points */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Régularité
              </h3>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Qui tient le plus longtemps</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Cette semaine
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
                          <span>{entry.streak} jours sans casser</span>
                        </div>
                      </div>

                      {/* Sessions */}
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-sm">{entry.sessions}</div>
                        <div className="text-xs text-muted-foreground">sessions</div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Micro-copy rétention */}
              <p className="text-center text-sm text-muted-foreground italic">
                "Reviens avant que ton corps n'explose."
              </p>
            </motion.div>
          </motion.div>

          {/* Community Stats - Reframés */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: <Heart className="h-6 w-6 text-pink-500" />, label: 'Personnes qui luttent ensemble', value: '25K+' },
              { icon: <StopCircle className="h-6 w-6 text-red-500" />, label: 'Crises interrompues', value: '150K+' },
              { icon: <Zap className="h-6 w-6 text-amber-500" />, label: 'Resets réussis', value: '5M+' },
              { icon: <Moon className="h-6 w-6 text-indigo-500" />, label: 'Nuits récupérées', value: '500K+' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-4 rounded-lg bg-muted/30 border border-border/50"
                whileHover={{ scale: 1.02 }}
              >
                <div className="mx-auto w-fit mb-2">{stat.icon}</div>
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

export default CommunityEngagement;
