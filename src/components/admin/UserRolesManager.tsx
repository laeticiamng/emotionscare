// @ts-nocheck
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Crown, Shield, User, Trash2, Plus, History, Users } from 'lucide-react';
import { AppRole, getRoleLabel, getRoleColor } from '@/services/userRolesService';
import { logger } from '@/lib/logger';
import { RoleAuditLogsViewer } from './RoleAuditLogsViewer';
import { AuditStatsDashboard } from './AuditStatsDashboard';
import AdminTableSkeleton from './AdminTableSkeleton';
import AdminEmptyState from './AdminEmptyState';

interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  roles: AppRole[];
  highest_role: AppRole | null;
}

export const UserRolesManager = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'add' | 'remove' | null>(null);
  const [bulkRole, setBulkRole] = useState<AppRole>('premium');
  const [showBulkDialog, setShowBulkDialog] = useState(false);

  // Fetch users with their roles
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users-roles'],
    queryFn: async () => {
      // Récupérer tous les utilisateurs
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      // Récupérer tous les rôles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      if (rolesError) throw rolesError;

      // Combiner les données
      const usersWithRoles: UserWithRoles[] = authUsers.users.map((user) => {
        const userRoles = rolesData
          .filter((r) => r.user_id === user.id)
          .map((r) => r.role as AppRole);

        // Déterminer le rôle le plus élevé
        const rolePriority: Record<AppRole, number> = {
          admin: 100,
          moderator: 75,
          premium: 50,
          user: 0,
        };

        const highestRole = userRoles.reduce<AppRole | null>((acc, role) => {
          if (!acc) return role;
          return rolePriority[role] > rolePriority[acc] ? role : acc;
        }, null);

        return {
          id: user.id,
          email: user.email || 'No email',
          created_at: user.created_at,
          roles: userRoles,
          highest_role: highestRole,
        };
      });

      return usersWithRoles;
    },
    refetchInterval: 30000, // Refresh every 30s
  });

  // Mutation pour ajouter un rôle
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-roles'] });
      toast.success('Rôle ajouté avec succès');
    },
    onError: (error: Error) => {
      logger.error('Failed to add role', error, 'ADMIN');
      toast.error('Erreur lors de l\'ajout du rôle');
    },
  });

  // Mutation pour retirer un rôle
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-roles'] });
      toast.success('Rôle retiré avec succès');
    },
    onError: (error: Error) => {
      logger.error('Failed to remove role', error, 'ADMIN');
      toast.error('Erreur lors du retrait du rôle');
    },
  });

  // Filtrer les utilisateurs
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.roles.some((role) => getRoleLabel(role).toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

  // Gérer la sélection
  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  // Actions en masse
  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.size === 0) return;

    try {
      const promises = Array.from(selectedUsers).map((userId) =>
        bulkAction === 'add'
          ? addRoleMutation.mutateAsync({ userId, role: bulkRole })
          : removeRoleMutation.mutateAsync({ userId, role: bulkRole })
      );

      await Promise.all(promises);
      toast.success(`${bulkAction === 'add' ? 'Rôles ajoutés' : 'Rôles retirés'} pour ${selectedUsers.size} utilisateurs`);
      setSelectedUsers(new Set());
      setShowBulkDialog(false);
    } catch (error) {
      logger.error('Bulk action failed', error as Error, 'ADMIN');
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'moderator':
        return <Shield className="h-4 w-4" />;
      case 'premium':
        return <Crown className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'secondary';
      case 'premium':
        return 'default';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return <AdminTableSkeleton columns={5} rows={8} showStats showSearch />;
  }

  return (
    <Tabs defaultValue="users" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des rôles</h2>
          <p className="text-muted-foreground">
            Gérez les rôles premium et administrateur des utilisateurs
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <TabsList>
        <TabsTrigger value="users" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Utilisateurs
        </TabsTrigger>
        <TabsTrigger value="audit" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Historique d'audit
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Statistiques
        </TabsTrigger>
      </TabsList>

      {/* Tab: Users Management */}
      <TabsContent value="users" className="space-y-6">

      {/* Recherche et actions en masse */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par email ou rôle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {selectedUsers.size > 0 && (
          <div className="flex gap-2">
            <Select value={bulkRole} onValueChange={(v) => setBulkRole(v as AppRole)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="moderator">Modérateur</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="default"
              onClick={() => {
                setBulkAction('add');
                setShowBulkDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setBulkAction('remove');
                setShowBulkDialog(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Retirer
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground">Utilisateurs total</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">
            {users.filter((u) => u.roles.includes('premium')).length}
          </div>
          <p className="text-xs text-muted-foreground">Premium</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">
            {users.filter((u) => u.roles.includes('moderator')).length}
          </div>
          <p className="text-xs text-muted-foreground">Modérateurs</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">
            {users.filter((u) => u.roles.includes('admin')).length}
          </div>
          <p className="text-xs text-muted-foreground">Admins</p>
        </div>
      </div>

      {/* Tableau */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-input"
                />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôles</TableHead>
              <TableHead>Inscrit le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-48">
                  <AdminEmptyState
                    preset={searchQuery ? 'no-results' : 'no-data'}
                    title={searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
                    description={
                      searchQuery
                        ? `Aucun résultat pour "${searchQuery}". Essayez un autre terme de recherche.`
                        : 'Il n\'y a pas encore d\'utilisateurs enregistrés dans la plateforme.'
                    }
                    action={searchQuery ? { label: 'Réinitialiser', onClick: () => setSearchQuery('') } : undefined}
                    icon={Users}
                  />
                </TableCell>
              </TableRow>
            )}
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="rounded border-input"
                  />
                </TableCell>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <Badge
                          key={role}
                          variant={getRoleBadgeVariant(role)}
                          className="flex items-center gap-1"
                        >
                          {getRoleIcon(role)}
                          {getRoleLabel(role)}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">Aucun rôle</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Select
                      onValueChange={(role) =>
                        addRoleMutation.mutate({ userId: user.id, role: role as AppRole })
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Ajouter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="moderator">Modérateur</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {user.roles.length > 0 && (
                      <Select
                        onValueChange={(role) =>
                          removeRoleMutation.mutate({ userId: user.id, role: role as AppRole })
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Retirer" />
                        </SelectTrigger>
                        <SelectContent>
                          {user.roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {getRoleLabel(role)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmation pour actions en masse */}
      <AlertDialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === 'add' ? 'Ajouter un rôle' : 'Retirer un rôle'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de {bulkAction === 'add' ? 'ajouter' : 'retirer'} le rôle{' '}
              <strong>{getRoleLabel(bulkRole)}</strong> pour {selectedUsers.size} utilisateur(s).
              Cette action est réversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkAction}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </TabsContent>

      {/* Tab: Audit History */}
      <TabsContent value="audit">
        <RoleAuditLogsViewer />
      </TabsContent>

      {/* Tab: Statistics */}
      <TabsContent value="stats">
        <AuditStatsDashboard />
      </TabsContent>
    </Tabs>
  );
};
