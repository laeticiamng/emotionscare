
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, Filter, Download, MoreHorizontal } from 'lucide-react';

const B2BAdminUsers: React.FC = () => {
  const users = [
    { id: 1, name: 'Sophie Martin', email: 'sophie.martin@example.com', department: 'Marketing', status: 'Actif', lastActive: 'Il y a 2h', wellnessScore: '87%' },
    { id: 2, name: 'Thomas Bernard', email: 'thomas.bernard@example.com', department: 'Commercial', status: 'Actif', lastActive: 'Il y a 30min', wellnessScore: '72%' },
    { id: 3, name: 'Emma Petit', email: 'emma.petit@example.com', department: 'RH', status: 'Actif', lastActive: "Il y a 1j", wellnessScore: '94%' },
    { id: 4, name: 'Julien Durand', email: 'julien.durand@example.com', department: 'Technique', status: 'Inactif', lastActive: 'Il y a 7j', wellnessScore: '65%' },
    { id: 5, name: 'Marie Leroy', email: 'marie.leroy@example.com', department: 'Finance', status: 'Actif', lastActive: 'Il y a 5h', wellnessScore: '78%' },
  ];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les accès et suivez l'activité des utilisateurs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Exporter
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" /> Ajouter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, email ou département..."
                className="pl-8"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filtrer
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière activité</TableHead>
                  <TableHead>Score bien-être</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'Actif' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                        {user.status}
                      </div>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-gray-200">
                          <div 
                            className="h-2 rounded-full bg-primary" 
                            style={{ 
                              width: user.wellnessScore, 
                              backgroundColor: parseInt(user.wellnessScore) > 80 ? '#10b981' : parseInt(user.wellnessScore) > 60 ? '#6366f1' : '#ef4444' 
                            }} 
                          />
                        </div>
                        <span>{user.wellnessScore}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de 1 à {users.length} sur {users.length} entrées
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Précédent</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm" disabled>Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminUsers;
