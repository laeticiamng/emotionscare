
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Info, LineChart, BarChart2, PieChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReportTimeline from '@/components/reports/ReportTimeline';
import ReportDataCards from '@/components/reports/ReportDataCards';
import ChartContainer from '@/components/reports/ChartContainer';
import { ReportPrivacyBadge } from '@/components/reports/ReportPrivacyBadge';
import mockReports from '@/data/mockReports';
import useSound from '@/hooks/useSound';
import { ReportingProvider } from '@/contexts/ReportingContext';

const ReportsAndDashboardPage: React.FC = () => {
  const { toast } = useToast();
  const [period, setPeriod] = useState<string>('month');
  const { playSound } = useSound();
  const [isExporting, setIsExporting] = useState(false);

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    playSound('tap');
  };

  const handleExportReport = () => {
    setIsExporting(true);
    playSound('success');
    
    setTimeout(() => {
      toast({
        title: "Votre rapport est prêt !",
        description: "Le rapport a été généré avec succès et est disponible au téléchargement.",
        variant: "default",
      });
      setIsExporting(false);
    }, 1500);
  };

  return (
    <ReportingProvider>
      <div className="container mx-auto py-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LineChart className="h-8 w-8 text-primary" />
              Rapports & Analyses
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualisez et analysez votre parcours émotionnel en détail
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[180px]">
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
              onClick={handleExportReport} 
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  Génération...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Exporter
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <ReportPrivacyBadge />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="emotions" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span>Émotions</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>Progression</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Chronologie</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <ReportDataCards period={period} />
              <ChartContainer type="overview" period={period} />
            </TabsContent>

            <TabsContent value="emotions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution des émotions</CardTitle>
                  <CardDescription>Répartition de vos émotions sur la période</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ChartContainer type="emotions" period={period} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progression du bien-être</CardTitle>
                  <CardDescription>Évolution de votre score de bien-être</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ChartContainer type="progress" period={period} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <ReportTimeline reports={mockReports} />
            </TabsContent>
          </Tabs>
        </motion.div>

        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Vos rapports récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReports.map((report) => (
                <motion.div 
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-muted/50 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.date).toLocaleDateString('fr-FR', { 
                        day: 'numeric', month: 'long', year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ReportingProvider>
  );
};

export default ReportsAndDashboardPage;
