// @ts-nocheck
import React from 'react';
import { type GlowBucket } from '@/hooks/useDashboardWeekly';
import { useTranslation } from 'react-i18next';

interface WeeklySummarySRProps {
  days: Array<{ date: string; glow_bucket: GlowBucket; tip?: string }>;
}

const analyzeTrend = (days: Array<{ glow_bucket: GlowBucket }>): 'up' | 'down' | 'flat' => {
  if (days.length < 2) return 'flat';
  
  const bucketValues = { low: 1, medium: 2, high: 3 };
  const values = days.map(d => bucketValues[d.glow_bucket]);
  
  let upCount = 0;
  let downCount = 0;
  
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i - 1]) upCount++;
    else if (values[i] < values[i - 1]) downCount++;
  }
  
  if (upCount > downCount) return 'up';
  if (downCount > upCount) return 'down';
  return 'flat';
};

const getDayCounts = (days: Array<{ glow_bucket: GlowBucket }>) => {
  return {
    low: days.filter(d => d.glow_bucket === 'low').length,
    medium: days.filter(d => d.glow_bucket === 'medium').length,
    high: days.filter(d => d.glow_bucket === 'high').length
  };
};

export const WeeklySummarySR: React.FC<WeeklySummarySRProps> = ({ days }) => {
  const { t } = useTranslation();
  const trend = analyzeTrend(days);
  const counts = getDayCounts(days);
  
  const trendText = t(`weekly.summary.${trend}`);
  
  const summary = `
    ${trendText}. 
    ${counts.high} jours au top, 
    ${counts.medium} jours stables, 
    ${counts.low} jours de recharge.
  `.trim();

  return (
    <div className="sr-only" aria-live="polite">
      Tendance 7 jours : {summary}
    </div>
  );
};