// @ts-nocheck
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Users, 
  BarChart3, 
  AlertTriangle 
} from 'lucide-react';
import { OrgKPI } from '@/hooks/useOrgInsights';

interface OrgKpiStripProps {
  kpi: OrgKPI;
}

/**
 * Bande d'indicateurs textuels pour le dashboard RH
 */
export const OrgKpiStrip: React.FC<OrgKpiStripProps> = ({ kpi }) => {
  const getTrendIcon = () => {
    switch (kpi.globalTrend) {
      case 'up': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'down': return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'flat': return <Minus className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getTrendColor = () => {
    switch (kpi.globalTrend) {
      case 'up': return 'text-green-700 bg-green-50';
      case 'down': return 'text-red-700 bg-red-50';
      case 'flat': return 'text-yellow-700 bg-yellow-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Équipes éligibles */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {kpi.eligibleTeams}
              </p>
              <p className="text-sm text-muted-foreground">
                équipes analysées
              </p>
              <p className="text-xs text-muted-foreground">
                sur {kpi.totalTeams} au total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tendance globale */}
      <Card className={getTrendColor()}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/50 rounded-lg">
              {getTrendIcon()}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Tendance
              </p>
              <p className="text-lg font-semibold">
                {kpi.globalTrendLabel}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Répartition */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Répartition
              </p>
              <p className="text-lg font-semibold">
                {kpi.distributionLabel}
              </p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{kpi.distribution.low}C</span>
                <span>{kpi.distribution.medium}S</span>
                <span>{kpi.distribution.high}É</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Équipes à surveiller */}
      <Card className={kpi.atRiskTeams > 0 ? 'border-amber-200 bg-amber-50' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${kpi.atRiskTeams > 0 ? 'bg-amber-100' : 'bg-gray-100'}`}>
              <AlertTriangle className={`w-5 h-5 ${kpi.atRiskTeams > 0 ? 'text-amber-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                À surveiller
              </p>
              <p className={`text-lg font-semibold ${kpi.atRiskTeams > 0 ? 'text-amber-800' : ''}`}>
                {kpi.atRiskLabel}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};