
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, TrendingUp, Users } from 'lucide-react';

const Reports = () => {
  const handleExportReport = (reportType: string) => {
    console.log(`Exporting ${reportType} report...`);
    // Implement actual export functionality
    const exportData = {
      timestamp: new Date().toISOString(),
      reports: ['Analytics', 'User Activity', 'Performance Metrics'],
      format: 'CSV'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `reports_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log('Export completed:', exportData);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Rapports d'Analyse</h1>
        <Button onClick={() => handleExportReport('all')}>
          <Download className="h-4 w-4 mr-2" />
          Exporter Tous
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Rapport Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Analyse détaillée de l'activité et du bien-être des utilisateurs
            </p>
            <Button 
              variant="outline" 
              onClick={() => handleExportReport('users')}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Générer Rapport
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Rapport Tendances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Évolution des métriques de bien-être sur la période
            </p>
            <Button 
              variant="outline" 
              onClick={() => handleExportReport('trends')}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Générer Rapport
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Rapport RGPD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Conformité et gestion des données personnelles
            </p>
            <Button 
              variant="outline" 
              onClick={() => handleExportReport('gdpr')}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Générer Rapport
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Informations importantes</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Les rapports sont générés en temps réel</li>
          <li>• Format d'export disponible : PDF, CSV, Excel</li>
          <li>• Données anonymisées selon les standards RGPD</li>
          <li>• Historique disponible sur les 12 derniers mois</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;
