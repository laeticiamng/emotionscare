
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, BarChart2, Settings, UserPlus, 
  Calendar, Activity, Search, Loader2, Download,
  AlertCircle, Building, Heart, PieChart, TrendingUp,
  Filter, ArrowRight, Plus, Mail, Delete
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from "@/components/ui/badge";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Données factices pour la démonstration
const mockUsers = [
  { id: 1, name: 'Sophie Martin', role: 'RH', avatar: 'https://i.pravatar.cc/150?img=5', lastActive: '1 heure', wellbeing: 85, status: 'active', email: 'sophie.m@entreprise.fr' },
  { id: 2, name: 'Thomas Dubois', role: 'Développeur', avatar: 'https://i.pravatar.cc/150?img=6', lastActive: '3 heures', wellbeing: 70, status: 'active', email: 'thomas.d@entreprise.fr' },
  { id: 3, name: 'Julie Lambert', role: 'Designer', avatar: 'https://i.pravatar.cc/150?img=7', lastActive: '2 jours', wellbeing: 90, status: 'active', email: 'julie.l@entreprise.fr' },
  { id: 4, name: 'Nicolas Bernard', role: 'Marketing', avatar: 'https://i.pravatar.cc/150?img=8', lastActive: '5 heures', wellbeing: 65, status: 'active', email: 'nicolas.b@entreprise.fr' },
  { id: 5, name: 'Marie Leroy', role: 'Finance', avatar: 'https://i.pravatar.cc/150?img=9', lastActive: '1 jour', wellbeing: 75, status: 'pending', email: 'marie.l@entreprise.fr' }
];

const mockTeams = [
  { id: 1, name: 'Équipe Marketing', members: 12, avgWellbeing: 78, trend: 'up' },
  { id: 2, name: 'Équipe Tech', members: 18, avgWellbeing: 72, trend: 'down' },
  { id: 3, name: 'Équipe Finance', members: 7, avgWellbeing: 81, trend: 'up' },
  { id: 4, name: 'Équipe RH', members: 5, avgWellbeing: 84, trend: 'stable' }
];

const mockEvents = [
  { id: 1, title: 'Atelier gestion du stress', date: '2023-06-15', time: '14:00', participants: 18, maxParticipants: 20 },
  { id: 2, title: 'Séance de méditation collective', date: '2023-06-12', time: '12:00', participants: 8, maxParticipants: 15 },
  { id: 3, title: 'Conférence: bien-être au travail', date: '2023-06-20', time: '10:00', participants: 25, maxParticipants: 30 }
];

const mockAlerts = [
  { id: 1, department: 'Tech', message: 'Baisse du bien-être général', severity: 'high', date: '2023-06-01' },
  { id: 2, department: 'Marketing', message: 'Augmentation du niveau de stress', severity: 'medium', date: '2023-06-02' },
  { id: 3, department: 'Finance', message: 'Pics d\'anxiété détectés', severity: 'low', date: '2023-06-04' }
];

