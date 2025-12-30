/**
 * StimulusCard - Carte de stimulus stressant
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Bell, Clock, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StimulusSpec } from '@/store/bounce.store';

interface StimulusCardProps {
  stimulus: StimulusSpec;
  onDismiss: () => void;
}

const getIcon = (kind: StimulusSpec['kind']) => {
  switch (kind) {
    case 'mail': return Mail;
    case 'notif': return Bell;
    case 'timer': return Clock;
    default: return Bell;
  }
};

const getColorClass = (kind: StimulusSpec['kind']) => {
  switch (kind) {
    case 'mail': return 'bg-destructive/10 border-destructive/30 text-destructive';
    case 'notif': return 'bg-warning/10 border-warning/30 text-warning';
    case 'timer': return 'bg-info/10 border-info/30 text-info';
    default: return 'bg-muted border-border text-muted-foreground';
  }
};

const getLabel = (kind: StimulusSpec['kind']) => {
  switch (kind) {
    case 'mail': return 'Email urgent';
    case 'notif': return 'Notification';
    case 'timer': return 'Deadline';
    default: return 'Alerte';
  }
};

export const StimulusCard: React.FC<StimulusCardProps> = ({ stimulus, onDismiss }) => {
  const Icon = getIcon(stimulus.kind);
  const colorClass = getColorClass(stimulus.kind);

  return (
    <motion.div
      initial={{ rotate: -2 }}
      animate={{ 
        rotate: [0, 1, -1, 0],
        transition: { repeat: Infinity, duration: 0.5 }
      }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={`relative overflow-hidden border-2 ${colorClass}`}>
        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 bg-current opacity-5"
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />

        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="gap-1">
              <Icon className="w-3 h-3" />
              {getLabel(stimulus.kind)}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-background/50"
              onClick={onDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-3">
          {stimulus.kind === 'mail' && (
            <>
              <p className="font-semibold text-sm text-foreground mb-1">
                {stimulus.payload.subject}
              </p>
              <p className="text-xs text-muted-foreground">
                De: {stimulus.payload.sender}
              </p>
            </>
          )}

          {stimulus.kind === 'notif' && (
            <>
              <p className="font-semibold text-sm text-foreground mb-1">
                {stimulus.payload.app}
              </p>
              <p className="text-xs text-muted-foreground">
                {stimulus.payload.message}
              </p>
            </>
          )}

          {stimulus.kind === 'timer' && (
            <>
              <p className="font-semibold text-sm text-foreground mb-1">
                {stimulus.payload.label}
              </p>
              <p className="text-xs text-muted-foreground">
                ⏰ {Math.floor(stimulus.payload.remaining / 60)}:{(stimulus.payload.remaining % 60).toString().padStart(2, '0')} restantes
              </p>
            </>
          )}

          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
              className="text-xs h-7"
            >
              Gérer calmement
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
