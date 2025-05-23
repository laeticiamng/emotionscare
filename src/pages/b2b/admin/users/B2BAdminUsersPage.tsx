
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Filter, Search, PlusCircle, MoreHorizontal, Mail, Download, UserPlus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
}

const B2BAdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  
  // Vérification que l'utilisateur est bien un administrateur
  useEffect(() => {
    if (userMode !== 'b2b_admin' && user?.role !== 'b2b_admin') {
      navigate('/b2b/selection');
    }
  }, [userMode, user, navigate]);
  
  // Simulation du chargement des données des utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      
      // Données simulées
      const mockUsers: User[] = [
        { id: '1', name: 'Marie Durand', email: 'm.durand@entreprise.com', department: 'Marketing', role: 'Utilisateur', status: 'active', lastActive: 'Il y a 2 heures' },
        { id: '2', name: 'Pierre Lambert', email: 'p.lambert@entreprise.com', department: 'Ventes', role: 'Utilisateur', status: 'active', lastActive: 'Aujourd\'hui' },
        { id: '3', name: 'Sophie Martin', email: 's.martin@entreprise.com', department: 'RH', role: 'Admin', status: 'active', lastActive: 'Il y a 30 minutes' },
        { id: '4', name: 'Jean Bernard', email: 'j.bernard@entreprise.com', department: 'IT', role: 'Utilisateur', status: 'inactive', lastActive: 'Il y a 2 semaines' },
        { id: '5', name: 'Camille Petit', email: 'c.petit@entreprise.com', department: 'Support', role: 'Utilisateur', status: 'active', lastActive: 'Hier' },
        { id: '6', name: 'Thomas Legrand', email: 't.legrand@entreprise.com', department: 'R&D', role: 'Utilisateur', status: 'pending', lastActive: 'Jamais' },
        { id: '7', name: 'Julie Robert', email: 'j.robert@entreprise.com', department: 'Design', role: 'Utilisateur', status: 'active', lastActive: 'Il y a 1 jour' },
        { id: '8', name: 'Nicolas Morel', email: 'n.morel@entreprise.com', department: 'Finance', role: 'Utilisateur', status: 'inactive', lastActive: 'Il y a 1 mois' },
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      setUsers(mockUsers);
      setIsLoading(false);
    };
    
    loadUsers();
  }, []);
  
  const handleInviteUser = () => {
    toast.success("Invitation envoyée avec succès");
  };
  
  const handleExportUsers = () => {
    toast.success("Export des utilisateurs en cours...");
  };
  
  const handleDeleteUser = (userId: string) => {
    toast.success("Utilisateur supprimé avec succès");
    setUsers(users.filter(user => user.id !== userId));
  };
  
  const filteredUsers = users.filter(user => {
    // Filtre par statut
    if (filter !== 'all' && user.status !== filter) {
      return false;
    }
    
    // Recherche par nom ou email
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les membres de votre organisation
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportUsers}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button 
            size="sm"
            onClick={handleInviteUser}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Inviter un utilisateur
          </Button>
        </div>
      </header>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher par nom ou email..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Filtrer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="h-60 flex items-center justify-center flex-col">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">Aucun utilisateur trouvé</h3>
              <p className="text-muted-foreground text-sm">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Département</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dernière activité</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium">{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          className={
                            user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                            user.status === 'inactive' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
                            'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }
                        >
                          {user.status === 'active' ? 'Actif' : 
                           user.status === 'inactive' ? 'Inactif' : 'En attente'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user.lastActive}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between py-4">
          <p className="text-sm text-muted-foreground">
            Affichage de <strong>{filteredUsers.length}</strong> sur <strong>{users.length}</strong> utilisateurs
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={true}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={true}
            >
              Suivant
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default B2BAdminUsersPage;
