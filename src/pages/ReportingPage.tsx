import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';
import {
  ArrowLeft, Download, Filter, Calendar, BarChart3, 
  TrendingUp, Activity, Heart, Brain, Target 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ReportData {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'activity' | 'emotions' | 'performance';
  lastGenerated: Date;
  format: 'PDF' | 'Excel' | 'CSV';
  status: 'ready' | 'generating' | 'scheduled';
}

const ReportingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reports] = useState<ReportData[]>([
    {
      id: '1',
      title: 'Analyse de Bien-être Mensuelle',
      description: 'Évolution de votre état émotionnel et physique sur 30 jours',
      category: 'wellness',
      lastGenerated: new Date('2024-01-20'),
      format: 'PDF',
      status: 'ready',
    },
    {
      id: '2',
      title: 'Rapport d\'Activité Hebdomadaire',
      description: 'Sessions VR, méditations, et exercices de respiration',
      category: 'activity',
      lastGenerated: new Date('2024-01-22'),
      format: 'Excel',
      status: 'ready',
    },
    {
      id: '3',
      title: 'Analyse Émotionnelle Détaillée',
      description: 'Patterns émotionnels et recommandations personnalisées',
      category: 'emotions',
      lastGenerated: new Date('2024-01-18'),
      format: 'PDF',
      status: 'generating',
    },
    {
      id: '4',
      title: 'Performance et Progrès',
      description: 'Métriques de progression et objectifs atteints',
      category: 'performance',
      lastGenerated: new Date('2024-01-15'),
      format: 'CSV',
      status: 'scheduled',
    },
  ]);

  const categoryIcons = {
    wellness: Heart,
    activity: Activity,
    emotions: Brain,
    performance: Target,
  };

  const categoryColors = {
    wellness: 'bg-green-100 text-green-700 border-green-200',
    activity: 'bg-blue-100 text-blue-700 border-blue-200',
    emotions: 'bg-purple-100 text-purple-700 border-purple-200',
    performance: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  const statusColors = {
    ready: 'bg-green-100 text-green-700',
    generating: 'bg-yellow-100 text-yellow-700',
    scheduled: 'bg-blue-100 text-blue-700',
  };

  const statusLabels = {
    ready: 'Prêt',
    generating: 'Génération...',
    scheduled: 'Programmé',
  };

  const handleGenerateReport = (reportId: string) => {
    logger.info('Génération du rapport', { reportId }, 'ANALYTICS');
    // Ici, déclencher la génération du rapport
  };

  const handleDownloadReport = (reportId: string) => {
    logger.info('Téléchargement du rapport', { reportId }, 'ANALYTICS');
    // Ici, déclencher le téléchargement
  };

  const filteredReports = reports.filter(report => 
    selectedCategory === 'all' || report.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
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
              <h1 className="text-xl font-semibold">Rapports & Analyses</h1>
              <p className="text-sm text-muted-foreground">Insights personnalisés de votre parcours</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
              <SelectItem value="custom">Période personnalisée</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <BarChart3 className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="wellness">Bien-être</SelectItem>
              <SelectItem value="activity">Activité</SelectItem>
              <SelectItem value="emotions">Émotions</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Métriques Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessions Total</p>
                <p className="text-2xl font-bold text-blue-600">47</p>
                <p className="text-xs text-green-600">+12% ce mois</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bien-être Moyen</p>
                <p className="text-2xl font-bold text-green-600">7.8/10</p>
                <p className="text-xs text-green-600">+0.5 ce mois</p>
              </div>
              <Heart className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stabilité Émotionnelle</p>
                <p className="text-2xl font-bold text-purple-600">85%</p>
                <p className="text-xs text-green-600">+8% ce mois</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Objectifs Atteints</p>
                <p className="text-2xl font-bold text-orange-600">12/15</p>
                <p className="text-xs text-green-600">80% de réussite</p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Liste des Rapports */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">Rapports Disponibles</h2>
          
          {filteredReports.map((report, index) => {
            const CategoryIcon = categoryIcons[report.category];
            
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${categoryColors[report.category]}`}>
                        <CategoryIcon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{report.title}</h3>
                          <Badge className={statusColors[report.status]}>
                            {statusLabels[report.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Format: {report.format}</span>
                          <span>•</span>
                          <span>Dernière génération: {report.lastGenerated.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {report.status === 'ready' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        onClick={() => handleGenerateReport(report.id)}
                        disabled={report.status === 'generating'}
                      >
                        {report.status === 'generating' ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                            Génération...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Générer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Rapports Personnalisés */}
        <Card className="mt-8 p-6 bg-accent/20 border-accent">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Rapport Personnalisé</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Créez un rapport sur-mesure selon vos besoins spécifiques
              </p>
            </div>
            <Button>
              Créer un Rapport
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportingPage;