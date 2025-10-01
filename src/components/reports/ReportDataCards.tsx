// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Award, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReporting } from '@/contexts/ReportingContext';

interface ReportDataCardsProps {
  period: string;
}

const ReportDataCards: React.FC<ReportDataCardsProps> = ({ period }) => {
  const { stats } = useReporting();
  
  const cards = [
    {
      title: "Score émotionnel",
      value: `${stats.emotionalScore}%`,
      change: stats.emotionalScoreChange,
      icon: Heart,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
    {
      title: "Sessions complétées",
      value: stats.completedSessions,
      change: stats.completedSessionsChange,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Badges obtenus",
      value: stats.badgesEarned,
      change: stats.badgesEarnedChange,
      icon: Award,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Progression",
      value: `${stats.progressPercentage}%`,
      change: stats.progressChange,
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div 
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                  <h3 className="text-2xl font-bold">{card.value}</h3>
                  {card.change !== undefined && (
                    <p className={cn(
                      "text-xs flex items-center mt-1",
                      card.change > 0 ? "text-emerald-500" : 
                      card.change < 0 ? "text-rose-500" : "text-muted-foreground"
                    )}>
                      {card.change > 0 ? '↑' : card.change < 0 ? '↓' : '–'}
                      {' '}{Math.abs(card.change)}% {period === 'week' ? 'cette semaine' : 'ce mois'}
                    </p>
                  )}
                </div>

                <div className={cn("p-2 rounded-full", card.bgColor)}>
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ReportDataCards;
