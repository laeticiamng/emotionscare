import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { MyGamification } from '@/store/gamification.store';

interface RankCardProps {
  data: MyGamification | null;
}

export const RankCard: React.FC<RankCardProps> = ({ data }) => {
  if (!data) {
    return (
      <Card className="bg-gradient-to-r from-muted/50 to-muted/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-20">
            <div className="text-center text-muted-foreground">
              <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Classement en cours de chargement...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Ton rang
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-foreground">
                {data.rank_label}
              </h3>
              <p className="text-sm text-muted-foreground">
                Rang actuel
              </p>
            </div>
            
            {data.featured_badge && (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mb-1">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Dernier badge
                </p>
              </div>
            )}
          </div>

          {data.next_goal_hint && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Prochain objectif</span>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm">{data.next_goal_hint}</p>
              </div>
              
              {/* Estimation visuelle de progression */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progression</span>
                  <span>En cours...</span>
                </div>
                <Progress 
                  value={65} // Valeur estimée, pas de chiffres exacts
                  className="h-2"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Actif
            </Badge>
            {data.tier && (
              <Badge variant="outline">
                Niveau {data.tier}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};