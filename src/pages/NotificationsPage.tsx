
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Shield, Users, Settings } from 'lucide-react';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();

  const getPageTitle = () => {
    switch (user?.role) {
      case 'b2b_admin':
        return 'Centre de Notifications - Administration RH';
      case 'b2b_user':
        return 'Centre de Notifications - Collaborateur';
      case 'b2c':
        return 'Centre de Notifications - Personnel';
      default:
        return 'Centre de Notifications';
    }
  };

  const getRoleSpecificFeatures = () => {
    switch (user?.role) {
      case 'b2b_admin':
        return [
          { icon: Shield, label: 'Alertes sécurité', count: 3 },
          { icon: Users, label: 'Notifications équipe', count: 12 },
          { icon: Settings, label: 'Alertes système', count: 1 }
        ];
      case 'b2b_user':
        return [
          { icon: Bell, label: 'Notifications personnelles', count: 5 },
          { icon: Users, label: 'Messages équipe', count: 8 },
          { icon: Settings, label: 'Préférences', count: 0 }
        ];
      case 'b2c':
        return [
          { icon: Bell, label: 'Notifications personnelles', count: 7 },
          { icon: Shield, label: 'Sécurité compte', count: 1 },
          { icon: Settings, label: 'Préférences', count: 0 }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
            <p className="text-muted-foreground">
              Gérez toutes vos notifications et préférences de communication
            </p>
          </div>
          <Badge variant="outline" className="capitalize">
            {user?.role?.replace('_', ' ')}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {getRoleSpecificFeatures().map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{feature.label}</span>
                    </div>
                    {feature.count > 0 && (
                      <Badge variant="secondary">
                        {feature.count}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Notification Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NotificationCenter />
        </motion.div>

        {/* Role-specific information */}
        {user?.role === 'b2b_admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Informations Administrateur RH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  En tant qu'administrateur RH, vous recevez des notifications prioritaires concernant 
                  la sécurité, les rapports d'équipe et les alertes système. Vous pouvez également 
                  configurer les paramètres de notification pour votre organisation.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
