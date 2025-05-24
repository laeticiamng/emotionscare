
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Mail, 
  MoreHorizontal,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  emotional_score?: number;
  last_active: string;
  status: 'active' | 'inactive' | 'critical';
  avatar_url?: string;
}

const B2BAdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedDepartment, selectedStatus]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['b2b_user', 'b2b_admin']);

      if (error) throw error;

      // Simuler des données utilisateur complètes
      const mockUsers: UserData[] = (profiles || []).map((profile, index) => ({
        id: profile.id,
        name: profile.name || `Utilisateur ${index + 1}`,
        email: profile.email || `user${index + 1}@exemple.fr`,
        role: profile.role || 'b2b_user',
        department: ['IT', 'Marketing', 'Ventes', 'RH', 'Finance'][index % 5],
        emotional_score: Math.floor(Math.random() * 40) + 60, // 60-100
        last_active: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.8 ? 'critical' : Math.random() > 0.3 ? 'active' : 'inactive',
        avatar_url: profile.avatar_url
      }));

      // Ajouter quelques utilisateurs de démo si la liste est vide
      if (mockUsers.length === 0) {
        const demoUsers: UserData[] = [
          {
            id: 'demo-1',
            name: 'Sarah Martin',
            email: 'sarah.martin@exemple.fr',
            role: 'b2b_user',
            department: 'Marketing',
            emotional_score: 85,
            last_active: new Date().toISOString(),
            status: 'active'
          },
          {
            id: 'demo-2',
            name: 'Thomas Dubois',
            email: 'thomas.dubois@exemple.fr',
            role: 'b2b_user',
            department: 'IT',
            emotional_score: 65,
            last_active: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'critical'
          },
          {
            id: 'demo-3',
            name: 'Marie Lefebvre',
            email: 'marie.lefebvre@exemple.fr',
            role: 'b2b_admin',
            department: 'RH',
            emotional_score: 92,
            last_active: new Date().toISOString(),
            status: 'active'
          }
        ];
        mockUsers.push(...demoUsers);
      }

      setUsers(mockUsers);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(user => user.department === selectedDepartment);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Actif</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactif</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Critique</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    // Simuler les actions utilisateur
    switch (action) {
      case 'contact':
        toast.info('Email envoyé à l\'utilisateur');
        break;
      case 'suspend':
        toast.warning('Utilisateur suspendu');
        break;
      case 'activate':
        toast.success('Utilisateur activé');
        break;
      case 'delete':
        toast.error('Utilisateur supprimé');
        setUsers(users.filter(u => u.id !== userId));
        break;
      default:
        break;
    }
  };

  const inviteUser = () => {
    toast.success('Invitation envoyée !');
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des utilisateurs 👥
          </h1>
          <p className="text-muted-foreground">
            Administrez les comptes et surveillez le bien-être de vos collaborateurs
          </p>
        </div>
        <Button onClick={inviteUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Inviter un utilisateur
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((users.filter(u => u.status === 'active').length / users.length) * 100)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Nécessitent une attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
            <Badge className="bg-blue-100 text-blue-700">
              {Math.round(users.reduce((acc, u) => acc + (u.emotional_score || 0), 0) / users.length)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(users.reduce((acc, u) => acc + (u.emotional_score || 0), 0) / users.length)}/100
            </div>
            <p className="text-xs text-muted-foreground">
              Bien-être global
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Ventes">Ventes</SelectItem>
                <SelectItem value="RH">RH</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Liste complète des collaborateurs de votre organisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((userData) => (
              <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={userData.avatar_url} />
                    <AvatarFallback>
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{userData.name}</span>
                      {userData.role === 'b2b_admin' && (
                        <Badge variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{userData.email}</span>
                      <span>•</span>
                      <span>{userData.department}</span>
                      <span>•</span>
                      <span>Dernière connexion: {new Date(userData.last_active).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">{userData.emotional_score}/100</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(userData.status)}
                    {getStatusBadge(userData.status)}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleUserAction('contact', userData.id)}>
                        <Mail className="h-4 w-4 mr-2" />
                        Contacter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUserAction('activate', userData.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUserAction('suspend', userData.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Suspendre
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleUserAction('delete', userData.id)}
                        className="text-red-600"
                      >
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
              <p className="text-sm text-muted-foreground">
                Modifiez vos filtres ou invitez de nouveaux utilisateurs
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminUsersPage;
