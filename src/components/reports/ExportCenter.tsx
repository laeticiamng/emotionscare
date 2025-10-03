
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, FileText, Table, Image, Mail, 
  Calendar, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportCenterProps {
  filters: Record<string, any>;
  userRole?: string;
}

const ExportCenter: React.FC<ExportCenterProps> = ({ filters, userRole }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportFormats = [
    { id: 'pdf', name: 'PDF', icon: FileText, description: 'Document formaté et stylé' },
    { id: 'excel', name: 'Excel', icon: Table, description: 'Feuille de calcul avec données' },
    { id: 'csv', name: 'CSV', icon: Table, description: 'Données brutes séparées par virgules' },
    { id: 'png', name: 'PNG', icon: Image, description: 'Images des graphiques' },
  ];

  const availableData = [
    { id: 'analytics', name: 'Données analytiques', description: 'Métriques et KPIs' },
    { id: 'emotional', name: 'Données émotionnelles', description: 'Scores et tendances' },
    { id: 'activities', name: 'Activités utilisateur', description: 'Usage des fonctionnalités' },
    { id: 'performance', name: 'Métriques de performance', description: 'Productivité et engagement' },
    { id: 'teams', name: 'Données d\'équipe', description: 'Comparaisons départementales', adminOnly: true },
    { id: 'compliance', name: 'Conformité', description: 'Rapports de conformité RGPD', adminOnly: true },
  ];

  const recentExports = [
    {
      id: '1',
      name: 'Rapport mensuel bien-être',
      format: 'PDF',
      date: '2024-06-22',
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Données analytiques Q2',
      format: 'Excel',
      date: '2024-06-20',
      status: 'completed',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Export graphiques',
      format: 'PNG',
      date: '2024-06-18',
      status: 'processing',
      size: '...'
    }
  ];

  const isAdmin = userRole === 'b2b_admin';
  const filteredData = availableData.filter(item => !item.adminOnly || isAdmin);

  const handleExport = async () => {
    if (selectedData.length === 0) return;

    setIsExporting(true);
    setExportProgress(0);

    // Simulation du processus d'export
    const intervals = [15, 35, 55, 75, 90, 100];
    for (const progress of intervals) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setExportProgress(progress);
    }

    // Simulation du téléchargement
    const blob = new Blob(['Export data...'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${selectedFormat}-${Date.now()}.${selectedFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    setExportProgress(0);
  };

  const toggleDataSelection = (dataId: string) => {
    setSelectedData(prev => 
      prev.includes(dataId) 
        ? prev.filter(id => id !== dataId)
        : [...prev, dataId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration d'export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-500" />
              Configuration d'Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Format de fichier */}
            <div className="space-y-3">
              <h3 className="font-medium">Format de fichier</h3>
              <div className="grid grid-cols-2 gap-3">
                {exportFormats.map((format) => (
                  <div
                    key={format.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFormat === format.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedFormat(format.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <format.icon className="h-4 w-4" />
                      <span className="font-medium">{format.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Données à inclure */}
            <div className="space-y-3">
              <h3 className="font-medium">Données à inclure</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredData.map((data) => (
                  <div
                    key={data.id}
                    className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50"
                  >
                    <Checkbox
                      id={data.id}
                      checked={selectedData.includes(data.id)}
                      onCheckedChange={() => toggleDataSelection(data.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <label htmlFor={data.id} className="font-medium text-sm cursor-pointer">
                          {data.name}
                        </label>
                        {data.adminOnly && (
                          <Badge variant="secondary" className="text-xs">Admin</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {data.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton d'export */}
            <div className="space-y-3">
              <Button 
                onClick={handleExport}
                disabled={isExporting || selectedData.length === 0}
                className="w-full"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter ({selectedData.length} sélection{selectedData.length > 1 ? 's' : ''})
                  </>
                )}
              </Button>

              <AnimatePresence>
                {isExporting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span>Progression de l'export</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} />
                    <p className="text-xs text-muted-foreground">
                      Préparation des données en format {selectedFormat.toUpperCase()}...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Exports récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              Exports Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExports.map((exportItem, index) => (
                <motion.div
                  key={exportItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{exportItem.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {exportItem.format}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exportItem.date}
                      </span>
                      <span>{exportItem.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(exportItem.status)}
                    {exportItem.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Options avancées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-500" />
            Options Avancées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Planification d'export</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium text-sm">Export automatique mensuel</p>
                    <p className="text-xs text-muted-foreground">Rapport bien-être complet</p>
                  </div>
                  <Checkbox />
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium text-sm">Notification par email</p>
                    <p className="text-xs text-muted-foreground">Recevoir les exports par email</p>
                  </div>
                  <Checkbox />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Templates d'export</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Rapport mensuel standard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Table className="h-4 w-4 mr-2" />
                  Export données brutes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Image className="h-4 w-4 mr-2" />
                  Pack graphiques
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportCenter;
