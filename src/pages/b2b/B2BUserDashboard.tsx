import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, TrendingUp, Activity } from 'lucide-react';

const B2BUserDashboard: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord B2B Utilisateur</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre expérience utilisateur en entreprise</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions cette semaine</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+20% par rapport à la semaine dernière</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserDashboard;