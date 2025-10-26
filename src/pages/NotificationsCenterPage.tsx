// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, Trash2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationsCenterPage() {
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, type: 'achievement', title: 'Nouveau badge débloqué !', message: 'Vous avez obtenu le badge "Méditant Dévoué"', time: '5 min', read: false },
    { id: 2, type: 'reminder', title: 'Session du jour', message: 'N\'oubliez pas votre session de méditation', time: '1h', read: false },
    { id: 3, type: 'social', title: 'Nouveau défi', message: 'Alice vous a invité à rejoindre un défi', time: '2h', read: true },
    { id: 4, type: 'goal', title: 'Objectif atteint', message: 'Vous avez complété votre objectif hebdomadaire', time: '1j', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-8 w-8" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">Centre de notifications</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/settings/notifications')}>
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </header>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Toutes les Notifications</CardTitle>
              <Button variant="ghost" size="sm">
                <Check className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
                <TabsTrigger value="read">Lues</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border rounded-lg ${!notif.read ? 'bg-accent/50 border-primary' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{notif.title}</h3>
                          {!notif.read && <Badge variant="default" className="text-xs">Nouveau</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">Il y a {notif.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="unread" className="space-y-3">
                {notifications.filter(n => !n.read).map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 border rounded-lg bg-accent/50 border-primary"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{notif.title}</h3>
                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">Il y a {notif.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="read" className="space-y-3">
                {notifications.filter(n => n.read).map((notif) => (
                  <div key={notif.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{notif.title}</h3>
                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">Il y a {notif.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
