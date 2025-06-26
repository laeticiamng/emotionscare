
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  FileBarChart, 
  Download, 
  Share2, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  TrendingUp,
  PieChart,
  BarChart3,
  LineChart,
  FileSpreadsheet,
  FilePdf,
  Mail,
  Settings,
  Eye,
  Filter,
  RefreshCw,
  Printer,
  Archive,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, subWeeks, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const ReportsPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [selectedReportType, setSelectedReportType] = useState('comprehensive');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // États pour les filtres
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  
  // Données mockées pour les rapports
  const [reportData] = useState({
    emotionalTrends: [
      { date: '2024-01-01', calm: 75, happy: 60, anxious: 20, energetic: 80, score: 73 },
      { date: '2024-01-08', calm: 80, happy: 70, anxious: 15, energetic: 75, score: 78 },
      { date: '2024-01-15', calm: 65, happy: 50, anxious: 35, energetic: 60, score: 65 },
      { date: '2024-01-22', calm: 85, happy: 85, anxious: 10, energetic: 90, score: 87 },
      { date: '2024-01-29', calm: 70, happy: 65, anxious: 25, energetic: 70, score: 71 }
    ],
    weeklyStats: [
      { week: 'S1', scans: 12, meditation: 45, journal: 8, music: 120, vr: 15 },
      { week: 'S2', scans: 15, meditation: 60, journal: 10, music: 150, vr: 20 },
      { week: 'S3', scans: 8, meditation: 30, journal: 5, music: 90, vr: 8 },
      { week: 'S4', scans: 18, meditation: 75, journal: 12, music: 180, vr: 25 }
    ],
    emotionDistribution: [
      { name: 'Calme', value: 35, color: '#3b82f6' },
      { name: 'Heureux', value: 28, color: '#10b981' },
      { name: 'Énergique', value: 22, color: '#f59e0b' },
      { name: 'Anxieux', value: 10, color: '#ef4444' },
      { name: 'Neutre', value: 5, color: '#6b7280' }
    ],
    kpis: {
      totalScans: 142,
      averageScore: 78,
      improvement: '+15%',
      streakDays: 12,
      meditationMinutes: 840,
      journalEntries: 45,
      musicHours: 28,
      vrSessions: 18
    }
  });

  const [availableReports] = useState([
    {
      id: 'comprehensive',
      name: 'Rapport Complet',
      description: 'Analyse complète de tous vos indicateurs de bien-être',
      includes: ['Scans émotionnels', 'Tendances', 'Activités', 'Recommandations'],
      frequency: ['Hebdomadaire', 'Mensuel', 'Trimestriel'],
      formats: ['PDF', 'Excel', 'JSON']
    },
    {
      id: 'emotional-analysis',
      name: 'Analyse Émotionnelle',
      description: 'Focus sur vos patterns émotionnels et leur évolution',
      includes: ['Historique émotions', 'Patterns', 'Déclencheurs', 'Corrélations'],
      frequency: ['Quotidien', 'Hebdomadaire', 'Mensuel'],
      formats: ['PDF', 'Excel']
    },
    {
      id: 'activity-summary',
      name: 'Résumé d\'Activités',
      description: 'Vue d\'ensemble de votre engagement avec les différents modules',
      includes: ['Utilisation modules', 'Temps d\'activité', 'Progression', 'Objectifs'],
      frequency: ['Hebdomadaire', 'Mensuel'],
      formats: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'progress-report',
      name: 'Rapport de Progression',
      description: 'Suivi de vos objectifs et amélioration du bien-être',
      includes: ['Objectifs', 'Métriques clés', 'Comparaisons', 'Prédictions'],
      frequency: ['Mensuel', 'Trimestriel'],
      formats: ['PDF', 'PowerPoint']
    }
  ]);

  const [reportTemplates] = useState([
    {
      id: 'executive-summary',
      name: 'Résumé Exécutif',
      description: 'Vue d\'ensemble concise pour les dirigeants',
      duration: '1 page',
      audience: 'Direction'
    },
    {
      id: 'detailed-analysis',
      name: 'Analyse Détaillée',
      description: 'Rapport complet avec toutes les métriques',
      duration: '10-15 pages',
      audience: 'Analystes, RH'
    },
    {
      id: 'visual-dashboard',
      name: 'Tableau de Bord Visuel',
      description: 'Graphiques et visualisations interactives',
      duration: 'Dashboard',
      audience: 'Tous'
    }
  ]);

  const handleGenerateReport = async (type: string, format: string) => {
    setIsGenerating(true);
    toast({
      title: "Génération en cours",
      description: `Création du rapport ${type} au format ${format}...`,
    });

    // Simulation de génération
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Rapport généré !",
        description: "Votre rapport est prêt à être téléchargé.",
      });
    }, 3000);
  };

  const handleScheduleReport = (reportId: string, frequency: string) => {
    const newSchedule = {
      id: `schedule-${Date.now()}`,
      reportId,
      frequency,
      nextRun: format(new Date(), 'yyyy-MM-dd'),
      active: true
    };
    
    setScheduledReports([...scheduledReports, newSchedule]);
    
    toast({
      title: "Rapport programmé",
      description: `Rapport ${frequency.toLowerCase()} programmé avec succès.`,
    });
  };

  const handleExportReport = (reportId: string, format: string) => {
    toast({
      title: "Export en cours",
      description: `Export du rapport au format ${format}...`,
    });
  };

  const handleShareReport = (reportId: string) => {
    navigator.clipboard.writeText(`https://emotionscare.app/reports/${reportId}`);
    toast({
      title: "Lien copié",
      description: "Le lien du rapport a été copié dans le presse-papiers.",
    });
  };

  const getPeriodLabel = (period: string) => {
    const labels = {
      'last-7-days': '7 derniers jours',
      'last-30-days': '30 derniers jours',
      'last-3-months': '3 derniers mois',
      'last-year': 'Dernière année',
      'custom': 'Période personnalisée'
    };
    return labels[period as keyof typeof labels] || period;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header avec contrôles */}
        <Card className="overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <FileBarChart className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Rapports & Analytics</h1>
                  <p className="text-blue-100 mt-1">
                    Analysez vos données et générez des rapports détaillés
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                  <span className="text-sm">Auto-actualisation</span>
                </div>
                <Button variant="secondary">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </div>

            {/* Filtres rapides */}
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">7 derniers jours</SelectItem>
                  <SelectItem value="last-30-days">30 derniers jours</SelectItem>
                  <SelectItem value="last-3-months">3 derniers mois</SelectItem>
                  <SelectItem value="last-year">Dernière année</SelectItem>
                  <SelectItem value="custom">Période personnalisée</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(dateRange.from, 'dd MMM', { locale: fr })} - {format(dateRange.to, 'dd MMM', { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => range && setDateRange(range)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <Button variant="secondary" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres avancés
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPIs rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{reportData.kpis.totalScans}</p>
              <p className="text-sm text-muted-foreground">Scans totaux</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{reportData.kpis.averageScore}</p>
              <p className="text-sm text-muted-foreground">Score moyen</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{reportData.kpis.meditationMinutes}min</p>
              <p className="text-sm text-muted-foreground">Méditation</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{reportData.kpis.improvement}</p>
              <p className="text-sm text-muted-foreground">Amélioration</p>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generate">Générer</TabsTrigger>
            <TabsTrigger value="scheduled">Programmés</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Onglet Génération */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Types de rapports */}
              <Card>
                <CardHeader>
                  <CardTitle>Types de Rapports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableReports.map((report) => (
                    <div key={report.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{report.name}</h3>
                        <Badge variant="outline">Disponible</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-medium">Inclut : </span>
                          {report.includes.join(', ')}
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="font-medium">Fréquences : </span>
                            {report.frequency.join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">Formats : </span>
                            {report.formats.join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        {report.formats.map((format) => (
                          <Button
                            key={format}
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateReport(report.name, format)}
                            disabled={isGenerating}
                          >
                            {format === 'PDF' && <FilePdf className="h-3 w-3 mr-1" />}
                            {format === 'Excel' && <FileSpreadsheet className="h-3 w-3 mr-1" />}
                            {format}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Templates de rapports */}
              <Card>
                <CardHeader>
                  <CardTitle>Templates Avancés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reportTemplates.map((template) => (
                    <div key={template.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="secondary">{template.audience}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>Durée : {template.duration}</span>
                        <span>Public : {template.audience}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleGenerateReport(template.name, 'PDF')}>
                          <Eye className="h-3 w-3 mr-1" />
                          Aperçu
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleGenerateReport(template.name, 'PDF')}>
                          <Download className="h-3 w-3 mr-1" />
                          Générer
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col gap-2" onClick={() => handleGenerateReport('Rapport Express', 'PDF')}>
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Rapport Express</span>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => handleShareReport('current')}>
                    <Share2 className="h-6 w-6" />
                    <span className="text-sm">Partager Données</span>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => handleExportReport('all', 'Excel')}>
                    <FileSpreadsheet className="h-6 w-6" />
                    <span className="text-sm">Export Excel</span>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Printer className="h-6 w-6" />
                    <span className="text-sm">Imprimer</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Rapports Programmés */}
          <TabsContent value="scheduled" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Rapports Programmés</h2>
              <Button>
                <Bell className="h-4 w-4 mr-2" />
                Nouveau Programme
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scheduledReports.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center">
                    <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Aucun rapport programmé</h3>
                    <p className="text-muted-foreground mb-4">
                      Programmez des rapports automatiques pour recevoir vos analytics régulièrement
                    </p>
                    <Button>
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Programmer un Rapport
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                scheduledReports.map((schedule: any) => (
                  <Card key={schedule.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Rapport {schedule.frequency}</h3>
                        <Badge variant={schedule.active ? 'default' : 'secondary'}>
                          {schedule.active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Prochaine exécution : {schedule.nextRun}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3 mr-1" />
                          Tester
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Configuration de programmation */}
            <Card>
              <CardHeader>
                <CardTitle>Programmer un Nouveau Rapport</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type de rapport</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableReports.map((report) => (
                          <SelectItem key={report.id} value={report.id}>
                            {report.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Fréquence</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="quarterly">Trimestriel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Format</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="email">Email HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={() => handleScheduleReport('comprehensive', 'weekly')}>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Programmer ce Rapport
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Historique */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rapports Récents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <FilePdf className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="font-medium">Rapport Complet - Janvier 2024</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Généré le {format(subDays(new Date(), item), 'dd/MM/yyyy')}</span>
                            <span>2.4 MB</span>
                            {item <= 2 && <Badge variant="secondary">Récent</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Télécharger
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-3 w-3 mr-1" />
                          Partager
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Graphique des tendances */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Tendances Émotionnelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={reportData.emotionalTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="calm" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="happy" stroke="#f59e0b" strokeWidth={2} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques hebdomadaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Activité Hebdomadaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={reportData.weeklyStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="scans" fill="#3b82f6" />
                        <Bar dataKey="meditation" fill="#10b981" />
                        <Bar dataKey="journal" fill="#f59e0b" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Distribution des émotions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Distribution Émotionnelle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={reportData.emotionDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {reportData.emotionDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Métriques avancées */}
              <Card>
                <CardHeader>
                  <CardTitle>Métriques Avancées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 border rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{reportData.kpis.streakDays}</p>
                      <p className="text-sm text-muted-foreground">Série en cours</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{reportData.kpis.journalEntries}</p>
                      <p className="text-sm text-muted-foreground">Entrées journal</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{reportData.kpis.musicHours}h</p>
                      <p className="text-sm text-muted-foreground">Écoute musicale</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{reportData.kpis.vrSessions}</p>
                      <p className="text-sm text-muted-foreground">Sessions VR</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;
