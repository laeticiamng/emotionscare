
import React, { useState, useEffect } from 'react';
import EnhancedSupportAssistant from '@/components/support/EnhancedSupportAssistant';
import HelpCenter from '@/components/support/HelpCenter';
import IncidentPortal from '@/components/support/IncidentPortal';
import Shell from '@/Shell';
import { SupportProvider } from '@/contexts/SupportContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, LifeBuoy, Info, Clock, ArrowRight, CheckCircle } from 'lucide-react';

const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assistance');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Show onboarding tooltip after 2 seconds on first visit
    const hasSeenOnboarding = localStorage.getItem('support-onboarding-seen');
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
        localStorage.setItem('support-onboarding-seen', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const dismissOnboarding = () => {
    setShowOnboarding(false);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Show congratulations toast when reaching the last tab
    if (value === 'resources' && activeTab !== 'resources') {
      toast({
        title: "Bravo !",
        description: "Vous avez exploré toutes les options d'assistance !",
        variant: "success"
      });
    }
  };

  return (
    <Shell>
      <SupportProvider>
        <div className="container mx-auto py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Centre d'assistance</h1>
            <p className="text-muted-foreground max-w-2xl">
              Nous sommes là pour vous aider ! Explorez nos ressources d'aide ou contactez directement notre équipe d'assistance.
            </p>
          </motion.div>

          <Tabs defaultValue="assistance" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-3 mb-8 w-full sm:w-auto">
              <TabsTrigger value="assistance" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Assistance</span>
              </TabsTrigger>
              <TabsTrigger value="incidents" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Incidents</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4" />
                <span className="hidden sm:inline">Ressources</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assistance" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <EnhancedSupportAssistant />
                </div>

                <div>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Statut de vos demandes</CardTitle>
                      <CardDescription>
                        Suivez l'état de vos tickets d'assistance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-500 h-5 w-5" />
                            <div>
                              <p className="font-medium">Problème d'affichage</p>
                              <p className="text-xs text-muted-foreground">Créé il y a 2 jours</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600">Résolu</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock className="text-amber-500 h-5 w-5" />
                            <div>
                              <p className="font-medium">Question sur la confidentialité</p>
                              <p className="text-xs text-muted-foreground">Créé hier</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-600">En cours</Badge>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full mt-4 text-sm">
                        Voir tout l'historique
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="incidents" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <IncidentPortal />
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Guide de résolution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">1. Vérifiez votre connexion</h3>
                        <p className="text-sm text-muted-foreground">
                          Assurez-vous que votre connexion internet est stable
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">2. Redémarrez l'application</h3>
                        <p className="text-sm text-muted-foreground">
                          Rafraîchissez la page ou reconnectez-vous
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">3. Signalez le problème</h3>
                        <p className="text-sm text-muted-foreground">
                          Utilisez le formulaire d'incident pour décrire précisément votre problème
                        </p>
                      </div>
                      
                      <Button className="w-full mt-2 flex items-center gap-2">
                        Guide de dépannage complet
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <HelpCenter />
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Tutoriels vidéo</CardTitle>
                      <CardDescription>
                        Apprenez à utiliser toutes les fonctionnalités
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="group cursor-pointer rounded-lg overflow-hidden border relative">
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Button size="sm" variant="secondary">Regarder</Button>
                          </div>
                          <div className="aspect-video bg-muted flex items-center justify-center">
                            <Play className="h-8 w-8 text-muted-foreground/50" />
                          </div>
                          <div className="p-2">
                            <h4 className="font-medium">Premiers pas</h4>
                            <p className="text-xs text-muted-foreground">3:45 min</p>
                          </div>
                        </div>
                        
                        <div className="group cursor-pointer rounded-lg overflow-hidden border relative">
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Button size="sm" variant="secondary">Regarder</Button>
                          </div>
                          <div className="aspect-video bg-muted flex items-center justify-center">
                            <Play className="h-8 w-8 text-muted-foreground/50" />
                          </div>
                          <div className="p-2">
                            <h4 className="font-medium">Analyse émotionnelle</h4>
                            <p className="text-xs text-muted-foreground">5:12 min</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <AnimatePresence>
            {showOnboarding && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed bottom-4 right-4 max-w-xs bg-card border rounded-lg shadow-lg p-4 z-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Bienvenue dans l'assistance</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={dismissOnboarding}
                  >
                    ×
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Explorez les différents onglets pour découvrir nos options d'assistance
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-xs">Assistance IA disponible 24/7</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SupportProvider>
    </Shell>
  );
};

export default SupportPage;

import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';
