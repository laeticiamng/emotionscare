/**
 * B2BDashboardAnalytics - Dashboard Établissement
 * Vue d'ensemble anonymisée de l'état émotionnel des équipes
 * Tendance bien-être (LineChart), Stress (PieChart), Utilisation (BarChart)
 * Données mockées prêtes pour Supabase
 */

import React, { useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Shield,
  Heart,
  AlertTriangle,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ══════════════════════════════════════════
// MOCK DATA — prêtes pour remplacement Supabase
// ══════════════════════════════════════════

const weeklyWellbeing = [
  { semaine: 'Sem 1', score: 6.2, participants: 42 },
  { semaine: 'Sem 2', score: 6.5, participants: 45 },
  { semaine: 'Sem 3', score: 5.9, participants: 48 },
  { semaine: 'Sem 4', score: 6.8, participants: 50 },
  { semaine: 'Sem 5', score: 7.1, participants: 52 },
  { semaine: 'Sem 6', score: 6.9, participants: 51 },
  { semaine: 'Sem 7', score: 7.3, participants: 55 },
  { semaine: 'Sem 8', score: 7.5, participants: 58 },
];

const stressDistribution = [
  { name: 'Faible', value: 35, color: 'hsl(142, 76%, 36%)' },
  { name: 'Modéré', value: 40, color: 'hsl(38, 92%, 50%)' },
  { name: 'Élevé', value: 18, color: 'hsl(25, 95%, 53%)' },
  { name: 'Critique', value: 7, color: 'hsl(0, 84%, 60%)' },
];

const serviceUsage = [
  { service: 'Urgences', taux: 78, sessions: 156 },
  { service: 'Réanimation', taux: 85, sessions: 210 },
  { service: 'Pédiatrie', taux: 62, sessions: 93 },
  { service: 'Chirurgie', taux: 71, sessions: 142 },
  { service: 'Gériatrie', taux: 55, sessions: 88 },
  { service: 'Maternité', taux: 68, sessions: 102 },
];

const kpis = [
  {
    label: 'Score bien-être moyen',
    value: '7.5',
    suffix: '/10',
    change: '+0.6',
    trend: 'up' as const,
    icon: Heart,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    label: 'Utilisateurs actifs',
    value: '58',
    suffix: '',
    change: '+12%',
    trend: 'up' as const,
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    label: 'Sessions cette semaine',
    value: '234',
    suffix: '',
    change: '+18%',
    trend: 'up' as const,
    icon: Activity,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    label: 'Alertes prévention',
    value: '3',
    suffix: '',
    change: '-2',
    trend: 'down' as const,
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
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            trend === 'up'
              ? 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30'
              : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30'
          )}
        >
          {trend === 'up' ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
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

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-muted-foreground">
          {entry.name}: <span className="font-medium text-foreground">{entry.value}</span>
        </p>
      ))}
    </div>
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

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart - Tendance bien-être */}
          <motion.div
            ref={lineRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isLineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Tendance bien-être hebdomadaire</h2>
                <p className="text-sm text-muted-foreground">
                  Score moyen d'équilibre émotionnel
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
                <ArrowUpRight className="h-4 w-4" />
                +21% en 8 semaines
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyWellbeing}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="semaine"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    domain={[4, 10]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Score bien-être"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart - Répartition stress */}
          <motion.div
            ref={pieRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isPieInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card border border-border/50 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold mb-1">Répartition du stress</h2>
            <p className="text-sm text-muted-foreground mb-4">Niveaux déclarés cette semaine</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stressDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stressDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {stressDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name}{' '}
                    <span className="font-medium text-foreground">{item.value}%</span>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart - Utilisation par service */}
          <motion.div
            ref={barRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isBarInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 bg-card border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Taux d'utilisation par service</h2>
                <p className="text-sm text-muted-foreground">
                  Pourcentage d'adoption et nombre de sessions
                </p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="service"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="taux"
                    name="Taux d'utilisation (%)"
                    fill="hsl(var(--primary))"
                    radius={[0, 8, 8, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
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
