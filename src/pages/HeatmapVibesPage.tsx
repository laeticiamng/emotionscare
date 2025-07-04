import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Thermometer, TrendingUp, Activity, Filter, Download } from 'lucide-react';

const HeatmapVibesPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);

  const emotionStats = [
    { name: 'Joie', value: 32, color: 'text-green-600' },
    { name: 'Sérénité', value: 28, color: 'text-blue-600' },
    { name: 'Énergie', value: 25, color: 'text-yellow-600' },
    { name: 'Stress', value: 15, color: 'text-red-600' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Thermometer className="h-8 w-8 text-primary" />
            Heatmap des Émotions
          </h1>
          <p className="text-muted-foreground">
            Visualisez vos patterns émotionnels dans le temps
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {emotionStats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}%</p>
                </div>
                <Activity className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Heatmap Émotionnelle - 30 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <p className="text-muted-foreground">Heatmap émotionnelle interactive</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatmapVibesPage;