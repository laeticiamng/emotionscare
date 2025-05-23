
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Plus, MoreVertical } from 'lucide-react';

const B2BAdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    { id: 1, name: 'Alice Martin', email: 'alice@example.com', role: 'Manager', status: 'Actif', lastSeen: '2 min' },
    { id: 2, name: 'Bob Durand', email: 'bob@example.com', role: 'Développeur', status: 'Actif', lastSeen: '5 min' },
    { id: 3, name: 'Claire Leroy', email: 'claire@example.com', role: 'Designer', status: 'Inactif', lastSeen: '2h' },
    { id: 4, name: 'David Chen', email: 'david@example.com', role: 'Support', status: 'Actif', lastSeen: '1 min' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Inviter un utilisateur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">91% du total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux cette semaine</CardTitle>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+3 par rapport à la semaine dernière</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'engagement</CardTitle>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Gérez les utilisateurs de votre organisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-6 gap-4 p-4 font-medium bg-muted/50">
              <div>Utilisateur</div>
              <div>Email</div>
              <div>Rôle</div>
              <div>Statut</div>
              <div>Dernière activité</div>
              <div>Actions</div>
            </div>
            
            {mockUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-6 gap-4 p-4 border-t items-center">
                <div className="font-medium">{user.name}</div>
                <div className="text-muted-foreground">{user.email}</div>
                <div>{user.role}</div>
                <div>
                  <Badge 
                    variant={user.status === 'Actif' ? 'default' : 'secondary'}
                  >
                    {user.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground">{user.lastSeen}</div>
                <div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminUsersPage;
