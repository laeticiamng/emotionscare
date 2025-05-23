
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Heart, BarChart3, Calendar, FileText, Music, MessageCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import UnifiedLayout from '@/components/unified/UnifiedLayout';
import QuickAccessGrid from '@/components/dashboard/b2c/QuickAccessGrid';

const EmotionCard = () => (
  <Card className="col-span-1 md:col-span-2">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <Heart className="h-5 w-5 mr-2 text-primary" />
        État émotionnel
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center py-6">
        <p className="text-lg font-medium">Comment vous sentez-vous aujourd'hui ?</p>
        <Button 
          onClick={() => toast.info("Navigation vers le scan émotionnel")}
          className="mt-4"
        >
          Analyser mes émotions
        </Button>
      </div>
    </CardContent>
  </Card>
);

const ActivitySummary = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-primary" />
        Activités récentes
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Séances de scan</span>
          <span className="font-medium">3</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Séances d'audio</span>
          <span className="font-medium">2</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Séances de VR</span>
          <span className="font-medium">1</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const UpcomingSessions = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-primary" />
        Sessions à venir
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="p-3 bg-muted rounded-md">
          <p className="font-medium">Séance de méditation</p>
          <p className="text-sm text-muted-foreground">Demain, 10:00</p>
        </div>
        <div className="p-3 bg-muted rounded-md">
          <p className="font-medium">Coaching émotionnel</p>
          <p className="text-sm text-muted-foreground">Jeudi, 14:30</p>
        </div>
        <Button variant="outline" className="w-full" onClick={() => toast.info("Planification de session")}>
          Planifier une session
        </Button>
      </div>
    </CardContent>
  </Card>
);

const JournalEntryWidget = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <FileText className="h-5 w-5 mr-2 text-primary" />
        Journal émotionnel
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Dernière entrée il y a 2 jours</p>
        <Button className="w-full" onClick={() => toast.info("Ajout d'une entrée au journal")}>
          Ajouter une entrée
        </Button>
      </div>
    </CardContent>
  </Card>
);

const RecommendedContent = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <Music className="h-5 w-5 mr-2 text-primary" />
        Contenu recommandé
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="p-3 bg-muted rounded-md flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-2">
            <Music className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">Méditation guidée</p>
            <p className="text-sm text-muted-foreground">10 minutes</p>
          </div>
        </div>
        <div className="p-3 bg-muted rounded-md flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-2">
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">Exercice de respiration</p>
            <p className="text-sm text-muted-foreground">5 minutes</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={() => toast.info("Navigation vers la bibliothèque")}>
          Voir plus
        </Button>
      </div>
    </CardContent>
  </Card>
);

const CoachWidget = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <MessageCircle className="h-5 w-5 mr-2 text-primary" />
        Coach virtuel
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center py-6">
        <p className="mb-4">Besoin de conseils ou de soutien ?</p>
        <Button onClick={() => toast.info("Démarrage conversation avec le coach")}>
          Parler à mon coach
        </Button>
      </div>
    </CardContent>
  </Card>
);

const WelcomeAlert = () => (
  <Alert className="mb-6">
    <AlertTitle className="flex items-center">
      <Heart className="h-4 w-4 mr-2" />
      Bienvenue sur votre tableau de bord
    </AlertTitle>
    <AlertDescription>
      Commencez par analyser vos émotions pour obtenir un suivi personnalisé de votre bien-être.
    </AlertDescription>
  </Alert>
);

const IncompleteProfileAlert = () => (
  <Alert variant="destructive" className="mb-6">
    <AlertTriangle className="h-4 w-4 mr-2" />
    <AlertTitle>Profil incomplet</AlertTitle>
    <AlertDescription>
      Pour profiter pleinement de votre expérience, complétez votre profil en ajoutant vos préférences.
      <Button variant="outline" size="sm" className="ml-2 mt-2" onClick={() => toast.info("Navigation vers le profil")}>
        Compléter mon profil
      </Button>
    </AlertDescription>
  </Alert>
);

const B2CDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showProfileAlert, setShowProfileAlert] = useState(true);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Veuillez vous connecter pour accéder à cette page');
      navigate('/b2c/login');
    }
    
    // Masquer l'alerte de bienvenue après quelques secondes
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, navigate]);
  
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
            Bienvenue, {user?.name || 'Utilisateur'}
          </h1>
        </div>
        
        {showWelcome && <WelcomeAlert />}
        {showProfileAlert && (
          <IncompleteProfileAlert />
        )}
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <QuickAccessGrid className="mb-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <EmotionCard />
              <ActivitySummary />
              <UpcomingSessions />
              <JournalEntryWidget />
              <RecommendedContent />
              <CoachWidget />
            </div>
          </TabsContent>
          
          <TabsContent value="activities">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Historique des activités</h3>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Scan émotionnel</h4>
                        <p className="text-sm text-muted-foreground">22/05/2025, 14:30</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast.info("Affichage des détails")}>
                        Détails
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Session de musique</h4>
                        <p className="text-sm text-muted-foreground">21/05/2025, 10:15</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast.info("Affichage des détails")}>
                        Détails
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Séance VR</h4>
                        <p className="text-sm text-muted-foreground">20/05/2025, 16:45</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast.info("Affichage des détails")}>
                        Détails
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="journal">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Mon journal</h3>
                  <Button onClick={() => toast.info("Ajout d'une nouvelle entrée")}>
                    Nouvelle entrée
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium">Journée productive</h4>
                    <p className="text-sm text-muted-foreground mb-2">21/05/2025</p>
                    <p className="text-sm">Aujourd'hui a été une journée très productive. J'ai réussi à accomplir plusieurs tâches importantes...</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium">Sensation de stress</h4>
                    <p className="text-sm text-muted-foreground mb-2">19/05/2025</p>
                    <p className="text-sm">J'ai ressenti beaucoup de stress aujourd'hui à cause de la préparation de la présentation...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Recommandations personnalisées</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="bg-primary/10 p-3 rounded-full w-fit mb-2">
                      <Music className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium">Playlist apaisante</h4>
                    <p className="text-sm text-muted-foreground mb-2">30 minutes</p>
                    <Button variant="outline" className="mt-2" onClick={() => toast.info("Écoute de la playlist")}>
                      Écouter
                    </Button>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="bg-primary/10 p-3 rounded-full w-fit mb-2">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium">Technique de respiration</h4>
                    <p className="text-sm text-muted-foreground mb-2">5 minutes</p>
                    <Button variant="outline" className="mt-2" onClick={() => toast.info("Démarrage de l'exercice")}>
                      Commencer
                    </Button>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="bg-primary/10 p-3 rounded-full w-fit mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium">Article : Gestion du stress</h4>
                    <p className="text-sm text-muted-foreground mb-2">Lecture de 10 minutes</p>
                    <Button variant="outline" className="mt-2" onClick={() => toast.info("Lecture de l'article")}>
                      Lire
                    </Button>
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

export default B2CDashboard;
