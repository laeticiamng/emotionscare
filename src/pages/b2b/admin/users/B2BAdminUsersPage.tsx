
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Plus, Search, Filter, MoreHorizontal, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: 'active' | 'invited' | 'inactive';
  avatar?: string;
  last_login?: string;
}

const B2BAdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [teams, setTeams] = useState<string[]>([]);
  
  // Dialog states
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'b2b_user',
    team: 'Marketing'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, statusFilter, teamFilter, users]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Sophie Martin',
          email: 'sophie.martin@company.com',
          role: 'b2b_user',
          team: 'Marketing',
          status: 'active',
          last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Thomas Dubois',
          email: 'thomas.dubois@company.com',
          role: 'b2b_admin',
          team: 'RH',
          status: 'active',
          last_login: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Julie Chen',
          email: 'julie.chen@company.com',
          role: 'b2b_user',
          team: 'Design',
          status: 'active',
          last_login: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          name: 'Marc Lefebvre',
          email: 'marc.lefebvre@company.com',
          role: 'b2b_user',
          team: 'Tech',
          status: 'invited'
        },
        {
          id: '5',
          name: 'Anna Kovacs',
          email: 'anna.kovacs@company.com',
          role: 'b2b_user',
          team: 'Marketing',
          status: 'inactive',
          last_login: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setUsers(mockUsers);
      
      // Extract unique teams
      const uniqueTeams = Array.from(new Set(mockUsers.map(user => user.team)));
      setTeams(uniqueTeams);
      
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    // Apply team filter
    if (teamFilter !== 'all') {
      filtered = filtered.filter(user => user.team === teamFilter);
    }
    
    setFilteredUsers(filtered);
  };

  const handleInviteUser = () => {
    if (!newUserData.email || !newUserData.name || !newUserData.team) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      team: newUserData.team,
      status: 'invited'
    };
    
    setUsers(prev => [newUser, ...prev]);
    setInviteDialogOpen(false);
    setNewUserData({
      name: '',
      email: '',
      role: 'b2b_user',
      team: 'Marketing'
    });
    
    toast.success(`Invitation envoyée à ${newUserData.email}`);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    
    toast.success(`Utilisateur ${selectedUser.name} supprimé`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Jamais';
    
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'invited': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="h-3 w-3" />;
      case 'invited': return <Plus className="h-3 w-3" />;
      default: return <X className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation size="large" text="Chargement des utilisateurs..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h1>
              <p className="text-muted-foreground">
                Administrez les comptes de votre organisation
              </p>
            </div>
            <Button onClick={() => setInviteDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Inviter un utilisateur
            </Button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-8 h-8 bg-green-500/20 flex items-center justify-center rounded-full">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">{users.filter(u => u.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-8 h-8 bg-blue-500/20 flex items-center justify-center rounded-full">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">{users.filter(u => u.status === 'invited').length}</p>
                <p className="text-sm text-muted-foreground">Invitations en attente</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-8 h-8 bg-gray-500/20 flex items-center justify-center rounded-full">
                <X className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold">{users.filter(u => u.status === 'inactive').length}</p>
                <p className="text-sm text-muted-foreground">Utilisateurs inactifs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="invited">Invités</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les équipes</SelectItem>
                    {teams.map(team => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs</CardTitle>
            <CardDescription>
              {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Nom</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Équipe</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Rôle</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Statut</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Dernière connexion</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="border-b hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{user.email}</td>
                        <td className="px-4 py-3 text-sm">{user.team}</td>
                        <td className="px-4 py-3">
                          <Badge variant={user.role === 'b2b_admin' ? 'default' : 'outline'}>
                            {user.role === 'b2b_admin' ? 'Admin' : 'Utilisateur'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`flex items-center gap-1 ${getStatusColor(user.status)}`}>
                            {getStatusIcon(user.status)}
                            <span>
                              {user.status === 'active' ? 'Actif' : 
                               user.status === 'invited' ? 'Invité' : 'Inactif'}
                            </span>
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {formatDate(user.last_login)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-center gap-1">
                            <Button size="icon" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-red-500"
                              onClick={() => {
                                setSelectedUser(user);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Invite Dialog */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inviter un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Envoyez une invitation par email pour ajouter un nouvel utilisateur à votre organisation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  placeholder="Prénom Nom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select 
                    value={newUserData.role} 
                    onValueChange={(value) => setNewUserData({...newUserData, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="b2b_user">Utilisateur</SelectItem>
                      <SelectItem value="b2b_admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Équipe</Label>
                  <Select 
                    value={newUserData.team} 
                    onValueChange={(value) => setNewUserData({...newUserData, team: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Tech">Tech</SelectItem>
                      <SelectItem value="RH">RH</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Ventes">Ventes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleInviteUser}>Envoyer l'invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="py-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-md">
                  <Avatar>
                    <AvatarFallback>
                      {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={handleDeleteUser}>Supprimer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default B2BAdminUsersPage;
