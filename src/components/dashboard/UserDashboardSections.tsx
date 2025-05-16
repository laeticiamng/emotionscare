
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { VRSessionTemplate } from '@/types/vr';
import { Clock, Book, Music, Scan, MessagesSquare, HeartPulse, Calendar, Users, ChevronRight } from 'lucide-react';

export const SessionCard: React.FC<{ session: VRSessionTemplate }> = ({ session }) => {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg w-12 h-12 bg-muted flex items-center justify-center shrink-0">
            <HeartPulse className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{session.title}</h3>
            <p className="text-xs text-muted-foreground">{session.duration / 60} min · {session.emotion_target || session.emotionTarget || 'Bien-être'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PopularSessionsSection: React.FC = () => {
  const navigate = useNavigate();
  
  const popularSessions: VRSessionTemplate[] = [
    {
      id: 'session1',
      title: 'Méditation pleine conscience',
      description: 'Une séance guidée pour se reconnecter au moment présent',
      duration: 600,
      tags: [],
      thumbnailUrl: '/images/meditation.jpg',
      category: 'meditation',
      emotionTarget: 'calme'
    },
    {
      id: 'session2',
      title: 'Respiration 4-7-8',
      description: 'Technique de respiration pour réduire l\'anxiété',
      duration: 300,
      tags: [],
      thumbnailUrl: '/images/breathing.jpg',
      category: 'breathing',
      emotionTarget: 'relaxation'
    }
  ];

  const handleViewAll = () => {
    navigate('/vr');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Sessions populaires</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleViewAll}>
            Voir tout
          </Button>
        </div>
        <CardDescription>Sessions recommandées basées sur votre historique</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {popularSessions.map(session => (
          <div key={session.id} className="cursor-pointer" onClick={() => navigate(`/vr/session/${session.id}`)}>
            <SessionCard session={session} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const RecentActivitySection: React.FC = () => {
  const activities = [
    { id: 1, type: 'journal', title: 'Journal du soir', time: '2h' },
    { id: 2, type: 'music', title: 'Musique apaisante', time: '5h' },
    { id: 3, type: 'coach', title: 'Session de coaching', time: 'hier' }
  ];
  
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'journal': return <Book className="h-4 w-4" />;
      case 'music': return <Music className="h-4 w-4" />;
      case 'scan': return <Scan className="h-4 w-4" />;
      case 'coach': return <MessagesSquare className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>Votre activité sur la plateforme</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-center justify-between py-2 px-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <div className="font-medium text-sm">{activity.title}</div>
                <div className="text-xs text-muted-foreground">Il y a {activity.time}</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const UpcomingEventsSection: React.FC = () => {
  const events = [
    { id: 1, title: 'Bilan hebdomadaire', date: 'Demain, 15:00' },
    { id: 2, title: 'Nouvelle méditation guidée', date: 'Jeudi, 10:00' }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Événements à venir</CardTitle>
        <CardDescription>Votre planning des prochains jours</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {events.map(event => (
          <div key={event.id} className="flex items-center justify-between py-2 px-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-sm">{event.title}</div>
                <div className="text-xs text-muted-foreground">{event.date}</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const TeamActivitySection: React.FC = () => {
  const teamActivities = [
    { id: 1, name: 'Anne', activity: 'a complété une session de respiration', time: '30 min' },
    { id: 2, name: 'Marc', activity: 'a atteint un objectif de méditation', time: '1h' }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Activité de l'équipe</CardTitle>
        <CardDescription>Suivez les progrès de votre équipe</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {teamActivities.map(item => (
          <div key={item.id} className="flex items-center justify-between py-2 px-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-sm">{item.name} <span className="font-normal">{item.activity}</span></div>
                <div className="text-xs text-muted-foreground">Il y a {item.time}</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const LevelSection: React.FC = () => {
  const currentLevel = {
    points: 1250,
    level: 5,
    rewards: ['Badge "Explorateur émotionnel"', 'Nouvelles méditations']
  };
  
  const nextLevel = {
    points: 1500,
    level: 6,
    rewards: ['Badge "Maître de soi"', 'Accès à des sessions premium']
  };
  
  const progress = ((currentLevel.points) / nextLevel.points) * 100;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Votre niveau</CardTitle>
        <CardDescription>Niveau {currentLevel.level} · {currentLevel.points} points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full bg-muted rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Niveau {currentLevel.level}</span>
            <span>{nextLevel.points - currentLevel.points} points pour niveau {nextLevel.level}</span>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Récompenses du prochain niveau :</h4>
            <ul className="text-sm space-y-1">
              {nextLevel.rewards.map((reward, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  {reward}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const UserDashboardSections = {
  PopularSessionsSection,
  RecentActivitySection,
  UpcomingEventsSection,
  TeamActivitySection,
  LevelSection
};

export default UserDashboardSections;
