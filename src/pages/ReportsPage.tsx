
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, FileText, TrendingUp, Users, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '@/components/reports/AnalyticsDashboard';
import ReportGenerator from '@/components/reports/ReportGenerator';
import DataVisualization from '@/components/reports/DataVisualization';
import PerformanceMetrics from '@/components/reports/PerformanceMetrics';
import ExportCenter from '@/components/reports/ExportCenter';
import ReportsFilters from '@/components/reports/ReportsFilters';

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [appliedFilters, setAppliedFilters] = useState({});

  const isAdmin = user?.role === 'b2b_admin';
  const isB2BUser = user?.role === 'b2b_user';

  const getAvailableTabs = () => {
    const baseTabs = [
      { id: 'analytics', label: 'Tableau de Bord', icon: BarChart },
      { id: 'performance', label: 'Performance', icon: TrendingUp },
      { id: 'visualization', label: 'Visualisations', icon: FileText },
      { id: 'export', label: 'Export', icon: Download }
    ];

    if (isAdmin) {
      return [
        ...baseTabs,
        { id: 'generator', label: 'Générateur', icon: Users }
      ];
    }

    return baseTabs;
  };

  const tabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête de la page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Rapports & Analyses
            </h1>
            <p className="text-muted-foreground mt-2">
              Analysez vos données et générez des rapports détaillés
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              {user?.role === 'b2b_admin' ? 'Administrateur' : 
               user?.role === 'b2b_user' ? 'Utilisateur B2B' : 'Utilisateur B2C'}
            </Badge>
            <ReportsFilters onFiltersChange={setAppliedFilters} />
          </div>
        </motion.div>

        {/* Métriques rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rapports Générés</p>
                  <p className="text-2xl font-bold">127</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Analyses Actives</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <BarChart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs Analysés</p>
                  <p className="text-2xl font-bold">{isAdmin ? '1,234' : '1'}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Exports Ce Mois</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <Download className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contenu principal avec onglets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 mb-6">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsDashboard filters={appliedFilters} userRole={user?.role} />
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <PerformanceMetrics filters={appliedFilters} userRole={user?.role} />
            </TabsContent>

            <TabsContent value="visualization" className="space-y-6">
              <DataVisualization filters={appliedFilters} userRole={user?.role} />
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <ExportCenter filters={appliedFilters} userRole={user?.role} />
            </TabsContent>

            {isAdmin && (
              <TabsContent value="generator" className="space-y-6">
                <ReportGenerator filters={appliedFilters} />
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsPage;
