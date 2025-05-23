
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, Users, Calendar, BarChart2, Shield, 
  Search, UserPlus, Settings, Download
} from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const B2BAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Simuler des données d'entreprise
  const companyStats = {
    usersCount: 36,
    activeUsers: 28,
    averageScore: 76,
    sessionsCount: 12,
  };
  
  // Simuler des données d'utilisateurs
  const users = [
    { id: 1, name: 'Sophie Martin', role: 'Responsable RH', score: 82, status: 'active' },
    { id: 2, name: 'Thomas Bernard', role: 'Développeur', score: 75, status: 'active' },
    { id: 3, name: 'Julie Dubois', role: 'Designer', score: 88, status: 'active' },
    { id: 4, name: 'Marc Leroy', role: 'Chef de Projet', score: 70, status: 'inactive' },
    { id: 5, name: 'Emma Petit', role: 'Marketing', score: 79, status: 'active' },
  ];
  
  // Simuler des données des séances
  const sessions = [
    { id: 1, title: 'Méditation collective', date: '2023-06-15', participants: 8, status: 'completed' },
    { id: 2, title: 'Gestion du stress', date: '2023-06-20', participants: 12, status: 'upcoming' },
    { id: 3, title: 'Relaxation guidée', date: '2023-06-25', participants: 6, status: 'upcoming' },
    { id: 4, title: 'Communication bienveillante', date: '2023-07-05', participants: 15, status: 'upcoming' },
  ];
  
  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderSkeletons = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-2 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-muted-foreground">Gérer votre espace professionnel</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Inviter utilisateur</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Exporter rapports</span>
          </Button>
        </div>
      </div>
      
      {isLoading ? renderSkeletons() : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companyStats.usersCount}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {companyStats.activeUsers} actifs ({Math.round(companyStats.activeUsers / companyStats.usersCount * 100)}%)
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                  Score moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companyStats.averageScore}/100</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-500">+2%</span> ce mois-ci
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Séances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companyStats.sessionsCount}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  3 à venir ce mois-ci
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-primary" />
                  Organisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold truncate">{user?.company?.name || 'Votre entreprise'}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {user?.role === 'b2b_admin' ? 'Accès administrateur' : 'Accès limité'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="users" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="sessions">Séances</TabsTrigger>
              <TabsTrigger value="analytics">Analytiques</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Gestion des utilisateurs
                  </CardTitle>
                  <CardDescription>
                    Gérez les utilisateurs et leurs accès à la plateforme
                  </CardDescription>
                  <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un utilisateur..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredUsers.length > 0 ? (
                    <div className="space-y-4">
                      {filteredUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between border-b pb-3">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-medium text-primary">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge 
                              variant={user.status === 'active' ? "outline" : "secondary"}
                              className={user.status === 'active' ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                            >
                              {user.status === 'active' ? 'Actif' : 'Inactif'}
                            </Badge>
                            <Badge variant={user.score > 80 ? "default" : "outline"}>
                              Score: {user.score}
                            </Badge>
                            <Button size="sm" variant="outline">Modifier</Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2">
                        <p className="text-sm text-muted-foreground">Affichage de {filteredUsers.length} sur {users.length} utilisateurs</p>
                        <Button variant="outline">Voir tous</Button>
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      title="Aucun utilisateur trouvé"
                      description="Aucun utilisateur ne correspond à votre recherche."
                      icon={Search}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Gestion des séances
                  </CardTitle>
                  <CardDescription>
                    Organisez et suivez les séances pour vos équipes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{session.title}</p>
                            {session.status === 'upcoming' && (
                              <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                                À venir
                              </Badge>
                            )}
                            {session.status === 'completed' && (
                              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                                Terminé
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.date).toLocaleDateString('fr-FR', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })} | {session.participants} participants
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">Modifier</Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center pt-2">
                      <Button>
                        <Calendar className="mr-2 h-4 w-4" />
                        Planifier une nouvelle séance
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5" />
                    Analytiques de l'entreprise
                  </CardTitle>
                  <CardDescription>
                    Suivez les statistiques et les tendances de votre organisation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <div className="text-center">
                      <p>Graphique d'évolution du bien-être de l'organisation</p>
                      <div className="flex justify-center gap-2 mt-4">
                        <Button>Voir les tendances</Button>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Exporter les données
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Paramètres de l'organisation
                  </CardTitle>
                  <CardDescription>
                    Configurez les paramètres de votre espace professionnel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Nom de l'entreprise</Label>
                          <Input id="company-name" defaultValue={user?.company?.name || 'Votre entreprise'} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-domain">Domaine</Label>
                          <Input id="company-domain" defaultValue="votreentreprise.com" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Permissions administrateur</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="allow-invitations" defaultChecked />
                          <Label htmlFor="allow-invitations">Autoriser les invitations</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="allow-user-delete" />
                          <Label htmlFor="allow-user-delete">Autoriser la suppression d'utilisateurs</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Notifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="notify-new-users" defaultChecked />
                          <Label htmlFor="notify-new-users">Notifier lors de nouvelles inscriptions</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="notify-sessions" defaultChecked />
                          <Label htmlFor="notify-sessions">Notifications pour les séances</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Enregistrer les modifications</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

// Composant Label simple si non importé d'ailleurs
const Label = ({ htmlFor, children, className = "" }: { htmlFor?: string; children: React.ReactNode; className?: string }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>
    {children}
  </label>
);

export default B2BAdminDashboard;
