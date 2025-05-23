
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, Shield } from 'lucide-react';

interface AnalyticsTabProps {
  className?: string;
  personalOnly?: boolean;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ className, personalOnly = false }) => {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">
        {personalOnly ? 'Mes analyses personnelles' : 'Analyses et statistiques'}
      </h2>
      
      {personalOnly ? (
        // Vue limitée pour les collaborateurs B2B
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                Mon évolution émotionnelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Graphique de votre évolution personnelle</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5" />
                Répartition de mes émotions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Analyse de vos émotions personnelles</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-500" />
                Protection des données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ces analyses ne concernent que vos données personnelles. 
                Aucune information individuelle n'est accessible aux administrateurs RH.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Vue complète pour les autres rôles
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                Tendances générales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Graphiques analytiques en développement...</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-5 w-5" />
                Évolution temporelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Évolution des métriques dans le temps</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTab;
