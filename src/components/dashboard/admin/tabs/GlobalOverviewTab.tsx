
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import EmotionalClimateCard from '../EmotionalClimateCard';

interface GlobalOverviewTabProps {
  absenteeismChartData: Array<{ date: string; value: number }>;
  emotionalScoreTrend: Array<{ date: string; value: number }>;
  dashboardStats: {
    productivity: {
      current: number;
      trend: number;
    };
    emotionalScore: {
      current: number;
      trend: number;
    };
  };
  gamificationData: {
    activeUsersPercent: number;
    totalBadges: number;
  };
}

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ 
  absenteeismChartData, 
  emotionalScoreTrend,
  dashboardStats,
  gamificationData
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Absenteeism Chart */}
      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="text-[#1B365D]" />
            Taux d'absentéisme
          </CardTitle>
          <CardDescription>
            Évolution du taux d'absence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={absenteeismChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Emotional Climate Card */}
      <EmotionalClimateCard emotionalScoreTrend={emotionalScoreTrend} />
      
      {/* KPI Summary Cards */}
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
      
      <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 rounded-xl text-sm text-muted-foreground">
        <p>Note RGPD: Données agrégées et anonymisées. Aucune information personnellement identifiable (PII) n'est utilisée.</p>
      </div>
    </div>
  );
};

export default GlobalOverviewTab;
