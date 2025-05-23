
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, FileText, Download, BarChart, LineChart, PieChart, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useNavigate } from 'react-router-dom';

const B2BAdminAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Vérification que l'utilisateur est bien un administrateur
  useEffect(() => {
    if (userMode !== 'b2b_admin' && user?.role !== 'b2b_admin') {
      navigate('/b2b/selection');
    }
  }, [userMode, user, navigate]);
  
  // Simulation du chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytiques</h1>
          <p className="text-muted-foreground">
            Analyses détaillées et tendances de l'organisation
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" onClick={() => navigate('/b2b/admin/dashboard')}>
            Retour au dashboard
          </Button>
        </div>
      </header>
      
      <div className="mb-8 flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant={dateRange === 'week' ? 'default' : 'outline'}
            onClick={() => setDateRange('week')}
          >
            Semaine
          </Button>
          <Button 
            variant={dateRange === 'month' ? 'default' : 'outline'}
            onClick={() => setDateRange('month')}
          >
            Mois
          </Button>
          <Button 
            variant={dateRange === 'quarter' ? 'default' : 'outline'}
            onClick={() => setDateRange('quarter')}
          >
            Trimestre
          </Button>
          <Button 
            variant={dateRange === 'year' ? 'default' : 'outline'}
            onClick={() => setDateRange('year')}
          >
            Année
          </Button>
        </div>
        
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Période
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Score moyen', value: '76%', change: '+2%', isPositive: true },
          { title: 'Taux d\'utilisation', value: '82%', change: '+5%', isPositive: true },
          { title: 'Alertes', value: '12', change: '-3', isPositive: true },
          { title: 'Utilisateurs inactifs', value: '8', change: '+2', isPositive: false },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                  <p className={`text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="emotions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="emotions" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Émotions</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Engagement</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Départements</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Rapports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="emotions">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendance des émotions</CardTitle>
                <CardDescription>Évolution au fil du temps par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="h-96 bg-muted/40 rounded-md flex items-center justify-center">
                    <LineChart className="h-10 w-10 text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Graphique de tendances des émotions</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des émotions</CardTitle>
                  <CardDescription>Distribution par catégorie</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-60 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="h-60 bg-muted/40 rounded-md flex items-center justify-center">
                      <PieChart className="h-10 w-10 text-muted-foreground" />
                      <p className="ml-2 text-muted-foreground">Graphique en secteurs</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top des déclencheurs</CardTitle>
                  <CardDescription>Causes les plus fréquentes</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-60 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="h-60 bg-muted/40 rounded-md flex items-center justify-center">
                      <BarChart className="h-10 w-10 text-muted-foreground" />
                      <p className="ml-2 text-muted-foreground">Graphique à barres</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité utilisateurs</CardTitle>
                <CardDescription>Utilisations quotidiennes et rétention</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="h-96 bg-muted/40 rounded-md flex items-center justify-center">
                    <LineChart className="h-10 w-10 text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Graphique d'engagement</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="departments">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison par départements</CardTitle>
                <CardDescription>Performance par service de l'entreprise</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="h-96 bg-muted/40 rounded-md flex items-center justify-center">
                    <BarChart className="h-10 w-10 text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Graphique comparatif par département</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rapports disponibles</CardTitle>
                <CardDescription>Télécharger les rapports détaillés</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-60 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { title: "Rapport mensuel d'émotions", date: "Mai 2025", size: "1.2 MB" },
                      { title: "Analyse de rétention", date: "T1 2025", size: "845 KB" },
                      { title: "Comparaison départements", date: "Avril 2025", size: "960 KB" },
                      { title: "Rapport d'anomalies", date: "Semaine 20", size: "1.5 MB" },
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <p className="text-sm text-muted-foreground">{report.date} • {report.size}</p>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Télécharger
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
