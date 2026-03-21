import React, { useState, useEffect } from 'react';
import { DemoBanner } from '@/components/ui/DemoBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  Download,
  Filter,
  FileText,
  PieChart,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ReportsPageEnhanced = () => {
  const [activeTab, setActiveTab] = useState('wellbeing');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState<typeof mockReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Données de démonstration — seront remplacées par des données Supabase
  const DEMO_LABEL = ' (démo)';
  const mockReportData = {
    wellbeing: {
      averageScore: 0,
      trend: 'up',
      change: '--',
      totalSessions: 0,
      activeUsers: 0,
      departments: [
        { name: 'Tech', score: 0, users: 0, change: '--' },
        { name: 'Marketing', score: 0, users: 0, change: '--' },
        { name: 'Sales', score: 0, users: 0, change: '--' },
        { name: 'HR', score: 0, users: 0, change: '--' },
        { name: 'Finance', score: 0, users: 0, change: '--' }
      ]
    },
    productivity: {
      overallScore: 0,
      focusTime: 0,
      breaksTaken: 0,
      stressLevel: 0,
      metrics: [
        { name: 'Temps de focus moyen', value: '--', trend: 'up', change: '--' },
        { name: 'Pauses actives', value: '--', trend: 'up', change: '--' },
        { name: 'Niveau de stress', value: '--', trend: 'down', change: '--' },
        { name: 'Satisfaction', value: '--', trend: 'up', change: '--' }
      ]
    },
    engagement: {
      participationRate: 0,
      completionRate: 0,
      averageSessionDuration: 0,
      activities: [
        { name: 'Méditation', participation: 0, satisfaction: 0 },
        { name: 'Exercices respiratoires', participation: 0, satisfaction: 0 },
        { name: 'Journal émotionnel', participation: 0, satisfaction: 0 },
        { name: 'Défis équipe', participation: 0, satisfaction: 0 },
        { name: 'Sessions VR', participation: 0, satisfaction: 0 }
      ]
    },
    alerts: [] as { type: string; message: string; priority: string }[]
  };

  const generateReport = async (type: string, period: string) => {
    setIsGenerating(true);
    try {
      // Simulation de génération de rapport
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Rapport généré",
        description: `Le rapport ${type} pour la période ${period} a été créé.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportReport = async (format: string) => {
    try {
      toast({
        title: "Export en cours",
        description: `Le rapport sera téléchargé au format ${format}.`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le rapport.",
        variant: "destructive"
      });
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertBadge = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-500',
      'medium': 'bg-orange-500',
      'low': 'bg-blue-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  useEffect(() => {
    setReportData(mockReportData);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <DemoBanner message="Module en cours d'intégration — les données affichées sont des aperçus de la mise en page, pas des données réelles." />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-10 w-10 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Rapports & Analytics
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Analyses détaillées et insights pour optimiser le bien-être en entreprise
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => generateReport(activeTab, selectedPeriod)}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex items-center gap-2"
                >
                  <Activity className="h-4 w-4" />
                  Génération...
                </motion.div>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Générer rapport
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Alertes importantes */}
        {reportData?.alerts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Alertes & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {reportData.alerts.map((alert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border"
                    >
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                      </div>
                      <Badge className={`${getAlertBadge(alert.priority)} text-white`}>
                        {alert.priority}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="wellbeing" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Bien-être
            </TabsTrigger>
            <TabsTrigger value="productivity" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Productivité
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Engagement
            </TabsTrigger>
          </TabsList>

          {/* Rapport Bien-être */}
          <TabsContent value="wellbeing" className="space-y-6">
            {reportData?.wellbeing && (
              <>
                {/* KPIs principaux */}
                <div className="grid md:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Activity className="h-6 w-6 text-green-500" />
                          {reportData.wellbeing.trend === 'up' ? 
                            <TrendingUp className="h-4 w-4 text-green-500" /> :
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          }
                        </div>
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {reportData.wellbeing.averageScore}%
                        </div>
                        <div className="text-sm text-gray-600 mb-1">Score moyen</div>
                        <Badge className="bg-green-100 text-green-700">
                          {reportData.wellbeing.change}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-6 text-center">
                      <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {reportData.wellbeing.activeUsers}
                      </div>
                      <div className="text-sm text-gray-600">Utilisateurs actifs</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-6 text-center">
                      <PieChart className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {reportData.wellbeing.totalSessions}
                      </div>
                      <div className="text-sm text-gray-600">Sessions totales</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-orange-600 mb-1">
                        {selectedPeriod === 'month' ? '30' : selectedPeriod === 'week' ? '7' : '90'}
                      </div>
                      <div className="text-sm text-gray-600">Jours analysés</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Détail par département */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                        Performance par Département
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => exportReport('xlsx')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reportData.wellbeing.departments.map((dept, index) => (
                          <motion.div
                            key={dept.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"
                          >
                            <div className="w-20 text-sm font-medium">{dept.name}</div>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>{dept.users} utilisateurs</span>
                                <span>{dept.score}%</span>
                              </div>
                              <Progress value={dept.score} className="h-2" />
                            </div>
                            <Badge 
                              className={dept.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                            >
                              {dept.change}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </TabsContent>

          {/* Rapport Productivité */}
          <TabsContent value="productivity" className="space-y-6">
            {reportData?.productivity && (
              <>
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-green-500" />
                          Métriques Clés
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {reportData.productivity.metrics.map((metric, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                            <div>
                              <div className="font-medium">{metric.name}</div>
                              <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                {metric.trend === 'up' ? 
                                  <TrendingUp className="h-4 w-4 text-green-500" /> :
                                  <TrendingDown className="h-4 w-4 text-red-500" />
                                }
                                <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                                  {metric.change}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle>Score Global de Productivité</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="relative w-40 h-40 mx-auto mb-4">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="80"
                              cy="80"
                              r="70"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-gray-200"
                            />
                            <motion.circle
                              cx="80"
                              cy="80"
                              r="70"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-green-500"
                              strokeDasharray={`${2 * Math.PI * 70}`}
                              initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - reportData.productivity.overallScore / 100) }}
                              transition={{ duration: 1, ease: "easeInOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-green-600">
                                {reportData.productivity.overallScore}%
                              </div>
                              <div className="text-sm text-gray-600">Score global</div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Basé sur les métriques de focus, pauses et satisfaction
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Rapport Engagement */}
          <TabsContent value="engagement" className="space-y-6">
            {reportData?.engagement && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      Engagement par Activité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.engagement.activities.map((activity, index) => (
                        <motion.div
                          key={activity.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold">{activity.name}</h4>
                            <div className="flex items-center gap-4">
                              <Badge className="bg-purple-100 text-purple-700">
                                {activity.participation}% participation
                              </Badge>
                              <Badge className="bg-yellow-100 text-yellow-700">
                                ⭐ {activity.satisfaction}/10
                              </Badge>
                            </div>
                          </div>
                          <Progress value={activity.participation} className="h-3" />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Button 
            variant="outline"
            onClick={() => exportReport('pdf')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button 
            variant="outline"
            onClick={() => exportReport('xlsx')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Planifier envoi
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsPageEnhanced;