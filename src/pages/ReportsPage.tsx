
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, TrendingUp, Users, BarChart3 } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const reports = [
    {
      id: 1,
      title: "Rapport mensuel de bien-être",
      description: "Analyse complète du bien-être des employés pour le mois dernier",
      type: "wellness",
      period: "Janvier 2024",
      status: "completed",
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Analyse des tendances émotionnelles",
      description: "Évolution des émotions au sein des équipes",
      type: "emotions",
      period: "Q4 2023",
      status: "completed",
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "Rapport d'engagement",
      description: "Niveau d'engagement et participation aux activités",
      type: "engagement",
      period: "Décembre 2023",
      status: "in_progress",
      downloadUrl: null
    }
  ];

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'wellness':
        return <TrendingUp className="h-4 w-4" />;
      case 'emotions':
        return <BarChart3 className="h-4 w-4" />;
      case 'engagement':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Terminé</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">En cours</Badge>;
      default:
        return <Badge variant="outline">Brouillon</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rapports</h1>
          <p className="text-muted-foreground">
            Générez et consultez les rapports de bien-être
          </p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Générer un rapport
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports ce mois</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 depuis le mois dernier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Téléchargements</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">+15% ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipes analysées</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Toutes les équipes</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des rapports */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Rapports disponibles</h2>
        
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getReportIcon(report.type)}
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                  <p className="text-muted-foreground">{report.description}</p>
                </div>
                {getStatusBadge(report.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{report.period}</span>
                  </div>
                </div>
                
                {report.downloadUrl && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
