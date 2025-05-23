
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MoreHorizontal, Plus, UserPlus, Mail, Trash2, Search, MailPlus, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { format, formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role?: string;
  name?: string;
  department?: string;
  avatar_url?: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
}

const B2BAdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: '',
    role: 'b2b_user'
  });
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchInvitations();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or('role.eq.b2b_user,role.eq.b2b_admin');

      if (error) throw error;
      
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Impossible de charger la liste des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setInvitations(data || []);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      toast.error('Impossible de charger les invitations');
    }
  };

  const handleSendInvitation = async () => {
    if (!newInvite.email) {
      toast.error('Veuillez entrer une adresse email');
      return;
    }

    try {
      setIsInviting(true);
      
      // Generate a unique token for the invitation
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Set expiration date to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      // Save invitation to the database
      const { data, error } = await supabase
        .from('invitations')
        .insert({
          email: newInvite.email,
          role: newInvite.role,
          token,
          status: 'pending',
          expires_at: expiresAt.toISOString()
        })
        .select();

      if (error) throw error;
      
      // In a real application, send an email to the invited user
      // For now, just show a success message with the token
      toast.success(`Invitation envoyée à ${newInvite.email}`);
      
      // Reset form and close dialog
      setNewInvite({ email: '', role: 'b2b_user' });
      setShowInviteDialog(false);
      
      // Refresh invitations list
      fetchInvitations();
    } catch (err) {
      console.error('Error sending invitation:', err);
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    
    try {
      setIsDeleting(true);
      
      // Delete user from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deleteUserId);

      if (error) throw error;
      
      // Remove from local state
      setUsers(users.filter(u => u.id !== deleteUserId));
      
      toast.success('Utilisateur supprimé avec succès');
      setDeleteUserId(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      // In a real application, we would update the invitation and send a new email
      toast.success('Invitation renvoyée');
    } catch (err) {
      console.error('Error resending invitation:', err);
      toast.error('Erreur lors du renvoi de l\'invitation');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;
      
      // Remove from local state
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      toast.success('Invitation annulée');
    } catch (err) {
      console.error('Error cancelling invitation:', err);
      toast.error('Erreur lors de l\'annulation de l\'invitation');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvitations = invitations.filter(inv => 
    inv.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">En attente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Acceptée</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Expirée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string | undefined) => {
    switch (role) {
      case 'b2b_admin':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Admin</Badge>;
      case 'b2b_user':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Collaborateur</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-2" 
            onClick={() => navigate('/b2b/admin/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Administrez vos utilisateurs et envoyez des invitations
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => setShowInviteDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter un utilisateur
          </Button>
          <Button variant="outline" onClick={() => {
            fetchUsers();
            fetchInvitations();
          }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email ou département..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            Utilisateurs ({users.length})
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            Invitations ({invitations.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>
                Liste des utilisateurs ayant accès à votre espace EmotionsCare
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Utilisateur</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Département</TableHead>
                        <TableHead>Ajouté le</TableHead>
                        <TableHead>Dernière connexion</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div>{user.name || 'N/A'}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{user.department || '-'}</TableCell>
                          <TableCell>
                            {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            {user.last_sign_in_at 
                              ? formatDistance(new Date(user.last_sign_in_at), new Date(), { addSuffix: true, locale: fr }) 
                              : 'Jamais connecté'}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Actions</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                  // Handle edit user
                                  toast.info('Édition d\'utilisateur à venir');
                                }}>
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // Handle send email
                                  toast.info('Envoi d\'email à venir');
                                }}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Envoyer un email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => setDeleteUserId(user.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle>Invitations</CardTitle>
              <CardDescription>
                Gérez les invitations pour rejoindre votre espace EmotionsCare
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredInvitations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucune invitation trouvée</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowInviteDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une invitation
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date d'envoi</TableHead>
                        <TableHead>Expiration</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvitations.map((invitation) => (
                        <TableRow key={invitation.id}>
                          <TableCell className="font-medium">{invitation.email}</TableCell>
                          <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                          <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                          <TableCell>
                            {format(new Date(invitation.created_at), 'dd/MM/yyyy', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            {format(new Date(invitation.expires_at), 'dd/MM/yyyy', { locale: fr })}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Actions</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {invitation.status === 'pending' && (
                                  <DropdownMenuItem onClick={() => handleResendInvitation(invitation.id)}>
                                    <MailPlus className="h-4 w-4 mr-2" />
                                    Renvoyer
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleCancelInvitation(invitation.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {invitation.status === 'pending' ? 'Annuler' : 'Supprimer'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inviter un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Envoyez une invitation par email pour rejoindre votre espace EmotionsCare.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="collaborateur@entreprise.com"
                value={newInvite.email}
                onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={newInvite.role}
                onValueChange={(value) => setNewInvite({ ...newInvite, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b2b_user">Collaborateur</SelectItem>
                  <SelectItem value="b2b_admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendInvitation} disabled={isInviting}>
              {isInviting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Envoyer l'invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. L'utilisateur sera supprimé définitivement.
            </DialogDescription>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserId(null)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default B2BAdminUsersPage;
