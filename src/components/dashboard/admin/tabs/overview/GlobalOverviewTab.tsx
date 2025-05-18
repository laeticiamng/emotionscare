
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TeamsSummaryTable from './TeamsSummaryTable';
import { Bar } from '@/components/ui/progress';
import { GlobalOverviewTabProps } from '@/types/dashboard';

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ period, segment, filterBy, className }) => {
  return (
    <div className={className}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Score Émotionnel Global</CardTitle>
            <CardDescription>Moyenne sur tous les départements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">75%</div>
            <div className="flex items-center space-x-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <Bar value={75} max={100} className="bg-gradient-to-r from-blue-500 to-indigo-600" />
              </div>
              <span className="text-sm text-muted-foreground">+2% ce mois</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Équipes Actives</CardTitle>
            <CardDescription>Équipes avec activité récente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8/10</div>
            <p className="text-sm text-muted-foreground mt-2">
              2 équipes inactives (+1 depuis dernier mois)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Engagement Hebdomadaire</CardTitle>
            <CardDescription>Taux d'engagement moyen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">84%</div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <Bar value={84} max={100} className="bg-gradient-to-r from-green-500 to-emerald-600" />
              </div>
              <span className="text-sm text-muted-foreground">+5%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Synthèse des équipes</CardTitle>
          <CardDescription>
            Vue d'ensemble des équipes et leur état émotionnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamsSummaryTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalOverviewTab;
