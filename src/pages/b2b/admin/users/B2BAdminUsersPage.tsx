
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Search, MoreHorizontal, Trash2, Edit, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  department?: string;
  job_title?: string;
}

const B2BAdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('b2b_user');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'b2c')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);

    try {
      // Générer un token unique pour l'invitation
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

      const { error } = await supabase
        .from('invitations')
        .insert({
          email: inviteEmail,
          role: inviteRole,
          token,
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Invitation envoyée avec succès');
      setInviteEmail('');
      setShowInviteForm(false);
      
      // TODO: Envoyer l'email d'invitation via une fonction Edge
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'invitation:', error);
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      toast.success('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const variants = {
      b2b_admin: { variant: 'destructive' as const, label: 'Admin' },
      b2b_user: { variant: 'default' as const, label: 'Collaborateur' },
    };
    
    const config = variants[role as keyof typeof variants] || { variant: 'secondary' as const, label: role };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-6xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Gestion des utilisateurs
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez les collaborateurs de votre organisation
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowInviteForm(true)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Inviter un utilisateur
            </Button>
            <Button onClick={() => navigate('/b2b/admin/dashboard')} variant="outline">
              Retour au tableau de bord
            </Button>
          </div>
        </header>

        {/* Formulaire d'invitation */}
        {showInviteForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Inviter un nouvel utilisateur
              </CardTitle>
              <CardDescription>
                Envoyez une invitation par email à un nouveau collaborateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInviteUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="utilisateur@entreprise.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <select
                      id="role"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="b2b_user">Collaborateur</option>
                      <option value="b2b_admin">Administrateur</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isInviting}>
                    {isInviting ? 'Envoi...' : 'Envoyer l\'invitation'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowInviteForm(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Barre de recherche */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par email, nom ou département..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>
              Utilisateurs ({filteredUsers.length})
            </CardTitle>
            <CardDescription>
              Liste de tous les collaborateurs de votre organisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Chargement...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{user.name || 'Nom non défini'}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-13">
                        {getRoleBadge(user.role)}
                        {user.department && (
                          <Badge variant="outline">{user.department}</Badge>
                        )}
                        {user.job_title && (
                          <span className="text-sm text-muted-foreground">{user.job_title}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Inscrit le {new Date(user.created_at).toLocaleDateString()}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => console.log('Éditer', user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Éditer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminUsersPage;
