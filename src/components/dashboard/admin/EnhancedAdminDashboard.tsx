
import React, { useState } from 'react';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Building, ChevronDown, Users, PieChart, Bell, LayoutDashboard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import GlobalOverviewTab from '@/components/dashboard/admin/tabs/overview/GlobalOverviewTab';
import { useSegment } from '@/contexts/SegmentContext';
import AccessLogsTable from '@/components/dashboard/admin/AccessLogsTable';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    }
  }
};

const EnhancedAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { selectedSegment } = useSegment();

  return (
    <motion.div 
      className="pb-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Dashboard Header */}
      <motion.div variants={itemVariants} className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            <span className="inline-flex items-center">
              <LayoutDashboard className="mr-2 h-8 w-8 text-primary" />
              Supervision d'équipe
            </span>
          </h1>
          <p className="text-muted-foreground">
            Accédez aux données anonymisées et synthétisées de l'ensemble du personnel
          </p>
        </div>
        
        {selectedSegment && (
          <Badge variant="outline" className="px-4 py-2 text-sm flex items-center">
            <Building className="h-4 w-4 mr-2" />
            <span>Filtré par segment: {selectedSegment}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Badge>
        )}
      </motion.div>
      
      {/* Quick Stats Row */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatsCard 
          title="Personnel actif" 
          value="132" 
          description="Membres connectés cette semaine"
          trend={{ direction: 'up', value: 12 }}
          icon={<Users className="h-5 w-5" />}
        />
        
        <StatsCard 
          title="Bien-être moyen" 
          value="75%" 
          description="Sur l'ensemble des équipes"
          trend={{ direction: 'up', value: 4 }}
          icon={<PieChart className="h-5 w-5" />}
        />
        
        <StatsCard 
          title="Équipes" 
          value="8" 
          description="Réparties sur 3 sites"
          trend={{ direction: 'stable', value: 0 }}
          icon={<Building className="h-5 w-5" />}
        />
        
        <StatsCard 
          title="Alertes actives" 
          value="3" 
          description="Nécessitant attention"
          trend={{ direction: 'down', value: 2 }}
          icon={<Bell className="h-5 w-5" />}
        />
      </motion.div>
      
      {/* Main Content Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 h-auto">
            <TabsTrigger value="overview" className="py-2">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="py-2">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Équipes</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="py-2">
              <PieChart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="py-2">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Alertes</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="py-2 hidden lg:flex">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <GlobalOverviewTab />
          </TabsContent>
          
          <TabsContent value="teams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Équipes</CardTitle>
                <CardDescription>
                  Vue d'ensemble des équipes et de leur état émotionnel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contenu des équipes à venir prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Analyses approfondies des données émotionnelles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contenu des analytics à venir prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alertes</CardTitle>
                <CardDescription>
                  Alertes et notifications importantes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contenu des alertes à venir prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres</CardTitle>
                <CardDescription>
                  Configuration de la supervision d'équipe.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contenu des paramètres à venir prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Access Logs Card */}
      <motion.div 
        variants={itemVariants} 
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M16 2v5h5"></path>
                <path d="M21 6v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12l5 3Z"></path>
              </svg>
              Logs d'accès
            </CardTitle>
            <CardDescription>
              Journal des dernières actions effectuées par les administrateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccessLogsTable />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedAdminDashboard;
