
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Info, CheckCircle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Sample alerts - this would come from the backend in a real app
const sampleAlerts = [
  {
    id: '1',
    severity: 'info',
    title: 'Mise à jour de sécurité',
    description: 'Nous avons mis à jour nos protocoles de sécurité pour mieux protéger vos données.',
    date: '2025-05-15T10:30:00Z',
    isNew: true,
  },
  {
    id: '2',
    severity: 'warning',
    title: 'Nouvelle connexion détectée',
    description: 'Connexion depuis un nouvel appareil le 18/05/2025 à 15:42. Si ce n\'était pas vous, veuillez sécuriser votre compte.',
    date: '2025-05-18T15:45:00Z',
    isNew: true,
    actionRequired: true,
    actionText: 'Vérifier la connexion',
  }
];

const SecurityAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState(sampleAlerts);

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isNew: false } : alert
    ));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alertes de sécurité
          </CardTitle>
          <CardDescription className="flex justify-between items-center">
            <span>Restez informé des événements importants concernant votre compte</span>
            {alerts.some(alert => alert.isNew) && (
              <Badge variant="success" className="animate-pulse">
                Nouvelles alertes
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-6">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">Aucune alerte de sécurité pour le moment</p>
            </div>
          ) : (
            <motion.div className="space-y-4" variants={containerVariants}>
              {alerts.map((alert) => (
                <motion.div key={alert.id} variants={itemVariants}>
                  <Alert className={`${alert.isNew ? 'border-l-4 border-l-blue-500' : ''}`}>
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <AlertTitle>{alert.title}</AlertTitle>
                          {alert.isNew && <Badge variant="new" size="sm">Nouveau</Badge>}
                        </div>
                        <AlertDescription className="mt-1">
                          {alert.description}
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>{formatDate(alert.date)}</span>
                          </div>
                        </AlertDescription>
                        {(alert.actionRequired || alert.isNew) && (
                          <div className="mt-2 flex gap-2">
                            {alert.actionRequired && (
                              <Button variant="outline" size="sm">
                                {alert.actionText || 'Action requise'}
                              </Button>
                            )}
                            {alert.isNew && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => markAsRead(alert.id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" /> Marquer comme lu
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Alert>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SecurityAlerts;
