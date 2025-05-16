
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CalendarDays, Clock, Users, BarChart } from 'lucide-react';

// Données fictives pour l'activité des utilisateurs
const activityData = {
  activeUsers: {
    total: 156,
    change: +12,
    trend: 'up'
  },
  newUsers: {
    total: 28,
    change: +5,
    trend: 'up'
  },
  dailyActiveUsers: [
    { date: 'Lun', count: 120 },
    { date: 'Mar', count: 132 },
    { date: 'Mer', count: 125 },
    { date: 'Jeu', count: 140 },
    { date: 'Ven', count: 156 },
  ],
  recentActivities: [
    { 
      id: '1', 
      user: { name: 'Sophie Martin', avatar: '/avatars/sophie.jpg', initials: 'SM' },
      action: 'a complété un scan émotionnel',
      time: '5 minutes',
      value: '+25 pts'
    },
    { 
      id: '2', 
      user: { name: 'Thomas Dubois', avatar: '/avatars/thomas.jpg', initials: 'TD' },
      action: 'a gagné un badge "Première semaine"',
      time: '12 minutes',
      value: 'Badge'
    },
    { 
      id: '3', 
      user: { name: 'Julia Leroy', avatar: '/avatars/julia.jpg', initials: 'JL' },
      action: 'a complété un défi "Journal quotidien"',
      time: '45 minutes',
      value: '+75 pts'
    },
    { 
      id: '4', 
      user: { name: 'Marc Dupont', avatar: '/avatars/marc.jpg', initials: 'MD' },
      action: 'a rejoint une équipe',
      time: '2 heures',
      value: 'Équipe'
    },
    { 
      id: '5', 
      user: { name: 'Clara Moreau', avatar: '/avatars/clara.jpg', initials: 'CM' },
      action: 'a participé à une session VR',
      time: '3 heures',
      value: '+50 pts'
    }
  ],
  topFeatures: [
    { name: 'Scan émotionnel', usage: 68 },
    { name: 'Journal', usage: 54 },
    { name: 'Sessions VR', usage: 42 },
    { name: 'Challenges', usage: 36 },
    { name: 'Social', usage: 29 }
  ]
};

const ActivityTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* KPIs row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activityData.activeUsers.total}</div>
              <Badge variant={activityData.activeUsers.trend === 'up' ? 'success' : 'error'}>
                {activityData.activeUsers.change > 0 ? '+' : ''}{activityData.activeUsers.change}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs période précédente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activityData.newUsers.total}</div>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">derniers 7 jours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">18:24</div>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">par session</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">74%</div>
              <BarChart className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">des défis acceptés</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity feed and top features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>
              Dernières actions des utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {activityData.recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{activity.user.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    {activity.value}
                  </Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    il y a {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Fonctionnalités populaires</CardTitle>
            <CardDescription>
              Pourcentage d'utilisateurs actifs par fonctionnalité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityData.topFeatures.map(feature => (
                <div key={feature.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{feature.name}</span>
                    <span className="text-xs text-muted-foreground">{feature.usage}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${feature.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Weekly trends */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tendance hebdomadaire</CardTitle>
            <CardDescription>
              Utilisateurs actifs journaliers
            </CardDescription>
          </div>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between px-4">
            {activityData.dailyActiveUsers.map(day => (
              <div key={day.date} className="flex flex-col items-center">
                <div 
                  className="w-12 bg-primary/20 rounded-t-lg relative overflow-hidden"
                  style={{ height: `${day.count / 2}px` }}
                >
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary"
                    style={{ height: `${day.count / 2}px` }}
                  />
                </div>
                <div className="mt-2 text-xs font-medium">{day.date}</div>
                <div className="text-xs text-muted-foreground">{day.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityTab;
