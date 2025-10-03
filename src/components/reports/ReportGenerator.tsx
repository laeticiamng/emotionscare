
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, Calendar, Users, BarChart, Download, 
  Settings, Play, Clock, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReportGeneratorProps {
  filters: Record<string, any>;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ filters }) => {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    type: '',
    period: '',
    departments: [] as string[],
    metrics: [] as string[],
    format: 'pdf'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [recentReports, setRecentReports] = useState([
    {
      id: '1',
      name: 'Rapport Bien-être Mensuel',
      type: 'wellbeing',
      created: '2024-06-20',
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Analyse Productivité Équipe',
      type: 'productivity',
      created: '2024-06-18',
      status: 'completed',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Rapport Engagement Q2',
      type: 'engagement',
      created: '2024-06-15',
      status: 'processing',
      size: '...'
    }
  ]);

  const reportTypes = [
    { value: 'wellbeing', label: 'Bien-être Général', icon: '❤️' },
    { value: 'productivity', label: 'Productivité', icon: '📈' },
    { value: 'engagement', label: 'Engagement', icon: '👥' },
    { value: 'emotional', label: 'Analyse Émotionnelle', icon: '🧠' },
    { value: 'custom', label: 'Personnalisé', icon: '⚙️' }
  ];

  const availableMetrics = [
    'Score bien-être global',
    'Niveau de stress',
    'Satisfaction au travail',
    'Équilibre vie-travail',
    'Engagement équipe',
    'Productivité',
    'Absentéisme',
    'Turnover',
    'Participation activités',
    'Usage des outils'
  ];

  const departments = [
    'Direction',
    'Ressources Humaines',
    'Développement',
    'Marketing',
    'Ventes',
    'Support Client',
    'Finance',
    'Opérations'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulation de génération
    const intervals = [10, 25, 45, 70, 85, 100];
    for (const progress of intervals) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGenerationProgress(progress);
    }

    // Ajouter le nouveau rapport
    const newReport = {
      id: Date.now().toString(),
      name: reportConfig.name || 'Nouveau Rapport',
      type: reportConfig.type,
      created: new Date().toISOString().split('T')[0],
      status: 'completed' as const,
      size: '2.1 MB'
    };

    setRecentReports(prev => [newReport, ...prev]);
    setIsGenerating(false);
    setGenerationProgress(0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Terminé</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />En cours</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration du rapport */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-500" />
              Configuration du Rapport
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-name">Nom du rapport</Label>
              <Input
                id="report-name"
                placeholder="Ex: Rapport bien-être mensuel"
                value={reportConfig.name}
                onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea
                id="report-description"
                placeholder="Description du rapport..."
                value={reportConfig.description}
                onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Type de rapport</Label>
              <Select onValueChange={(value) => setReportConfig(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        {type.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Période</Label>
              <Select onValueChange={(value) => setReportConfig(prev => ({ ...prev, period: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                  <SelectItem value="custom">Personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Départements à inclure</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {departments.map((dept) => (
                  <div key={dept} className="flex items-center space-x-2">
                    <Checkbox
                      id={dept}
                      checked={reportConfig.departments.includes(dept)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setReportConfig(prev => ({
                            ...prev,
                            departments: [...prev.departments, dept]
                          }));
                        } else {
                          setReportConfig(prev => ({
                            ...prev,
                            departments: prev.departments.filter(d => d !== dept)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={dept} className="text-sm">{dept}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Métriques à inclure</Label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {availableMetrics.map((metric) => (
                  <div key={metric} className="flex items-center space-x-2">
                    <Checkbox
                      id={metric}
                      checked={reportConfig.metrics.includes(metric)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setReportConfig(prev => ({
                            ...prev,
                            metrics: [...prev.metrics, metric]
                          }));
                        } else {
                          setReportConfig(prev => ({
                            ...prev,
                            metrics: prev.metrics.filter(m => m !== metric)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={metric} className="text-sm">{metric}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !reportConfig.name || !reportConfig.type}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Générer le Rapport
                  </>
                )}
              </Button>
            </div>

            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Rapports récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Rapports Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{report.name}</h4>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.created}
                      </span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates de rapports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-purple-500" />
            Templates de Rapports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.slice(0, 4).map((template, index) => (
              <motion.div
                key={template.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => setReportConfig(prev => ({ ...prev, type: template.value }))}
              >
                <div className="text-2xl mb-2">{template.icon}</div>
                <h3 className="font-medium mb-2">{template.label}</h3>
                <p className="text-sm text-muted-foreground">
                  Template prêt à utiliser pour {template.label.toLowerCase()}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
