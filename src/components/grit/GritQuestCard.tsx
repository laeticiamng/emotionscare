import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Target } from 'lucide-react';

interface GritQuest {
  quest_id: string;
  title: string;
  est_minutes: number;
  copy: string;
}

interface GritQuestCardProps {
  quest: GritQuest;
  onStart: (questId: string) => void;
  disabled?: boolean;
}

export const GritQuestCard: React.FC<GritQuestCardProps> = ({
  quest,
  onStart,
  disabled = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`relative overflow-hidden ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
      } transition-all duration-200`}>
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-foreground leading-tight">
              {quest.title}
            </CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1 ml-2 shrink-0">
              <Clock className="h-3 w-3" />
              {quest.est_minutes}min
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="relative space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {quest.copy}
          </p>
          
          <div className="flex items-center gap-3 pt-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Défi de persévérance
            </span>
          </div>
          
          <Button
            onClick={() => onStart(quest.quest_id)}
            disabled={disabled}
            className="w-full mt-4"
            size="lg"
            aria-label="Commencer la quête de persévérance"
          >
            <Play className="h-4 w-4 mr-2" />
            Commencer
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GritQuestCard;