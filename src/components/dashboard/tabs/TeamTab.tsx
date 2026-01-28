import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Activity,
  UserPlus,
  Mail,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface TeamTabProps {
  className?: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  wellbeingScore: number;
  lastActive: string;
  sessionsThisWeek: number;
}

interface TeamStats {
  totalMembers: number;
  averageWellbeing: number;
  activeToday: number;
  weeklyGrowth: number;
}

const TeamTab: React.FC<TeamTabProps> = ({ className }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);

  useEffect(() => {
    if (user) {
      fetchTeamData();
    }
  }, [user]);

  const fetchTeamData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Récupérer l'organisation de l'utilisateur
      const { data: membership, error: membershipError } = await supabase
        .from('org_memberships')
        .select('org_id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (membershipError) throw membershipError;

      if (!membership) {
        // L'utilisateur n'est pas dans une équipe
        setMembers([]);
        setStats(null);
        setLoading(false);
        return;
      }

      // Récupérer les membres de l'organisation
      const { data: orgMembers, error: membersError } = await supabase
        .from('org_memberships')
        .select(`
          user_id,
          role,
          joined_at
        `)
        .eq('org_id', membership.org_id);

      if (membersError) throw membersError;

      // Récupérer les profils des membres
      const userIds = orgMembers?.map(m => m.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combiner les données
      const teamMembers: TeamMember[] = orgMembers?.map(member => {
        const profile = profiles?.find(p => p.id === member.user_id);
        return {
          id: member.user_id,
          name: profile?.display_name || 'Utilisateur',
          email: '',
          avatar: profile?.avatar_url || undefined,
          role: member.role || 'member',
          wellbeingScore: Math.floor(Math.random() * 40) + 60, // Mock pour l'instant
          lastActive: member.joined_at,
          sessionsThisWeek: Math.floor(Math.random() * 10) + 1
        };
      }) || [];

      setMembers(teamMembers);

      // Calculer les stats
      if (teamMembers.length > 0) {
        const avgWellbeing = teamMembers.reduce((acc, m) => acc + m.wellbeingScore, 0) / teamMembers.length;
        setStats({
          totalMembers: teamMembers.length,
          averageWellbeing: Math.round(avgWellbeing),
          activeToday: Math.floor(teamMembers.length * 0.7),
          weeklyGrowth: 5
        });
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWellbeingColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats || members.length === 0) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune équipe</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Vous n'êtes pas encore membre d'une organisation.
              Rejoignez ou créez une équipe pour collaborer sur le bien-être émotionnel.
            </p>
            <div className="flex gap-3">
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Rejoindre une équipe
              </Button>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Créer une équipe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Tableau de bord d'équipe</h2>
        <Button variant="ghost" size="icon" onClick={fetchTeamData}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membres</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              dans l'équipe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bien-être moyen</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getWellbeingColor(stats.averageWellbeing)}`}>
              {stats.averageWellbeing}%
            </div>
            <Progress value={stats.averageWellbeing} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs aujourd'hui</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeToday}</div>
            <p className="text-xs text-muted-foreground">
              sur {stats.totalMembers} membres
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Croissance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+{stats.weeklyGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des membres */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Membres de l'équipe</CardTitle>
              <CardDescription>
                Suivi du bien-être de votre équipe
              </CardDescription>
            </div>
            <Button size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Inviter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div 
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {member.role === 'admin' ? 'Admin' : 'Membre'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className={`font-bold ${getWellbeingColor(member.wellbeingScore)}`}>
                      {member.wellbeingScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Bien-être</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">{member.sessionsThisWeek}</div>
                    <div className="text-xs text-muted-foreground">Sessions/sem</div>
                  </div>

                  <Button variant="ghost" size="icon">
                    <BarChart3 className="h-4 w-4" />
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

export default TeamTab;
