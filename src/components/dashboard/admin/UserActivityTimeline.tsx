// @ts-nocheck

import React from 'react';
import { 
  Calendar, 
  MessageSquare, 
  Headphones, 
  Headset, // Changed from VrHeadset to Headset
  UserCheck, 
  Settings
} from 'lucide-react';

interface UserActivityTimelineProps {
  userId: string;
}

export const UserActivityTimeline: React.FC<UserActivityTimelineProps> = ({ userId }) => {
  // Mock data - in a real app, this would be fetched based on userId
  const activities = [
    {
      id: '1',
      type: 'scan_emotion',
      date: '2023-07-23T14:22:00Z',
      details: 'Scan émotionnel effectué'
    },
    {
      id: '2',
      type: 'journal_entry',
      date: '2023-07-22T10:15:00Z',
      details: 'Entrée de journal ajoutée'
    },
    {
      id: '3',
      type: 'music_play',
      date: '2023-07-21T16:30:00Z',
      details: 'Méditation sonore écoutée'
    },
    {
      id: '4',
      type: 'vr_session',
      date: '2023-07-20T09:45:00Z',
      details: 'Session VR complétée'
    },
    {
      id: '5',
      type: 'login',
      date: '2023-07-20T09:30:00Z',
      details: 'Connexion à la plateforme'
    },
    {
      id: '6',
      type: 'profile_update',
      date: '2023-07-18T11:20:00Z',
      details: 'Mise à jour du profil'
    }
  ];

  // Helper function to get icon by activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'scan_emotion':
        return <Calendar className="h-5 w-5" />;
      case 'journal_entry':
        return <MessageSquare className="h-5 w-5" />;
      case 'music_play':
        return <Headphones className="h-5 w-5" />;
      case 'vr_session':
        return <Headset className="h-5 w-5" />; // Changed from VrHeadset to Headset
      case 'login':
        return <UserCheck className="h-5 w-5" />;
      case 'profile_update':
        return <Settings className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {activities.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          Aucune activité récente enregistrée.
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3.5 top-5 bottom-5 w-0.5 bg-muted"></div>
          
          {/* Activities */}
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 items-start relative z-10">
                <div className="bg-background p-1.5 rounded-full border">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium">{activity.details}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(activity.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
