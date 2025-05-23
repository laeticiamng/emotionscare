
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, Building2, BarChart3, Settings, User, Plus, Search, 
  Download, Filter, AlertTriangle, CheckCircle2, Mail, Eye, FileText,
  Calendar, PieChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

// Composant pour les statistiques
const StatsCard = ({ title, value, trend, icon: Icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <p className={`text-xs mt-1 ${trend.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="bg-primary/10 p-2 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Composant pour la liste des utilisateurs
const UsersList = ({ users }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <Input 
          placeholder="Rechercher un utilisateur..." 
          className="max-w-xs"
          onChange={() => toast.info("Recherche d'utilisateurs")}
        />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="user">Utilisateur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => toast.info("Export des utilisateurs")}
        >
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>
        <Button 
          size="sm"
          onClick={() => toast.info("Ajout d'un nouvel utilisateur")}
        >
          <Plus className="h-4 w-4 mr-1" /> Ajouter
        </Button>
      </div>
    </div>
    
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Utilisateur
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Rôle
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium">{user.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={user.role === 'Admin' ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={user.status === 'Actif' ? "success" : "destructive"} className="bg-green-100 text-green-700">
                  {user.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary-focus"
                  onClick={() => toast.info(`Voir le profil de ${user.name}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary-focus ml-2"
                  onClick={() => toast.info(`Modifier l'utilisateur ${user.name}`)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Affichage de 1 à 5 sur 24 utilisateurs
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled>Précédent</Button>
        <Button variant="outline" size="sm">Suivant</Button>
      </div>
    </div>
  </div>
);

// Composant pour les alertes
const AlertsSection = ({ alerts }) => (
  <div className="space-y-4">
    {alerts.map((alert, index) => (
      <Card key={index} className={`border-l-4 ${alert.type === 'warning' ? 'border-l-amber-500' : 'border-l-green-500'}`}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            {alert.type === 'warning' ? (
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            )}
            <div>
              <h4 className="font-medium">{alert.title}</h4>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary-focus"
            onClick={() => toast.info(`Action sur l'alerte: ${alert.title}`)}
          >
            Voir
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Composant pour les invitations
const InvitationsSection = ({ invitations }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium">Invitations récentes</h3>
      <Button 
        size="sm" 
        onClick={() => toast.info("Création d'une nouvelle invitation")}
      >
        <Plus className="h-4 w-4 mr-1" /> Nouvelle invitation
      </Button>
    </div>
    
    <div className="space-y-4">
      {invitations.map((invitation, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-primary mr-3" />
              <div>
                <h4 className="font-medium">{invitation.email}</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-2">
                    {invitation.role}
                  </Badge>
                  Expire le {invitation.expires}
                </div>
              </div>
            </div>
            <Badge 
              variant={
                invitation.status === 'Envoyée' ? "outline" : 
                invitation.status === 'Acceptée' ? "success" : 
                "secondary"
              }
            >
              {invitation.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
    
    <div className="flex justify-end">
      <Button variant="outline" size="sm" onClick={() => toast.info("Affichage de toutes les invitations")}>
        Voir toutes les invitations
      </Button>
    </div>
  </div>
);

// Données factices
const mockUsers = [
  { id: 1, name: 'Marie Dubois', email: 'marie@example.com', role: 'Admin', status: 'Actif' },
  { id: 2, name: 'Thomas Martin', email: 'thomas@example.com', role: 'Collaborateur', status: 'Actif' },
  { id: 3, name: 'Sophie Bernard', email: 'sophie@example.com', role: 'Collaborateur', status: 'Inactif' },
  { id: 4, name: 'Jean Petit', email: 'jean@example.com', role: 'Collaborateur', status: 'Actif' },
  { id: 5, name: 'Claire Leroy', email: 'claire@example.com', role: 'Collaborateur', status: 'Actif' },
];

const mockAlerts = [
  {
    type: 'warning',
    title: 'Licences à renouveler',
    message: '3 licences expirent dans 7 jours'
  },
  {
    type: 'success',
    title: '5 nouveaux utilisateurs',
    message: 'Nouveaux utilisateurs inscrits cette semaine'
  },
];

const mockInvitations = [
  {
    email: 'nouveau@example.com',
    role: 'Collaborateur',
    expires: '31/05/2025',
    status: 'Envoyée'
  },
  {
    email: 'directeur@example.com',
    role: 'Admin',
    expires: '29/05/2025',
    status: 'Acceptée'
  },
  {
    email: 'stagiaire@example.com',
    role: 'Collaborateur',
    expires: '28/05/2025',
    status: 'En attente'
  },
];

const mockEvents = [
  {
    title: 'Atelier gestion du stress',
    date: '25/05/2025',
    time: '14:00 - 16:00',
    participants: 12
  },
  {
    title: 'Formation bien-être',
    date: '30/05/2025',
    time: '10:00 - 12:00',
    participants: 8
  },
  {
    title: 'Séance de cohésion d\'équipe',
    date: '02/06/2025',
    time: '15:00 - 17:00',
    participants: 15
  },
];

const B2BAdminDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userMode, setUserMode } = useUserMode();
  const navigate = useNavigate();
  
  // S'assurer que le mode d'utilisateur est correct
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Veuillez vous connecter pour accéder à cette page');
      navigate('/b2b/admin/login');
    }
    
    // Définir le mode utilisateur si nécessaire
    if (userMode !== 'b2b_admin') {
      setUserMode('b2b_admin');
    }
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Administration
            </h1>
            <p className="text-muted-foreground">
              Gérez votre organisation et vos utilisateurs
            </p>
          </div>
          <Button onClick={() => toast.info("Accès aux paramètres administrateur")}>
            <Settings className="mr-2 h-4 w-4" /> Paramètres
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Utilisateurs actifs" 
            value="24" 
            trend="+3 cette semaine" 
            icon={Users} 
          />
          <StatsCard 
            title="Sessions organisées" 
            value="18" 
            trend="+5 ce mois-ci" 
            icon={Calendar} 
          />
          <StatsCard 
            title="Taux d'engagement" 
            value="78%" 
            trend="+12% depuis le mois dernier" 
            icon={PieChart} 
          />
          <StatsCard 
            title="Bien-être moyen" 
            value="72%" 
            trend="+4% cette semaine" 
            icon={BarChart3} 
          />
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="analytics">Analytique</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Alertes et notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <AlertsSection alerts={mockAlerts} />
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle>Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <InvitationsSection invitations={mockInvitations} />
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle>Sessions à venir</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEvents.map((event, index) => (
                      <div key={index} className="p-3 bg-muted rounded-md">
                        <p className="font-medium">{event.title}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{event.date}, {event.time}</span>
                          <span>{event.participants} participants</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={() => toast.info("Planification d'une nouvelle session")}>
                      Planifier une session
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Bien-être par équipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Marketing</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="h-2 bg-muted rounded">
                        <div className="h-full bg-green-500 rounded" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Développement</span>
                        <span className="font-medium">72%</span>
                      </div>
                      <div className="h-2 bg-muted rounded">
                        <div className="h-full bg-green-500 rounded" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Commercial</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="h-2 bg-muted rounded">
                        <div className="h-full bg-yellow-500 rounded" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Support</span>
                        <span className="font-medium">62%</span>
                      </div>
                      <div className="h-2 bg-muted rounded">
                        <div className="h-full bg-yellow-500 rounded" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Finance</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="h-2 bg-muted rounded">
                        <div className="h-full bg-green-500 rounded" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Gérez les utilisateurs de votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsersList users={mockUsers} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytique</CardTitle>
                <CardDescription>
                  Visualisez les données d'utilisation et le bien-être de votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Tendances du bien-être</h3>
                    <div className="h-80 bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Graphique des tendances du bien-être sur 6 mois</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Participation</h3>
                      <div className="text-3xl font-bold">85%</div>
                      <p className="text-sm text-muted-foreground">des employés participent régulièrement</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Bien-être moyen</h3>
                      <div className="text-3xl font-bold">72%</div>
                      <p className="text-sm text-green-500">+4% depuis le mois dernier</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Sessions complétées</h3>
                      <div className="text-3xl font-bold">158</div>
                      <p className="text-sm text-muted-foreground">ce trimestre</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Répartition des activités</h3>
                    <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Graphique de répartition des activités</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => toast.info("Exportation des données analytiques")}
                    >
                      <Download className="mr-2 h-4 w-4" /> Exporter les données
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => toast.info("Génération d'un rapport PDF")}
                    >
                      <FileText className="mr-2 h-4 w-4" /> Générer un rapport
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des sessions</CardTitle>
                <CardDescription>
                  Planifiez et gérez les sessions pour votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Rechercher une session..." 
                        className="max-w-xs"
                        onChange={() => toast.info("Recherche de sessions")}
                      />
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filtrer par type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les types</SelectItem>
                          <SelectItem value="workshop">Atelier</SelectItem>
                          <SelectItem value="training">Formation</SelectItem>
                          <SelectItem value="team">Équipe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={() => toast.info("Création d'une nouvelle session")}>
                      <Plus className="h-4 w-4 mr-1" /> Nouvelle session
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {
                        title: "Atelier gestion du stress",
                        type: "Atelier",
                        date: "25/05/2025",
                        time: "14:00 - 16:00",
                        location: "Salle de conférence A",
                        capacity: "20 personnes",
                        registered: 12
                      },
                      {
                        title: "Formation bien-être",
                        type: "Formation",
                        date: "30/05/2025",
                        time: "10:00 - 12:00",
                        location: "Salle de formation B",
                        capacity: "15 personnes",
                        registered: 8
                      },
                      {
                        title: "Séance de cohésion d'équipe",
                        type: "Équipe",
                        date: "02/06/2025",
                        time: "15:00 - 17:00",
                        location: "Espace détente",
                        capacity: "30 personnes",
                        registered: 15
                      }
                    ].map((session, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{session.title}</h3>
                              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground">
                                <Badge variant="outline" className="mr-2 mb-1 sm:mb-0">
                                  {session.type}
                                </Badge>
                                <span className="mr-2 mb-1 sm:mb-0">{session.date}, {session.time}</span>
                                <span className="mr-2 mb-1 sm:mb-0">{session.location}</span>
                              </div>
                              <p className="text-sm mt-1">
                                {session.registered} / {session.capacity.split(' ')[0]} inscrits
                              </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast.info(`Affichage des participants à ${session.title}`)}
                              >
                                Participants
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast.info(`Modification de la session ${session.title}`)}
                              >
                                Modifier
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => toast.info(`Gestion de la session ${session.title}`)}
                              >
                                Gérer
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Affichage de 3 sessions sur 12</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>Précédent</Button>
                      <Button variant="outline" size="sm">Suivant</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de l'organisation</CardTitle>
                <CardDescription>
                  Configurez les paramètres de votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Nom de l'entreprise</Label>
                        <Input id="company-name" defaultValue="EmotionsCare Inc." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Secteur d'activité</Label>
                        <Input id="industry" defaultValue="Bien-être émotionnel" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Email administrateur</Label>
                        <Input id="admin-email" defaultValue="admin@emotionscare.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size">Taille de l'entreprise</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger id="size">
                            <SelectValue placeholder="Sélectionner la taille" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Petite (1-50 employés)</SelectItem>
                            <SelectItem value="medium">Moyenne (51-250 employés)</SelectItem>
                            <SelectItem value="large">Grande (251+ employés)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Paramètres des licences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license-type">Type de licence</Label>
                        <Select defaultValue="team">
                          <SelectTrigger id="license-type">
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basique</SelectItem>
                            <SelectItem value="team">Équipe</SelectItem>
                            <SelectItem value="enterprise">Entreprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seats">Nombre de licences</Label>
                        <Input id="seats" type="number" defaultValue="50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="renewal-date">Date de renouvellement</Label>
                        <Input id="renewal-date" defaultValue="31/12/2025" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Paramètres de sécurité</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Expiration de session (minutes)</Label>
                        <Input id="session-timeout" type="number" defaultValue="30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-policy">Politique de mot de passe</Label>
                        <Select defaultValue="strong">
                          <SelectTrigger id="password-policy">
                            <SelectValue placeholder="Sélectionner une politique" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basique</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="strong">Forte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" className="mr-2" onClick={() => toast.info("Annulation des modifications")}>
                      Annuler
                    </Button>
                    <Button onClick={() => toast.success("Paramètres enregistrés")}>
                      Enregistrer les paramètres
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

export default B2BAdminDashboard;
