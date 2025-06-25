
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, BarChart3, ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();

  const reports = [
    {
      title: 'Rapport mensuel de bien-être',
      description: 'Analyse complète des métriques de bien-être de l\'organisation',
      date: '2024-01-15',
      status: 'ready',
      type: 'monthly'
    },
    {
      title: 'Analyse par équipe - Marketing',
      description: 'Détail des performances et alertes de l\'équipe Marketing',
      date: '2024-01-14',
      status: 'ready',
      type: 'team'
    },
    {
      title: 'Rapport d\'engagement',
      description: 'Taux d\'utilisation des fonctionnalités par les utilisateurs',
      date: '2024-01-13',
      status: 'processing',
      type: 'engagement'
    },
    {
      title: 'Analyse des tendances',
      description: 'Évolution du bien-être sur les 6 derniers mois',
      date: '2024-01-12',
      status: 'ready',
      type: 'trends'
    }
  ];

  const metrics = [
    {
      title: 'Score moyen global',
      value: '7.8/10',
      change: '+0.3',
      icon: BarChart3
    },
    {
      title: 'Engagement utilisateurs',
      value: '87%',
      change: '+5%',
      icon: TrendingUp
    },
    {
      title: 'Sessions cette semaine',
      value: '1,247',
      change: '+12%',
      icon: Calendar
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Prêt</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapports et analyses</h1>
            <p className="text-gray-600">Consultez les données de bien-être de votre organisation</p>
          </div>
          <Button onClick={() => navigate('/b2b/admin/dashboard')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>

        {/* Métriques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <metric.icon className="h-8 w-8 text-blue-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-green-600">{metric.change}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-4">{metric.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Liste des rapports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Rapports disponibles
              </CardTitle>
              <Button>
                Générer nouveau rapport
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{report.title}</h3>
                      {getStatusBadge(report.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{report.description}</p>
                    <p className="text-xs text-gray-500">Généré le {report.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    {report.status === 'ready' && (
                      <Button size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Télécharger
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/teams')}>
                  Analyse par équipe
                </Button>
                <Button variant="outline" onClick={() => navigate('/events')}>
                  Planifier une intervention
                </Button>
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  Paramètres de rapport
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
