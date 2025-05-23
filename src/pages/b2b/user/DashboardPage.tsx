
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Heart, Users, BarChart3, Calendar, FileText, User, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { toast } from 'sonner';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

// Composant pour la carte d'équipe
const TeamOverviewCard = () => (
  <Card className="col-span-1 md:col-span-2 h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <Users className="h-5 w-5 mr-2 text-primary" />
        Mon équipe
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center">
            <div className="bg-primary/10 rounded-full p-2 mr-3">
              <User className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium">Marie Dubois</span>
          </div>
          <span className="text-sm text-muted-foreground">Membre</span>
        </div>
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center">
            <div className="bg-primary/10 rounded-full p-2 mr-3">
              <User className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium">Thomas Martin</span>
          </div>
          <span className="text-sm text-muted-foreground">Membre</span>
        </div>
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center">
            <div className="bg-primary/10 rounded-full p-2 mr-3">
              <User className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium">Sophie Bernard</span>
          </div>
          <span className="text-sm text-muted-foreground">Membre</span>
        </div>
        <Button variant="outline" className="w-full" onClick={() => toast.info("Voir tous les membres")}>
          Voir tous les membres
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Composant pour le suivi émotionnel
const EmotionalTrackingCard = () => (
  <Card className="col-span-1 h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <Heart className="h-5 w-5 mr-2 text-primary" />
        Mon suivi émotionnel
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Dernière analyse: Aujourd'hui</p>
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="text-xl font-bold">75%</div>
            <div className="text-xs text-muted-foreground">Bien-être</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-xl font-bold">23%</div>
            <div className="text-xs text-muted-foreground">Stress</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-xl font-bold">82%</div>
            <div className="text-xs text-muted-foreground">Énergie</div>
          </div>
        </div>
        <Button className="w-full" onClick={() => toast.info("Nouvelle analyse demandée")}>
          Nouvelle analyse
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Composant pour les sessions à venir
const UpcomingSessionsCard = () => (
  <Card className="col-span-1 h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-primary" />
        Sessions à venir
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="p-3 bg-muted rounded-md">
          <p className="font-medium">Team Building</p>
          <p className="text-sm text-muted-foreground">Demain, 14:00</p>
        </div>
        <div className="p-3 bg-muted rounded-md">
          <p className="font-medium">Coaching d'équipe</p>
          <p className="text-sm text-muted-foreground">Vendredi, 10:30</p>
        </div>
        <Button variant="outline" className="w-full" onClick={() => toast.info("Planification d'une session")}>
          Planifier une session
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Composant pour la carte entreprise
const CompanyCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <Building className="h-5 w-5 mr-2 text-primary" />
        Mon entreprise
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">EmotionsCare Inc.</p>
            <p className="text-sm text-muted-foreground">Bien-être émotionnel</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Membres actifs:</span>
          <span className="font-medium">24</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Mon équipe:</span>
          <span className="font-medium">Équipe Marketing</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Rôle:</span>
          <span className="font-medium">Collaborateur</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const B2BUserDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userMode, setUserMode } = useUserMode();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  
  // S'assurer que le mode d'utilisateur est correct
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Veuillez vous connecter pour accéder à cette page');
      navigate('/b2b/user/login');
    }
    
    // Définir le mode utilisateur si nécessaire
    if (userMode !== 'b2b_user') {
      setUserMode('b2b_user');
    }
    
    // Masquer l'alerte de bienvenue après quelques secondes
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, navigate, userMode, setUserMode]);
  
  if (isLoading) {
    return (
      <UnifiedLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </UnifiedLayout>
    );
  }
  
  return (
    <UnifiedLayout>
      <div className="container max-w-7xl mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenue, {user?.name || 'Collaborateur'}
          </h1>
        </div>
        
        {showWelcome && (
          <Alert className="mb-6 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30">
            <AlertTitle className="text-blue-800 dark:text-blue-300">Espace Collaborateur</AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              Accédez à vos outils de bien-être en entreprise et suivez les activités de votre équipe.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="team">Mon équipe</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="analytics">Analytique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TeamOverviewCard />
              <EmotionalTrackingCard />
              <UpcomingSessionsCard />
              <CompanyCard />
              
              <Card className="col-span-1 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <p className="font-medium">Séance d'équipe complétée</p>
                      <p className="text-sm text-muted-foreground">Hier, 15:30</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="font-medium">Questionnaire bien-être complété</p>
                      <p className="text-sm text-muted-foreground">23/05/2025, 10:15</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="font-medium">Session de méditation</p>
                      <p className="text-sm text-muted-foreground">22/05/2025, 09:00</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => toast.info("Affichage de l'historique complet")}>
                      Voir l'historique complet
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Ressources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">Guide du bien-être</p>
                      <p className="text-sm text-muted-foreground">PDF • 2.4 MB</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">Exercices de cohésion</p>
                      <p className="text-sm text-muted-foreground">PDF • 1.8 MB</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => toast.info("Ouverture de la bibliothèque de ressources")}>
                      Voir toutes les ressources
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Mon équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Membres de l'équipe</h3>
                    <div className="space-y-2">
                      {['Marie Dubois', 'Thomas Martin', 'Sophie Bernard', 'Jean Petit', 'Claire Leroy'].map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border-b">
                          <div className="flex items-center">
                            <div className="bg-primary/10 rounded-full p-2 mr-3">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <span>{member}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => toast.info(`Voir le profil de ${member}`)}>
                            Voir le profil
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Sessions d'équipe</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 border-b">
                        <div>
                          <p className="font-medium">Team Building</p>
                          <p className="text-sm text-muted-foreground">Demain, 14:00</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => toast.info("Détails de la session affichés")}>
                          Détails
                        </Button>
                      </div>
                      <div className="flex justify-between items-center p-2 border-b">
                        <div>
                          <p className="font-medium">Cohésion de groupe</p>
                          <p className="text-sm text-muted-foreground">30/05/2025, 11:00</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => toast.info("Détails de la session affichés")}>
                          Détails
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Bien-être de l'équipe</h3>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Bien-être global</span>
                          <span className="font-medium">72%</span>
                        </div>
                        <div className="h-2 bg-muted rounded">
                          <div className="h-full bg-green-500 rounded" style={{ width: '72%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Stress</span>
                          <span className="font-medium">28%</span>
                        </div>
                        <div className="h-2 bg-muted rounded">
                          <div className="h-full bg-amber-500 rounded" style={{ width: '28%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Cohésion</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <div className="h-2 bg-muted rounded">
                          <div className="h-full bg-blue-500 rounded" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Sessions planifiées</h3>
                    <Button onClick={() => toast.info("Planification d'une nouvelle session")}>
                      Planifier une session
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Team Building</h4>
                          <p className="text-sm text-muted-foreground">Demain, 14:00 - 16:00</p>
                          <p className="text-sm">Salle de conférence A</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toast.info("Détails de la session affichés")}>
                            Détails
                          </Button>
                          <Button size="sm" onClick={() => toast.info("Confirmation de participation")}>
                            Confirmer
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Coaching d'équipe</h4>
                          <p className="text-sm text-muted-foreground">Vendredi, 10:30 - 12:00</p>
                          <p className="text-sm">Salle de réunion B</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toast.info("Détails de la session affichés")}>
                            Détails
                          </Button>
                          <Button size="sm" onClick={() => toast.info("Confirmation de participation")}>
                            Confirmer
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Cohésion de groupe</h4>
                          <p className="text-sm text-muted-foreground">30/05/2025, 11:00 - 13:00</p>
                          <p className="text-sm">Salle détente</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toast.info("Détails de la session affichés")}>
                            Détails
                          </Button>
                          <Button size="sm" onClick={() => toast.info("Confirmation de participation")}>
                            Confirmer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Sessions passées</h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Méditation guidée</h4>
                            <p className="text-sm text-muted-foreground">22/05/2025, 09:00 - 10:00</p>
                            <p className="text-sm">Salle zen</p>
                          </div>
                          <div>
                            <Button variant="outline" size="sm" onClick={() => toast.info("Affichage des notes de session")}>
                              Notes
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Atelier gestion du stress</h4>
                            <p className="text-sm text-muted-foreground">15/05/2025, 14:00 - 16:00</p>
                            <p className="text-sm">Salle de conférence A</p>
                          </div>
                          <div>
                            <Button variant="outline" size="sm" onClick={() => toast.info("Affichage des notes de session")}>
                              Notes
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Mon bien-être émotionnel</h3>
                    <div className="h-60 bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Graphique de tendance du bien-être</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Comparaison avec l'équipe</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Votre bien-être</span>
                          <span className="font-medium">75%</span>
                        </div>
                        <div className="h-2 bg-muted rounded">
                          <div className="h-full bg-primary rounded" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Moyenne de l'équipe</span>
                          <span className="font-medium">72%</span>
                        </div>
                        <div className="h-2 bg-muted rounded">
                          <div className="h-full bg-blue-500 rounded" style={{ width: '72%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Moyenne de l'entreprise</span>
                          <span className="font-medium">68%</span>
                        </div>
                        <div className="h-2 bg-muted rounded">
                          <div className="h-full bg-green-500 rounded" style={{ width: '68%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Sessions complétées</h3>
                      <div className="text-3xl font-bold">12</div>
                      <p className="text-sm text-muted-foreground">Sur les 30 derniers jours</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Minutes de bien-être</h3>
                      <div className="text-3xl font-bold">420</div>
                      <p className="text-sm text-muted-foreground">Sur les 30 derniers jours</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Activité de l'équipe</h3>
                      <div className="text-3xl font-bold">85%</div>
                      <p className="text-sm text-muted-foreground">Taux de participation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
};

export default B2BUserDashboard;
