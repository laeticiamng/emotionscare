
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Settings, Zap, Database, Globe } from 'lucide-react';

const OptimisationPage: React.FC = () => {
  const optimizationMetrics = [
    { label: "Performance générale", value: 85, status: "Bon" },
    { label: "Utilisation mémoire", value: 62, status: "Modéré" },
    { label: "Temps de réponse", value: 91, status: "Excellent" },
    { label: "Disponibilité", value: 99, status: "Excellent" }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Optimisation Système</h1>
          </div>
          <p className="text-muted-foreground">
            Surveillez et optimisez les performances de la plateforme
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {optimizationMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold">{metric.value}%</div>
                    <Progress value={metric.value} className="w-full" />
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      metric.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                      metric.status === 'Bon' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {metric.status}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Actions d'optimisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Optimiser la base de données
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  Nettoyer le cache
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Analyse des performances
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium text-blue-800">Cache optimisé</p>
                    <p className="text-blue-600">Le cache a été optimisé récemment</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-yellow-800">Surveillance requise</p>
                    <p className="text-yellow-600">L'utilisation mémoire nécessite une attention</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimisationPage;
