
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Calendar, FileText, Heart, Music, Users, Building2, BarChart2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EmptyState from '@/components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const B2BUserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [wellbeingScore, setWellbeingScore] = useState<number | null>(null);
  const [teamWellbeingScore, setTeamWellbeingScore] = useState<number | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [teamActivities, setTeamActivities] = useState<any[]>([]);

  // Simulation du chargement des données
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simuler les appels API avec un délai
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Données fictives pour la démo
        setWellbeingScore(72);
        setTeamWellbeingScore(68);
        setUpcomingEvents([
          { id: 1, title: 'Session d\'équipe: Gestion du stress', date: '2023-05-25', type: 'workshop' },
          { id: 2, title: 'Séance de relaxation guidée', date: '2023-05-27', type: 'meditation' }
        ]);
        setTeamActivities([
          { id: 1, name: 'Atelier cohésion', participants: 12, date: '2023-05-29' },
          { id: 2, name: 'Séance de méditation collective', participants: 8, date: '2023-06-02' }
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
        navigate('/b2b/user/scan');
        break;
      case 'team':
        navigate('/b2b/user/team');
        break;
      case 'activities':
        navigate('/b2b/user/activities');
        break;
      case 'social':
        navigate('/b2b/user/social');
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

  // Rendu du score de bien-être personnel
  const renderPersonalWellbeingScore = () => {
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
          description="Effectuez un scan émotionnel pour voir votre score personnel"
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
          <h4 className="text-sm font-medium">Votre bien-être</h4>
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

  // Rendu du score de bien-être d'équipe
  const renderTeamWellbeingScore = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      );
    }

    if (teamWellbeingScore === null) {
      return (
        <EmptyState 
          title="Données d'équipe indisponibles" 
          description="Les données d'équipe seront disponibles lorsque votre équipe sera complétée"
          icon={Users}
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
          <h4 className="text-sm font-medium">Bien-être de l'équipe</h4>
          <span className="text-2xl font-bold">{teamWellbeingScore}%</span>
        </div>
        <ProgressBar 
          value={teamWellbeingScore} 
          indicatorClassName={getScoreColor(teamWellbeingScore)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Besoin d'attention</span>
          <span>Optimal</span>
        </div>
        <Button onClick={() => handleAction('team')} className="w-full mt-4">
          Voir les statistiques d'équipe
        </Button>
      </div>
    );
  };

  // Rendu des événements à venir
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
          description="Explorez les sessions disponibles pour votre entreprise"
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
        case 'workshop': return <Users className="h-5 w-5 text-blue-500" />;
        case 'meditation': return <Heart className="h-5 w-5 text-green-500" />;
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

  // Rendu des activités d'équipe
  const renderTeamActivities = () => {
    if (isLoading) {
      return Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-12 w-full" />
        </div>
      ));
    }

    if (!teamActivities.length) {
      return (
        <EmptyState 
          title="Aucune activité d'équipe" 
          description="Participez à des activités pour renforcer la cohésion"
          icon={Users}
          action={{
            label: "Explorer les activités",
            onClick: () => handleAction('activities')
          }}
        />
      );
    }

    return teamActivities.map(activity => (
      <div key={activity.id} className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
        <div className="flex justify-between items-center">
          <span className="font-medium">{activity.name}</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            {activity.participants} participants
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date(activity.date).toLocaleDateString('fr-FR')}
        </p>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour, {user?.name || 'là'}</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace collaborateur</p>
          {user?.company && (
            <div className="mt-1 flex items-center">
              <Building2 className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user.company}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-4">
          <TabsTrigger value="overview">Vue générale</TabsTrigger>
          <TabsTrigger value="personal">Personnel</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
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
                    <CardTitle>Bien-être personnel</CardTitle>
                    <CardDescription>Votre score actuel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderPersonalWellbeingScore()}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Bien-être de l'équipe</CardTitle>
                    <CardDescription>Score collectif</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderTeamWellbeingScore()}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Événements à venir</CardTitle>
                      <CardDescription>Sessions programmées</CardDescription>
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
                { title: 'Mon équipe', icon: Users, action: 'team' },
                { title: 'Activités', icon: Calendar, action: 'activities' },
                { title: 'Espace social', icon: Users, action: 'social' }
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

          {/* Personal Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Votre espace personnel</CardTitle>
                <CardDescription>
                  Suivez votre bien-être et accédez à vos outils personnalisés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Votre bien-être</h3>
                    {renderPersonalWellbeingScore()}
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Outils personnels</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAction('journal')}>
                        <FileText className="h-4 w-4 mr-2" /> Journal
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAction('meditation')}>
                        <Heart className="h-4 w-4 mr-2" /> Méditation
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAction('music')}>
                        <Music className="h-4 w-4 mr-2" /> Musicothérapie
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAction('scan')}>
                        <BarChart2 className="h-4 w-4 mr-2" /> Analyse
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Espace équipe</CardTitle>
                <CardDescription>
                  Consultez les informations sur votre équipe et la dynamique collective
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Bien-être de l'équipe</h3>
                    {renderTeamWellbeingScore()}
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Activités d'équipe</h3>
                    <div className="space-y-3">
                      {renderTeamActivities()}
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => handleAction('team')}>
                  Voir toutes les données d'équipe
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Activités et événements</CardTitle>
                <CardDescription>
                  Découvrez et participez aux activités disponibles pour votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Événements à venir</h3>
                    {renderUpcomingEvents()}
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Explorer les activités</h3>
                    <div className="space-y-3">
                      <Button className="w-full" onClick={() => handleAction('activities')}>
                        Voir le catalogue complet
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Découvrez les ateliers, formations et sessions disponibles pour améliorer votre bien-être au travail.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default B2BUserDashboard;
