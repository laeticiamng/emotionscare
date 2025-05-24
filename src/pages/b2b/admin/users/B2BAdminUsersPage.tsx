
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Search, Plus, Filter, MoreHorizontal, 
  UserCheck, UserX, Mail, Calendar 
} from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';

const B2BAdminUsersPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@entreprise.com',
      role: 'Collaborateur',
      department: 'Marketing',
      status: 'Actif',
      lastActivity: '2024-01-20',
      wellbeingScore: 8.2
    },
    {
      id: 2,
      name: 'Pierre Martin',
      email: 'pierre.martin@entreprise.com',
      role: 'Collaborateur',
      department: 'Développement',
      status: 'Actif',
      lastActivity: '2024-01-19',
      wellbeingScore: 7.8
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      email: 'sophie.laurent@entreprise.com',
      role: 'Manager',
      department: 'Commercial',
      status: 'Inactif',
      lastActivity: '2024-01-15',
      wellbeingScore: 6.9
    },
    {
      id: 4,
      name: 'Demo Admin',
      email: 'admin@exemple.fr',
      role: 'Administrateur',
      department: 'IT',
      status: 'Actif',
      lastActivity: '2024-01-20',
      wellbeingScore: 8.5
    }
  ]);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteUser = () => {
    // Simuler l'ajout d'un utilisateur
    console.log('Inviter un nouvel utilisateur');
  };

  const getStatusBadge = (status: string) => {
    return status === 'Actif' 
      ? <Badge variant="default" className="bg-green-100 text-green-700">Actif</Badge>
      : <Badge variant="secondary">Inactif</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      'Administrateur': 'bg-purple-100 text-purple-700',
      'Manager': 'bg-blue-100 text-blue-700',
      'Collaborateur': 'bg-gray-100 text-gray-700'
    };
    return (
      <Badge variant="secondary" className={colors[role as keyof typeof colors]}>
        {role}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement des utilisateurs..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Gestion des utilisateurs
            </h1>
            <p className="text-muted-foreground">
              Administrez les comptes et permissions de votre organisation
            </p>
          </div>
          <Button onClick={handleInviteUser} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Inviter un utilisateur
          </Button>
        </div>
      </motion.div>

      {/* Statistiques rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-muted-foreground">Total utilisateurs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'Actif').length}
              </div>
              <div className="text-sm text-muted-foreground">Utilisateurs actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'Administrateur').length}
              </div>
              <div className="text-sm text-muted-foreground">Administrateurs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(users.reduce((acc, u) => acc + u.wellbeingScore, 0) / users.length).toFixed(1)}/10
              </div>
              <div className="text-sm text-muted-foreground">Score moyen</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Liste des utilisateurs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Liste de tous les utilisateurs de votre organisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                      <p className="text-sm text-muted-foreground">{user.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">{user.wellbeingScore}/10</div>
                      <div className="text-xs text-muted-foreground">Bien-être</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.lastActivity).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-muted-foreground">Dernière activité</div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(user.status)}
                      {getRoleBadge(user.role)}
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BAdminUsersPage;
