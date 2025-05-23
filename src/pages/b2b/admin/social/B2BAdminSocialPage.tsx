
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  MessageCircle, 
  Plus, 
  Settings,
  TrendingUp,
  Loader2,
  Building2,
  Target,
  Award,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Group {
  id: string;
  name: string;
  topic: string;
  members: string[];
}

interface TeamMember {
  id: string;
  name: string;
  department?: string;
  job_title?: string;
  emotional_score?: number;
  role: string;
}

const B2BAdminSocialPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { setUserMode } = useUserMode();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupTopic, setNewGroupTopic] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setUserMode('b2b_admin');
    fetchData();
  }, [setUserMode]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*');

      if (groupsError) throw groupsError;
      setGroups(groupsData || []);

      // Fetch all team members
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['b2b_user', 'b2b_admin']);

      if (membersError) throw membersError;
      setTeamMembers(membersData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const createGroup = async () => {
    if (!newGroupName.trim() || !newGroupTopic.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsCreating(true);
      const { error } = await supabase
        .from('groups')
        .insert([
          {
            name: newGroupName,
            topic: newGroupTopic,
            members: []
          }
        ]);

      if (error) throw error;

      toast.success('Groupe créé avec succès !');
      setNewGroupName('');
      setNewGroupTopic('');
      setShowCreateGroup(false);
      fetchData();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Erreur lors de la création du groupe');
    } finally {
      setIsCreating(false);
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      toast.success('Groupe supprimé avec succès !');
      fetchData();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Erreur lors de la suppression du groupe');
    }
  };

  const getTeamStats = () => {
    const totalMembers = teamMembers.length;
    const collaborators = teamMembers.filter(m => m.role === 'b2b_user').length;
    const admins = teamMembers.filter(m => m.role === 'b2b_admin').length;
    const averageScore = teamMembers.reduce((sum, m) => sum + (m.emotional_score || 0), 0) / totalMembers || 0;
    
    return { totalMembers, collaborators, admins, averageScore: Math.round(averageScore) };
  };

  const stats = getTeamStats();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de la gestion sociale...</p>
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
            <h1 className="text-xl font-bold">Social Cocoon - Administration</h1>
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
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Équipe</p>
                  <p className="text-2xl font-bold">{stats.totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Collaborateurs</p>
                  <p className="text-2xl font-bold">{stats.collaborators}</p>
                </div>
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Groupes Actifs</p>
                  <p className="text-2xl font-bold">{groups.length}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bien-être Moyen</p>
                  <p className="text-2xl font-bold">{stats.averageScore}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="groups">
              <MessageCircle className="h-4 w-4 mr-2" />
              Groupes
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              Équipe
            </TabsTrigger>
            <TabsTrigger value="wellness">
              <TrendingUp className="h-4 w-4 mr-2" />
              Bien-être
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestion des groupes</CardTitle>
                    <CardDescription>
                      Créez et gérez les groupes de discussion de votre organisation
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateGroup(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau groupe
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showCreateGroup && (
                  <Card className="mb-6 border-2 border-dashed">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Créer un nouveau groupe</h3>
                      <div className="space-y-4">
                        <Input
                          placeholder="Nom du groupe"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <Textarea
                          placeholder="Sujet ou description du groupe"
                          value={newGroupTopic}
                          onChange={(e) => setNewGroupTopic(e.target.value)}
                        />
                        <div className="flex space-x-2">
                          <Button 
                            onClick={createGroup}
                            disabled={isCreating}
                          >
                            {isCreating ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4 mr-2" />
                            )}
                            Créer
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setShowCreateGroup(false)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {groups.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Aucun groupe créé</h3>
                    <p className="text-muted-foreground">
                      Créez votre premier groupe pour favoriser la collaboration
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groups.map((group) => (
                      <Card key={group.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{group.name}</h3>
                              <p className="text-muted-foreground">{group.topic}</p>
                              <Badge variant="outline" className="mt-2">
                                {group.members?.length || 0} membres
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Gérer
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => deleteGroup(group.id)}
                              >
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
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Membres de l'équipe</CardTitle>
                <CardDescription>
                  Vue d'ensemble de tous les membres de votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                            {member.name?.charAt(0) || 'U'}
                          </div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {member.job_title || 'Poste non défini'}
                          </p>
                          <div className="space-y-2">
                            <Badge 
                              variant="outline" 
                              className={member.role === 'b2b_admin' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}
                            >
                              {member.role === 'b2b_admin' ? 'Admin' : 'Collaborateur'}
                            </Badge>
                            {member.emotional_score && (
                              <Badge variant="outline" className="text-xs">
                                Bien-être: {member.emotional_score}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tableau de bord bien-être</CardTitle>
                <CardDescription>
                  Analysez le bien-être général de votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Statistiques générales</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Score moyen de bien-être</span>
                        <span className="font-bold text-2xl">{stats.averageScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Participation active</span>
                        <span className="font-bold">85%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tendance ce mois</span>
                        <Badge className="bg-green-50 text-green-600">+5%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Actions recommandées</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm">Organiser un événement team building</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Planifier des sessions de formation</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Définir des objectifs bien-être</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de l'organisation</CardTitle>
                <CardDescription>
                  Configurez les paramètres sociaux de votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Politique de groupes</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Définissez qui peut créer et gérer les groupes de discussion
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Seuls les admins peuvent créer des groupes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Modération automatique des messages</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Objectifs bien-être</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Définissez les objectifs de bien-être pour l'équipe
                    </p>
                    <Input 
                      type="number" 
                      placeholder="Score cible (%)" 
                      defaultValue="75"
                      className="max-w-xs"
                    />
                  </div>
                  
                  <Button>
                    Sauvegarder les paramètres
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2BAdminSocialPage;
