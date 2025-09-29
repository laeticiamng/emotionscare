
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Download, FileJson, FileSpreadsheet, FileCode, 
  Database, User, MessageSquare, Activity, 
  Calendar, Settings, Shield, CheckCircle 
} from 'lucide-react';
import { useEthics } from '@/contexts/EthicsContext';
import { toast } from 'sonner';

const DataExportSection: React.FC = () => {
  const { exportUserData, privacySettings, loading } = useEthics();
  const [exportFormat, setExportFormat] = useState(privacySettings.exportFormat);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'profile', 'activities', 'preferences', 'logs'
  ]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const dataCategories = [
    {
      id: 'profile',
      name: 'Profil utilisateur',
      description: 'Informations personnelles, préférences de compte',
      icon: User,
      size: '2.5 KB',
      color: 'blue'
    },
    {
      id: 'activities',
      name: 'Activités et sessions',
      description: 'Historique des sessions VR, émotions scannées, musique',
      icon: Activity,
      size: '15.3 MB',
      color: 'green'
    },
    {
      id: 'communications',
      name: 'Communications',
      description: 'Messages du coach, notifications, journal',
      icon: MessageSquare,
      size: '8.7 MB',
      color: 'purple'
    },
    {
      id: 'preferences',
      name: 'Préférences et paramètres',
      description: 'Paramètres de confidentialité, notifications, thèmes',
      icon: Settings,
      size: '1.2 KB',
      color: 'orange'
    },
    {
      id: 'logs',
      name: 'Journaux d\'activité',
      description: 'Logs de sécurité, historique des connexions',
      icon: Shield,
      size: '4.8 KB',
      color: 'red'
    },
    {
      id: 'analytics',
      name: 'Données analytiques',
      description: 'Métriques d\'utilisation, statistiques personnelles',
      icon: Database,
      size: '12.1 MB',
      color: 'indigo'
    }
  ];

  const exportFormats = [
    {
      value: 'json',
      label: 'JSON',
      description: 'Format structuré, lisible par les développeurs',
      icon: FileJson,
      recommended: true
    },
    {
      value: 'csv',
      label: 'CSV',
      description: 'Compatible tableurs (Excel, Google Sheets)',
      icon: FileSpreadsheet,
      recommended: false
    },
    {
      value: 'xml',
      label: 'XML',
      description: 'Format technique standardisé',
      icon: FileCode,
      recommended: false
    }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleExport = async () => {
    if (selectedCategories.length === 0) {
      toast.error('Veuillez sélectionner au moins une catégorie de données');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulation du processus d'export avec progression
    const steps = [
      { label: 'Collecte des données...', progress: 20 },
      { label: 'Chiffrement...', progress: 40 },
      { label: 'Formatage...', progress: 60 },
      { label: 'Génération du fichier...', progress: 80 },
      { label: 'Finalisation...', progress: 100 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setExportProgress(step.progress);
      toast.loading(step.label, { id: 'export-progress' });
    }

    try {
      await exportUserData();
      toast.success('Export terminé avec succès !', { id: 'export-progress' });
    } catch (error) {
      toast.error('Erreur lors de l\'export', { id: 'export-progress' });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const totalSize = selectedCategories.reduce((total, categoryId) => {
    const category = dataCategories.find(c => c.id === categoryId);
    const size = category?.size || '0 KB';
    const value = parseFloat(size);
    const unit = size.includes('MB') ? 1024 : 1;
    return total + (value * unit);
  }, 0);

  const formatSize = (sizeInKB: number) => {
    if (sizeInKB > 1024) {
      return `${(sizeInKB / 1024).toFixed(1)} MB`;
    }
    return `${sizeInKB.toFixed(1)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Sélection du format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Format d'Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exportFormats.map((format, index) => (
              <motion.div
                key={format.value}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                  exportFormat === format.value 
                    ? 'ring-2 ring-primary border-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setExportFormat(format.value as any)}
              >
                {format.recommended && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Recommandé
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <format.icon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">{format.label}</h3>
                    <p className="text-sm text-muted-foreground">{format.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sélection des catégories */}
      <Card>
        <CardHeader>
          <CardTitle>Catégories de Données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
              >
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                  <category.icon className={`h-4 w-4 text-${category.color}-600`} />
                </div>
                <div className="flex-1">
                  <label htmlFor={category.id} className="font-medium cursor-pointer">
                    {category.name}
                  </label>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {category.size}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Résumé de la sélection */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {selectedCategories.length} catégorie{selectedCategories.length > 1 ? 's' : ''} sélectionnée{selectedCategories.length > 1 ? 's' : ''}
              </span>
              <span className="font-medium">
                Taille estimée: {formatSize(totalSize)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processus d'export */}
      {isExporting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary animate-spin" />
                  <span className="font-medium">Export en cours...</span>
                </div>
                <Progress value={exportProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {exportProgress}% terminé
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action d'export */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Prêt à exporter</h3>
                <p className="text-sm text-muted-foreground">
                  Vos données seront téléchargées en format {exportFormat.toUpperCase()}
                </p>
              </div>
              <Button
                onClick={handleExport}
                disabled={loading || isExporting || selectedCategories.length === 0}
                size="lg"
                className="min-w-32"
              >
                {isExporting ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Export...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DataExportSection;
