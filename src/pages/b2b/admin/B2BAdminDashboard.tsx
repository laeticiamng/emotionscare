
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Building,
  Activity
} from 'lucide-react';

const B2BAdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const companyStats = {
    totalEmployees: 245,
    activeUsers: 189,
    engagementRate: 77,
    averageWellbeing: 72,
    criticalAlerts: 3,
    improvementTrend: '+5.2%'
  };

  const departmentData = [
    { name: 'Développement', members: 45, wellbeing: 78, engagement: 82 },
    { name: 'Marketing', members: 32, wellbeing: 74, engagement: 79 },
    { name: 'Ventes', members: 28, wellbeing: 69, engagement: 71 },
    { name: 'RH', members: 15, wellbeing: 85, engagement: 88 },
    { name: 'Support', members: 22, wellbeing: 76, engagement: 75 }
  ];

  const recentAlerts = [
    { id: 1, type: 'warning', department: 'Ventes', message: 'Stress élevé détecté dans l\'équipe', time: '2h' },
    { id: 2, type: 'info', department: 'Dev', message: 'Amélioration du bien-être +8%', time: '4h' },
    { id: 3, type: 'critical', department: 'Marketing', message: 'Baisse d\'engagement significative', time: '6h' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Administrateur</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble du bien-être de votre organisation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
          <Button>
            Générer Rapport
          </Button>
        </div>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Tous départements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((companyStats.activeUsers / companyStats.totalEmployees) * 100)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats.engagementRate}%</div>
            <Progress value={companyStats.engagementRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bien-être Moyen</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats.averageWellbeing}%</div>
            <p className="text-xs text-green-600">{companyStats.improvementTrend}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{companyStats.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">À traiter rapidement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Aujourd'hui</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+12% vs hier</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="departments">Départements</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Département</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Building className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{dept.name}</h3>
                        <p className="text-sm text-muted-foreground">{dept.members} membres</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Bien-être</p>
                        <p className="font-semibold">{dept.wellbeing}%</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <p className="font-semibold">{dept.engagement}%</p>
                      </div>
                      
                      <Badge 
                        variant={dept.wellbeing >= 75 ? 'default' : dept.wellbeing >= 65 ? 'secondary' : 'destructive'}
                      >
                        {dept.wellbeing >= 75 ? 'Excellent' : dept.wellbeing >= 65 ? 'Bon' : 'À améliorer'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.type === 'critical' ? 'bg-red-500' :
                      alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">{alert.department}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">il y a {alert.time}</span>
                      <Button size="sm" variant="outline">
                        Voir détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendances d'Utilisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Journal Émotionnel</span>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="w-20" />
                      <span className="text-sm">78%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Scans Émotionnels</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-20" />
                      <span className="text-sm">65%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Musique Thérapeutique</span>
                    <div className="flex items-center gap-2">
                      <Progress value={82} className="w-20" />
                      <span className="text-sm">82%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Coach IA</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20" />
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objectifs de l'Organisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Engagement global</span>
                      <span className="text-sm font-medium">77/85%</span>
                    </div>
                    <Progress value={77} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Bien-être moyen</span>
                      <span className="text-sm font-medium">72/80%</span>
                    </div>
                    <Progress value={72} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Adoption plateforme</span>
                      <span className="text-sm font-medium">189/220</span>
                    </div>
                    <Progress value={(189/220)*100} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'Organisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Gestion des Utilisateurs
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Building className="h-4 w-4 mr-2" />
                Structure des Départements
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Configuration des Alertes
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Paramètres de Reporting
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres Généraux
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminDashboard;
