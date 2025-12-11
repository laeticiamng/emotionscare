// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Star, Trophy, Info, Gift, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const SeasonBanner: React.FC = () => {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  const currentSeason = {
    name: 'Saison Nova',
    theme: 'Exploration cosmique',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-12-31'),
    progress: 65,
    userRank: 127,
    totalParticipants: 1543,
    userPoints: 2450,
  };

  const exclusiveRewards = [
    { name: 'Badge Explorateur', rarity: 'rare', icon: '🚀' },
    { name: 'Thème Cosmique', rarity: 'epic', icon: '🌌' },
    { name: 'Titre Pionnier', rarity: 'legendary', icon: '👑' },
  ];

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = currentSeason.endDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'text-blue-500 bg-blue-500/10';
      case 'epic': return 'text-purple-500 bg-purple-500/10';
      case 'legendary': return 'text-amber-500 bg-amber-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/20 overflow-hidden relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{ left: `${20 + i * 15}%`, bottom: 0 }}
            />
          ))}
        </div>

        <CardContent className="p-6 relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Star className="w-7 h-7 text-white" />
                </motion.div>
                
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {currentSeason.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{currentSeason.theme}</p>
                </div>
              </div>

              {/* Season Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progression de la saison</span>
                  <span className="font-medium">{currentSeason.progress}%</span>
                </div>
                <Progress value={currentSeason.progress} className="h-2" />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-yellow-500" />
                  Rang #{currentSeason.userRank}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  {currentSeason.userPoints.toLocaleString()} pts
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Saison active
                </Badge>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex flex-col items-center gap-2 p-4 bg-background/50 rounded-xl border border-border/50">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Temps restant
              </p>
              <div className="flex gap-2">
                {[
                  { value: countdown.days, label: 'j' },
                  { value: countdown.hours, label: 'h' },
                  { value: countdown.minutes, label: 'm' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold tabular-nums bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Règles
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-500" />
                      {currentSeason.name}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Exclusive Rewards Preview */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-purple-500" />
                        Récompenses exclusives
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {exclusiveRewards.map((reward, i) => (
                          <div 
                            key={i}
                            className={`p-3 rounded-lg text-center ${getRarityColor(reward.rarity)}`}
                          >
                            <div className="text-2xl mb-1">{reward.icon}</div>
                            <p className="text-sm font-medium">{reward.name}</p>
                            <Badge variant="outline" className="text-xs mt-1 capitalize">
                              {reward.rarity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Points System */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { points: '+1', action: 'Connexion quotidienne', color: 'green' },
                        { points: '+3', action: 'Module terminé', color: 'blue' },
                        { points: '+5', action: 'Objectif hebdo', color: 'purple' },
                        { points: '+10', action: 'Nouveau badge', color: 'orange' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                          <div className={`w-8 h-8 rounded-full bg-${item.color}-500/20 flex items-center justify-center`}>
                            <span className={`text-xs font-bold text-${item.color}-600`}>{item.points}</span>
                          </div>
                          <span className="text-sm">{item.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <Gift className="w-4 h-4 mr-1" />
                Récompenses
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
