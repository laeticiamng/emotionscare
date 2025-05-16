
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Eye, Clock, Activity, MessagesSquare } from 'lucide-react';
import { VRSessionTemplate } from '@/types/vr';

// Internal section for Popular Sessions
const PopularSessionsSection = () => {
  // Mock VR sessions data
  const sessions: VRSessionTemplate[] = [
    {
      id: '1',
      title: 'Méditation pleine conscience',
      description: 'Une séance de méditation guidée pour débutants.',
      duration: 10,
      tags: ['meditation', 'débutant'],
      emotion_target: 'calm',
      emotionTarget: 'calm',
      thumbnailUrl: '/sessions/meditation.jpg',
    },
    {
      id: '2',
      title: 'Respiration profonde',
      description: 'Techniques de respiration pour réduire le stress.',
      duration: 5,
      tags: ['respiration', 'anti-stress'],
      emotion_target: 'relaxed',
      emotionTarget: 'relaxed',
      thumbnailUrl: '/sessions/breathing.jpg',
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sessions populaires</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-0">
        <div className="space-y-4">
          {sessions.map(session => (
            <div key={session.id} className="flex gap-3">
              <div className="h-12 w-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                {session.thumbnailUrl ? (
                  <img 
                    src={session.thumbnailUrl} 
                    alt={session.title} 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <Activity className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium">{session.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  <span>{session.duration} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="ghost" size="sm" className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          Voir toutes les sessions
        </Button>
      </CardFooter>
    </Card>
  );
};

// Internal section for Recent Activity
const RecentActivitySection = () => {
  // Mock recent activity data
  const activities = [
    {
      id: '1',
      type: 'journal',
      title: 'Journal complété',
      timestamp: '2023-05-16T09:30:00Z'
    },
    {
      id: '2',
      type: 'session',
      title: 'Méditation matinale',
      timestamp: '2023-05-15T08:15:00Z'
    },
    {
      id: '3',
      type: 'chat',
      title: 'Conversation avec le coach',
      timestamp: '2023-05-14T14:45:00Z'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'journal': return <CalendarDays className="h-4 w-4" />;
      case 'session': return <Activity className="h-4 w-4" />;
      case 'chat': return <MessagesSquare className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activités récentes</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-0">
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <h4 className="text-sm font-medium">{activity.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="ghost" size="sm" className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          Voir toutes les activités
        </Button>
      </CardFooter>
    </Card>
  );
};

// Internal section for Upcoming Events
const UpcomingEventsSection = () => {
  // Mock upcoming events
  const events = [
    {
      id: '1',
      title: 'Méditation de groupe',
      date: '2023-05-20T15:00:00Z',
      participants: 8
    },
    {
      id: '2',
      title: 'Atelier gestion du stress',
      date: '2023-05-25T14:30:00Z',
      participants: 12
    }
  ];

  const formatEventDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Événements à venir</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-0">
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-muted-foreground/10 flex flex-col items-center justify-center">
                <span className="text-xs font-medium">
                  {new Date(event.date).toLocaleDateString('fr-FR', { day: '2-digit' })}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium">{event.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Clock className="h-3 w-3" />
                  <span>{formatEventDate(event.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="ghost" size="sm" className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          Voir tous les événements
        </Button>
      </CardFooter>
    </Card>
  );
};

export const UserDashboardSections = {
  PopularSessionsSection,
  RecentActivitySection,
  UpcomingEventsSection
};
