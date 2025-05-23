
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Building, Loader2, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Team {
  id: string;
  name: string;
  description: string;
  member_count: number;
  manager: string;
  department: string;
}

const B2BAdminTeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    department: '',
    manager: ''
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      
      // In a real application, we would fetch teams from the database
      // For now, let's use mock data
      setTimeout(() => {
        setTeams([
          {
            id: '1',
            name: 'Équipe Marketing',
            description: 'Marketing et communication',
            member_count: 8,
            manager: 'Sophie Dubois',
            department: 'Marketing'
          },
          {
            id: '2',
            name: 'Équipe Technique',
            description: 'Développement logiciel',
            member_count: 12,
            manager: 'Thomas Martin',
            department: 'IT'
          },
          {
            id: '3',
            name: 'Équipe RH',
            description: 'Ressources humaines',
            member_count: 5,
            manager: 'Marie Lefèvre',
            department: 'RH'
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Impossible de charger les équipes');
      setIsLoading(false);
    }
  };

  const handleAddTeam = () => {
    // Validate form
    if (!newTeam.name || !newTeam.department) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Add team to the list (in a real app, we would save to the database)
    const newTeamWithId = {
      id: `team_${Date.now()}`,
      ...newTeam,
      member_count: 0
    };

    setTeams([...teams, newTeamWithId]);
    setShowAddTeamDialog(false);
    setNewTeam({
      name: '',
      description: '',
      department: '',
      manager: ''
    });

    toast.success('Équipe ajoutée avec succès');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-2" 
            onClick={() => navigate('/b2b/admin/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold">Gestion des équipes</h1>
          <p className="text-muted-foreground">
            Créez et gérez les équipes de votre organisation
          </p>
        </div>
        
        <Button onClick={() => setShowAddTeamDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une équipe
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Équipes</CardTitle>
          <CardDescription>Liste des équipes de votre organisation</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-10">
              <Building className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune équipe trouvée</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer votre première équipe
              </p>
              <Button onClick={() => setShowAddTeamDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une équipe
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Membres</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground">{team.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{team.department}</TableCell>
                    <TableCell>{team.manager}</TableCell>
                    <TableCell>{team.member_count}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => {
                        toast.info('Gestion d\'équipe à venir');
                      }}>
                        <Users className="h-4 w-4 mr-2" />
                        Gérer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Add Team Dialog */}
      <Dialog open={showAddTeamDialog} onOpenChange={setShowAddTeamDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une équipe</DialogTitle>
            <DialogDescription>
              Créez une nouvelle équipe pour votre organisation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'équipe *</Label>
              <Input
                id="name"
                placeholder="Ex: Équipe Marketing"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Ex: Gestion des campagnes marketing"
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Département *</Label>
              <Input
                id="department"
                placeholder="Ex: Marketing"
                value={newTeam.department}
                onChange={(e) => setNewTeam({ ...newTeam, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Input
                id="manager"
                placeholder="Ex: Sophie Dubois"
                value={newTeam.manager}
                onChange={(e) => setNewTeam({ ...newTeam, manager: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTeamDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddTeam}>
              Créer l'équipe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default B2BAdminTeamsPage;
