
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Search, 
  Mail, 
  MoreVertical,
  ArrowLeft,
  Users,
  Crown,
  Heart,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const B2BAdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);

  const users = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@entreprise.com',
      department: 'Marketing',
      role: 'user',
      score: 78,
      trend: +5,
      lastScan: '2h',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jean Martin',
      email: 'jean.martin@entreprise.com',
      department: 'Développement',
      role: 'user',
      score: 82,
      trend: +12,
      lastScan: '4h',
      status: 'active'
    },
    {
      id: 3,
      name: 'Sophie Leroy',
      email: 'sophie.leroy@entreprise.com',
      department: 'RH',
      role: 'admin',
      score: 85,
      trend: +8,
      lastScan: '1h',
      status: 'active'
    },
    {
      id: 4,
      name: 'Pierre Durand',
      email: 'pierre.durand@entreprise.com',
      department: 'Commercial',
      role: 'user',
      score: 65,
      trend: -3,
      lastScan: '1j',
      status: 'inactive'
    },
    {
      id: 5,
      name: 'Demo User',
      email: 'demo@exemple.fr',
      department: 'Test',
      role: 'user',
      score: 75,
      trend: 0,
      lastScan: '30min',
      status: 'demo'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      toast.error('Veuillez saisir une adresse email');
      return;
    }

    try {
      // Simulation d'envoi d'invitation
      toast.success(`Invitation envoyée à ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteForm(false);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'user': return 'Collaborateur';
      default: return 'Utilisateur';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'demo': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    avgScore: Math.round(users.reduce((acc, u) => acc + u.score, 0) / users.length)
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/b2b/admin/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
              <p className="text-muted-foreground">
                Invitez et gérez les collaborateurs de votre organisation
              </p>
            </div>
          </div>
          <Button onClick={() => setShowInviteForm(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter un collaborateur
          </Button>
        </div>
      </motion.div>

      {/* Statistiques rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total utilisateurs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.avgScore}%</p>
                  <p className="text-sm text-muted-foreground">Score moyen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Formulaire d'invitation */}
      {showInviteForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Inviter un nouveau collaborateur</CardTitle>
              <CardDescription>
                Envoyez une invitation par email pour rejoindre la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="email@entreprise.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleInviteUser}>
                  <Mail className="h-4 w-4 mr-2" />
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
        </motion.div>
      )}

      {/* Liste des utilisateurs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Collaborateurs ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  Gérez les accès et suivez les performances
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{user.name}</p>
                        {user.role === 'admin' && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {user.department}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                          {user.status === 'demo' ? 'Démo' : 
                           user.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{user.score}%</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`flex items-center justify-center ${
                        user.trend > 0 ? 'text-green-600' : 
                        user.trend < 0 ? 'text-red-600' : 'text-gray-400'
                      }`}>
                        {user.trend > 0 ? <TrendingUp className="h-4 w-4" /> :
                         user.trend < 0 ? <TrendingDown className="h-4 w-4" /> :
                         <span className="h-4 w-4 flex items-center justify-center">→</span>}
                        <span className="ml-1 text-sm font-medium">
                          {user.trend > 0 ? '+' : ''}{user.trend}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Tendance</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium">{user.lastScan}</p>
                      <p className="text-xs text-muted-foreground">Dernier scan</p>
                    </div>
                    
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
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
