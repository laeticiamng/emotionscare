import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Search, Edit3, Shield, Mail, Phone, Calendar, MapPin, Activity, AlertTriangle, CheckCircle, XCircle, Eye, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin?: string;
  created_at: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: string;
    preferences?: any;
  };
  subscription?: {
    plan: string;
    status: string;
    expiresAt?: string;
  };
  metrics?: {
    sessionsCount: number;
    totalTime: number;
    lastActivity: string;
  };
}

interface UserFilters {
  status?: string[];
  role?: string[];
  plan?: string[];
  dateRange?: { start: string; end: string };
  search?: string;
}

export const AdvancedUserManagement: React.FC = () => {
  const {  } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<UserFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'created_at' | 'lastLogin'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Statistiques globales
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    premiumUsers: 0
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters, sortBy, sortOrder]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Simulation de données utilisateurs avancées
      const mockUsers: User[] = Array.from({ length: 150 }, (_, i) => ({
        id: `user-${i + 1}`,
        email: `user${i + 1}@example.com`,
        name: `Utilisateur ${i + 1}`,
        role: ['admin', 'manager', 'user'][Math.floor(Math.random() * 3)],
        status: ['active', 'inactive', 'suspended', 'pending'][Math.floor(Math.random() * 4)] as any,
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        profile: {
          firstName: `Prénom${i + 1}`,
          lastName: `Nom${i + 1}`,
          phone: `+33 6 ${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
          location: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'][Math.floor(Math.random() * 5)],
        },
        subscription: {
          plan: ['free', 'premium', 'enterprise'][Math.floor(Math.random() * 3)],
          status: ['active', 'expired', 'cancelled'][Math.floor(Math.random() * 3)],
          expiresAt: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        metrics: {
          sessionsCount: Math.floor(Math.random() * 100),
          totalTime: Math.floor(Math.random() * 10000),
          lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      }));

      setUsers(mockUsers);
      
      // Calculer les statistiques
      setStats({
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(u => u.status === 'active').length,
        newUsersThisMonth: mockUsers.filter(u => 
          new Date(u.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        premiumUsers: mockUsers.filter(u => u.subscription?.plan !== 'free').length
      });

    } catch (error) {
      logger.error('Erreur lors du chargement des utilisateurs', error, 'Admin');
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Filtrage par recherche
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(search) ||
        user.name?.toLowerCase().includes(search) ||
        user.profile?.firstName?.toLowerCase().includes(search) ||
        user.profile?.lastName?.toLowerCase().includes(search)
      );
    }

    // Filtrage par statut
    if (filters.status?.length) {
      filtered = filtered.filter(user => filters.status!.includes(user.status));
    }

    // Filtrage par rôle
    if (filters.role?.length) {
      filtered = filtered.filter(user => user.role && filters.role!.includes(user.role));
    }

    // Filtrage par plan
    if (filters.plan?.length) {
      filtered = filtered.filter(user => 
        user.subscription?.plan && filters.plan!.includes(user.subscription.plan)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || a.email;
          bValue = b.name || b.email;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'lastLogin':
          aValue = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
          bValue = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
          break;
        default:
          aValue = a.created_at;
          bValue = b.created_at;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId: string, action: string, data?: any) => {
    try {
      switch (action) {
        case 'suspend':
          // Suspendre l'utilisateur
          setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, status: 'suspended' } : u
          ));
          toast.success('Utilisateur suspendu');
          break;
        
        case 'activate':
          // Activer l'utilisateur
          setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, status: 'active' } : u
          ));
          toast.success('Utilisateur activé');
          break;
        
        case 'delete':
          // Supprimer l'utilisateur
          setUsers(prev => prev.filter(u => u.id !== userId));
          toast.success('Utilisateur supprimé');
          break;
        
        case 'updateRole':
          // Changer le rôle
          setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, role: data.role } : u
          ));
          toast.success('Rôle mis à jour');
          break;
        
        case 'sendEmail':
          // Envoyer un email
          toast.success('Email envoyé à l\'utilisateur');
          break;
      }
    } catch (error) {
      logger.error('Erreur lors de l\'action utilisateur', error, 'Admin');
      toast.error('Erreur lors de l\'action');
    }
  };

  const exportUsers = async (format: 'csv' | 'excel' | 'json') => {
    try {
      const data = filteredUsers.map(user => ({
        ID: user.id,
        Email: user.email,
        Nom: user.name || `${user.profile?.firstName} ${user.profile?.lastName}`,
        Rôle: user.role,
        Statut: user.status,
        Plan: user.subscription?.plan,
        'Dernière connexion': user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais',
        'Date création': new Date(user.created_at).toLocaleDateString('fr-FR'),
        Sessions: user.metrics?.sessionsCount,
        'Temps total (min)': Math.round((user.metrics?.totalTime || 0) / 60)
      }));

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `utilisateurs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Pour CSV et Excel, on simule le download
        toast.success(`Export ${format.toUpperCase()} généré avec succès`);
      }
    } catch (error) {
      logger.error('Erreur lors de l\'export', error, 'Admin');
      toast.error('Erreur lors de l\'export');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'suspended': return 'bg-destructive/10 text-destructive';
      case 'pending': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Activity className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-1">Administration avancée et analytique</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => exportUsers('json')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nouveaux ce mois</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newUsersThisMonth.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Premium</p>
                <p className="text-2xl font-bold text-gray-900">{stats.premiumUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, email..."
                  className="pl-10"
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, status: value ? [value] : [] }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, role: value ? [value] : [] }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les rôles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">Utilisateur</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date création</SelectItem>
                <SelectItem value="lastLogin">Dernière connexion</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table des utilisateurs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Utilisateurs ({filteredUsers.length.toLocaleString()})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Utilisateur</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Statut</th>
                  <th className="text-left p-4">Plan</th>
                  <th className="text-left p-4">Activité</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold">
                            {(user.name || user.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {user.name || `${user.profile?.firstName} ${user.profile?.lastName}`}
                            </div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            <div className="text-xs text-muted-foreground">ID: {user.id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="space-y-1">
                          {user.profile?.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.profile.phone}
                            </div>
                          )}
                          {user.profile?.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-3 h-3 mr-1" />
                              {user.profile.location}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <Badge className={`${getStatusColor(user.status)} flex items-center gap-1`}>
                          {getStatusIcon(user.status)}
                          {user.status}
                        </Badge>
                        {user.role && (
                          <div className="text-xs text-gray-500 mt-1">
                            {user.role}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <Badge variant={user.subscription?.plan === 'free' ? 'secondary' : 'default'}>
                            {user.subscription?.plan || 'free'}
                          </Badge>
                          {user.subscription?.expiresAt && (
                            <div className="text-xs text-gray-500">
                              Expire: {new Date(user.subscription.expiresAt).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">
                            {user.metrics?.sessionsCount || 0} sessions
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round((user.metrics?.totalTime || 0) / 60)}min total
                          </div>
                          {user.lastLogin && (
                            <div className="text-xs text-gray-400">
                              Connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Détails de l'utilisateur</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-sm text-gray-900">{selectedUser.email}</p>
                                    </div>
                                    <div>
                                      <Label>Statut</Label>
                                      <Badge className={getStatusColor(selectedUser.status)}>
                                        {selectedUser.status}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>Plan d'abonnement</Label>
                                      <p className="text-sm text-gray-900">{selectedUser.subscription?.plan || 'free'}</p>
                                    </div>
                                    <div>
                                      <Label>Rôle</Label>
                                      <p className="text-sm text-gray-900">{selectedUser.role || 'user'}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label>Sessions</Label>
                                      <p className="text-2xl font-bold text-blue-600">
                                        {selectedUser.metrics?.sessionsCount || 0}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Temps total</Label>
                                      <p className="text-2xl font-bold text-green-600">
                                        {Math.round((selectedUser.metrics?.totalTime || 0) / 60)}min
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Dernière activité</Label>
                                      <p className="text-sm text-gray-600">
                                        {selectedUser.metrics?.lastActivity 
                                          ? new Date(selectedUser.metrics.lastActivity).toLocaleDateString('fr-FR')
                                          : 'Jamais'
                                        }
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex space-x-2 pt-4">
                                    <Button
                                      variant={selectedUser.status === 'active' ? 'destructive' : 'default'}
                                      onClick={() => handleUserAction(
                                        selectedUser.id,
                                        selectedUser.status === 'active' ? 'suspend' : 'activate'
                                      )}
                                    >
                                      {selectedUser.status === 'active' ? 'Suspendre' : 'Activer'}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => handleUserAction(selectedUser.id, 'sendEmail')}
                                    >
                                      <Mail className="w-4 h-4 mr-2" />
                                      Envoyer email
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'edit')}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};