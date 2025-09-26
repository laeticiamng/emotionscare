import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Download, FileText, Database, Image, 
  Calendar, CheckCircle, Clock, AlertCircle, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  formats: string[];
  estimatedSize: string;
  selected: boolean;
}

interface ExportJob {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  format: string;
  size?: string;
  downloadUrl?: string;
}

const ExportPage: React.FC = () => {
  const navigate = useNavigate();
  const [exportOptions, setExportOptions] = useState<ExportOption[]>([
    {
      id: 'journal',
      name: 'Entrées de Journal',
      description: 'Toutes vos réflexions et pensées personnelles',
      icon: FileText,
      formats: ['PDF', 'DOCX', 'JSON', 'CSV'],
      estimatedSize: '~2.5 MB',
      selected: true,
    },
    {
      id: 'emotions',
      name: 'Analyses Émotionnelles',
      description: 'Historique des scans et analyses émotionnelles',
      icon: Database,
      formats: ['CSV', 'JSON', 'Excel'],
      estimatedSize: '~1.2 MB',
      selected: true,
    },
    {
      id: 'sessions',
      name: 'Sessions VR & Méditations',
      description: 'Données des sessions immersives et exercices',
      icon: Image,
      formats: ['CSV', 'JSON'],
      estimatedSize: '~800 KB',
      selected: false,
    },
    {
      id: 'progress',
      name: 'Données de Progression',
      description: 'Métriques, objectifs et évolution personnelle',
      icon: Database,
      formats: ['CSV', 'Excel', 'JSON'],
      estimatedSize: '~600 KB',
      selected: false,
    },
  ]);

  const [exportJobs] = useState<ExportJob[]>([
    {
      id: '1',
      name: 'Export Journal Complet',
      status: 'completed',
      progress: 100,
      createdAt: new Date('2024-01-20T10:30:00'),
      format: 'PDF',
      size: '2.4 MB',
      downloadUrl: '/downloads/journal-export-20240120.pdf',
    },
    {
      id: '2', 
      name: 'Données Émotionnelles Q1',
      status: 'processing',
      progress: 65,
      createdAt: new Date('2024-01-22T14:15:00'),
      format: 'CSV',
    },
    {
      id: '3',
      name: 'Export Sessions VR',
      status: 'pending',
      progress: 0,
      createdAt: new Date('2024-01-22T15:00:00'),
      format: 'JSON',
    },
  ]);

  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const handleToggleOption = (optionId: string) => {
    setExportOptions(options =>
      options.map(option =>
        option.id === optionId
          ? { ...option, selected: !option.selected }
          : option
      )
    );
  };

  const handleStartExport = () => {
    const selectedOptions = exportOptions.filter(option => option.selected);
    if (selectedOptions.length === 0) {
      alert('Veuillez sélectionner au moins une catégorie de données');
      return;
    }

    console.log('Démarrage de l\'export:', {
      options: selectedOptions,
      format: selectedFormat,
      period: selectedPeriod,
    });

    // Ici, déclencher l'export
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };

  const statusIcons = {
    pending: Clock,
    processing: Settings,
    completed: CheckCircle,
    failed: AlertCircle,
  };

  const statusLabels = {
    pending: 'En attente',
    processing: 'En cours',
    completed: 'Terminé',
    failed: 'Échec',
  };

  const selectedOptionsCount = exportOptions.filter(option => option.selected).length;
  const estimatedTotalSize = exportOptions
    .filter(option => option.selected)
    .reduce((total, option) => {
      const size = parseFloat(option.estimatedSize.match(/[\d.]+/)?.[0] || '0');
      const unit = option.estimatedSize.includes('MB') ? 1 : 0.001;
      return total + (size * unit);
    }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Export de Données</h1>
              <p className="text-sm text-muted-foreground">Téléchargez vos données personnelles</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {selectedOptionsCount} catégorie{selectedOptionsCount > 1 ? 's' : ''} sélectionnée{selectedOptionsCount > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Configuration Export */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Paramètres */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Paramètres d'Export</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Format de fichier</label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF - Lecture facile</SelectItem>
                      <SelectItem value="CSV">CSV - Données tabulaires</SelectItem>
                      <SelectItem value="JSON">JSON - Données structurées</SelectItem>
                      <SelectItem value="Excel">Excel - Analyse avancée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Période</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les données</SelectItem>
                      <SelectItem value="year">Cette année</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="custom">Période personnalisée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Options de données */}
              <div>
                <h3 className="font-medium mb-3">Catégories de données</h3>
                <div className="space-y-3">
                  {exportOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <div key={option.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50">
                        <Checkbox
                          checked={option.selected}
                          onCheckedChange={() => handleToggleOption(option.id)}
                        />
                        <IconComponent className="w-5 h-5 mt-0.5 text-gray-600" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{option.name}</h4>
                            <span className="text-sm text-muted-foreground">{option.estimatedSize}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                          <div className="flex gap-1 mt-1">
                            {option.formats.map(format => (
                              <Badge key={format} variant="outline" className="text-xs">
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Historique des Exports */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Historique des Exports</h2>
              <div className="space-y-3">
                {exportJobs.map((job) => {
                  const StatusIcon = statusIcons[job.status];
                  return (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-5 h-5" />
                        <div>
                          <h4 className="font-medium">{job.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{job.createdAt.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{job.format}</span>
                            {job.size && (
                              <>
                                <span>•</span>
                                <span>{job.size}</span>
                              </>
                            )}
                          </div>
                          {job.status === 'processing' && (
                            <Progress value={job.progress} className="w-32 h-2 mt-1" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[job.status]}>
                          {statusLabels[job.status]}
                        </Badge>
                        {job.status === 'completed' && job.downloadUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Résumé & Action */}
          <div className="space-y-6">
            
            {/* Résumé */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Résumé de l'Export</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Catégories sélectionnées</span>
                  <span className="font-medium">{selectedOptionsCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Format</span>
                  <span className="font-medium">{selectedFormat}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Période</span>
                  <span className="font-medium">
                    {selectedPeriod === 'all' ? 'Toutes' : selectedPeriod}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taille estimée</span>
                  <span className="font-medium">~{estimatedTotalSize.toFixed(1)} MB</span>
                </div>
              </div>

              <Button 
                onClick={handleStartExport}
                className="w-full mt-6"
                disabled={selectedOptionsCount === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Démarrer l'Export
              </Button>
            </Card>

            {/* Informations */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Informations</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• L'export peut prendre plusieurs minutes</li>
                <li>• Vous recevrez un email une fois terminé</li>
                <li>• Les fichiers sont disponibles 30 jours</li>
                <li>• Toutes les données sont chiffrées</li>
              </ul>
            </Card>

            {/* RGPD */}
            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">🔒 Confidentialité</h3>
              <p className="text-sm text-green-700">
                Conformément au RGPD, vous avez le droit d'accéder, modifier ou supprimer vos données personnelles.
              </p>
              <Button variant="outline" size="sm" className="mt-3 text-green-700 border-green-300">
                En savoir plus
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;