/**
 * StimulusCard - Carte de stimulus stressant avec payloads typés
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Bell, Clock, X, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Typed payloads for each stimulus kind
interface MailPayload {
  subject: string;
  sender: string;
  preview?: string;
}

interface NotifPayload {
  app: string;
  message: string;
  icon?: string;
}

interface TimerPayload {
  label: string;
  remaining: number;
}

export interface StimulusSpec {
  kind: 'mail' | 'notif' | 'timer';
  payload: MailPayload | NotifPayload | TimerPayload;
  at: number;
  id: string;
  processed?: boolean;
}

interface StimulusCardProps {
  stimulus: StimulusSpec;
  onDismiss: () => void;
}

const getIcon = (kind: StimulusSpec['kind']) => {
  switch (kind) {
    case 'mail': return Mail;
    case 'notif': return Bell;
    case 'timer': return Clock;
    default: return AlertTriangle;
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

// Type guards for payloads
const isMailPayload = (payload: any): payload is MailPayload => {
  return payload && typeof payload.subject === 'string' && typeof payload.sender === 'string';
};

const isNotifPayload = (payload: any): payload is NotifPayload => {
  return payload && typeof payload.app === 'string' && typeof payload.message === 'string';
};

const isTimerPayload = (payload: any): payload is TimerPayload => {
  return payload && typeof payload.label === 'string' && typeof payload.remaining === 'number';
};

export const StimulusCard: React.FC<StimulusCardProps> = ({ stimulus, onDismiss }) => {
  const Icon = getIcon(stimulus.kind);
  const colorClass = getColorClass(stimulus.kind);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Countdown for timer stimuli
  useEffect(() => {
    if (stimulus.kind === 'timer' && isTimerPayload(stimulus.payload)) {
      setTimeLeft(stimulus.payload.remaining);
      const interval = setInterval(() => {
        setTimeLeft(prev => prev !== null && prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stimulus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ rotate: -2, scale: 0.9 }}
      animate={{ 
        rotate: [0, 1, -1, 0],
        scale: 1,
        transition: { 
          rotate: { repeat: Infinity, duration: 0.5 },
          scale: { duration: 0.2 }
        }
      }}
      whileHover={{ scale: 1.02 }}
      role="alert"
      aria-live="polite"
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
              <Icon className="w-3 h-3" aria-hidden="true" />
              {getLabel(stimulus.kind)}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-background/50"
              onClick={onDismiss}
              aria-label="Gérer ce stimulus"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-3">
          {stimulus.kind === 'mail' && isMailPayload(stimulus.payload) && (
            <>
              <p className="font-semibold text-sm text-foreground mb-1">
                {stimulus.payload.subject}
              </p>
              <p className="text-xs text-muted-foreground">
                De: {stimulus.payload.sender}
              </p>
              {stimulus.payload.preview && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {stimulus.payload.preview}
                </p>
              )}
            </>
          )}

          {stimulus.kind === 'notif' && isNotifPayload(stimulus.payload) && (
            <>
              <p className="font-semibold text-sm text-foreground mb-1">
                {stimulus.payload.app}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {stimulus.payload.message}
              </p>
            </>
          )}

          {stimulus.kind === 'timer' && isTimerPayload(stimulus.payload) && (
            <>
              <p className="font-semibold text-sm text-foreground mb-1">
                {stimulus.payload.label}
              </p>
              <p className={`text-xs font-mono ${timeLeft !== null && timeLeft < 30 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                ⏰ {formatTime(timeLeft ?? stimulus.payload.remaining)} restantes
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