const B2BAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState('Entreprise S.A.');
  const [teamWellbeing, setTeamWellbeing] = useState(76);
  const [isSubmitting, setIsSubmitting] = useState<{[key: string]: boolean}>({});
  
  // Charger les données au montage
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        // Simuler le chargement des données depuis une API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setTeams(mockTeams);
        setEvents(mockEvents);
        setAlerts(mockAlerts);
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard:", error);
        toast.error("Erreur de chargement du dashboard administrateur");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboard();
  }, []);

  // Filtrer les utilisateurs en fonction de la recherche
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          user => 
            user.name.toLowerCase().includes(query) || 
            user.role.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  // Inviter un utilisateur
  const inviteUser = async (teamId?: number) => {
    const actionKey = `invite-${teamId || 'new'}`;
    setIsSubmitting({...isSubmitting, [actionKey]: true});
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Invitation envoyée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'invitation");
    } finally {
      setIsSubmitting({...isSubmitting, [actionKey]: false});
    }
  };

  // Supprimer un utilisateur
  const removeUser = async (userId: number) => {
    const actionKey = `remove-${userId}`;
    setIsSubmitting({...isSubmitting, [actionKey]: true});
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mettre à jour l'état local
      setUsers(prev => prev.filter(user => user.id !== userId));
      setFilteredUsers(prev => prev.filter(user => user.id !== userId));
      
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
    } finally {
      setIsSubmitting({...isSubmitting, [actionKey]: false});
    }
  };

  // Créer un événement
  const createEvent = async () => {
    setIsSubmitting({...isSubmitting, 'create-event': true});
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1800));
      toast.success("Événement créé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la création de l'événement");
    } finally {
      setIsSubmitting({...isSubmitting, 'create-event': false});
    }
  };

  // Résoudre une alerte
  const resolveAlert = async (alertId: number) => {
    const actionKey = `resolve-${alertId}`;
    setIsSubmitting({...isSubmitting, [actionKey]: true});
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour l'état local
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      
      toast.success("Alerte marquée comme résolue");
    } catch (error) {
      toast.error("Erreur lors de la résolution de l'alerte");
    } finally {
      setIsSubmitting({...isSubmitting, [actionKey]: false});
    }
  };

  // Si les données sont en cours de chargement, afficher un squelette
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <h2 className="mt-4 text-xl font-medium">Chargement du tableau de bord administrateur...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
              <p className="text-muted-foreground mt-1">
                Gérez votre organisation {companyName} et ses indicateurs de bien-être
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => toast.info("Export disponible prochainement")}>
                <Download className="mr-2 h-4 w-4" />
                Exporter données
              </Button>
              <Button onClick={() => toast.info("Paramètres disponibles prochainement")}>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Button>
            </div>
          </div>
        </motion.div>
        
        <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview">Vue générale</TabsTrigger>
            <TabsTrigger value="teams">Équipes</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="events">Événements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Statistiques générales */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      Utilisateurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{users.length}</div>
                    <p className="text-sm text-muted-foreground">Total d'utilisateurs</p>
                    <div className="mt-4 text-sm">
                      <span className="font-medium">{users.filter(u => u.status === 'active').length}</span> actifs, 
                      <span className="font-medium ml-1">{users.filter(u => u.status === 'pending').length}</span> en attente
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Building className="mr-2 h-5 w-5 text-primary" />
                      Équipes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{teams.length}</div>
                    <p className="text-sm text-muted-foreground">Groupes actifs</p>
                    <div className="mt-4 text-sm">
                      <span className="font-medium">{teams.reduce((acc, team) => acc + team.members, 0)}</span> membres au total
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Heart className="mr-2 h-5 w-5 text-primary" />
                      Bien-être global
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{teamWellbeing}%</div>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      <span className="text-sm text-green-500">+5% ce mois</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={teamWellbeing} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Alertes de bien-être */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                        Alertes de bien-être
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {alerts.length} alerte{alerts.length !== 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Incidents et tendances nécessitant votre attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {alerts.length > 0 ? (
                      <div className="space-y-4">
                        {alerts.map(alert => (
                          <div 
                            key={alert.id}
                            className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-start space-x-4">
                              <div className={`p-2 rounded-full ${
                                alert.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                alert.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                                'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                              }`}>
                                <AlertCircle className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-medium">{alert.department}</h3>
                                  <Badge 
                                    className={`ml-2 ${
                                      alert.severity === 'high' ? 'bg-red-500' :
                                      alert.severity === 'medium' ? 'bg-amber-500' :
                                      'bg-blue-500'
                                    }`}
                                  >
                                    {alert.severity === 'high' ? 'Élevé' :
                                    alert.severity === 'medium' ? 'Moyen' : 'Faible'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {alert.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Détecté le {alert.date}
                                </p>
                              </div>
                            </div>
                            <div className="flex mt-3 md:mt-0">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mr-2"
                                onClick={() => toast.info("Analyse avancée disponible prochainement")}
                              >
                                Détails
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => resolveAlert(alert.id)}
                                disabled={isSubmitting[`resolve-${alert.id}`]}
                              >
                                {isSubmitting[`resolve-${alert.id}`] ? (
                                  <>
                                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                    Résolution...
                                  </>
                                ) : (
                                  "Résoudre"
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <CheckIcon className="mx-auto h-12 w-12 text-green-500 mb-3" />
                        <h3 className="text-lg font-medium">Aucune alerte active</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Toutes les alertes ont été résolues
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Aperçu des équipes */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="mr-2 h-5 w-5" /> 
                      Aperçu des équipes
                    </CardTitle>
                    <CardDescription>
                      Niveau de bien-être par département
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {teams.map(team => (
                        <div key={team.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <h3 className="font-medium">{team.name}</h3>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({team.members} membres)
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className={`mr-2 ${
                                team.trend === 'up' ? 'text-green-500' :
                                team.trend === 'down' ? 'text-red-500' :
                                'text-blue-500'
                              }`}>
                                {team.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                                {team.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                                {team.trend === 'stable' && <ArrowRight className="h-4 w-4" />}
                              </div>
                              <span className="font-medium">{team.avgWellbeing}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${
                                team.avgWellbeing >= 80 ? 'bg-green-500' :
                                team.avgWellbeing >= 70 ? 'bg-blue-500' :
                                team.avgWellbeing >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${team.avgWellbeing}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('teams')}
                      >
                        Voir toutes les équipes
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Actions rapides */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col items-center"
                    onClick={() => inviteUser()}
                    disabled={isSubmitting[`invite-new`]}
                  >
                    {isSubmitting[`invite-new`] ? (
                      <>
                        <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-6 w-6 mb-2 text-blue-500" />
                        <span>Inviter un utilisateur</span>
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col items-center"
                    onClick={() => createEvent()}
                    disabled={isSubmitting['create-event']}
                  >
                    {isSubmitting['create-event'] ? (
                      <>
                        <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                        <span>Création en cours...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-6 w-6 mb-2 text-green-500" />
                        <span>Créer un événement</span>
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col items-center"
                    onClick={() => toast.info("Rapports avancés disponibles prochainement")}
                  >
                    <BarChart2 className="h-6 w-6 mb-2 text-purple-500" />
                    <span>Générer des rapports</span>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="teams">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Gestion des équipes</CardTitle>
                        <CardDescription>
                          Gérez les équipes et départements de votre organisation
                        </CardDescription>
                      </div>
                      <Button onClick={() => toast.info("Création d'équipe disponible prochainement")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvelle équipe
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {teams.map(team => (
                        <Card key={team.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle>{team.name}</CardTitle>
                              <Badge variant="outline">{team.members} membres</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Bien-être de l'équipe</span>
                                  <div className="flex items-center">
                                    <span className="mr-2">{team.avgWellbeing}%</span>
                                    <div className={`${
                                      team.trend === 'up' ? 'text-green-500' :
                                      team.trend === 'down' ? 'text-red-500' :
                                      'text-blue-500'
                                    }`}>
                                      {team.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                                      {team.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                                      {team.trend === 'stable' && <ArrowRight className="h-4 w-4" />}
                                    </div>
                                  </div>
                                </div>
                                <Progress 
                                  value={team.avgWellbeing} 
                                  className="h-2"
                                  color={
                                    team.avgWellbeing >= 80 ? 'bg-green-500' :
                                    team.avgWellbeing >= 70 ? 'bg-blue-500' :
                                    team.avgWellbeing >= 60 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }
                                />
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {mockUsers
                                  .filter((_, index) => index % (team.id + 1) === 0)
                                  .slice(0, 3)
                                  .map(user => (
                                    <div key={user.id} className="flex items-center space-x-2 bg-muted/50 px-2 py-1 rounded-full">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm">{user.name}</span>
                                    </div>
                                  ))
                                }
                                {team.members > 3 && (
                                  <div className="bg-muted/50 px-2 py-1 rounded-full">
                                    <span className="text-sm">+{team.members - 3} autres</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <div className="flex space-x-2 w-full">
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => inviteUser(team.id)}
                                disabled={isSubmitting[`invite-${team.id}`]}
                              >
                                {isSubmitting[`invite-${team.id}`] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Inviter
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => toast.info("Analyse disponible prochainement")}
                              >
                                <BarChart2 className="h-4 w-4 mr-1" />
                                Analyser
                              </Button>
                              <Button 
                                className="flex-1"
                                onClick={() => toast.info("Gestion d'équipe disponible prochainement")}
                              >
                                Gérer
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="users">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Gestion des utilisateurs</CardTitle>
                        <CardDescription>
                          {users.length} utilisateurs au total
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Rechercher..." 
                            className="w-full pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button onClick={() => inviteUser()}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Inviter
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left font-medium py-3 px-4">Utilisateur</th>
                            <th className="text-left font-medium py-3 px-4">Email</th>
                            <th className="text-left font-medium py-3 px-4">Rôle</th>
                            <th className="text-left font-medium py-3 px-4">Dernière activité</th>
                            <th className="text-left font-medium py-3 px-4">Bien-être</th>
                            <th className="text-left font-medium py-3 px-4">Statut</th>
                            <th className="text-right font-medium py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{user.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {user.email}
                              </td>
                              <td className="py-3 px-4">
                                {user.role}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                Il y a {user.lastActive}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="w-16 bg-muted h-2 rounded-full overflow-hidden mr-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        user.wellbeing >= 80 ? 'bg-green-500' :
                                        user.wellbeing >= 70 ? 'bg-blue-500' :
                                        user.wellbeing >= 60 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                      }`}
                                      style={{ width: `${user.wellbeing}%` }}
                                    ></div>
                                  </div>
                                  <span>{user.wellbeing}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={user.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}>
                                  {user.status === 'active' ? 'Actif' : 'En attente'}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => toast.info("Messagerie disponible prochainement")}
                                  >
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => toast.info("Édition disponible prochainement")}
                                  >
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeUser(user.id)}
                                    disabled={isSubmitting[`remove-${user.id}`]}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    {isSubmitting[`remove-${user.id}`] ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Delete className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {filteredUsers.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-10 text-center">
                                <div className="text-muted-foreground">
                                  Aucun utilisateur trouvé
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="events">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Gestion des événements</CardTitle>
                        <CardDescription>
                          Créez et gérez les événements de bien-être
                        </CardDescription>
                      </div>
                      <Button onClick={() => createEvent()} disabled={isSubmitting['create-event']}>
                        {isSubmitting['create-event'] ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Création...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvel événement
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.map(event => (
                        <Card key={event.id} className="overflow-hidden">
                          <div className="h-12 bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            <CardDescription className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" /> 
                              {event.date} à {event.time}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="text-sm text-muted-foreground mb-4">
                              <div className="flex items-center mb-1">
                                <Users className="h-4 w-4 mr-1" />
                                <span>{event.participants}/{event.maxParticipants} participants</span>
                              </div>
                              <Progress 
                                value={(event.participants / event.maxParticipants) * 100} 
                                className="h-2"
                              />
                            </div>
                          </CardContent>
                          <CardFooter>
                            <div className="flex space-x-2 w-full">
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => toast.info("Édition disponible prochainement")}
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => toast.info("Détails disponibles prochainement")}
                              >
                                <Users className="h-4 w-4 mr-1" />
                                Participants
                              </Button>
                              <Button 
                                className="flex-1"
                                onClick={() => toast.info("Envoi disponible prochainement")}
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                Rappel
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}

                      {events.length === 0 && (
                        <div className="text-center py-10">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <h3 className="text-lg font-medium">Aucun événement programmé</h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Créez votre premier événement de bien-être
                          </p>
                          <Button className="mt-4" onClick={() => createEvent()}>
                            Créer un événement
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Composants additionnels pour les icônes
const CheckIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const TrendingDown = (props: React.ComponentProps<'svg'>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

export default B2BAdminDashboard;
