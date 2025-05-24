
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar as CalendarIcon,
  Download,
  Filter,
  Eye,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const B2BAdminAnalyticsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date()
  });
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [analyticsData, setAnalyticsData] = useState({
    wellbeingTrends: [],
    departmentStats: [],
    userEngagement: [],
    riskAnalysis: []
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange, selectedDepartment]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées pour la démonstration
      setAnalyticsData({
        wellbeingTrends: [
          { month: 'Jan', score: 78 },
          { month: 'Fév', score: 82 },
          { month: 'Mar', score: 79 },
          { month: 'Avr', score: 85 },
          { month: 'Mai', score: 84 }
        ],
        departmentStats: [
          { department: 'Développement', users: 45, avgScore: 88, trend: 'up' },
          { department: 'Marketing', users: 32, avgScore: 82, trend: 'up' },
          { department: 'Design', users: 18, avgScore: 85, trend: 'stable' },
          { department: 'Ventes', users: 28, avgScore: 76, trend: 'down' },
          { department: 'RH', users: 12, avgScore: 91, trend: 'up' }
        ],
        userEngagement: [
          { metric: 'Connexions quotidiennes', value: 89, change: +12 },
          { metric: 'Analyses complétées', value: 76, change: +8 },
          { metric: 'Sessions coach utilisées', value: 45, change: +15 },
          { metric: 'Entrées journal', value: 34, change: -2 }
        ],
        riskAnalysis: [
          { category: 'Stress élevé', count: 8, percentage: 5.3 },
          { category: 'Fatigue chronique', count: 12, percentage: 8.0 },
          { category: 'Burnout potentiel', count: 3, percentage: 2.0 },
          { category: 'Isolement social', count: 6, percentage: 4.0 }
        ]
      });
    } catch (error) {
      toast.error('Erreur lors du chargement des analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const departments = [
    { value: 'all', label: 'Tous les départements' },
    { value: 'dev', label: 'Développement' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Ventes' },
    { value: 'hr', label: 'Ressources Humaines' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Avancées</h1>
          <p className="text-muted-foreground">
            Analyse détaillée du bien-être organisationnel
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
          {/* Sélecteur de département */}
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sélecteur de date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y", { locale: fr })} -{" "}
                      {format(dateRange.to, "LLL dd, y", { locale: fr })}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y", { locale: fr })
                  )
                ) : (
                  <span>Sélectionner une période</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="risks">Analyse des risques</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Score moyen</p>
                    <p className="text-2xl font-bold">84%</p>
                    <p className="text-xs text-green-500">+5% ce mois</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Participation</p>
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-xs text-green-500">+3% ce mois</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alertes actives</p>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-red-500">-2 cette semaine</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Satisfaction</p>
                    <p className="text-2xl font-bold">4.6/5</p>
                    <p className="text-xs text-green-500">+0.2 ce mois</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution du bien-être</CardTitle>
              <CardDescription>Tendance sur les 5 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2 p-4">
                {analyticsData.wellbeingTrends.map((data, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div 
                      className="bg-primary rounded-t min-w-[40px] flex items-end justify-center pb-2"
                      style={{ height: `${(data.score / 100) * 200}px` }}
                    >
                      <span className="text-white text-sm font-semibold">{data.score}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{data.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance par département</CardTitle>
              <CardDescription>Comparaison des scores de bien-être</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.departmentStats.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{dept.department}</h4>
                        <p className="text-sm text-muted-foreground">{dept.users} collaborateurs</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">{dept.avgScore}%</p>
                        <div className="flex items-center">
                          {dept.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {dept.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                          {dept.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Métriques d'engagement</CardTitle>
              <CardDescription>Utilisation des fonctionnalités par les collaborateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analyticsData.userEngagement.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{metric.metric}</h4>
                      <Badge variant={metric.change > 0 ? "default" : "destructive"}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-muted rounded-full h-2 mr-4">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{metric.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des risques</CardTitle>
              <CardDescription>Identification des situations nécessitant une attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.riskAnalysis.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <h4 className="font-medium">{risk.category}</h4>
                        <p className="text-sm text-muted-foreground">{risk.count} collaborateurs concernés</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{risk.percentage}%</p>
                      <p className="text-sm text-muted-foreground">de l'effectif</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Recommandations</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Organiser des sessions de gestion du stress pour les équipes à risque</li>
                  <li>• Mettre en place des pauses régulières pour lutter contre la fatigue</li>
                  <li>• Encourager les activités sociales pour réduire l'isolement</li>
                  <li>• Surveiller de près les collaborateurs à risque de burnout</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
