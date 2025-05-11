
import React from 'react';
import ChartCard from '@/components/dashboard/charts/ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';

interface AdminChartSectionProps {
  absenteeismData: Array<{ date: string; value: number }>;
  productivityData: Array<{ date: string; value: number }>;
  isLoading?: boolean;
}

const AdminChartSection: React.FC<AdminChartSectionProps> = ({ 
  absenteeismData, 
  productivityData,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Chargement des données...</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  // Si les données sont vides, afficher un message
  if (!absenteeismData?.length || !productivityData?.length) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Données non disponibles</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">Aucune donnée disponible pour la période sélectionnée.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Métriques principales</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Taux d'absentéisme" 
          data={absenteeismData} 
          icon={BarChart3}
          valueFormat={(val) => `${val}%`}
          trend={-1.2}
          trendLabel="vs période précédente"
        />
        <ChartCard 
          title="Productivité" 
          data={productivityData}
          icon={TrendingUp}
          valueFormat={(val) => `${val}%`}
          trend={2.1}
          trendLabel="vs période précédente"
        />
      </CardContent>
    </Card>
  );
};

export default AdminChartSection;
