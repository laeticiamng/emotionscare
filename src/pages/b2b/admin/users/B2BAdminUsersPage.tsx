
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Mail,
  Trash2,
  Edit,
  UserPlus,
  Loader2,
  Building2,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  job_title?: string;
  emotional_score?: number;
  created_at: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  expires_at: string;
}

const B2BAdminUsersPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { setUserMode } = useUserMode();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('b2b_user');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    setUserMode('b2b_admin');
    fetchData();
  }, [setUserMode]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['b2b_user', 'b2b_admin']);

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (invitationsError) throw invitationsError;
      setInvitations(invitationsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const sendInvitation = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Veuillez saisir une adresse email');
      return;
    }

    try {
      setIsInviting(true);
      
      // Generate invitation token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      const { error } = await supabase
        .from('invitations')
        .insert([
          {
            email: inviteEmail,
            role: inviteRole,
            token: token,
            expires_at: expiresAt.toISOString(),
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast.success('Invitation envoyée avec succès !');
      setInviteEmail('');
      setInviteRole('b2b_user');
      setShowInviteForm(false);
      fetchData();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success('Utilisateur supprimé avec succès');
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;

      toast.success('Invitation annulée');
      fetchData();
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast.error('Erreur lors de l\'annulation');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesDepartment = departmentFilter === 'all' || u.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const getUniqueValues = (field: keyof User) => {
    return Array.from(new Set(users.map(u => u[field]).filter(Boolean)));
  };

  const getStats = () => {
    const totalUsers = users.length;
    const admins = users.filter(u => u.role === 'b2b_admin').length;
    const collaborators = users.filter(u => u.role === 'b2b_user').length;
    const pendingInvitations = invitations.filter(i => i.status === 'pending').length;
    
    return { totalUsers, admins, collaborators, pendingInvitations };
  };

  const stats = getStats();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/b2b/admin/dashboard')}>
              ← Tableau de bord
            </Button>
            <h1 className="text-xl font-bold">Gestion des utilisateurs</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-purple-50 text-purple-600">
              Administrateur
            </Badge>
            <Badge variant="outline">
              {user?.user_metadata?.name || user?.email}
            </Badge>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Utilisateurs</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Administrateurs</p>
                  <p className="text-2xl font-bold">{stats.admins}</p>
                </div>
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Collaborateurs</p>
                  <p className="text-2xl font-bold">{stats.collaborators}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Invitations en attente</p>
                  <p className="text-2xl font-bold">{stats.pendingInvitations}</p>
                </div>
                <Mail className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher des utilisateurs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="b2b_admin">Administrateurs</SelectItem>
                    <SelectItem value="b2b_user">Collaborateurs</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous départements</SelectItem>
                    {getUniqueValues('department').map((dept) => (
                      <SelectItem key={dept} value={dept as string}>
                        {dept as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => setShowInviteForm(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Inviter un utilisateur
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invite Form */}
        {showInviteForm && (
          <Card className="mb-8 border-2 border-dashed">
            <CardHeader>
              <CardTitle>Inviter un nouvel utilisateur</CardTitle>
              <CardDescription>
                Envoyez une invitation par email à un nouveau collaborateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="email"
                placeholder="Adresse email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b2b_user">Collaborateur</SelectItem>
                  <SelectItem value="b2b_admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button 
                  onClick={sendInvitation}
                  disabled={isInviting}
                >
                  {isInviting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Envoyer l'invitation
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowInviteForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Utilisateurs actifs ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant="outline"
                          className={user.role === 'b2b_admin' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}
                        >
                          {user.role === 'b2b_admin' ? 'Admin' : 'Collaborateur'}
                        </Badge>
                        {user.department && (
                          <Badge variant="outline">
                            {user.department}
                          </Badge>
                        )}
                        {user.emotional_score && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-600">
                            Bien-être: {user.emotional_score}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        {invitations.filter(i => i.status === 'pending').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Invitations en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invitations
                  .filter(i => i.status === 'pending')
                  .map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                      <div>
                        <h3 className="font-semibold">{invitation.email}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-600">
                            {invitation.role === 'b2b_admin' ? 'Admin' : 'Collaborateur'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Expire le {new Date(invitation.expires_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => cancelInvitation(invitation.id)}
                      >
                        Annuler
                      </Button>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default B2BAdminUsersPage;
