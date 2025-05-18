
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCcw, 
  LayoutDashboard, 
  Users, 
  BarChart, 
  Calendar, 
  Settings, 
  AlertTriangle, 
  TrendingUp 
} from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import GlobalOverviewTab from './tabs/overview/GlobalOverviewTab';
import { TeamSummary, AdminAccessLog } from '@/types';
import { useToast } from '@/hooks/use-toast';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const EnhancedAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [teamSummaries, setTeamSummaries] = useState<TeamSummary[]>([]);
  const [accessLogs, setAccessLogs] = useState<AdminAccessLog[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Mock data for demonstration
    setTeamSummaries([
      { teamId: 'team-1', memberCount: 12, averageMood: 'calm', alertCount: 2, trendDirection: 'up' },
      { teamId: 'team-2', memberCount: 8, averageMood: 'focused', alertCount: 0, trendDirection: 'stable' },
      { teamId: 'team-3', memberCount: 15, averageMood: 'stressed', alertCount: 4, trendDirection: 'down' }
    ]);
    
    setAccessLogs([
      { adminId: 'admin-1', action: 'Dashboard access', timestamp: new Date().toISOString() },
      { adminId: 'admin-2', action: 'Analytics export', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { adminId: 'admin-1', action: 'Team settings update', timestamp: new Date(Date.now() - 7200000).toISOString() }
    ]);
  }, []);
  
  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      // Here you would fetch real data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Données actualisées",
        description: "Les données du tableau de bord ont été mises à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'actualisation",
        description: "Impossible de mettre à jour les données",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <DashboardHeader onRefresh={handleRefresh} />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Vue d'ensemble</span>
            <span className="inline sm:hidden">Aperçu</span>
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Équipes</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Analytiques</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Calendrier</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
            className="mt-6"
          >
            <TabsContent value="overview" className="mt-0">
              <GlobalOverviewTab />
            </TabsContent>
            
            <TabsContent value="teams" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des équipes</CardTitle>
                  <CardDescription>Consultez et gérez les équipes et leurs membres</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="grid gap-4" 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {teamSummaries.map((team) => (
                      <motion.div 
                        key={team.teamId}
                        variants={fadeIn}
                        className="p-4 border rounded-lg flex items-center justify-between hover:bg-accent/50 transition-colors"
                      >
                        <div>
                          <h3 className="font-medium">Équipe {team.teamId}</h3>
                          <p className="text-sm text-muted-foreground">{team.memberCount} membres</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={team.trendDirection === 'down' ? 'destructive' : 'default'}>
                            {team.averageMood}
                          </Badge>
                          {team.alertCount > 0 && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {team.alertCount}
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">Voir</Button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Analytiques</CardTitle>
                  <CardDescription>Mesures et statistiques d'équipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Contenu des analytiques à venir...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Calendrier</CardTitle>
                  <CardDescription>Événements et planifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Contenu du calendrier à venir...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres administrateur</CardTitle>
                  <CardDescription>Configuration et préférences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Card className="bg-background">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Journal d'accès</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        {accessLogs.map((log, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div>
                              <p className="text-sm font-medium">{log.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant="outline">{log.adminId}</Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-background">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">RGPD & Anonymisation</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">Seuil minimum d'affichage</p>
                            <p className="text-xs text-muted-foreground">
                              Nombre minimum de personnes pour afficher des statistiques
                            </p>
                          </div>
                          <Badge variant="outline" className="font-mono">5</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default EnhancedAdminDashboard;
