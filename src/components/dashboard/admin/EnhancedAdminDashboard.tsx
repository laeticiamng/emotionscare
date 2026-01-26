// @ts-nocheck
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardAnimatedChart from './DashboardAnimatedChart';
import EmotionalWeatherWidget from '../widgets/EmotionalWeatherWidget';
import TeamActivitySummary from '../widgets/TeamActivitySummary';
import NotificationsPanel from './NotificationsPanel';
import UserActivityChart from '@/components/admin/UserActivityChart';
import OrganizationStats from '@/components/admin/OrganizationStats';
import { useUser } from '@/hooks/useUser';
import { motion } from 'framer-motion';
import OnboardingButton from '@/components/admin/OnboardingButton';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { b2bAdminOnboardingSteps } from '@/data/onboardingSteps';
import { CommandMenu } from '@/components/ui/command-menu';
import { AnimatePresence } from 'framer-motion';

const EnhancedAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useUser();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  
  return (
    <OnboardingProvider steps={b2bAdminOnboardingSteps}>
      <div className="container mx-auto py-6 space-y-8">
        <motion.div 
          className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Tableau de bord {user?.name ? `de ${user.name}` : 'Admin'}
            </h1>
            <p className="text-muted-foreground">
              Bienvenue sur votre espace administrateur EmotionsCare
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <OnboardingButton />
            <button 
              className="text-sm px-3 py-1.5 rounded-full border bg-background hover:bg-accent transition-colors duration-200 flex items-center gap-1.5"
              onClick={() => setIsCommandOpen(true)}
            >
              <span>⌘</span>
              <span>K</span>
            </button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              key={`weather-widget`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="col-span-1"
            >
              <EmotionalWeatherWidget />
            </motion.div>
          
          <motion.div
              key={`org-stats`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="col-span-1 md:col-span-2"
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Organisation</CardTitle>
                  <CardDescription>
                    Vue d'ensemble des statistiques d'utilisation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrganizationStats />
                </CardContent>
              </Card>
            </motion.div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 h-auto gap-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="teams">Équipes</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="sync">{/* Fixed multiple children warning */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Activité utilisateur</CardTitle>
                      <CardDescription>Interactions quotidiennes sur la plateforme</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UserActivityChart />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Dernières mises à jour</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <NotificationsPanel />
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tendances émotionnelles</CardTitle>
                    <CardDescription>
                      Évolution du bien-être émotionnel sur les 30 derniers jours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <DashboardAnimatedChart />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activité des équipes</CardTitle>
                      <CardDescription>Résumé des interactions par équipe</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TeamActivitySummary />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Objectifs collectifs</CardTitle>
                      <CardDescription>Progression vers les objectifs de bien-être</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Engagement hebdomadaire</span>
                            <span className="text-sm text-muted-foreground">75%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Satisfaction globale</span>
                            <span className="text-sm text-muted-foreground">82%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full" style={{ width: '82%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Réduction du stress</span>
                            <span className="text-sm text-muted-foreground">43%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-warning rounded-full" style={{ width: '43%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="teams" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des équipes</CardTitle>
                    <CardDescription>Visualisez et gérez les équipes de votre organisation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Contenu de l'onglet Teams...</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytiques avancées</CardTitle>
                    <CardDescription>Explorez les données détaillées de votre organisation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Contenu de l'onglet Analytics...</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des utilisateurs</CardTitle>
                    <CardDescription>Administrez les comptes utilisateurs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Contenu de l'onglet Users...</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres administrateur</CardTitle>
                    <CardDescription>Configurez les options administrateur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Contenu de l'onglet Settings...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
      
      <CommandMenu 
        open={isCommandOpen} 
        onOpenChange={setIsCommandOpen}
        commands={[
          { category: "Navigation", command: "Aller au tableau de bord", shortcut: "G D" },
          { category: "Navigation", command: "Aller aux paramètres", shortcut: "G S" },
          { category: "Navigation", command: "Aller aux équipes", shortcut: "G T" },
          { category: "Actions", command: "Exporter les données", shortcut: "E D" },
          { category: "Actions", command: "Créer un rapport", shortcut: "C R" },
          { category: "Actions", command: "Lancer la formation", shortcut: "L F" },
        ]}
      />
    </OnboardingProvider>
  );
};

export default EnhancedAdminDashboard;
