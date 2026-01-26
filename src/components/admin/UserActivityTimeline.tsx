import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

export interface UserActivityTimelineProps {
  userId: string; // Make sure the component expects userId prop
}

const UserActivityTimeline: React.FC<UserActivityTimelineProps> = ({ userId }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch from an API based on userId
    const fetchActivities = async () => {
      try {
        // Mock data for demonstration
        const mockActivities = [
          {
            id: '1',
            type: 'login',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            details: 'Connexion depuis application mobile'
          },
          {
            id: '2',
            type: 'scan',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            details: 'Scan émotionnel complété'
          },
          {
            id: '3',
            type: 'journal',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            details: 'Entrée de journal ajoutée'
          },
          {
            id: '4',
            type: 'vr',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            details: 'Session VR de 10 minutes'
          }
        ];
        
        setActivities(mockActivities);
      } catch (error) {
        logger.error('Error fetching activity data', { error, userId }, 'ADMIN');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, [userId]);
  
  if (loading) {
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
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Activité récente</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            {getActivityIcon(activity.type)}
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.details}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>{format(new Date(activity.timestamp), 'dd/MM/yyyy')}</span>
                <Clock className="h-3 w-3 ml-3 mr-1" />
                <span>{format(new Date(activity.timestamp), 'HH:mm')}</span>
              </div>
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
