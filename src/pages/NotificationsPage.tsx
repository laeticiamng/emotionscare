
import React, { useState, useEffect } from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, MessageCircle, AlertCircle, Clock, CheckCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Notification {
  id: number;
  type: 'alert' | 'message' | 'success' | 'reminder';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call like:
        // const response = await fetch('/api/notifications');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = [
          {
            id: 1,
            type: 'alert' as const,
            title: 'Votre rapport hebdomadaire est prêt',
            message: 'Découvrez les insights de votre semaine',
            time: '1h',
            read: false
          },
          {
            id: 2,
            type: 'message' as const,
            title: 'Nouveau message du support',
            message: 'Bonjour, suite à votre demande...',
            time: '3h',
            read: true
          },
          {
            id: 3,
            type: 'success' as const,
            title: 'Session complétée',
            message: 'Vous avez complété votre session de méditation',
            time: '1j',
            read: false
          },
          {
            id: 4,
            type: 'reminder' as const,
            title: 'Rappel: séance musicale',
            message: 'Votre séance de musicothérapie commence dans 30 minutes',
            time: '2j',
            read: true
          }
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setNotifications(mockData);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Une erreur est survenue lors de la récupération des notifications. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);
  
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
  
  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      
      // In a real app, this would be an API call like:
      // await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      
      toast.success('Toutes les notifications ont été marquées comme lues');
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };
  
  const handleMarkAsRead = async (id: number) => {
    try {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      
      // In a real app, this would be an API call like:
      // await fetch(`/api/notifications/${id}/mark-read`, { method: 'POST' });
      
      toast.success('Notification marquée comme lue');
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const tabLabel = (tabName: string) => {
    const count = tabName === 'unread' 
      ? notifications.filter(n => !n.read).length 
      : tabName === 'all'
        ? notifications.length
        : notifications.filter(n => n.type === tabName).length;
        
    return (
      <div className="flex items-center">
        <span>{tabName === 'all' ? 'Toutes' : tabName === 'unread' ? 'Non lues' : tabName === 'alert' ? 'Alertes' : 'Messages'}</span>
        {count > 0 && <span className="ml-2 bg-primary text-primary-foreground rounded-full h-5 min-w-5 flex items-center justify-center text-xs">{count}</span>}
      </div>
    );
  };

  return (
    <Shell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Bell className="h-7 w-7 mr-2" /> Notifications
        </h1>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">{tabLabel('all')}</TabsTrigger>
              <TabsTrigger value="unread">{tabLabel('unread')}</TabsTrigger>
              <TabsTrigger value="alert">{tabLabel('alert')}</TabsTrigger>
              <TabsTrigger value="message">{tabLabel('message')}</TabsTrigger>
            </TabsList>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={!notifications.some(n => !n.read) || isLoading}
              className="flex items-center"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {activeTab === 'all' 
                    ? 'Toutes les notifications' 
                    : activeTab === 'unread' 
                      ? 'Notifications non lues' 
                      : activeTab === 'alert'
                        ? 'Alertes'
                        : 'Messages'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center py-10"
                    >
                      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                      <p className="text-muted-foreground">Chargement de vos notifications...</p>
                    </motion.div>
                  ) : error ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center py-10"
                    >
                      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
                      <p className="text-center text-muted-foreground mb-4">{error}</p>
                      <Button onClick={() => window.location.reload()}>Réessayer</Button>
                    </motion.div>
                  ) : getTabNotifications(activeTab).length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center py-10"
                    >
                      <Bell className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="text-center text-muted-foreground">
                        Aucune notification {activeTab === 'unread' ? 'non lue' : ''} pour le moment
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {getTabNotifications(activeTab).map(notification => (
                        <motion.div 
                          key={notification.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex items-start p-4 rounded-md border ${notification.read ? 'bg-background' : 'bg-muted/50'}`}
                        >
                          <div className="mr-3 mt-1">{getIcon(notification.type)}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className={`font-medium ${notification.read ? '' : 'text-foreground'}`}>{notification.title}</h3>
                              <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{notification.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 mb-2">{notification.message}</p>
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs h-7"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Marquer comme lue
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default NotificationsPage;
