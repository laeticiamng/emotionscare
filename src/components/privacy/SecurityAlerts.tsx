
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertTriangle, CheckCircle, Bell, 
  Lock, Eye, Globe, Smartphone, Mail, Settings 
} from 'lucide-react';
import { toast } from 'sonner';

interface SecurityAlert {
  id: string;
  type: 'security' | 'privacy' | 'compliance' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  action?: string;
}

const SecurityAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'security',
      severity: 'medium',
      title: 'Nouvelle connexion détectée',
      description: 'Connexion depuis un nouvel appareil (Chrome, Windows)',
      timestamp: new Date().toISOString(),
      resolved: false,
      action: 'Vérifier l\'appareil'
    },
    {
      id: '2',
      type: 'privacy',
      severity: 'low',
      title: 'Mise à jour des paramètres de confidentialité',
      description: 'Vos préférences de partage de données ont été modifiées',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      resolved: true
    },
    {
      id: '3',
      type: 'compliance',
      severity: 'high',
      title: 'Demande d\'export de données',
      description: 'Une demande d\'export RGPD est en cours de traitement',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      resolved: false,
      action: 'Suivre la demande'
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    securityEvents: true,
    privacyChanges: true,
    complianceUpdates: false
  });

  const severityColors = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  };

  const typeIcons = {
    security: Shield,
    privacy: Eye,
    compliance: CheckCircle,
    system: Settings
  };

  const typeColors = {
    security: 'text-red-600',
    privacy: 'text-blue-600',
    compliance: 'text-green-600',
    system: 'text-gray-600'
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    toast.success('Alerte marquée comme résolue');
  };

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success('Paramètres de notification mis à jour');
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  return (
    <div className="space-y-6">
      {/* Résumé des alertes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">
              {alerts.filter(a => a.severity === 'critical').length}
            </div>
            <div className="text-sm text-red-600">Critiques</div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">
              {alerts.filter(a => a.severity === 'high').length}
            </div>
            <div className="text-sm text-orange-600">Élevées</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-700">
              {alerts.filter(a => a.severity === 'medium').length}
            </div>
            <div className="text-sm text-yellow-600">Moyennes</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">
              {resolvedAlerts.length}
            </div>
            <div className="text-sm text-green-600">Résolues</div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes actives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertes Actives ({unresolvedAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {unresolvedAlerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>Aucune alerte active</p>
                <p className="text-sm">Votre compte est sécurisé</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {unresolvedAlerts.map((alert, index) => {
                  const TypeIcon = typeIcons[alert.type];
                  
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Alert className={severityColors[alert.severity]}>
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-start gap-3">
                            <TypeIcon className={`h-5 w-5 ${typeColors[alert.type]} mt-0.5`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{alert.title}</h4>
                                <Badge className={severityColors[alert.severity]}>
                                  {alert.severity}
                                </Badge>
                              </div>
                              <AlertDescription>{alert.description}</AlertDescription>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(alert.timestamp).toLocaleString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {alert.action && (
                              <Button size="sm" variant="outline">
                                {alert.action}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              Résoudre
                            </Button>
                          </div>
                        </div>
                      </Alert>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Paramètres de notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Paramètres de Notification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-600" />
                <div>
                  <label className="font-medium">Alertes par email</label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les alertes importantes par email
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.emailAlerts}
                onCheckedChange={() => handleNotificationToggle('emailAlerts')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-green-600" />
                <div>
                  <label className="font-medium">Notifications push</label>
                  <p className="text-sm text-muted-foreground">
                    Notifications en temps réel sur vos appareils
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={() => handleNotificationToggle('pushNotifications')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-red-600" />
                <div>
                  <label className="font-medium">Événements de sécurité</label>
                  <p className="text-sm text-muted-foreground">
                    Alertes pour les connexions et activités suspectes
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.securityEvents}
                onCheckedChange={() => handleNotificationToggle('securityEvents')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-blue-600" />
                <div>
                  <label className="font-medium">Modifications de confidentialité</label>
                  <p className="text-sm text-muted-foreground">
                    Changements dans vos paramètres de confidentialité
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.privacyChanges}
                onCheckedChange={() => handleNotificationToggle('privacyChanges')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <label className="font-medium">Mises à jour de conformité</label>
                  <p className="text-sm text-muted-foreground">
                    Changements dans les politiques et la conformité RGPD
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.complianceUpdates}
                onCheckedChange={() => handleNotificationToggle('complianceUpdates')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes résolues */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Alertes Résolues ({resolvedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resolvedAlerts.slice(0, 5).map((alert, index) => {
                const TypeIcon = typeIcons[alert.type];
                
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg opacity-75"
                  >
                    <TypeIcon className={`h-4 w-4 ${typeColors[alert.type]}`} />
                    <div className="flex-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityAlerts;
