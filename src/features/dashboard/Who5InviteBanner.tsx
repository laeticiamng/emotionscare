// @ts-nocheck
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Who5Tone } from '@/features/orchestration/useWho5Orchestration';
import { cn } from '@/lib/utils';

interface Who5InviteBannerProps {
  summary: string;
  tone: Who5Tone;
  onStart: () => Promise<void>;
  onSnooze?: () => void;
}

const toneBackground: Record<Who5Tone, string> = {
  very_low: 'from-sky-950/60 via-slate-900/50 to-slate-900/40',
  low: 'from-sky-900/60 via-slate-900/40 to-purple-900/40',
  neutral: 'from-slate-900/50 via-slate-800/40 to-slate-900/40',
  high: 'from-indigo-900/50 via-purple-900/40 to-slate-900/40',
  very_high: 'from-amber-900/50 via-purple-900/40 to-slate-900/40',
};

export const Who5InviteBanner: React.FC<Who5InviteBannerProps> = ({ summary, tone, onStart, onSnooze }) => {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <Card
      role="region"
      aria-label="Invitation à partager votre ressenti"
      className={cn(
        'overflow-hidden border-none bg-gradient-to-r text-slate-100 shadow-md shadow-slate-950/30',
        toneBackground[tone],
      )}
    >
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-1 rounded-full bg-slate-900/60 p-2">
            <HeartHandshake className="h-6 w-6 text-slate-100" aria-hidden />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-200">Écoute hebdomadaire</p>
            <p className="text-base text-slate-100">Partagez comment vous allez aujourd’hui.</p>
            <p className="text-sm text-slate-200/80">{summary}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            className="bg-slate-100 text-slate-900 hover:bg-slate-50"
            onClick={() => {
              void onStart();
            }}
          >
            D’accord
          </Button>
          <Button
            variant="ghost"
            className="text-slate-100 hover:bg-slate-100/10"
            onClick={() => onSnooze?.()}
          >
            Plus tard
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (prefersReducedMotion) {
    return content;
  }

  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      {content}
    </motion.div>
  );
};

export default Who5InviteBanner;
