
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const B2BAdminUsersPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteDepartment, setInviteDepartment] = useState('');
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    loadUsersData();
  }, []);

  const loadUsersData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées
      setUsers([
        {
          id: 1,
          name: 'Jean Dupont',
          email: 'j.dupont@entreprise.com',
          department: 'Développement',
          role: 'b2b_user',
          status: 'active',
          lastSeen: new Date(),
          wellbeingScore: 88,
          joinedAt: new Date(2024, 0, 15)
        },
        {
          id: 2,
          name: 'Marie Leblanc',
          email: 'm.leblanc@entreprise.com',
          department: 'Marketing',
          role: 'b2b_user',
          status: 'active',
          lastSeen: new Date(Date.now() - 3600000),
          wellbeingScore: 92,
          joinedAt: new Date(2024, 1, 3)
        },
        {
          id: 3,
          name: 'Pierre Durand',
          email: 'p.durand@entreprise.com',
          department: 'Design',
          role: 'b2b_admin',
          status: 'inactive',
          lastSeen: new Date(Date.now() - 86400000),
          wellbeingScore: 76,
          joinedAt: new Date(2023, 11, 20)
        }
      ]);

      setInvitations([
        {
          id: 1,
          email: 'nouveau@entreprise.com',
          department: 'Ventes',
          status: 'pending',
          invitedAt: new Date(Date.now() - 172800000),
          invitedBy: 'Admin'
        },
        {
          id: 2,
          email: 'stagiaire@entreprise.com',
          department: 'Marketing',
          status: 'accepted',
          invitedAt: new Date(Date.now() - 604800000),
          invitedBy: 'Admin'
        }
      ]);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail || !inviteDepartment) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      // Simuler l'envoi d'invitation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newInvitation = {
        id: Date.now(),
        email: inviteEmail,
        department: inviteDepartment,
        status: 'pending',
        invitedAt: new Date(),
        invitedBy: 'Admin'
      };

      setInvitations(prev => [newInvitation, ...prev]);
      setInviteEmail('');
      setInviteDepartment('');
      setIsInviteDialogOpen(false);
      toast.success(`Invitation envoyée à ${inviteEmail}`);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    }
  };

  const departments = [
    { value: 'all', label: 'Tous les départements' },
    { value: 'dev', label: 'Développement' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Ventes' },
    { value: 'hr', label: 'Ressources Humaines' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'suspended', label: 'Suspendu' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Actif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspendu</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-500">Acceptée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'b2b_admin':
        return <Badge variant="destructive">Administrateur</Badge>;
      case 'b2b_user':
        return <Badge variant="secondary">Collaborateur</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les comptes et invitations de votre organisation
          </p>
        </div>
        
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Inviter un collaborateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inviter un nouveau collaborateur</DialogTitle>
              <DialogDescription>
                Envoyez une invitation par email pour rejoindre votre organisation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Adresse email</label>
                <Input
                  type="email"
                  placeholder="collaborateur@entreprise.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Département</label>
                <Select value={inviteDepartment} onValueChange={setInviteDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Développement</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="sales">Ventes</SelectItem>
                    <SelectItem value="hr">Ressources Humaines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleInviteUser}>
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer l'invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un collaborateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Utilisateurs actifs ({users.length})</TabsTrigger>
          <TabsTrigger value="invitations">Invitations ({invitations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4">
            {users.map((user: any) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Département</p>
                        <p className="font-medium">{user.department}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Bien-être</p>
                        <p className="font-medium">{user.wellbeingScore}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Dernière connexion</p>
                        <p className="font-medium text-xs">
                          {user.lastSeen.toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <div className="grid gap-4">
            {invitations.map((invitation: any) => (
              <Card key={invitation.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{invitation.email}</h3>
                        <p className="text-sm text-muted-foreground">
                          Invité par {invitation.invitedBy} - {invitation.department}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(invitation.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Envoyée le</p>
                        <p className="font-medium text-xs">
                          {invitation.invitedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {invitation.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline">
                              Renvoyer
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminUsersPage;
