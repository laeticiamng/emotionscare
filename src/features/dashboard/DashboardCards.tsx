import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Footprints, MessageCircle, Music, PenTool, Scan, Wind } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Who5Tone } from '@/features/orchestration/useWho5Orchestration';
import { getCardNudge, getToneCopy, type DashboardCardId } from '@/features/dashboard/nudges';
import { cn } from '@/lib/utils';

type DashboardCardsProps = {
  order: string[];
  tone: Who5Tone;
};

type CardConfig = {
  title: string;
  description: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: string;
};

const CARD_CATALOG: Record<DashboardCardId, CardConfig> = {
  'card-nyvee': {
    title: 'Nyvée',
    description: 'Un échange chaleureux avec l’IA compagnon.',
    to: '/app/coach',
    icon: MessageCircle,
    accent: 'bg-purple-100/10 text-purple-200',
  },
  'card-breath': {
    title: 'Respiration',
    description: 'Séance guidée pour réguler le souffle et apaiser le corps.',
    to: '/app/breath',
    icon: Wind,
    accent: 'bg-sky-100/10 text-sky-200',
  },
  'card-music': {
    title: 'Musique adaptative',
    description: 'Ambiances sur mesure pour soutenir le moment présent.',
    to: '/app/music',
    icon: Music,
    accent: 'bg-blue-100/10 text-blue-200',
  },
  'card-journal': {
    title: 'Journal léger',
    description: 'Un espace pour déposer quelques phrases en toute simplicité.',
    to: '/app/journal',
    icon: PenTool,
    accent: 'bg-emerald-100/10 text-emerald-200',
  },
  'card-scan': {
    title: 'Scan émotionnel',
    description: 'Observer le visage et repérer les nuances du moment.',
    to: '/app/scan',
    icon: Scan,
    accent: 'bg-amber-100/10 text-amber-200',
  },
  'card-coach': {
    title: 'Micro-action',
    description: 'Un petit pas guidé pour faire circuler l’énergie.',
    to: '/app/coach-micro',
    icon: Footprints,
    accent: 'bg-rose-100/10 text-rose-200',
  },
};

const DEFAULT_ORDER: DashboardCardId[] = [
  'card-nyvee',
  'card-breath',
  'card-music',
  'card-journal',
  'card-scan',
  'card-coach',
];

const toneBadgeClasses: Record<Who5Tone, string> = {
  very_low: 'bg-sky-950/40 text-sky-100',
  low: 'bg-sky-900/40 text-sky-50',
  neutral: 'bg-slate-900/40 text-slate-100',
  high: 'bg-indigo-900/40 text-indigo-100',
  very_high: 'bg-amber-900/40 text-amber-50',
};

export const DashboardCards: React.FC<DashboardCardsProps> = ({ order, tone }) => {
  const toneCopy = getToneCopy(tone);

  const resolvedOrder = useMemo<DashboardCardId[]>(() => {
    const unique = new Set<DashboardCardId>();
    order.forEach((id) => {
      if ((CARD_CATALOG as Record<string, CardConfig>)[id]) {
        unique.add(id as DashboardCardId);
      }
    });
    DEFAULT_ORDER.forEach((id) => unique.add(id));
    return Array.from(unique);
  }, [order]);

  return (
    <section aria-label="Suggestions du jour" className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className={cn('rounded-full px-3 py-1 text-sm font-medium', toneBadgeClasses[tone])}>{toneCopy.headline}</span>
        <p className="text-sm text-slate-300">{toneCopy.helper}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {resolvedOrder.map((cardId) => {
          const config = CARD_CATALOG[cardId];
          const CardIcon = config.icon;
          const nudge = getCardNudge(cardId, tone);

          return (
            <Card key={cardId} role="article" className="border border-slate-800/60 bg-slate-950/60">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', config.accent)}>
                  <CardIcon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-base text-slate-100">{config.title}</CardTitle>
                  <CardDescription className="text-slate-300">{nudge}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-300">{config.description}</p>
                <Button asChild variant="ghost" className="justify-start gap-2 px-0 text-slate-200 hover:text-slate-50">
                  <Link to={config.to} aria-label={`${config.title} - ouvrir`} className="flex items-center gap-2">
                    <span>Découvrir</span>
                    <span aria-hidden className="font-semibold text-slate-100">→</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardCards;
