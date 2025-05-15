
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Calendar, Download, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const B2BAdminJournal: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for emotion trends
  const emotionTrendData = [
    { date: '01/05', joy: 45, calm: 22, stress: 18, anxiety: 15 },
    { date: '02/05', joy: 40, calm: 25, stress: 20, anxiety: 15 },
    { date: '03/05', joy: 35, calm: 30, stress: 25, anxiety: 10 },
    { date: '04/05', joy: 30, calm: 35, stress: 20, anxiety: 15 },
    { date: '05/05', joy: 35, calm: 30, stress: 25, anxiety: 10 },
    { date: '06/05', joy: 40, calm: 28, stress: 20, anxiety: 12 },
    { date: '07/05', joy: 42, calm: 30, stress: 18, anxiety: 10 },
    { date: '08/05', joy: 38, calm: 32, stress: 22, anxiety: 8 },
    { date: '09/05', joy: 42, calm: 28, stress: 20, anxiety: 10 },
    { date: '10/05', joy: 45, calm: 25, stress: 18, anxiety: 12 },
    { date: '11/05', joy: 48, calm: 24, stress: 18, anxiety: 10 },
    { date: '12/05', joy: 46, calm: 25, stress: 19, anxiety: 10 },
    { date: '13/05', joy: 50, calm: 22, stress: 18, anxiety: 10 },
    { date: '14/05', joy: 52, calm: 24, stress: 16, anxiety: 8 },
  ];
  
  // Mock data for participation
  const participationData = [
    { name: 'Journal actifs', value: 68 },
    { name: 'Inactifs', value: 32 },
  ];
  
  // Mock data for emotion distribution
  const emotionDistributionData = [
    { name: 'Joie', value: 35 },
    { name: 'Calme', value: 25 },
    { name: 'Stress', value: 20 },
    { name: 'Anxiété', value: 10 },
    { name: 'Autres', value: 10 },
  ];
  
  const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EC4899', '#64748B'];
  
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
            <h1 className="text-3xl font-bold mb-2">Journal émotionnel - Vue globale</h1>
            <p className="text-muted-foreground">
              Analyse anonymisée des tendances émotionnelles de votre équipe.
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
            <CardTitle className="text-lg">Taux de participation</CardTitle>
            <CardDescription>Utilisation du journal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">68%</p>
                <p className="text-sm text-muted-foreground">+5% vs mois dernier</p>
              </div>
              <div className="h-16 w-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participationData}
                      innerRadius={15}
                      outerRadius={30}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {participationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#E5E7EB'} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nombre d'entrées</CardTitle>
            <CardDescription>Ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div>
                <p className="text-3xl font-bold">246</p>
                <p className="text-sm text-muted-foreground">+12% vs mois dernier</p>
              </div>
              <div className="ml-auto p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
                <BarChart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Émotion dominante</CardTitle>
            <CardDescription>Tendance générale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div>
                <p className="text-3xl font-bold">Joie</p>
                <p className="text-sm text-muted-foreground">35% des entrées</p>
              </div>
              <div className="ml-auto p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="emotional-trends">Tendances émotionnelles</TabsTrigger>
          <TabsTrigger value="participation">Participation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution émotionnelle (14 derniers jours)</CardTitle>
              <CardDescription>Pourcentage des émotions exprimées par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={emotionTrendData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="joy"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      name="Joie"
                    />
                    <Area
                      type="monotone"
                      dataKey="calm"
                      stackId="1"
                      stroke="#6366F1"
                      fill="#6366F1"
                      name="Calme"
                    />
                    <Area
                      type="monotone"
                      dataKey="stress"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      name="Stress"
                    />
                    <Area
                      type="monotone"
                      dataKey="anxiety"
                      stackId="1"
                      stroke="#EC4899"
                      fill="#EC4899"
                      name="Anxiété"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des émotions</CardTitle>
                <CardDescription>Répartition globale des émotions exprimées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emotionDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {emotionDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations IA</CardTitle>
                <CardDescription>Basées sur les tendances émotionnelles de l'équipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300">Tendances positives</h3>
                    <p className="text-sm mt-2">
                      Les émotions positives sont en augmentation (+5%). Continuez à encourager les pratiques actuelles
                      et à célébrer les succès de l'équipe.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-300">Points de vigilance</h3>
                    <p className="text-sm mt-2">
                      Légère hausse du stress en fin de semaine (+3%). Considérez d'organiser des sessions de
                      relaxation ou de prévoir des moments de pause collective.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300">Actions recommandées</h3>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Organiser un atelier de gestion du stress (priorité haute)</li>
                      <li>• Encourager l'utilisation régulière du journal (priorité moyenne)</li>
                      <li>• Évaluer la charge de travail en fin de semaine (priorité haute)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emotional-trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendances émotionnelles détaillées</CardTitle>
              <CardDescription>
                Analyse approfondie des émotions exprimées par l'équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Cette section présente une analyse détaillée des tendances émotionnelles de votre équipe.
                Toutes les données sont anonymisées pour protéger la vie privée des collaborateurs.
              </p>
              
              <div className="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-lg text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold">Contenu détaillé à venir</h3>
                <p className="mt-2 text-muted-foreground">
                  Cette fonctionnalité sera disponible prochainement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participation">
          <Card>
            <CardHeader>
              <CardTitle>Analyse de participation</CardTitle>
              <CardDescription>
                Statistiques d'utilisation du journal émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Cette section présente les statistiques d'utilisation du journal émotionnel au sein de votre équipe.
                Toutes les données sont anonymisées pour protéger la vie privée des collaborateurs.
              </p>
              
              <div className="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-lg text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold">Contenu détaillé à venir</h3>
                <p className="mt-2 text-muted-foreground">
                  Cette fonctionnalité sera disponible prochainement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminJournal;
