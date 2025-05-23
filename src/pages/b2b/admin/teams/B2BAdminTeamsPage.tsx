
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  Plus, 
  Building2,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Loader2,
  Edit,
  Trash2,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Team {
  id: string;
  name: string;
  description: string;
  department: string;
  members: string[];
  goals: any[];
  created_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  job_title?: string;
  emotional_score?: number;
}

const B2BAdminTeamsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { setUserMode } = useUserMode();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    department: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setUserMode('b2b_admin');
    fetchData();
  }, [setUserMode]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // For now, we'll simulate teams data since there's no teams table
      // In a real implementation, you would fetch from a teams table
      setTeams([
        {
          id: '1',
          name: 'Équipe Développement',
          description: 'Équipe de développement logiciel',
          department: 'Technologie',
          members: [],
          goals: [],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Équipe Marketing',
          description: 'Équipe marketing et communication',
          department: 'Marketing',
          members: [],
          goals: [],
          created_at: new Date().toISOString()
        }
      ]);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['b2b_user', 'b2b_admin']);

      if (usersError) throw usersError;
      setUsers(usersData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async () => {
    if (!newTeam.name.trim() || !newTeam.description.trim() || !newTeam.department.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsCreating(true);
      
      // In a real implementation, you would save to a teams table
      const team: Team = {
        id: Date.now().toString(),
        name: newTeam.name,
        description: newTeam.description,
        department: newTeam.department,
        members: [],
        goals: [],
        created_at: new Date().toISOString()
      };

      setTeams(prev => [...prev, team]);
      toast.success('Équipe créée avec succès !');
      setNewTeam({ name: '', description: '', department: '' });
      setShowCreateTeam(false);
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Erreur lors de la création de l\'équipe');
    } finally {
      setIsCreating(false);
    }
  };

  const deleteTeam = (teamId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
      return;
    }

    setTeams(prev => prev.filter(t => t.id !== teamId));
    toast.success('Équipe supprimée avec succès');
  };

  const getDepartmentStats = () => {
    const departments = Array.from(new Set(users.map(u => u.department).filter(Boolean)));
    return departments.map(dept => ({
      name: dept,
      userCount: users.filter(u => u.department === dept).length,
      averageWellness: Math.round(
        users
          .filter(u => u.department === dept && u.emotional_score)
          .reduce((sum, u) => sum + (u.emotional_score || 0), 0) /
        users.filter(u => u.department === dept && u.emotional_score).length || 0
      )
    }));
  };

  const departmentStats = getDepartmentStats();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des équipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/b2b/admin/dashboard')}>
              ← Tableau de bord
            </Button>
            <h1 className="text-xl font-bold">Gestion des équipes</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-purple-50 text-purple-600">
              Administrateur
            </Badge>
            <Badge variant="outline">
              {user?.user_metadata?.name || user?.email}
            </Badge>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Équipes</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Départements</p>
                  <p className="text-2xl font-bold">{departmentStats.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Membres Actifs</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <UserPlus className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Objectifs Actifs</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vue d'ensemble des départements</CardTitle>
            <CardDescription>
              Statistiques par département de votre organisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentStats.map((dept) => (
                <Card key={dept.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{dept.name}</h3>
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Membres</span>
                        <span className="font-medium">{dept.userCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bien-être moyen</span>
                        <Badge 
                          variant="outline"
                          className={dept.averageWellness >= 70 ? 'bg-green-50 text-green-600' : 
                                   dept.averageWellness >= 50 ? 'bg-yellow-50 text-yellow-600' : 
                                   'bg-red-50 text-red-600'}
                        >
                          {dept.averageWellness || 0}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Team Form */}
        {showCreateTeam && (
          <Card className="mb-8 border-2 border-dashed">
            <CardHeader>
              <CardTitle>Créer une nouvelle équipe</CardTitle>
              <CardDescription>
                Organisez vos collaborateurs en équipes pour une meilleure collaboration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Nom de l'équipe"
                value={newTeam.name}
                onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
              />
              
              <Textarea
                placeholder="Description de l'équipe"
                value={newTeam.description}
                onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
              />

              <Input
                placeholder="Département"
                value={newTeam.department}
                onChange={(e) => setNewTeam(prev => ({ ...prev, department: e.target.value }))}
              />

              <div className="flex space-x-2">
                <Button 
                  onClick={createTeam}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Créer l'équipe
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowCreateTeam(false)}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Teams List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Équipes organisées</CardTitle>
                <CardDescription>
                  Gérez vos équipes et leurs objectifs
                </CardDescription>
              </div>
              <Button onClick={() => setShowCreateTeam(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle équipe
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {teams.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Aucune équipe créée</h3>
                <p className="text-muted-foreground">
                  Créez votre première équipe pour organiser vos collaborateurs
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => (
                  <Card key={team.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{team.name}</h3>
                              <p className="text-muted-foreground">{team.description}</p>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                              {team.department}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                              <p className="text-sm text-muted-foreground">Membres</p>
                              <p className="font-bold">{team.members.length}</p>
                            </div>
                            <div className="text-center">
                              <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                              <p className="text-sm text-muted-foreground">Objectifs</p>
                              <p className="font-bold">{team.goals.length}</p>
                            </div>
                            <div className="text-center">
                              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                              <p className="text-sm text-muted-foreground">Performance</p>
                              <p className="font-bold">85%</p>
                            </div>
                            <div className="text-center">
                              <Award className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                              <p className="text-sm text-muted-foreground">Succès</p>
                              <p className="font-bold">12</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Gérer
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteTeam(team.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Goals Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Objectifs d'équipe</CardTitle>
            <CardDescription>
              Définissez et suivez les objectifs de vos équipes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-dashed">
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Objectif Bien-être</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Maintenir un score de bien-être supérieur à 75%
                  </p>
                  <Badge className="bg-green-50 text-green-600">En cours</Badge>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Activités Mensuelles</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Organiser 2 activités team-building par mois
                  </p>
                  <Badge className="bg-blue-50 text-blue-600">Planifié</Badge>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Programme Reconnaissance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Mettre en place un système de récompenses
                  </p>
                  <Badge className="bg-yellow-50 text-yellow-600">À définir</Badge>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminTeamsPage;
