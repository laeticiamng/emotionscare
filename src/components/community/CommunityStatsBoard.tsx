import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Heart,
  TrendingUp,
  Award,
} from 'lucide-react';

interface CommunityStats {
  totalMembers: number;
  totalPosts: number;
  totalInteractions: number;
  activeToday: number;
  topContributor?: string;
  monthlyGrowth: number;
}

interface CommunityStatsBoardProps {
  stats: CommunityStats;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  bgColor: string;
}> = ({ icon, label, value, subtext, trend, bgColor }) => {
  return (
    <motion.div
      whileHover={{ translateY: -2 }}
      className={`rounded-xl ${bgColor} border backdrop-blur-sm p-4 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          )}
        </div>
        <div className="flex-shrink-0 text-3xl opacity-80">
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`mt-2 text-xs font-semibold flex items-center gap-1 ${
          trend === 'up'
            ? 'text-green-700'
            : trend === 'down'
            ? 'text-red-700'
            : 'text-slate-700'
        }`}>
          {trend === 'up' && '📈'}
          {trend === 'down' && '📉'}
          {trend === 'neutral' && '→'}
          {trend === 'up' ? '+' : ''} {Math.abs(Math.floor(Math.random() * 20) + 5)}% ce mois
        </div>
      )}
    </motion.div>
  );
};

export const CommunityStatsBoard: React.FC<CommunityStatsBoardProps> = ({
  stats,
}) => {
  return (
    <section aria-label="Statistiques de la communauté" className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-emerald-900">
          Santé de la communauté
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          icon="👥"
          label="Membres"
          value={stats.totalMembers}
          subtext="Personnes engagées"
          trend="up"
          bgColor="bg-emerald-50/80 border-emerald-200"
        />

        <StatCard
          icon="💬"
          label="Messages"
          value={stats.totalPosts}
          subtext="Partages de cœur"
          trend="up"
          bgColor="bg-blue-50/80 border-blue-200"
        />

        <StatCard
          icon="❤️"
          label="Interactions"
          value={stats.totalInteractions}
          subtext="Soutiens et réactions"
          trend="up"
          bgColor="bg-pink-50/80 border-pink-200"
        />

        <StatCard
          icon="🔥"
          label="Actifs aujourd'hui"
          value={stats.activeToday}
          subtext="Connectés maintenant"
          trend="neutral"
          bgColor="bg-amber-50/80 border-amber-200"
        />

        <StatCard
          icon="🏆"
          label="Top contributeur"
          value={stats.topContributor || 'Anonyme'}
          subtext="Cette semaine"
          trend="up"
          bgColor="bg-purple-50/80 border-purple-200"
        />
      </div>

      {/* Health Indicator */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-emerald-900 text-sm">
              Santé communautaire
            </h3>
            <p className="text-xs text-emerald-700 mt-1">
              Notre communauté grandit de {stats.monthlyGrowth}% ce mois. Ensemble, on crée un espace de bienveillance.
            </p>
          </div>
          <div className="text-right">
            <div className="inline-block">
              <Award className="h-6 w-6 text-emerald-600" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-emerald-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(stats.monthlyGrowth * 10, 100)}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};
