
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Calendar, Database, FileText, Settings, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportTask {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  fileSize: string;
  createdAt: string;
  downloadUrl?: string;
}

const ExportCSVPage: React.FC = () => {
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(['emotions', 'journal']);
  const [dateRange, setDateRange] = useState('last_month');
  const [format, setFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState<string | null>(null);

  const [exportHistory, setExportHistory] = useState<ExportTask[]>([
    {
      id: '1',
      name: 'Données émotionnelles - Décembre 2024',
      status: 'completed',
      progress: 100,
      fileSize: '2.4 MB',
      createdAt: '2024-12-15T10:30:00Z',
      downloadUrl: '/downloads/emotions-dec-2024.csv'
    },
    {
      id: '2',
      name: 'Journal complet - Novembre 2024',
      status: 'completed',
      progress: 100,
      fileSize: '890 KB',
      createdAt: '2024-12-10T15:45:00Z',
      downloadUrl: '/downloads/journal-nov-2024.csv'
    },
    {
      id: '3',
      name: 'Analyses vocales - Q4 2024',
      status: 'failed',
      progress: 0,
      fileSize: '0 KB',
      createdAt: '2024-12-08T09:15:00Z'
    }
  ]);

  const dataTypes = [
    {
      id: 'emotions',
      name: 'Données émotionnelles',
      description: 'Scans émotionnels, scores, tendances',
      fields: ['Date', 'Émotion principale', 'Score', 'Intensité', 'Contexte'],
      estimatedSize: '~1.2 MB',
      icon: '🎭'
    },
    {
      id: 'journal',
      name: 'Entrées de journal',
      description: 'Textes, réflexions, notes personnelles',
      fields: ['Date', 'Titre', 'Contenu', 'Humeur', 'Tags'],
      estimatedSize: '~800 KB',
      icon: '📝'
    },
    {
      id: 'voice',
      name: 'Analyses vocales',
      description: 'Métadonnées des analyses audio (pas les fichiers)',
      fields: ['Date', 'Durée', 'Émotion détectée', 'Confiance', 'Transcription'],
      estimatedSize: '~300 KB',
      icon: '🎤'
    },
    {
      id: 'activities',
      name: 'Activités et exercices',
      description: 'Méditation, respiration, VR, musique',
      fields: ['Date', 'Type activité', 'Durée', 'Score', 'Complétion'],
      estimatedSize: '~500 KB',
      icon: '🏃'
    },
    {
      id: 'gamification',
      name: 'Gamification',
      description: 'Points, badges, niveaux, achievements',
      fields: ['Date', 'Action', 'Points gagnés', 'Niveau', 'Badge'],
      estimatedSize: '~200 KB',
      icon: '🏆'
    },
    {
      id: 'settings',
      name: 'Paramètres et préférences',
      description: 'Configuration, choix utilisateur',
      fields: ['Paramètre', 'Valeur', 'Date modification'],
      estimatedSize: '~50 KB',
      icon: '⚙️'
    }
  ];

  const handleDataTypeToggle = (dataTypeId: string) => {
    setSelectedDataTypes(prev => 
      prev.includes(dataTypeId) 
        ? prev.filter(id => id !== dataTypeId)
        : [...prev, dataTypeId]
    );
  };

  const handleExport = async () => {
    if (selectedDataTypes.length === 0) return;

    setIsExporting(true);
    setExportProgress(0);
    setCurrentTask('Préparation des données...');

    // Simulation du processus d'export
    const steps = [
      'Validation des permissions...',
      'Collecte des données...',
      'Formatage en CSV...',
      'Compression du fichier...',
      'Finalisation...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentTask(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setExportProgress((i + 1) * 20);
    }

    // Créer une nouvelle tâche d'export
    const newTask: ExportTask = {
      id: Date.now().toString(),
      name: `Export personnalisé - ${new Date().toLocaleDateString()}`,
      status: 'completed',
      progress: 100,
      fileSize: '3.2 MB',
      createdAt: new Date().toISOString(),
      downloadUrl: '/downloads/custom-export.csv'
    };

    setExportHistory(prev => [newTask, ...prev]);
    setIsExporting(false);
    setExportProgress(0);
    setCurrentTask(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'processing': return 'text-blue-500';
      case 'failed': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="w-4 h-4" />;
      case 'processing': return <Settings className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-green-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 Export CSV
          </h1>
          <p className="text-xl text-green-200 mb-6">
            Exportez vos données dans des formats compatibles pour vos analyses
          </p>
        </motion.div>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="export">📤 Nouvel export</TabsTrigger>
            <TabsTrigger value="history">📋 Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="export">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Configuration de l'export */}
              <div className="lg:col-span-2 space-y-6">
                {/* Sélection des types de données */}
                <Card className="bg-black/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Types de données à exporter
                    </CardTitle>
                    <CardDescription className="text-green-200">
                      Sélectionnez les catégories de données que vous souhaitez inclure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dataTypes.map((dataType) => (
                        <div 
                          key={dataType.id}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            selectedDataTypes.includes(dataType.id)
                              ? 'border-green-500 bg-green-900/20'
                              : 'border-gray-600 bg-gray-800/50 hover:border-green-500/50'
                          }`}
                          onClick={() => handleDataTypeToggle(dataType.id)}
                          data-testid={`data-type-${dataType.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedDataTypes.includes(dataType.id)}
                              onCheckedChange={() => handleDataTypeToggle(dataType.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{dataType.icon}</span>
                                <h3 className="font-semibold text-white">{dataType.name}</h3>
                              </div>
                              <p className="text-sm text-gray-300 mb-2">{dataType.description}</p>
                              <div className="text-xs text-gray-400 mb-2">
                                Champs: {dataType.fields.join(', ')}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {dataType.estimatedSize}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Paramètres d'export */}
                <Card className="bg-black/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-400">⚙️ Paramètres d'export</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-green-200 mb-2">
                          Période
                        </label>
                        <Select value={dateRange} onValueChange={setDateRange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="last_week">7 derniers jours</SelectItem>
                            <SelectItem value="last_month">30 derniers jours</SelectItem>
                            <SelectItem value="last_3months">3 derniers mois</SelectItem>
                            <SelectItem value="last_year">12 derniers mois</SelectItem>
                            <SelectItem value="all_time">Depuis le début</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-200 mb-2">
                          Format de fichier
                        </label>
                        <Select value={format} onValueChange={setFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                            <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="tsv">TSV (Tab Separated)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Checkbox id="include-metadata" />
                        <label htmlFor="include-metadata" className="text-sm text-green-200">
                          Inclure les métadonnées (dates de création, IDs, etc.)
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="anonymize-data" />
                        <label htmlFor="anonymize-data" className="text-sm text-green-200">
                          Anonymiser les données sensibles
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Panneau de prévisualisation et export */}
              <div className="space-y-6">
                {/* Résumé de l'export */}
                <Card className="bg-black/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-blue-400">📋 Résumé</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Types sélectionnés:</span>
                        <Badge variant="secondary">{selectedDataTypes.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Période:</span>
                        <Badge variant="outline">
                          {dateRange === 'last_week' && '7 jours'}
                          {dateRange === 'last_month' && '30 jours'}
                          {dateRange === 'last_3months' && '3 mois'}
                          {dateRange === 'last_year' && '1 an'}
                          {dateRange === 'all_time' && 'Tout'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Format:</span>
                        <Badge variant="outline" className="uppercase">{format}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Taille estimée:</span>
                        <Badge className="bg-green-500 text-black">
                          ~{selectedDataTypes.length * 0.8}MB
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button 
                        onClick={handleExport}
                        disabled={selectedDataTypes.length === 0 || isExporting}
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-bold"
                        data-testid="start-export-button"
                      >
                        {isExporting ? (
                          <>
                            <Settings className="w-4 h-4 mr-2 animate-spin" />
                            Export en cours...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Lancer l'export
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Progression de l'export */}
                <AnimatePresence>
                  {isExporting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card className="bg-black/50 border-yellow-500/30">
                        <CardHeader>
                          <CardTitle className="text-yellow-400">⏳ Export en cours</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Progress value={exportProgress} className="w-full" />
                            <div className="text-center">
                              <div className="text-white font-bold">{exportProgress}%</div>
                              <div className="text-sm text-gray-300">{currentTask}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Informations importantes */}
                <Card className="bg-black/50 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-gray-400">ℹ️ À savoir</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>• Les exports sont conservés 7 jours</p>
                      <p>• Taille maximale par export: 100MB</p>
                      <p>• Les fichiers audio ne sont pas inclus</p>
                      <p>• Les données sont chiffrées pendant le transfert</p>
                      <p>• Maximum 3 exports par jour</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-black/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Historique des exports
                </CardTitle>
                <CardDescription className="text-green-200">
                  Vos derniers exports et téléchargements disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exportHistory.map((task) => (
                    <div 
                      key={task.id}
                      className="p-4 rounded-lg border border-gray-600 bg-gray-800/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{task.name}</h3>
                        <div className={`flex items-center gap-2 ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="text-sm capitalize">{task.status}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <div className="flex items-center gap-4">
                          <span>{task.fileSize}</span>
                          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {task.status === 'completed' && task.downloadUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Télécharger
                          </Button>
                        )}
                      </div>

                      {task.status === 'processing' && (
                        <div className="mt-3">
                          <Progress value={task.progress} className="w-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExportCSVPage;
