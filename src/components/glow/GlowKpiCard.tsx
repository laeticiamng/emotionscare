// @ts-nocheck

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Sparkles, Wind, Footprints, Coffee, TrendingUp, TrendingDown } from 'lucide-react';

interface GlowKpiCardProps {
  title: string;
  value: number;
  unit?: string;
  icon: 'sparkle' | 'wind' | 'walk' | 'cup';
  trend?: number;
  index: number;
}

const iconMap = {
  sparkle: Sparkles,
  wind: Wind,
  walk: Footprints,
  cup: Coffee
};

const titleMap = {
  sparkle: 'Décompression',
  wind: 'Breathe Sync',
  walk: 'Move',
  cup: 'Zen Drop'
};

export const GlowKpiCard: React.FC<GlowKpiCardProps> = ({
  title,
  value,
  unit = '',
  icon,
  trend,
  index
}) => {
  const IconComponent = iconMap[icon];
  const displayTitle = titleMap[icon];
  const slugify = (text: string) =>
    text
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '-')
      .toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
    >
      <Card
        data-testid={`kpi-card-${slugify(displayTitle)}`}
        className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border-white/20 shadow-lg"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100">
              <IconComponent className="w-5 h-5 text-purple-600" />
            </div>
            {trend !== undefined && (
              <div className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {trend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                <span>{trend >= 0 ? '+' : ''}{trend}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {value.toFixed(value % 1 === 0 ? 0 : 1)}{unit}
            </p>
            <p className="text-sm text-gray-600 font-medium">{displayTitle}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
