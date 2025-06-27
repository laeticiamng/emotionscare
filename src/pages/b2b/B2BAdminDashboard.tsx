
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Shield,
  Download,
  Settings,
  UserCheck,
  Activity,
  Calendar,
  Mail
} from 'lucide-react';

const B2BAdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const organizationStats = {
    totalEmployees: 245,
    activeUsers: 198,
    engagementRate: 81,
    wellnessScore: 7.4,
    riskUsers: 12
  };

  const departmentData = [
    { name: 'IT', employees: 45, engagement: 85, score: 7.8, risk: 2 },
    { name: 'RH', employees: 12, engagement: 92, score: 8.1, risk: 0 },
    { name: 'Marketing', employees: 28, engagement: 78, score: 7.2, risk: 3 },
    { name: 'Ventes', employees: 35, engagement: 68, score: 6.9, risk: 5 },
    { name: 'Finance', employees: 18, engagement: 88, score: 7.6, risk: 1 }
  ];

  const alerts = [
    {
      type: 'warning',
      message: 'Baisse d\'engagement de 15% dans le département Ventes',
      time: 'Il y a 2h'
    },
    {
      type: 'info',
      message: 'Nouveau record d\'engagement mensuel atteint',
      time: 'Il y a 5h'
    },
    {
      type: 'urgent',
      message: '3 employés nécessitent un suivi prioritaire',
      time: 'Il y a 1j'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard Administrateur
              </h1>
            </div>
            <p className="text-gray-600">
              Vue d'ensemble du bien-être organisationnel - ACME Corp
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Employés</p>
                  <p className="text-2xl font-bold">{organizationStats.totalEmployees}</p>
                </div>
                <Users className="h-6 w-6 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Utilisateurs actifs</p>
                  <p className="text-2xl font-bold">{organizationStats.activeUsers}</p>
                </div>
                <UserCheck className="h-6 w-6 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Engagement</p>
                  <p className="text-2xl font-bold">{organizationStats.engagementRate}%</p>
                </div>
                <Activity className="h-6 w-6 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Score bien-être</p>
                  <p className="text-2xl font-bold">{organizationStats.wellnessScore}/10</p>
                </div>
                <TrendingUp className="h-6 w-6 text-indigo-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Utilisateurs à risque</p>
                  <p className="text-2xl font-bold">{organizationStats.riskUsers}</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="departments" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="departments">Départements</TabsTrigger>
                <TabsTrigger value="trends">Tendances</TabsTrigger>
                <TabsTrigger value="reports">Rapports</TabsTrigger>
              </TabsList>

              <TabsContent value="departments">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance par département
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentData.map((dept) => (
                        <div key={dept.name} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{dept.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{dept.employees} emp.</Badge>
                              {dept.risk > 0 && (
                                <Badge variant="destructive">{dept.risk} à risque</Badge>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">Engagement</span>
                                <span className="text-sm font-medium">{dept.engagement}%</span>
                              </div>
                              <Progress value={dept.engagement} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">Score bien-être</span>
                                <span className="text-sm font-medium">{dept.score}/10</span>
                              </div>
                              <Progress value={(dept.score / 10) * 100} className="h-2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution des métriques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      Graphique d'évolution temporelle
                      <br />
                      (Composant de graphique à intégrer)
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>Rapports disponibles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Rapport mensuel</h3>
                        <p className="text-sm text-gray-600">Analyse complète de décembre 2024</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Export données</h3>
                        <p className="text-sm text-gray-600">Données anonymisées CSV</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alertes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertes récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      alert.type === 'urgent' ? 'border-red-200 bg-red-50' :
                      alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Gérer les équipes
                </Button>
                <Button className="w-full" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer communication
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier intervention
                </Button>
                <Button className="w-full" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Audit de sécurité
                </Button>
              </CardContent>
            </Card>

            {/* Conformité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Conformité RGPD
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Anonymisation</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Actif
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chiffrement</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      AES-256
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audit trail</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Complet
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboard;
