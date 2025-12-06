// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const mockTeams = [
  {
    id: 'team-1',
    name: 'Marketing',
    activity: 87,
    members: 8,
    mood: 'positive'
  },
  {
    id: 'team-2',
    name: 'Développement',
    activity: 92,
    members: 12,
    mood: 'positive'
  },
  {
    id: 'team-3',
    name: 'Support',
    activity: 65,
    members: 6,
    mood: 'neutral'
  },
  {
    id: 'team-4',
    name: 'Ventes',
    activity: 43,
    members: 9,
    mood: 'negative'
  }
];

interface TeamActivitySummaryProps {
  className?: string;
}

const TeamActivitySummary: React.FC<TeamActivitySummaryProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-5 ${className}`}>
      {mockTeams.map((team, index) => (
        <motion.div 
          key={team.id}
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                team.mood === 'positive' ? 'bg-success' : 
                team.mood === 'neutral' ? 'bg-warning' : 
                'bg-destructive'
              }`}></div>
              <span className="font-medium">{team.name}</span>
              <Badge variant="outline" className="ml-2">
                {team.members} membres
              </Badge>
            </div>
            <span className="text-sm font-medium">{team.activity}%</span>
          </div>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          >
            <Progress 
              value={team.activity} 
              className={`h-2 ${
                team.activity > 80 ? 'bg-success/10' : 
                team.activity > 50 ? 'bg-warning/10' : 
                'bg-destructive/10'
              }`}
            />
          </motion.div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Dernière activité: il y a 45 min</span>
            <span>{team.activity > 80 ? 'Très actif' : team.activity > 50 ? 'Actif' : 'Peu actif'}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamActivitySummary;
