// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, Trash2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotificationsCenterPage() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
    clearAll,
  } = useNotifications();

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  const renderNotification = (notif: typeof notifications[0], showMarkRead = false) => (
    <div
      key={notif.id}
      className={`p-4 border rounded-lg transition-colors ${!notif.read ? 'bg-accent/50 border-primary' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => markAsRead(notif.id)}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{notif.title}</h3>
            {!notif.read && <Badge variant="default" className="text-xs">Nouveau</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{notif.message}</p>
          <p className="text-xs text-muted-foreground mt-2">{formatTime(notif.createdAt)}</p>
          {notif.actionUrl && (
            <Button
              variant="link"
              size="sm"
              className="px-0 mt-1"
              onClick={(e) => {
                e.stopPropagation();
                navigate(notif.actionUrl!);
              }}
            >
              {notif.actionLabel || 'Voir'}
            </Button>
          )}
        </div>
        <div className="flex gap-1">
          {showMarkRead && !notif.read && (
            <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)} title="Marquer comme lu">
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => dismiss(notif.id)} title="Supprimer">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

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
          <div className="flex gap-2">
            {notifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Tout effacer
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/settings/notifications')}>
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </header>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Toutes les Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Tout marquer comme lu
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
                <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
                <TabsTrigger value="read">Lues ({notifications.length - unreadCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Aucune notification</p>
                ) : notifications.map((n) => renderNotification(n, true))}
              </TabsContent>

              <TabsContent value="unread" className="space-y-3">
                {notifications.filter(n => !n.read).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Aucune notification non lue</p>
                ) : notifications.filter(n => !n.read).map((n) => renderNotification(n, true))}
              </TabsContent>

              <TabsContent value="read" className="space-y-3">
                {notifications.filter(n => n.read).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Aucune notification lue</p>
                ) : notifications.filter(n => n.read).map((n) => renderNotification(n))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
