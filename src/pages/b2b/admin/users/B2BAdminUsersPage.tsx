
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, UserPlus, Filter, Shield, Mail } from 'lucide-react';
import { toast } from 'sonner';

const B2BAdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - En production, ces données viendraient de Supabase
  const users = [
    {
      id: '1',
      email: 'marie.dupont@entreprise.com',
      name: 'Marie Dupont',
      role: 'Collaborateur',
      status: 'Actif',
      lastActivity: '2024-01-20',
      department: 'Marketing'
    },
    {
      id: '2',
      email: 'jean.martin@entreprise.com',
      name: 'Jean Martin',
      role: 'Collaborateur',
      status: 'Inactif',
      lastActivity: '2024-01-15',
      department: 'IT'
    },
    {
      id: '3',
      email: 'sophie.bernard@entreprise.com',
      name: 'Sophie Bernard',
      role: 'Collaborateur',
      status: 'Actif',
      lastActivity: '2024-01-21',
      department: 'RH'
    }
  ];

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      toast.error('Veuillez saisir une adresse email');
      return;
    }

    setIsLoading(true);
    try {
      // Ici on appellerait l'API Supabase pour envoyer une invitation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      toast.success('Invitation envoyée avec succès !');
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les accès et invitations de votre équipe
          </p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Inviter un collaborateur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">32</p>
            <p className="text-sm text-muted-foreground">Comptes actifs et inactifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Actifs ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">24</p>
            <p className="text-sm text-muted-foreground">Connexions récentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Invitations en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">5</p>
            <p className="text-sm text-muted-foreground">Non acceptées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Nouveaux ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">3</p>
            <p className="text-sm text-muted-foreground">Inscriptions récentes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Liste des utilisateurs
          </CardTitle>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
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
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{user.department}</Badge>
                      <Badge variant={user.status === 'Actif' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Dernière activité</p>
                  <p className="text-sm font-medium">{user.lastActivity}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Inviter un collaborateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Adresse email professionnelle</label>
                <Input
                  type="email"
                  placeholder="collaborateur@entreprise.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleInviteUser}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Envoi...' : 'Envoyer l\'invitation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-500" />
            Confidentialité et accès
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Gestion des accès :</strong> En tant qu'administrateur RH, vous pouvez inviter des collaborateurs 
              et gérer leurs accès. Les données personnelles de bien-être restent privées pour chaque utilisateur. 
              Seules les statistiques anonymisées et agrégées sont accessibles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminUsersPage;
