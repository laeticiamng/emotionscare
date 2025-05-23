
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Filter,
  Download,
  UserPlus,
  Mail,
  Phone,
  MapPin
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
  status: 'active' | 'inactive' | 'pending';
  wellbeingScore: number;
  lastActivity: string;
}

const B2BAdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showInviteForm, setShowInviteForm] = useState(false);

  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Marie Dubois',
      email: 'marie.dubois@entreprise.com',
      department: 'Marketing',
      role: 'Manager',
      status: 'active',
      wellbeingScore: 85,
      lastActivity: 'Il y a 2h'
    },
    {
      id: '2',
      name: 'Pierre Martin',
      email: 'pierre.martin@entreprise.com',
      department: 'IT',
      role: 'Développeur',
      status: 'active',
      wellbeingScore: 92,
      lastActivity: 'Il y a 1h'
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      email: 'sophie.laurent@entreprise.com',
      department: 'RH',
      role: 'Responsable RH',
      status: 'active',
      wellbeingScore: 78,
      lastActivity: 'Il y a 30min'
    },
    {
      id: '4',
      name: 'Thomas Rousseau',
      email: 'thomas.rousseau@entreprise.com',
      department: 'Finance',
      role: 'Comptable',
      status: 'inactive',
      wellbeingScore: 65,
      lastActivity: 'Il y a 2 jours'
    },
    {
      id: '5',
      name: 'Julie Moreau',
      email: 'julie.moreau@entreprise.com',
      department: 'Commercial',
      role: 'Commerciale',
      status: 'pending',
      wellbeingScore: 0,
      lastActivity: 'Jamais'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleUserAction = (action: string, userId: string) => {
    switch (action) {
      case 'edit':
        toast.info(`Édition de l'utilisateur ${userId}`);
        break;
      case 'deactivate':
        toast.success(`Utilisateur ${userId} désactivé`);
        break;
      case 'resend':
        toast.success(`Invitation renvoyée à l'utilisateur ${userId}`);
        break;
      default:
        console.log(action, userId);
    }
  };

  const handleInviteUser = () => {
    toast.success("Invitation envoyée avec succès!");
    setShowInviteForm(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Administrer les comptes et permissions des collaborateurs
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={() => setShowInviteForm(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Inviter un utilisateur
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtres avancés
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invite Form */}
      {showInviteForm && (
        <Card>
          <CardHeader>
            <CardTitle>Inviter un nouvel utilisateur</CardTitle>
            <CardDescription>
              Envoyez une invitation par email à un nouveau collaborateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input placeholder="utilisateur@entreprise.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom complet</label>
                <Input placeholder="Nom Prénom" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Département</label>
                <Input placeholder="Marketing, IT, RH..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rôle</label>
                <Input placeholder="Manager, Développeur..." />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleInviteUser}>
                <Mail className="mr-2 h-4 w-4" />
                Envoyer l'invitation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Utilisateurs ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-medium text-primary">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {user.department}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status === 'active' ? 'Actif' : 
                         user.status === 'inactive' ? 'Inactif' : 'En attente'}
                      </Badge>
                    </div>
                    {user.status === 'active' && (
                      <p className={`text-sm font-medium ${getScoreColor(user.wellbeingScore)}`}>
                        Score: {user.wellbeingScore}/100
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">{user.lastActivity}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUserAction('edit', user.id)}>
                        Éditer
                      </DropdownMenuItem>
                      {user.status === 'pending' && (
                        <DropdownMenuItem onClick={() => handleUserAction('resend', user.id)}>
                          Renvoyer l'invitation
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleUserAction('deactivate', user.id)}>
                        {user.status === 'active' ? 'Désactiver' : 'Activer'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter(u => u.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Invitations en attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(users.filter(u => u.status === 'active').reduce((acc, u) => acc + u.wellbeingScore, 0) / users.filter(u => u.status === 'active').length) || 0}
            </div>
            <p className="text-sm text-muted-foreground">Score moyen bien-être</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminUsersPage;
