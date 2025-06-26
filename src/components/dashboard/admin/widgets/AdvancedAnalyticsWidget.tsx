
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, Users, Activity } from 'lucide-react';

const AdvancedAnalyticsWidget: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Alerte critique */}
      <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
            Alertes Critiques
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900 dark:text-red-100">3</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="destructive" className="text-xs">
              Urgent
            </Badge>
          </div>
          <ul className="text-xs text-red-700 dark:text-red-300 mt-2 space-y-1">
            <li>• 3 employés avec score &lt; 50%</li>
            <li>• Département Finance en baisse</li>
            <li>• Absentéisme en hausse (Tech)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Tendance négative */}
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">
            Tendances Négatives
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">7</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
              -12% cette semaine
            </Badge>
          </div>
          <ul className="text-xs text-orange-700 dark:text-orange-300 mt-2 space-y-1">
            <li>• Satisfaction client en baisse</li>
            <li>• Temps de réponse augmenté</li>
            <li>• Motivation équipe Marketing</li>
          </ul>
        </CardContent>
      </Card>

      {/* Utilisateurs à risque */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Utilisateurs à Risque
          </CardTitle>
          <Users className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">12</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700">
              Surveillance
            </Badge>
          </div>
          <ul className="text-xs text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
            <li>• Score bien-être &lt; 60%</li>
            <li>• Activité en diminution</li>
            <li>• Signalements RH récents</li>
          </ul>
        </CardContent>
      </Card>

      {/* Performance globale */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Performance Globale
          </CardTitle>
          <Activity className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">78%</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs border-blue-500 text-blue-700">
              Stable
            </Badge>
          </div>
          <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 space-y-1">
            <li>• Objectifs mensuels : 85%</li>
            <li>• Engagement équipe : 82%</li>
            <li>• Satisfaction RH : 91%</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalyticsWidget;
