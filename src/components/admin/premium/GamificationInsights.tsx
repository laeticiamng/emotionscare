import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Trophy, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GamificationInsightsProps {
  isActive: boolean;
  onClick: () => void;
  visualStyle: 'minimal' | 'artistic';
  zenMode: boolean;
  className?: string;
}

// Mock data for badge levels
const badgeLevelsData = [
  { level: 'Bronze', count: 14, color: '#CD7F32' },
  { level: 'Argent', count: 7, color: '#C0C0C0' },
  { level: 'Or', count: 3, color: '#FFD700' }
];

// Mock data for challenges
const topChallengesData = [
  { name: 'Check-in quotidien', completions: 156, progress: 76 },
  { name: 'Partage d\'expérience', completions: 87, progress: 42 },
  { name: 'Lecture bien-être', completions: 63, progress: 31 }
];

const GamificationInsights: React.FC<GamificationInsightsProps> = ({
  isActive,
  onClick,
  visualStyle,
  zenMode,
  className
}) => {
  return (
    <Card 
      className={cn(
        "premium-card overflow-hidden relative transition-all ease-in-out", 
        isActive ? "shadow-xl border-primary/20" : "",
        zenMode ? "bg-background/70 backdrop-blur-lg border-border/50" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="relative">
        <CardTitle className="flex items-center text-xl">
          <div className="w-10 h-10 mr-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="text-primary" />
          </div>
          Gamification
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-2xl font-semibold">68%</span>
            <span className="text-sm text-muted-foreground">Utilisateurs actifs</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-semibold">24</span>
            <span className="text-sm text-muted-foreground">Badges disponibles</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Niveaux de badges</h3>
          <div className="grid grid-cols-3 gap-3">
            {badgeLevelsData.map((badge) => (
              <motion.div
                key={badge.level}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                  style={{ 
                    backgroundColor: `${badge.color}20`, 
                    border: `2px solid ${badge.color}` 
                  }}
                >
                  {badge.level === 'Bronze' ? (
                    <Medal size={20} style={{ color: badge.color }} />
                  ) : badge.level === 'Argent' ? (
                    <Medal size={20} style={{ color: badge.color }} />
                  ) : (
                    <Award size={20} style={{ color: badge.color }} />
                  )}
                </div>
                <span className="text-xs font-medium">{badge.level}</span>
                <span className="text-2xs text-muted-foreground">{badge.count}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Top challenges</h3>
          <div className="space-y-3">
            {topChallengesData.map((challenge) => (
              <div key={challenge.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{challenge.name}</span>
                  <span className="font-medium">{challenge.completions}</span>
                </div>
                <Progress value={challenge.progress} className="h-1" />
              </div>
            ))}
          </div>
        </div>
        
        {visualStyle === 'artistic' && (
          <motion.div 
            className="mt-6 p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-100 dark:border-yellow-800/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-medium mb-2">Suggestion IA</h3>
            <p className="text-sm text-muted-foreground">
              Créer un badge "Équilibre" encouragerait les utilisateurs à adopter une routine plus stable.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

// Change from named export to default export
export default GamificationInsights;
