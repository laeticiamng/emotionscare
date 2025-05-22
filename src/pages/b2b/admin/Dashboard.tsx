
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Users, AlertTriangle, TrendingUp, TrendingDown, Clock, Calendar, FileText, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const B2BAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header with admin welcome message */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Administration</h1>
              <p className="text-muted-foreground">
                Tableau de bord de gestion de l'organisation
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 space-x-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Exporter</span>
              </Button>
              <Button size="sm">Générer un rapport</Button>
            </div>
          </div>
          
          {/* Quick stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">127</div>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% ce mois-ci</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bien-être moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">72%</div>
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+3% depuis la semaine dernière</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Alertes actives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">4</div>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>Requièrent votre attention</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taux d'absentéisme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">2.4%</div>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" />
                  <span>-0.8% depuis le dernier trimestre</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main dashboard tabs */}
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="teams">Équipes</TabsTrigger>
              <TabsTrigger value="trends">Tendances</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {/* Emotional health overview chart */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Aperçu de la santé émotionnelle</CardTitle>
                  <CardDescription>Données agrégées de toutes les équipes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center border-2 border-dashed border-muted rounded-md">
                    <BarChart className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Graphique en cours de chargement</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-muted-foreground">Satisfaction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-muted-foreground">Engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm text-muted-foreground">Stress</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Department breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Répartition par département</CardTitle>
                    <CardDescription>Classement des départements par niveau de bien-être</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Marketing', 'Développement', 'Ressources Humaines', 'Finance', 'Opérations'].map((dept, i) => (
                        <div key={dept} className="flex items-center">
                          <span className="w-24 text-sm">{dept}</span>
                          <div className="flex-1 h-4 bg-accent rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                i === 0 ? 'bg-emerald-500' : 
                                i === 1 ? 'bg-blue-500' : 
                                i === 2 ? 'bg-violet-500' : 
                                i === 3 ? 'bg-amber-500' : 
                                'bg-red-500'
                              }`} 
                              style={{ width: `${85 - (i * 7)}%` }}
                            ></div>
                          </div>
                          <span className="w-12 text-right text-sm font-medium ml-2">
                            {85 - (i * 7)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Actions requises</CardTitle>
                    <CardDescription>Points d'attention</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-amber-500 pl-3 py-1">
                      <p className="text-sm font-medium">Augmentation du stress - Équipe Développement</p>
                      <p className="text-xs text-muted-foreground">Augmentation de 15% cette semaine</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3 py-1">
                      <p className="text-sm font-medium">Baisse d'engagement - Service Finance</p>
                      <p className="text-xs text-muted-foreground">Tendance négative sur 3 semaines</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-3 py-1">
                      <p className="text-sm font-medium">Pic d'absentéisme - Opérations</p>
                      <p className="text-xs text-muted-foreground">3 absences non planifiées</p>
                    </div>
                    <Button className="w-full mt-2">Voir toutes les alertes</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="teams">
              <Card>
                <CardHeader>
                  <CardTitle>Vue d'ensemble des équipes</CardTitle>
                  <CardDescription>Gestion et suivi des différentes équipes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center border-2 border-dashed border-muted rounded-md">
                    <span className="text-muted-foreground">Contenu de l'onglet Équipes en cours de développement</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des tendances</CardTitle>
                  <CardDescription>Évolution des indicateurs au fil du temps</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center border-2 border-dashed border-muted rounded-md">
                    <span className="text-muted-foreground">Contenu de l'onglet Tendances en cours de développement</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Génération de rapports</CardTitle>
                  <CardDescription>Créez et téléchargez des rapports personnalisés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center border-2 border-dashed border-muted rounded-md">
                    <span className="text-muted-foreground">Contenu de l'onglet Rapports en cours de développement</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Calendar section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Planning des événements
              </CardTitle>
              <CardDescription>Prochains ateliers et initiatives de bien-être</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-accent p-2 rounded-md text-center min-w-[60px]">
                    <div className="text-sm font-medium">15</div>
                    <div className="text-xs text-muted-foreground">Juin</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Atelier Gestion du stress</h4>
                    <p className="text-xs text-muted-foreground">10:00 - 12:00 • Salle de conférence A</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-accent p-2 rounded-md text-center min-w-[60px]">
                    <div className="text-sm font-medium">22</div>
                    <div className="text-xs text-muted-foreground">Juin</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Séance de méditation collective</h4>
                    <p className="text-xs text-muted-foreground">14:00 - 15:00 • Espace détente</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-accent p-2 rounded-md text-center min-w-[60px]">
                    <div className="text-sm font-medium">30</div>
                    <div className="text-xs text-muted-foreground">Juin</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Présentation des nouveaux outils de bien-être</h4>
                    <p className="text-xs text-muted-foreground">11:00 - 12:30 • En ligne</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Voir le calendrier complet
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
};

export default B2BAdminDashboard;
