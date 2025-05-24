
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Building2, 
  Users, 
  Brain, 
  Music, 
  BookOpen, 
  Scan, 
  TrendingUp, 
  Calendar,
  Award,
  Target,
  Smile,
  Activity,
  Plus,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const B2BUserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 0,
    teamAverage: 0,
    personalProgress: 0,
    companyRanking: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalScans: 18,
        teamAverage: 82,
        personalProgress: 78,
        companyRanking: 3
      });
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Scanner mes émotions',
      description: 'Analyser votre état émotionnel professionnel',
      icon: Scan,
      action: () => navigate('/scan'),
      color: 'bg-blue-500'
    },
    {
      title: 'Coach IA Professionnel',
      description: 'Conseils pour la gestion du stress au travail',
      icon: Brain,
      action: () => navigate('/coach'),
      color: 'bg-purple-500'
    },
    {
      title: 'Musique de focus',
      description: 'Améliorer votre concentration',
      icon: Music,
      action: () => navigate('/music'),
      color: 'bg-green-500'
    },
    {
      title: 'Journal professionnel',
      description: 'Réflexions sur votre journée de travail',
      icon: BookOpen,
      action: () => navigate('/journal'),
      color: 'bg-orange-500'
    }
  ];

  const getDayMessage = () => {
    const hour = new Date().getHours();
    const name = user?.user_metadata?.name || 'Collaborateur';
    const company = user?.user_metadata?.company || 'votre organisation';
    
    if (hour < 12) return `Bonjour ${name} !`;
    if (hour < 18) return `Bon après-midi ${name} !`;
    return `Bonsoir ${name} !`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre espace collaborateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-primary mr-3" />
          <Badge variant="secondary" className="text-sm">
            Espace Collaborateur
          </Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2">{getDayMessage()}</h1>
        <p className="text-muted-foreground">
          Gérez votre bien-être au travail et contribuez à une meilleure ambiance d'équipe.
        </p>
      </motion.div>

      {/* Statistiques équipe/entreprise */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mes analyses</p>
                <p className="text-2xl font-bold">{stats.totalScans}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Moyenne équipe</p>
                <p className="text-2xl font-bold">{stats.teamAverage}%</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ma progression</p>
                <p className="text-2xl font-bold">{stats.personalProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Classement</p>
                <p className="text-2xl font-bold">#{stats.companyRanking}</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="actions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="actions">Actions rapides</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="progress">Progression</TabsTrigger>
          <TabsTrigger value="company">Entreprise</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance de l'équipe</CardTitle>
              <CardDescription>
                Vue d'ensemble du bien-être de votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">JD</span>
                    </div>
                    <div>
                      <p className="font-medium">Jean Dupont</p>
                      <p className="text-sm text-muted-foreground">Chef d'équipe</p>
                    </div>
                  </div>
                  <Badge variant="secondary">95% bien-être</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">ML</span>
                    </div>
                    <div>
                      <p className="font-medium">Marie Leblanc</p>
                      <p className="text-sm text-muted-foreground">Développeuse</p>
                    </div>
                  </div>
                  <Badge variant="secondary">88% bien-être</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">PD</span>
                    </div>
                    <div>
                      <p className="font-medium">Pierre Durand</p>
                      <p className="text-sm text-muted-foreground">Designer</p>
                    </div>
                  </div>
                  <Badge variant="secondary">76% bien-être</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Votre progression mensuelle</CardTitle>
              <CardDescription>
                Évolution de votre bien-être au travail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Objectif mensuel</span>
                  <Badge variant="secondary">{stats.personalProgress}% atteint</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${stats.personalProgress}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">18</p>
                    <p className="text-xs text-muted-foreground">Analyses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">12</p>
                    <p className="text-xs text-muted-foreground">Sessions coach</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">8</p>
                    <p className="text-xs text-muted-foreground">Entrées journal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance entreprise</CardTitle>
              <CardDescription>
                Vue d'ensemble du bien-être dans votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">Niveau de bien-être global</p>
                      <p className="text-sm text-muted-foreground">Moyenne de tous les collaborateurs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">84%</p>
                    <p className="text-xs text-muted-foreground">+5% ce mois</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Participants actifs</p>
                    <p className="text-xl font-bold">127/150</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Taux d'engagement</p>
                    <p className="text-xl font-bold">85%</p>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">🎯 Objectif du mois</h4>
                  <p className="text-sm text-muted-foreground">
                    Atteindre 90% de bien-être global grâce aux initiatives de team building et aux sessions de méditation collectives.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BUserDashboardPage;
