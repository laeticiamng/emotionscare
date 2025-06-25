
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, TrendingUp, Download, Calendar } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const reports = [
    { title: "Bien-être général", period: "Cette semaine", trend: "+12%" },
    { title: "Utilisation des modules", period: "Ce mois", trend: "+8%" },
    { title: "Engagement équipes", period: "Trimestre", trend: "+15%" }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BarChart className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Rapports & Analytics</h1>
              </div>
              <p className="text-muted-foreground">
                Tableaux de bord et analyses détaillées
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {report.period}
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-semibold">{report.trend}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Graphique de tendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <BarChart className="h-12 w-12 mx-auto mb-2" />
                  <p>Graphique de données à venir</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
