// @ts-nocheck

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

export interface ScanTeamTabProps {
  emotionalScoreTrend: Array<{ date: string; value: number }>;
  currentScore: number;
  isLoading?: boolean;
}

const ScanTeamTab: React.FC<ScanTeamTabProps> = ({ emotionalScoreTrend, currentScore, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Score émotionnel de l'équipe</CardTitle>
            <CardDescription>Évolution du score moyen et des alertes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Skeleton className="w-full h-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-card col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Score émotionnel de l'équipe</CardTitle>
          <CardDescription>Évolution du score moyen et des alertes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emotionalScoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="p-4 rounded-lg">
              <h3 className="font-medium">Score moyen</h3>
              <p className="text-2xl font-bold">{currentScore}/100</p>
            </Card>
            <Card className="p-4 rounded-lg">
              <h3 className="font-medium">Collaborateurs à risque</h3>
              <p className="text-2xl font-bold text-amber-600">12%</p>
            </Card>
            <Card className="p-4 rounded-lg">
              <h3 className="font-medium">Scans cette semaine</h3>
              <p className="text-2xl font-bold">42</p>
            </Card>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Button variant="outline">Filtrer par service</Button>
            <Button variant="outline">Filtrer par période</Button>
            <Button variant="outline">Exporter les données</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanTeamTab;
