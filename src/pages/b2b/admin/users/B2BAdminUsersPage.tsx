
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreHorizontal,
  Mail,
  Shield,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

const B2BAdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  
  const isDemoAccount = user?.email?.endsWith('@exemple.fr');

  const mockUsers = isDemoAccount ? [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@exemple.fr',
      department: 'Marketing',
      role: 'user',
      status: 'active',
      lastActive: '2024-01-24',
      engagementScore: 87
    },
    {
      id: 2,
      name: 'Pierre Martin',
      email: 'pierre.martin@exemple.fr',
      department: 'Développement',
      role: 'user',
      status: 'active',
      lastActive: '2024-01-24',
      engagementScore: 92
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      email: 'sophie.laurent@exemple.fr',
      department: 'RH',
      role: 'admin',
      status: 'active',
      lastActive: '2024-01-23',
      engagementScore: 95
    },
    {
      id: 4,
      name: 'Thomas Petit',
      email: 'thomas.petit@exemple.fr',
      department: 'Commercial',
      role: 'user',
      status: 'inactive',
      lastActive: '2024-01-20',
      engagementScore: 65
    },
    {
      id: 5,
      name: 'Julie Moreau',
      email: 'julie.moreau@exemple.fr',
      department: 'Support',
      role: 'user',
      status: 'active',
      lastActive: '2024-01-24',
      engagementScore: 91
    }
  ] : [];

  const departments = ['Tous', 'Développement', 'Marketing', 'RH', 'Commercial', 'Support'];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || 
                             user.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleInviteUser = () => {
    toast.success('Invitation envoyée avec succès');
  };

  const handleEditUser = (userId: number) => {
    toast.info(`Édition de l'utilisateur ${userId}`);
  };

  const handleDeleteUser = (userId: number) => {
    toast.error(`Utilisateur ${userId} supprimé`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'user':
        return <Badge variant="outline">Utilisateur</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
            <p className="text-muted-foreground mt-1">
              Administrez les comptes et permissions de votre organisation
              {isDemoAccount && ' (Données de démonstration)'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importer
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button onClick={handleInviteUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Inviter un utilisateur
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">Total utilisateurs</span>
            </div>
            <p className="text-2xl font-bold">{isDemoAccount ? mockUsers.length : '0'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Utilisateurs actifs</span>
            </div>
            <p className="text-2xl font-bold">
              {isDemoAccount ? mockUsers.filter(u => u.status === 'active').length : '0'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-muted-foreground">Invitations en attente</span>
            </div>
            <p className="text-2xl font-bold">
              {isDemoAccount ? '3' : '0'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-muted-foreground">Administrateurs</span>
            </div>
            <p className="text-2xl font-bold">
              {isDemoAccount ? mockUsers.filter(u => u.role === 'admin').length : '0'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                className="px-3 py-2 border rounded-md"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">Tous les départements</option>
                {departments.slice(1).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Plus de filtres
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length > 0 ? (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.department}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Score: {user.engagementScore}%</p>
                        <p className="text-xs text-muted-foreground">Dernière activité: {user.lastActive}</p>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        {getStatusBadge(user.status)}
                        {getRoleBadge(user.role)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedDepartment !== 'all' 
                    ? 'Aucun utilisateur trouvé avec ces critères'
                    : 'Aucun utilisateur dans votre organisation'
                  }
                </p>
                {!searchTerm && selectedDepartment === 'all' && (
                  <Button onClick={handleInviteUser}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Inviter le premier utilisateur
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BAdminUsersPage;
