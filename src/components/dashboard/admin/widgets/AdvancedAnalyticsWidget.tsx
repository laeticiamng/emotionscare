
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Users } from 'lucide-react';

interface AnalyticsMetric {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'success' | 'warning' | 'danger';
}

const AdvancedAnalyticsWidget: React.FC = () => {
  const metrics: AnalyticsMetric[] = [
    {
      title: "Score émotionnel moyen",
      value: "72%",
      change: +5.2,
      trend: 'up',
      status: 'success'
    },
    {
      title: "Engagement équipe",
      value: "68%",
      change: -2.1,
      trend: 'down',
      status: 'warning'
    },
    {
      title: "Satisfaction globale",
      value: "78%",
      change: +3.4,
      trend: 'up',
      status: 'success'
    },
    {
      title: "Risque burnout",
      value: "12%",
      change: +1.8,
      trend: 'up',
      status: 'danger'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Bon</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Attention</Badge>;
      case 'danger':
        return <Badge variant="destructive">Critique</Badge>;
      default:
        return <Badge variant="outline">Neutre</Badge>;
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Analyses Avancées RH
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{metric.title}</h4>
                {getStatusBadge(metric.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{metric.value}</span>
                {getTrendIcon(metric.trend)}
                <span className={`text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Alertes & Recommandations</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Risque Burnout Détecté</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• 3 employés avec score &lt; 50%</li>
                  <li>• Département Finance en baisse</li>
                  <li>• Absentéisme en hausse (Tech)</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
              <TrendingDown className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Engagement en baisse</p>
                <p className="text-xs text-muted-foreground mt-1">Recommandation: Organiser des sessions d'écoute</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { AdvancedAnalyticsWidget };
export default AdvancedAnalyticsWidget;
