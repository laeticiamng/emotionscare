// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Globe, Heart, Calendar, Clock } from 'lucide-react';
import { Scope, Period } from '@/store/gamification.store';
import { motion } from 'framer-motion';

interface FiltersBarProps {
  scope: Scope;
  period: Period;
  onScope: (scope: Scope) => void;
  onPeriod: (period: Period) => void;
}

const scopeConfig = {
  friends: {
    label: 'Amis',
    icon: Heart,
    description: 'Classement entre amis'
  },
  org: {
    label: 'Mon équipe',
    icon: Users,
    description: 'Classement d\'équipe'
  },
  global: {
    label: 'Global',
    icon: Globe,
    description: 'Classement mondial'
  }
};

const periodConfig = {
  '7d': {
    label: '7 jours',
    icon: Clock,
    description: 'Dernière semaine'
  },
  '30d': {
    label: '30 jours',
    icon: Calendar,
    description: 'Dernier mois'
  }
};

export const FiltersBar: React.FC<FiltersBarProps> = ({
  scope,
  period,
  onScope,
  onPeriod
}) => {
  return (
    <div className="space-y-4">
      {/* Scope Selection */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Classement</h4>
        <div 
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Sélection du scope de classement"
        >
          {(Object.keys(scopeConfig) as Scope[]).map((key, index) => {
            const config = scopeConfig[key];
            const Icon = config.icon;
            const isSelected = scope === key;
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onScope(key)}
                  className={`flex items-center gap-2 ${
                    isSelected ? '' : 'hover:bg-muted'
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${config.label}: ${config.description}`}
                >
                  <Icon className="w-4 h-4" />
                  {config.label}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Period Selection */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Période</h4>
        <div 
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Sélection de la période"
        >
          {(Object.keys(periodConfig) as Period[]).map((key, index) => {
            const config = periodConfig[key];
            const Icon = config.icon;
            const isSelected = period === key;
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Button
                  variant={isSelected ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onPeriod(key)}
                  className="flex items-center gap-2"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${config.label}: ${config.description}`}
                >
                  <Icon className="w-3 h-3" />
                  {config.label}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Filtres actifs:</span>
        <Badge variant="secondary">
          {scopeConfig[scope].label}
        </Badge>
        <Badge variant="outline">
          {periodConfig[period].label}
        </Badge>
      </div>
    </div>
  );
};