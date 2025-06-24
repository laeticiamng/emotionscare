
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, Users, Calendar, AlertCircle } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const notifications = [
    { 
      id: 1, 
      title: 'Rappel session bien-être', 
      content: 'N\'oubliez pas votre session de méditation de 15h',
      type: 'reminder',
      status: 'sent',
      recipients: 45,
      date: '2024-01-15 14:30'
    },
    { 
      id: 2, 
      title: 'Nouveau défi bien-être', 
      content: 'Un nouveau défi mensuel vous attend !',
      type: 'challenge',
      status: 'draft',
      recipients: 120,
      date: '2024-01-15 10:00'
    },
    { 
      id: 3, 
      title: 'Rapport hebdomadaire disponible', 
      content: 'Consultez votre rapport de bien-être de la semaine',
      type: 'report',
      status: 'scheduled',
      recipients: 80,
      date: '2024-01-16 09:00'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centre de Notifications</h1>
          <p className="text-muted-foreground">
            Gérez et envoyez des notifications aux utilisateurs
          </p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Nouvelle Notification
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Envoyées Aujourd'hui</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12% vs hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Ouverture</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5% vs semaine dernière</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programmées</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Pour cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Échec</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Notifications non délivrées</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications Récentes</CardTitle>
          <CardDescription>Historique des notifications envoyées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between border-b pb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{notification.title}</h4>
                    <Badge variant={
                      notification.type === 'reminder' ? 'default' : 
                      notification.type === 'challenge' ? 'secondary' : 'outline'
                    }>
                      {notification.type === 'reminder' ? 'Rappel' : 
                       notification.type === 'challenge' ? 'Défi' : 'Rapport'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.content}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{notification.recipients} destinataires</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{notification.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    notification.status === 'sent' ? 'default' : 
                    notification.status === 'scheduled' ? 'secondary' : 'outline'
                  }>
                    {notification.status === 'sent' ? 'Envoyée' : 
                     notification.status === 'scheduled' ? 'Programmée' : 'Brouillon'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Voir détails
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

export default NotificationsPage;
