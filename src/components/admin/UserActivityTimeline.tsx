import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserActivityTimelineProps {
  userId: string;
}

interface Activity {
  id: string;
  activity_type: string;
  created_at: string | null;
  activity_data: any;
}

const UserActivityTimeline: React.FC<UserActivityTimelineProps> = ({ userId }) => {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['user-activity-timeline', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activities')
        .select('id, activity_type, created_at, activity_data')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data || []) as Activity[];
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune activité récente pour cet utilisateur.
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>;
      case 'scan':
        return <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>;
      case 'journal':
        return <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>;
      case 'vr':
        return <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500 mt-2"></div>;
    }
  };

  const getActivityLabel = (type: string, data: any) => {
    const details = data?.details || data?.description;
    if (details) return details;
    switch (type) {
      case 'login': return 'Connexion';
      case 'scan': return 'Scan émotionnel complété';
      case 'journal': return 'Entrée de journal ajoutée';
      case 'vr': return 'Session VR';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Activité récente</h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            {getActivityIcon(activity.activity_type)}
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{getActivityLabel(activity.activity_type, activity.activity_data)}</p>
              {activity.created_at && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span>{format(new Date(activity.created_at), 'dd/MM/yyyy')}</span>
                  <Clock className="h-3 w-3 ml-3 mr-1" />
                  <span>{format(new Date(activity.created_at), 'HH:mm')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-full mt-4">
        Voir toutes les activités
      </Button>
    </div>
  );
};

export default UserActivityTimeline;
