// @ts-nocheck
/**
 * B2BDashboardAnalytics - Dashboard Établissement
 * Vue d'ensemble anonymisée de l'état émotionnel des équipes
 * Tendance bien-être (LineChart), Stress (PieChart), Utilisation (BarChart)
 * Prêt pour intégration Supabase
 */

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Users,
  Activity,
  Shield,
  Heart,
  AlertTriangle,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ══════════════════════════════════════════
// Empty data — ready for Supabase integration
// ══════════════════════════════════════════

const weeklyWellbeing: { semaine: string; score: number; participants: number }[] = [];
const stressDistribution: { name: string; value: number; color: string }[] = [];
const serviceUsage: { service: string; taux: number; sessions: number }[] = [];

const kpis = [
  {
    label: 'Score bien-être moyen',
    value: '--',
    suffix: '/10',
    change: '--',
    trend: 'up' as const,
    icon: Heart,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    label: 'Utilisateurs actifs',
    value: '0',
    suffix: '',
    change: '--',
    trend: 'up' as const,
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    label: 'Sessions cette semaine',
    value: '0',
    suffix: '',
    change: '--',
    trend: 'up' as const,
    icon: Activity,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    label: 'Alertes prévention',
    value: '0',
    suffix: '',
    change: '--',
    trend: 'up' as const,
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
  },
];

// ══════════════════════════════════════════

interface StatCardProps {
  label: string;
  value: string;
  suffix?: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.FC<{ className?: string }>;
  color: string;
  bgColor: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix,
  change,
  trend,
  icon: Icon,
  color,
  bgColor,
  index,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-2.5 rounded-xl', bgColor)}>
          <Icon className={cn('h-5 w-5', color)} />
        </div>
        <div className="text-xs text-muted-foreground px-2 py-1">
          {change}
        </div>
      </div>
      <div className="text-3xl font-bold">
        {value}
        {suffix && <span className="text-lg text-muted-foreground font-normal">{suffix}</span>}
      </div>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
};

const B2BDashboardAnalytics: React.FC = () => {
  const lineRef = useRef<HTMLDivElement>(null);
  const pieRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const isLineInView = useInView(lineRef, { once: true, amount: 0.2 });
  const isPieInView = useInView(pieRef, { once: true, amount: 0.2 });
  const isBarInView = useInView(barRef, { once: true, amount: 0.2 });

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                <Shield className="h-3 w-3" />
                Données anonymisées
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Dashboard{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Établissement
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Vue d'ensemble du bien-être émotionnel de vos équipes
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
              <Calendar className="h-4 w-4" />
              8 dernières semaines
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <StatCard key={kpi.label} {...kpi} index={i} />
          ))}
        </div>

        {/* Empty state for charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart placeholder */}
          <motion.div
            ref={lineRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isLineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Tendance bien-être hebdomadaire</h2>
              <p className="text-sm text-muted-foreground">
                Score moyen d'équilibre émotionnel
              </p>
            </div>
            <div className="h-72 flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                Aucune donnée de tendance disponible
              </div>
            </div>
          </motion.div>

          {/* Pie Chart placeholder */}
          <motion.div
            ref={pieRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isPieInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card border border-border/50 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold mb-1">Répartition du stress</h2>
            <p className="text-sm text-muted-foreground mb-4">Niveaux déclarés cette semaine</p>
            <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center">
                Aucune donnée de stress disponible
              </div>
            </div>
          </motion.div>

          {/* Bar Chart placeholder */}
          <motion.div
            ref={barRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isBarInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 bg-card border border-border/50 rounded-2xl p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Taux d'utilisation par service</h2>
              <p className="text-sm text-muted-foreground">
                Pourcentage d'adoption et nombre de sessions
              </p>
            </div>
            <div className="h-72 flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center">
                Aucune donnée d'utilisation disponible
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="h-3 w-3" />
            Toutes les données sont anonymisées conformément au RGPD. Aucune donnée individuelle n'est accessible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default B2BDashboardAnalytics;
