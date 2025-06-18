
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

/**
 * Page des rapports (Admin)
 */
const ReportsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <BarChart className="h-8 w-8 text-green-600" />
          Rapports et Analyses
        </h1>
        <p className="text-gray-600">
          Consultez les analyses et métriques de votre organisation
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tableaux de Bord Analytiques</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module de rapports en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
