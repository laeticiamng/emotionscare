
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, TrendingDown } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
}

interface AdminChartSectionProps {
  absenteeismData: DataPoint[];
  productivityData: DataPoint[];
}

const AdminChartSection: React.FC<AdminChartSectionProps> = ({
  absenteeismData,
  productivityData
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingDown className="h-5 w-5 mr-2 text-amber-500" />
            Absentéisme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
            Graphique d'absentéisme
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Layers className="h-5 w-5 mr-2 text-blue-500" />
            Productivité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
            Graphique de productivité
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminChartSection;
