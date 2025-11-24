import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, MessageCircle, Music, PenTool, Scan, Sparkles, Wind } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Who5Tone, Who5Orchestration } from '@/features/orchestration/useWho5Orchestration';
import { cn } from '@/lib/utils';

type PrimaryCTAProps = {
  kind: Who5Orchestration['primaryCta'];
  tone: Who5Tone;
};

type CtaConfig = {
  label: string;
  description: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const CTA_COPY: Record<Who5Orchestration['primaryCta'], CtaConfig> = {
  breath_soft: {
    label: 'Respirer doucement',
    description: 'Un instant guidé pour laisser retomber la tension.',
    to: '/app/breath',
    icon: Wind,
  },
  nyvee_calm: {
    label: 'Parler à Nyvée',
    description: 'Une écoute immédiate pour déposer ce qui pèse.',
    to: '/app/coach',
    icon: MessageCircle,
  },
  journal_light: {
    label: 'Écrire quelques mots',
    description: 'Un petit récit pour éclairer le moment présent.',
    to: '/app/journal',
    icon: PenTool,
  },
  music_soft: {
    label: 'Lancer une ambiance douce',
    description: 'Un cocon sonore sur mesure pour prolonger l’apaisement.',
    to: '/app/music',
    icon: Music,
  },
  scan: {
    label: 'Observer mon état',
    description: 'Un scan calme pour prendre le pouls intérieur.',
    to: '/app/scan',
    icon: Scan,
  },
  coach_micro: {
    label: 'Bouger en douceur',
    description: 'Une micro-action guidée pour canaliser l’énergie.',
    to: '/app/coach-micro',
    icon: Sparkles,
  },
};

const TONE_ACCENTS: Record<Who5Tone, string> = {
  very_low: 'from-sky-950/40 via-sky-900/20 to-slate-900/30',
  low: 'from-sky-900/30 via-slate-900/20 to-purple-900/20',
  neutral: 'from-slate-900/20 via-slate-800/20 to-slate-900/20',
  high: 'from-purple-900/30 via-indigo-900/20 to-slate-900/20',
  very_high: 'from-amber-900/30 via-purple-900/20 to-slate-900/20',
};

const ICON_BACKGROUNDS: Record<Who5Tone, string> = {
  very_low: 'bg-sky-900/50 text-sky-100',
  low: 'bg-sky-800/50 text-sky-100',
  neutral: 'bg-slate-800/60 text-slate-100',
  high: 'bg-indigo-800/60 text-indigo-100',
  very_high: 'bg-amber-800/60 text-amber-100',
};

const SecondaryIcon: React.FC = () => (
  <Feather className="h-5 w-5 text-slate-200/60" aria-hidden />
);

export const PrimaryCTA: React.FC<PrimaryCTAProps> = ({ kind, tone }) => {
  const config = CTA_COPY[kind];
  const AccentIcon = config.icon;

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-none bg-gradient-to-r text-slate-100 shadow-lg shadow-slate-950/40',
        TONE_ACCENTS[tone],
      )}
      aria-label="Suggestion principale du jour"
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', ICON_BACKGROUNDS[tone])}>
          <AccentIcon className="h-6 w-6" aria-hidden />
        </div>
        <SecondaryIcon />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <CardTitle className="text-xl font-semibold text-slate-50">{config.label}</CardTitle>
          <CardDescription className="text-slate-200/80">{config.description}</CardDescription>
        </div>
        <Button asChild variant="secondary" className="bg-slate-100 text-slate-900 hover:bg-slate-50">
          <Link to={config.to} className="flex items-center gap-2" aria-label={`${config.label} - ouvrir`}>
            <span>{config.label}</span>
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrimaryCTA;
