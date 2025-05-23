
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter,
  ArrowLeft,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  lastActivity: string;
  wellnessScore: number;
  status: 'active' | 'inactive' | 'pending';
}

const B2BAdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Marie Dubois',
          email: 'marie.dubois@exemple.fr',
          department: 'Marketing',
          role: 'b2b_user',
          lastActivity: '2024-01-15',
          wellnessScore: 87,
          status: 'active'
        },
        {
          id: '2',
          name: 'Jean Martin',
          email: 'jean.martin@exemple.fr',
          department: 'Développement',
          role: 'b2b_user',
          lastActivity: '2024-01-14',
          wellnessScore: 82,
          status: 'active'
        },
        {
          id: '3',
          name: 'Sophie Bernard',
          email: 'sophie.bernard@exemple.fr',
          department: 'RH',
          role: 'b2b_admin',
          lastActivity: '2024-01-15',
          wellnessScore: 91,
          status: 'active'
        },
        {
          id: '4',
          name: 'Pierre Durand',
          email: 'pierre.durand@exemple.fr',
          department: 'Commercial',
          role: 'b2b_user',
          lastActivity: '2024-01-10',
          wellnessScore: 76,
          status: 'inactive'
        },
        {
          id: '5',
          name: 'Claire Moreau',
          email: 'claire.moreau@exemple.fr',
          department: 'Finance',
          role: 'b2b_user',
          lastActivity: 'Jamais',
          wellnessScore: 0,
          status: 'pending'
        }
      ];
      
      setUsers(mockUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  const getWellnessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score > 0) return 'text-red-600';
    return 'text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/b2b/admin/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Gestion des Utilisateurs
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Administrez votre communauté bien-être
              </p>
            </div>
          </div>
          <Button onClick={() => toast('Invitation d\'utilisateurs bientôt disponible')}>
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter
          </Button>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher par nom, email ou département..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'active', label: 'Actifs' },
              { key: 'inactive', label: 'Inactifs' },
              { key: 'pending', label: 'En attente' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? 'default' : 'outline'}
                onClick={() => setSelectedFilter(filter.key)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold">{users.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Actifs</span>
              </div>
              <p className="text-2xl font-bold">
                {users.filter(u => u.status === 'active').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">Inactifs</span>
              </div>
              <p className="text-2xl font-bold">
                {users.filter(u => u.status === 'inactive').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">En attente</span>
              </div>
              <p className="text-2xl font-bold">
                {users.filter(u => u.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Liste complète des utilisateurs de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Dernière activité: {user.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">{user.department}</p>
                        <Badge variant="outline" className="text-xs">
                          {user.role === 'b2b_admin' ? 'Admin' : 'User'}
                        </Badge>
                      </div>
                      
                      <div className="text-center">
                        <p className={`text-lg font-bold ${getWellnessColor(user.wellnessScore)}`}>
                          {user.wellnessScore > 0 ? user.wellnessScore : '-'}
                        </p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                      
                      <Badge className={getStatusColor(user.status)}>
                        {getStatusLabel(user.status)}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast('Voir profil bientôt disponible')}>
                            Voir le profil
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast('Envoyer message bientôt disponible')}>
                            Envoyer un message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast('Modifier statut bientôt disponible')}>
                            Modifier le statut
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Aucun utilisateur trouvé avec ces critères
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BAdminUsersPage;
