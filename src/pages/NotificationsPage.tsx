
import React, { useState } from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, MessageCircle, AlertCircle, Clock } from 'lucide-react';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Votre rapport hebdomadaire est prêt',
      message: 'Découvrez les insights de votre semaine',
      time: '1h',
      read: false
    },
    {
      id: 2,
      type: 'message',
      title: 'Nouveau message du support',
      message: 'Bonjour, suite à votre demande...',
      time: '3h',
      read: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Session complétée',
      message: 'Vous avez complété votre session de méditation',
      time: '1j',
      read: false
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Rappel: séance musicale',
      message: 'Votre séance de musicothérapie commence dans 30 minutes',
      time: '2j',
      read: true
    }
  ];
  
  const getTabNotifications = (tabName: string) => {
    if (tabName === 'all') return notifications;
    if (tabName === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === tabName);
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Shell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="unread">Non lues</TabsTrigger>
              <TabsTrigger value="alert">Alertes</TabsTrigger>
              <TabsTrigger value="message">Messages</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">Tout marquer comme lu</Button>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {activeTab === 'all' 
                    ? 'Toutes les notifications' 
                    : activeTab === 'unread' 
                      ? 'Notifications non lues' 
                      : `Notifications de type ${activeTab}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getTabNotifications(activeTab).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune notification pour le moment
                  </div>
                ) : (
                  getTabNotifications(activeTab).map(notification => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start p-3 rounded-md border ${notification.read ? 'bg-background' : 'bg-muted/50'}`}
                    >
                      <div className="mr-3 mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className={`font-medium ${notification.read ? '' : 'text-foreground'}`}>{notification.title}</h3>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default NotificationsPage;
