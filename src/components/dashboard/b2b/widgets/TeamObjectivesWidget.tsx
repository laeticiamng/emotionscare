// @ts-nocheck
/**
 * TeamObjectivesWidget - Widget d'objectifs d'équipe
 * Utilise des données dynamiques depuis team_challenges et Supabase
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, Trophy, Clock, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface TeamObjective {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  status: 'achieved' | 'in_progress' | 'attention';
  deadline: string;
}

const DEFAULT_OBJECTIVES: TeamObjective[] = [
  {
    id: '1',
    title: 'Bien-être collectif',
    description: 'Maintenir un score d\'équipe > 75%',
    current: 78,
    target: 75,
    status: 'achieved',
    deadline: '2 jours restants'
  },
  {
    id: '2',
    title: 'Participation active',
    description: 'Atteindre 80% de participation aux scans',
    current: 72,
    target: 80,
    status: 'in_progress',
    deadline: '1 semaine restante'
  },
  {
    id: '3',
    title: 'Engagement social',
    description: 'Interactions dans le Social Cocon',
    current: 45,
    target: 60,
    status: 'attention',
    deadline: '3 jours restants'
  }
];

async function fetchTeamObjectives(orgId: string): Promise<TeamObjective[]> {
  try {
    const now = new Date();
    
    // Récupérer les défis d'équipe actifs
    const { data: challenges, error } = await supabase
      .from('team_challenges')
      .select('*')
      .eq('is_active', true)
      .order('ends_at', { ascending: true })
      .limit(5);

    if (error || !challenges || challenges.length === 0) {
      return DEFAULT_OBJECTIVES;
    }

    return challenges.map(challenge => {
      const progress = challenge.goal_value > 0 
        ? (challenge.current_value / challenge.goal_value) * 100 
        : 0;
      
      const endDate = new Date(challenge.ends_at);
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      let status: TeamObjective['status'] = 'in_progress';
      if (progress >= 100) status = 'achieved';
      else if (progress < 50 && daysRemaining <= 3) status = 'attention';

      let deadline = `${daysRemaining} jours restants`;
      if (daysRemaining <= 0) deadline = 'Terminé';
      else if (daysRemaining === 1) deadline = '1 jour restant';

      return {
        id: challenge.id,
        title: challenge.name || 'Objectif équipe',
        description: challenge.description || '',
        current: challenge.current_value || 0,
        target: challenge.goal_value || 100,
        status,
        deadline,
      };
    });
  } catch (error) {
    console.error('Error fetching team objectives:', error);
    return DEFAULT_OBJECTIVES;
  }
}

export const TeamObjectivesWidget: React.FC = () => {
  const { user } = useAuth();
  const orgId = user?.user_metadata?.org_id as string | undefined;

  const { data: objectives, isLoading } = useQuery({
    queryKey: ['team-objectives', orgId],
    queryFn: () => fetchTeamObjectives(orgId!),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
  });

  const displayObjectives = objectives || DEFAULT_OBJECTIVES;

  const getStatusColor = (status: TeamObjective['status']) => {
    switch (status) {
      case 'achieved': return 'bg-success/10 text-success border-success/30';
      case 'in_progress': return 'bg-primary/10 text-primary border-primary/30';
      case 'attention': return 'bg-warning/10 text-warning border-warning/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: TeamObjective['status']) => {
    switch (status) {
      case 'achieved': return Trophy;
      case 'in_progress': return Target;
      case 'attention': return AlertCircle;
      default: return Target;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" aria-hidden="true" />
          Objectifs d'Équipe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          displayObjectives.map((obj) => {
            const StatusIcon = getStatusIcon(obj.status);
            const progress = obj.target > 0 ? (obj.current / obj.target) * 100 : 0;
            
            return (
              <div 
                key={obj.id} 
                className="space-y-3 p-3 border rounded-lg"
                role="article"
                aria-label={`Objectif: ${obj.title}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={cn(
                      "h-4 w-4",
                      obj.status === 'achieved' && "text-success",
                      obj.status === 'in_progress' && "text-primary",
                      obj.status === 'attention' && "text-warning"
                    )} aria-hidden="true" />
                    <h4 className="font-medium text-sm">{obj.title}</h4>
                  </div>
                  <Badge className={cn("text-xs", getStatusColor(obj.status))}>
                    {obj.current}/{obj.target}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground">{obj.description}</p>
                
                <div className="space-y-2">
                  <Progress 
                    value={Math.min(progress, 100)} 
                    className="h-2"
                    aria-label={`Progression: ${Math.round(progress)}%`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(progress)}% complété</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {obj.deadline}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default TeamObjectivesWidget;
