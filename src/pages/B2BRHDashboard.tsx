import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BarChart3, Shield, AlertTriangle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BRHDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6" data-testid="page-root">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Dashboard RH Manager
            </h1>
            <p className="text-muted-foreground mt-2">Vue d'ensemble organisationnelle</p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Rapport mensuel
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employés Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-green-600">+8.5% ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">189</div>
              <p className="text-xs text-muted-foreground">77% d'adoption</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bien-être Moyen</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.2/10</div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">Bon</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Nécessitent attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/app/reports">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              Rapports détaillés
            </Button>
          </Link>
          <Link to="/app/teams">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Gérer équipes
            </Button>
          </Link>
          <Link to="/app/security">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Shield className="h-6 w-6" />
              Audit sécurité
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BRHDashboard;