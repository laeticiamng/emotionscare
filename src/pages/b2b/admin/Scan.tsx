
import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { 
  BarChart3, Download, PieChart, CalendarClock, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const B2BAdminScan: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for usage statistics
  const usageData = [
    { name: 'Lun', emotion: 45, object: 8, text: 12 },
    { name: 'Mar', emotion: 52, object: 12, text: 10 },
    { name: 'Mer', emotion: 48, object: 10, text: 14 },
    { name: 'Jeu', emotion: 60, object: 15, text: 16 },
    { name: 'Ven', emotion: 55, object: 10, text: 18 },
    { name: 'Sam', emotion: 20, object: 2, text: 5 },
    { name: 'Dim', emotion: 15, object: 1, text: 3 },
  ];
  
  // Mock data for scan type distribution
  const scanTypeData = [
    { name: 'Scan émotionnel', value: 70 },
    { name: 'Scan d\'objet', value: 15 },
    { name: 'Scan de texte', value: 15 },
  ];
  
  // Mock data for trend data
  const trendData = [
    { date: '01/05', usage: 60 },
    { date: '02/05', usage: 65 },
    { date: '03/05', usage: 70 },
    { date: '04/05', usage: 75 },
    { date: '05/05', usage: 80 },
    { date: '06/05', usage: 85 },
    { date: '07/05', usage: 82 },
    { date: '08/05', usage: 80 },
    { date: '09/05', usage: 85 },
    { date: '10/05', usage: 88 },
    { date: '11/05', usage: 90 },
    { date: '12/05', usage: 92 },
    { date: '13/05', usage: 95 },
    { date: '14/05', usage: 98 },
  ];
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];
  
  const handleExportData = () => {
    toast({
      title: 'Exportation en cours',
      description: 'Les données anonymisées sont en cours d\'exportation.',
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Statistiques de scan - Vue globale</h1>
            <p className="text-muted-foreground">
              Analyse d'utilisation des fonctionnalités de scan par votre équipe.
            </p>
          </div>
          <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
            <Download size={16} />
            Exporter
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Scans totaux</CardTitle>
            <CardDescription>Ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">632</p>
                <p className="text-sm text-muted-foreground">+14% vs mois dernier</p>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Type de scan</CardTitle>
            <CardDescription>Le plus utilisé</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">Émotionnel</p>
                <p className="text-sm text-muted-foreground">70% des scans</p>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
                <PieChart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taux de conversion</CardTitle>
            <CardDescription>Scan → Action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">62%</p>
                <p className="text-sm text-muted-foreground">+8% vs mois dernier</p>
              </div>
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="detailed-usage">Utilisation détaillée</TabsTrigger>
          <TabsTrigger value="temporal">Tendances temporelles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilisation hebdomadaire par type de scan</CardTitle>
              <CardDescription>Répartition par jour de la semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usageData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="emotion" name="Scan émotionnel" stackId="a" fill="#3B82F6" />
                    <Bar dataKey="object" name="Scan d'objet" stackId="a" fill="#10B981" />
                    <Bar dataKey="text" name="Scan de texte" stackId="a" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des types de scan</CardTitle>
                <CardDescription>Répartition par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={scanTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {scanTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations IA</CardTitle>
                <CardDescription>Basées sur les statistiques d'utilisation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300">Tendances d'utilisation</h3>
                    <p className="text-sm mt-2">
                      Le scan émotionnel est le plus utilisé (70%). Considérez de mettre en avant cette fonctionnalité
                      dans vos communications auprès des équipes.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-300">Points d'amélioration</h3>
                    <p className="text-sm mt-2">
                      L'utilisation du scan d'objet est relativement faible (15%). Envisagez de former les utilisateurs
                      sur cette fonctionnalité pour en augmenter l'adoption.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300">Actions recommandées</h3>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Organiser un webinaire de démonstration des scans d'objets</li>
                      <li>• Mettre en place un challenge mensuel lié aux scans</li>
                      <li>• Partager des témoignages d'utilisateurs satisfaits</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed-usage">
          <Card>
            <CardHeader>
              <CardTitle>Utilisation détaillée par département</CardTitle>
              <CardDescription>
                Analyse approfondie des scans par équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Cette section présente une analyse détaillée de l'utilisation des fonctionnalités de scan par département.
                Toutes les données sont anonymisées pour protéger la vie privée des collaborateurs.
              </p>
              
              <div className="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-lg text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold">Contenu détaillé à venir</h3>
                <p className="mt-2 text-muted-foreground">
                  Cette fonctionnalité sera disponible prochainement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temporal">
          <Card>
            <CardHeader>
              <CardTitle>Évolution de l'utilisation</CardTitle>
              <CardDescription>
                Tendance d'utilisation sur les 14 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      name="Nombre de scans"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Tendance positive détectée
                </h3>
                <p className="text-sm mt-2">
                  L'utilisation des fonctionnalités de scan est en augmentation constante (+38% sur les 14 derniers jours).
                  Cette tendance indique une bonne adoption des outils par les équipes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminScan;
