
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Plus, Search, Filter, MoreHorizontal, Mail, Phone, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '@/services/teamService';
import { TeamSummary } from '@/types/dashboard';
import { toast } from 'sonner';

const TeamsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamSummary | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const queryClient = useQueryClient();

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.listTeams(),
  });

  const createTeamMutation = useMutation({
    mutationFn: (name: string) => teamService.createTeam(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Équipe créée avec succès');
      setIsCreateDialogOpen(false);
      setNewTeamName('');
    },
    onError: () => {
      toast.error('Erreur lors de la création de l\'équipe');
    },
  });

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      createTeamMutation.mutate(newTeamName.trim());
    }
  };

  const getStatusColor = (averageScore: number) => {
    if (averageScore >= 8) return 'bg-green-500';
    if (averageScore >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '↗️';
    if (trend < 0) return '↘️';
    return '➡️';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des équipes</h1>
          <p className="text-muted-foreground">
            Gérez les équipes et surveillez leur bien-être émotionnel
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer une équipe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle équipe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-name">Nom de l'équipe</Label>
                <Input
                  id="team-name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Ex: Équipe Marketing"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleCreateTeam}
                  disabled={!newTeamName.trim() || createTeamMutation.isPending}
                >
                  {createTeamMutation.isPending ? 'Création...' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une équipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team) => (
              <Card 
                key={team.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTeam(team)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{team.department}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(team.averageScore)}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Membres</span>
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {team.memberCount}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Score moyen</span>
                    <span className="font-semibold">{team.averageScore}/10</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tendance</span>
                    <span className="flex items-center">
                      {getTrendIcon(team.trend)}
                      <span className="ml-1 text-sm">{Math.abs(team.trend)}%</span>
                    </span>
                  </div>
                  
                  {team.alertCount && team.alertCount > 0 && (
                    <div className="flex items-center text-amber-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span className="text-sm">{team.alertCount} alerte(s)</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alertes actives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Système d'alertes pour détecter les baisses de moral ou les risques émotionnels.
              </p>
              <div className="mt-4">
                <Button variant="outline">Configurer les alertes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analyses des équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analyses détaillées du bien-être émotionnel par équipe.
              </p>
              <div className="mt-4">
                <Button variant="outline">Voir les analyses détaillées</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamsPage;
