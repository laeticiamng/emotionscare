import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Calendar, FileText, Heart, Music, Headphones, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EmptyState from '@/components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const B2CDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [wellbeingScore, setWellbeingScore] = useState<number | null>(null);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  // Simulation du chargement des données
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simuler les appels API avec un délai
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Données fictives pour la démo
        setWellbeingScore(78);
        setRecentEntries([
          { id: 1, date: '2023-05-22', mood: 'Heureux', note: 'Journée très productive' },
          { id: 2, date: '2023-05-20', mood: 'Calme', note: 'Méditation matinale bénéfique' }
        ]);
        setUpcomingEvents([
          { id: 1, title: 'Session de musicothérapie', date: '2023-05-25', type: 'music' },
          { id: 2, title: 'Séance de relaxation guidée', date: '2023-05-27', type: 'meditation' }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Impossible de charger les données du tableau de bord');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAction = (action: string) => {
    switch (action) {
      case 'scan':
        navigate('/b2c/scan');
        break;
      case 'journal':
        navigate('/b2c/journal');
        break;
      case 'music':
        navigate('/b2c/music');
        break;
      case 'social':
        navigate('/b2c/social');
        break;
      default:
        toast.info('Fonctionnalité en cours de développement');
    }
  };

  // Variants pour les animations avec Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Rendu du score de bien-être
  const renderWellbeingScore = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      );
    }

    if (wellbeingScore === null) {
      return (
        <EmptyState 
          title="Aucune donnée de bien-être" 
          description="Effectuez un scan émotionnel pour voir votre score de bien-être"
          icon={Heart}
          action={{
            label: "Faire un scan",
            onClick: () => handleAction('scan')
          }}
        />
      );
    }

    const getScoreColor = (score: number) => {
      if (score < 40) return "bg-red-500";
      if (score < 70) return "bg-yellow-500";
      return "bg-green-500";
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Score de bien-être</h4>
          <span className="text-2xl font-bold">{wellbeingScore}%</span>
        </div>
        <ProgressBar 
          value={wellbeingScore} 
          indicatorClassName={getScoreColor(wellbeingScore)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Besoin d'attention</span>
          <span>Optimal</span>
        </div>
        <Button onClick={() => handleAction('scan')} className="w-full mt-4">
          Nouveau scan émotionnel
        </Button>
      </div>
    );
  };

  // Rendu des entrées récentes du journal
  const renderRecentEntries = () => {
    if (isLoading) {
      return Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      ));
    }

    if (!recentEntries.length) {
      return (
        <EmptyState 
          title="Aucune entrée de journal" 
          description="Commencez à noter vos pensées et émotions"
          icon={FileText}
          action={{
            label: "Nouvelle entrée",
            onClick: () => handleAction('journal')
          }}
        />
      );
    }

    return recentEntries.map(entry => (
      <div key={entry.id} className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{new Date(entry.date).toLocaleDateString('fr-FR')}</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{entry.mood}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 truncate">{entry.note}</p>
      </div>
    ));
  };

  // Rendu des prochains événements
  const renderUpcomingEvents = () => {
    if (isLoading) {
      return Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-12 w-full" />
        </div>
      ));
    }

    if (!upcomingEvents.length) {
      return (
        <EmptyState 
          title="Aucun événement à venir" 
          description="Explorez les sessions disponibles"
          icon={Calendar}
          action={{
            label: "Voir les sessions",
            onClick: () => toast.info('Page des sessions en développement')
          }}
        />
      );
    }

    const getEventIcon = (type: string) => {
      switch (type) {
        case 'music': return <Music className="h-5 w-5 text-blue-500" />;
        case 'meditation': return <Headphones className="h-5 w-5 text-green-500" />;
        default: return <Calendar className="h-5 w-5 text-gray-500" />;
      }
    };

    return upcomingEvents.map(event => (
      <div key={event.id} className="flex items-center p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
        <div className="bg-muted rounded-full p-2 mr-3">
          {getEventIcon(event.type)}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">{event.title}</div>
          <div className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString('fr-FR')}</div>
        </div>
        <Button size="sm" variant="ghost">Voir</Button>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour, {user?.name || 'là'}</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace personnel</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => navigate('/b2c/profile')} variant="ghost" className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <span>Mon profil</span>
          </Button>
        </motion.div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4">
          <TabsTrigger value="overview">Vue générale</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="music" className="hidden md:block">Musicothérapie</TabsTrigger>
          <TabsTrigger value="social" className="hidden md:block">Social</TabsTrigger>
        </TabsList>

        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Bien-être</CardTitle>
                    <CardDescription>Votre score actuel et tendances</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderWellbeingScore()}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Journal</CardTitle>
                      <CardDescription>Vos entrées récentes</CardDescription>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleAction('journal')}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderRecentEntries()}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>À venir</CardTitle>
                      <CardDescription>Vos prochaines sessions</CardDescription>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleAction('calendar')}>
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderUpcomingEvents()}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Scan émotionnel', icon: Heart, action: 'scan' },
                { title: 'Journal', icon: FileText, action: 'journal' },
                { title: 'Musicothérapie', icon: Music, action: 'music' },
                { title: 'Espace social', icon: User, action: 'social' }
              ].map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Button
                    variant="outline"
                    className="h-24 w-full flex flex-col items-center justify-center gap-2"
                    onClick={() => handleAction(item.action)}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.title}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Other Tabs */}
          {['emotions', 'journal', 'music', 'social'].map(tab => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle>{tab.charAt(0).toUpperCase() + tab.slice(1)}</CardTitle>
                  <CardDescription>
                    Module {tab.charAt(0).toUpperCase() + tab.slice(1)} d'EmotionsCare
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => handleAction(tab)}>
                    Accéder au module {tab}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </motion.div>
      </Tabs>
    </div>
  );
};

export default B2CDashboard;
