
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardStats, GamificationData } from './types';

interface KpiSummaryCardsProps {
  dashboardStats: DashboardStats;
  gamificationData: GamificationData;
}

const KpiSummaryCards: React.FC<KpiSummaryCardsProps> = ({ dashboardStats, gamificationData }) => {
  return (
    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-1">
          <CardTitle className="text-lg">Productivité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{dashboardStats.productivity.current}%</div>
          <div className="text-sm text-green-600 flex items-center">
            ↑ +{dashboardStats.productivity.trend}% vs période précédente
          </div>
        </CardContent>
      </Card>

      <Card className="p-4 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-1">
          <CardTitle className="text-lg">Score émotionnel moyen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">{dashboardStats.emotionalScore.current}/100</div>
          <div className="text-sm text-green-600 flex items-center">
            ↑ +{dashboardStats.emotionalScore.trend}% vs période précédente
          </div>
        </CardContent>
      </Card>

      <Card className="p-4 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-1">
          <CardTitle className="text-lg">Engagement gamification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600">{gamificationData.activeUsersPercent}%</div>
          <div className="text-sm text-green-600 flex items-center">
            {gamificationData.totalBadges} badges distribués ce mois
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiSummaryCards;
