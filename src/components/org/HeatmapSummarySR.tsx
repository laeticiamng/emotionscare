// @ts-nocheck
import React from 'react';
import { OrgWeekly, Trend } from '@/hooks/useOrgWeekly';

interface HeatmapSummarySRProps {
  data: OrgWeekly;
}

export const HeatmapSummarySR: React.FC<HeatmapSummarySRProps> = ({ data }) => {
  const eligibleTeams = data.teams.filter(team => team.eligible);
  
  const trends = eligibleTeams.reduce((acc, team) => {
    if (team.trend) {
      acc[team.trend] = (acc[team.trend] || 0) + 1;
    }
    return acc;
  }, {} as Record<Trend, number>);

  const summary = [
    trends.up && `${trends.up} équipes en hausse`,
    trends.flat && `${trends.flat} équipes stables`, 
    trends.down && `${trends.down} équipes en baisse`,
  ].filter(Boolean).join(', ');

  return (
    <div className="sr-only" aria-live="polite">
      Résumé de la heatmap vibes sur {eligibleTeams.length} équipes : {summary || 'Aucune tendance disponible'}.
      Période analysée du {data.from} au {data.to}.
      Seuil minimum d'anonymat : {data.min_n} personnes par équipe.
    </div>
  );
};