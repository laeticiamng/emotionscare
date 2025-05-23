
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Award,
  TrendingUp,
  Loader2,
  Building2,
  Coffee,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  id: string;
  name: string;
  department?: string;
  job_title?: string;
  avatar_url?: string;
  emotional_score?: number;
}

interface Group {
  id: string;
  name: string;
  topic: string;
  members: string[];
}

const B2BUserSocialPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { setUserMode } = useUserMode();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    setUserMode('b2b_user');
    fetchData();
  }, [setUserMode]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profile);

      // Fetch team members (users with b2b_user role in same department)
      const { data: members, error: membersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'b2b_user')
        .eq('department', profile?.department)
        .neq('id', user?.id);

      if (membersError) throw membersError;
      setTeamMembers(members || []);

      // Fetch groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*');

      if (groupsError) throw groupsError;
      setGroups(groupsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de votre espace social...</p>
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
            <Button variant="ghost" onClick={() => navigate('/b2b/user/dashboard')}>
              ← Tableau de bord
            </Button>
            <h1 className="text-xl font-bold">Espace Social Collaborateur</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-600">
              Collaborateur
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
                  <p className="text-sm font-medium text-muted-foreground">Mon Équipe</p>
                  <p className="text-2xl font-bold">{teamMembers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Groupes</p>
                  <p className="text-2xl font-bold">{groups.length}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Département</p>
                  <p className="text-lg font-bold">{userProfile?.department || 'Non défini'}</p>
                </div>
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Score Bien-être</p>
                  <p className="text-2xl font-bold">{userProfile?.emotional_score || 0}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              Mon Équipe
            </TabsTrigger>
            <TabsTrigger value="groups">
              <MessageCircle className="h-4 w-4 mr-2" />
              Groupes
            </TabsTrigger>
            <TabsTrigger value="wellness">
              <Coffee className="h-4 w-4 mr-2" />
              Bien-être
            </TabsTrigger>
            <TabsTrigger value="goals">
              <Target className="h-4 w-4 mr-2" />
              Objectifs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Membres de mon équipe</CardTitle>
                <CardDescription>
                  Collaborateurs de votre département : {userProfile?.department}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {teamMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Aucun collègue trouvé</h3>
                    <p className="text-muted-foreground">
                      Il n'y a pas d'autres collaborateurs dans votre département pour le moment.
                    </p>
                  </div>
                ) : (
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
                              {member.job_title || 'Collaborateur'}
                            </p>
                            {member.emotional_score && (
                              <Badge variant="outline" className="text-xs">
                                Bien-être: {member.emotional_score}%
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Groupes de discussion</CardTitle>
                <CardDescription>
                  Participez aux discussions d'équipe et aux projets collaboratifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {groups.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Aucun groupe disponible</h3>
                    <p className="text-muted-foreground">
                      Les groupes de discussion seront créés par votre administrateur.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groups.map((group) => (
                      <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{group.name}</h3>
                              <p className="text-sm text-muted-foreground">{group.topic}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">
                                {group.members?.length || 0} membres
                              </Badge>
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

          <TabsContent value="wellness" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Programme Bien-être</CardTitle>
                <CardDescription>
                  Initiatives et ressources pour votre bien-être au travail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <Coffee className="h-8 w-8 text-brown-600 mb-4" />
                      <h3 className="font-semibold mb-2">Pause Mindfulness</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Participez aux sessions de méditation quotidiennes
                      </p>
                      <Button variant="outline" className="w-full">
                        Rejoindre la session
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <Award className="h-8 w-8 text-yellow-600 mb-4" />
                      <h3 className="font-semibold mb-2">Défis Bien-être</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Participez aux défis mensuels de l'équipe
                      </p>
                      <Button variant="outline" className="w-full">
                        Voir les défis
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <Calendar className="h-8 w-8 text-blue-600 mb-4" />
                      <h3 className="font-semibold mb-2">Événements</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Calendrier des événements bien-être
                      </p>
                      <Button variant="outline" className="w-full">
                        Voir le calendrier
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <TrendingUp className="h-8 w-8 text-green-600 mb-4" />
                      <h3 className="font-semibold mb-2">Mon Progrès</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Suivez votre évolution bien-être
                      </p>
                      <Button variant="outline" className="w-full">
                        Voir les statistiques
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs d'équipe</CardTitle>
                <CardDescription>
                  Objectifs collaboratifs et individuels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Objectifs en cours de définition</h3>
                  <p className="text-muted-foreground">
                    Vos objectifs d'équipe seront définis par votre manager.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2BUserSocialPage;
