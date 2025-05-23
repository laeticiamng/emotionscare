
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Edit, Trash2, Plus, Search, Heart, BarChart2, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  wellbeing_score: number;
  active_challenges: number;
}

const B2BAdminTeamsPage: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog states
  const [addTeamDialogOpen, setAddTeamDialogOpen] = useState(false);
  const [deleteTeamDialogOpen, setDeleteTeamDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [searchQuery, teams]);

  const loadTeams = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Marketing',
          description: 'Équipe marketing centrée sur la stratégie de contenu et l\'engagement client.',
          members: [
            { id: '1', name: 'Sophie Martin', role: 'Responsable' },
            { id: '2', name: 'Jean Dubois', role: 'Designer' },
            { id: '3', name: 'Emma Richard', role: 'Analyste' },
          ],
          wellbeing_score: 0.82,
          active_challenges: 2
        },
        {
          id: '2',
          name: 'Tech',
          description: 'Équipe de développement travaillant sur les plateformes web et mobile.',
          members: [
            { id: '4', name: 'Thomas Lee', role: 'Lead Developer' },
            { id: '5', name: 'Marie Chen', role: 'Frontend' },
            { id: '6', name: 'Paul Durant', role: 'Backend' },
            { id: '7', name: 'Clara Leroy', role: 'QA' },
          ],
          wellbeing_score: 0.75,
          active_challenges: 1
        },
        {
          id: '3',
          name: 'RH',
          description: 'Équipe ressources humaines chargée du bien-être et de la gestion du personnel.',
          members: [
            { id: '8', name: 'Anne Moreau', role: 'DRH' },
            { id: '9', name: 'Marc Bernard', role: 'Recrutement' },
          ],
          wellbeing_score: 0.91,
          active_challenges: 3
        },
        {
          id: '4',
          name: 'Design',
          description: 'Équipe de conception créative et d\'expérience utilisateur.',
          members: [
            { id: '10', name: 'Julie Chen', role: 'UX Lead' },
            { id: '11', name: 'David Petit', role: 'UI Designer' },
          ],
          wellbeing_score: 0.78,
          active_challenges: 2
        },
      ];
      
      setTeams(mockTeams);
      
    } catch (error) {
      console.error('Error loading teams:', error);
      toast.error('Erreur lors du chargement des équipes');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTeams = () => {
    if (!searchQuery) {
      setFilteredTeams(teams);
      return;
    }
    
    const filtered = teams.filter(team => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      team.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredTeams(filtered);
  };

  const handleAddTeam = () => {
    if (!newTeam.name) {
      toast.error('Veuillez spécifier un nom d\'équipe');
      return;
    }
    
    const teamData: Team = {
      id: Date.now().toString(),
      name: newTeam.name,
      description: newTeam.description,
      members: [],
      wellbeing_score: 0,
      active_challenges: 0
    };
    
    setTeams(prev => [...prev, teamData]);
    setAddTeamDialogOpen(false);
    setNewTeam({ name: '', description: '' });
    
    toast.success(`Équipe ${newTeam.name} créée avec succès`);
  };

  const handleDeleteTeam = () => {
    if (!selectedTeam) return;
    
    setTeams(prev => prev.filter(team => team.id !== selectedTeam.id));
    setDeleteTeamDialogOpen(false);
    setSelectedTeam(null);
    
    toast.success(`Équipe ${selectedTeam.name} supprimée`);
  };

  const getWellbeingScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation size="large" text="Chargement des équipes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestion des équipes</h1>
              <p className="text-muted-foreground">
                Créez et administrez les équipes de votre organisation
              </p>
            </div>
            <Button onClick={() => setAddTeamDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Créer une équipe
            </Button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">{teams.length}</p>
                <p className="text-sm text-muted-foreground">Équipes totales</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-semibold">
                  {Math.round(teams.reduce((acc, team) => acc + team.wellbeing_score, 0) / teams.length * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Score bien-être moyen</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <BarChart2 className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-semibold">
                  {teams.reduce((acc, team) => acc + team.active_challenges, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Défis bien-être actifs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une équipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Teams */}
        <div className="space-y-6">
          {filteredTeams.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Aucune équipe trouvée</p>
                <Button onClick={() => setAddTeamDialogOpen(true)} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Créer une équipe
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTeams.map((team) => (
              <Card key={team.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Team Info */}
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{team.name}</h3>
                          <Badge variant="outline">
                            {team.members.length} membre{team.members.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {team.description}
                      </p>
                    </div>
                    
                    {/* Members */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Membres</h4>
                      <div className="space-y-2">
                        {team.members.slice(0, 3).map((member) => (
                          <div key={member.id} className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{member.name}</span>
                            <Badge variant="outline" className="ml-auto text-xs">
                              {member.role}
                            </Badge>
                          </div>
                        ))}
                        {team.members.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            + {team.members.length - 3} autre{team.members.length - 3 > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Stats & Actions */}
                    <div className="flex flex-col justify-between">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground">Bien-être</p>
                          <p className={`font-semibold ${getWellbeingScoreColor(team.wellbeing_score)}`}>
                            {Math.round(team.wellbeing_score * 100)}%
                          </p>
                        </div>
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground">Défis actifs</p>
                          <p className="font-semibold">
                            {team.active_challenges}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1"
                        >
                          Détails
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedTeam(team);
                              setDeleteTeamDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Team Dialog */}
        <Dialog open={addTeamDialogOpen} onOpenChange={setAddTeamDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle équipe</DialogTitle>
              <DialogDescription>
                Ajoutez une équipe à votre organisation. Vous pourrez ajouter des membres après la création.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Nom de l'équipe</Label>
                <Input 
                  id="team-name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  placeholder="Ex: Marketing, Design..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Description</Label>
                <Textarea 
                  id="team-description"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                  placeholder="Décrivez le rôle et les responsabilités de cette équipe"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddTeamDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddTeam}>Créer l'équipe</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Team Dialog */}
        <Dialog open={deleteTeamDialogOpen} onOpenChange={setDeleteTeamDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cette équipe ? Tous les membres seront détachés de l'équipe, mais leurs comptes resteront actifs.
              </DialogDescription>
            </DialogHeader>
            {selectedTeam && (
              <div className="py-4">
                <div className="flex flex-col gap-2 p-4 bg-muted rounded-md">
                  <h3 className="font-semibold">{selectedTeam.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTeam.description}</p>
                  <p className="text-sm">
                    {selectedTeam.members.length} membre{selectedTeam.members.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTeamDialogOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={handleDeleteTeam}>Supprimer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default B2BAdminTeamsPage;
