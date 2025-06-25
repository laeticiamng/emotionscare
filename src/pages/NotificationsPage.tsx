
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, Settings, Eye, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { useNotificationsFeed } from '@/hooks/useNotificationsFeed';
import { useResend } from '@/hooks/useResend';
import ActionButton from '@/components/buttons/ActionButton';
import { toast } from 'sonner';

const NotificationsPage: React.FC = () => {
  const { notifications, isLoading, markAsRead, unreadCount } = useNotificationsFeed();
  const { sendEmail, isLoading: isSendingEmail } = useResend();
  const [emailEnabled, setEmailEnabled] = useState(false);

  const handleToggleEmailNotifications = async (enabled: boolean) => {
    setEmailEnabled(enabled);
    
    if (enabled) {
      toast.success('Notifications email activées');
    } else {
      toast.info('Notifications email désactivées');
    }
  };

  const handleViewReminders = () => {
    toast.info('Chargement des rappels personnalisés...');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Sparkles className="w-5 h-5 text-yellow-500" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'suggestion':
        return <Eye className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800';
      case 'reminder':
        return 'bg-blue-100 text-blue-800';
      case 'suggestion':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4" data-testid="page-root">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="w-8 h-8 text-blue-600" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-2">
                Restez informé de vos progrès et recevez des rappels personnalisés
              </p>
            </div>
            
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {/* Actions principales */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold">Rappels IA</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Recevez des suggestions personnalisées basées sur votre humeur et vos habitudes
                </p>
                <ActionButton
                  onClick={handleViewReminders}
                  icon={<Eye className="w-5 h-5" />}
                  variant="primary"
                  isLoading={isLoading}
                >
                  Voir rappels
                </ActionButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold">Notifications Email</h3>
                  </div>
                  <Switch
                    checked={emailEnabled}
                    onCheckedChange={handleToggleEmailNotifications}
                  />
                </div>
                <p className="text-gray-600 mb-4">
                  Recevez vos notifications importantes par email
                </p>
                {emailEnabled && (
                  <div className="text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Notifications email activées
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Liste des notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Feed de notifications</span>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Préférences
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border rounded-lg animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune notification pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg transition-all hover:shadow-md ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {notification.timestamp.toLocaleString('fr-FR')}
                        </span>
                        
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Marquer comme lu
                            </Button>
                          )}
                          
                          {notification.actionButton && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={notification.actionButton.action}
                            >
                              {notification.actionButton.text}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
