/**
 * ParkStreakWidget - Widget de série/streak compact
 * Affiche la série de jours consécutifs et le calendrier de la semaine
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ParkStreakWidgetProps {
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: boolean[];
  lastActivityDate?: string;
  compact?: boolean;
}

export const ParkStreakWidget: React.FC<ParkStreakWidgetProps> = ({
  currentStreak,
  longestStreak,
  weeklyActivity,
  lastActivityDate,
  compact = false
}) => {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;
  
  const isStreakActive = currentStreak > 0;
  const isNewRecord = currentStreak >= longestStreak && currentStreak > 0;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
      >
        <motion.div
          animate={isStreakActive ? { scale: [1, 1.15, 1] } : undefined}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame className={`h-6 w-6 ${isStreakActive ? 'text-orange-500' : 'text-muted-foreground'}`} />
        </motion.div>
        <div>
          <p className="text-lg font-bold">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">jours</p>
        </div>
        {isNewRecord && (
          <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-600">
            Record!
          </Badge>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-orange-500/10 via-red-500/5 to-yellow-500/10 border-orange-500/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`
                  p-3 rounded-xl 
                  ${isStreakActive 
                    ? 'bg-gradient-to-br from-orange-500 to-red-500' 
                    : 'bg-muted'
                  }
                `}
                animate={isStreakActive ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : undefined}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className={`h-6 w-6 ${isStreakActive ? 'text-white' : 'text-muted-foreground'}`} />
              </motion.div>
              
              <div>
                <motion.p 
                  className="text-3xl font-bold"
                  animate={isStreakActive ? { scale: [1, 1.05, 1] } : undefined}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentStreak}
                </motion.p>
                <p className="text-sm text-muted-foreground">
                  {currentStreak === 1 ? 'jour' : 'jours'} consécutifs
                </p>
              </div>
            </div>

            <div className="text-right">
              {isNewRecord ? (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white gap-1">
                  <Zap className="h-3 w-3" />
                  Nouveau record!
                </Badge>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Record: {longestStreak}</span>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="bg-background/50 rounded-lg p-3">
            <div className="flex items-center justify-between gap-2">
              {weeklyActivity.map((active, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-1 text-center"
                >
                  <motion.div
                    className={`
                      w-full aspect-square rounded-lg flex items-center justify-center mb-1
                      ${active 
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' 
                        : index === todayIndex 
                          ? 'bg-primary/20 border-2 border-primary border-dashed'
                          : 'bg-muted'
                      }
                    `}
                    whileHover={{ scale: 1.1 }}
                  >
                    {active ? (
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      >
                        🔥
                      </motion.span>
                    ) : index === todayIndex ? (
                      <span className="text-xs font-bold text-primary">?</span>
                    ) : null}
                  </motion.div>
                  <span className={`text-xs ${index === todayIndex ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                    {days[index]}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Last Activity */}
          {lastActivityDate && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Dernière activité: {new Date(lastActivityDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'short'
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ParkStreakWidget;
