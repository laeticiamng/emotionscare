// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock } from 'lucide-react';

interface ZoneProgressCardProps {
  zoneName: string;
  zoneEmoji: string;
  visited: number;
  total: number;
  percentage: number;
  isUnlocked: boolean;
}

export const ZoneProgressCard: React.FC<ZoneProgressCardProps> = ({
  zoneName,
  zoneEmoji,
  visited,
  total,
  percentage,
  isUnlocked
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <Card className={`p-4 ${isUnlocked ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5' : 'bg-background'}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{zoneEmoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{zoneName}</h4>
              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Trophy className="h-4 w-4 text-primary" />
                </motion.div>
              )}
              {!isUnlocked && visited > 0 && (
                <Lock className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {visited}/{total} attractions visitées
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground">
              {percentage}%
            </span>
            {isUnlocked ? (
              <Badge variant="default" className="text-xs">
                Complété
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                En cours
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
