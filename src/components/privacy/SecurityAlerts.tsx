
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

// Sample data - in a real app this would come from an API
const alerts = [
  {
    id: '1',
    severity: 'warning',
    title: 'Tentative de connexion inhabituelle',
    description: 'Une tentative de connexion a été détectée depuis une nouvelle localisation.',
    date: '2025-05-18T10:45:22',
    isNew: true,
    actionRequired: true,
    actionText: 'Vérifier'
  },
  {
    id: '2',
    severity: 'info',
    title: 'Mise à jour de la politique de confidentialité',
    description: 'Notre politique de confidentialité a été mise à jour. Veuillez la consulter.',
    date: '2025-05-15T14:30:10',
    isNew: false,
    actionRequired: false
  },
  {
    id: '3',
    severity: 'critical',
    title: 'Changement de mot de passe recommandé',
    description: 'Pour votre sécurité, nous vous recommandons de changer votre mot de passe régulièrement.',
    date: '2025-05-10T09:15:43',
    isNew: false,
    actionRequired: true,
    actionText: 'Changer'
  }
];

const SecurityAlerts: React.FC = () => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Critique</Badge>;
      case 'warning':
        return <Badge variant="warning" className="flex items-center gap-1 bg-yellow-500 text-white"><AlertTriangle className="h-3 w-3" /> Attention</Badge>;
      case 'info':
      default:
        return <Badge variant="secondary" className="flex items-center gap-1"><Info className="h-3 w-3" /> Information</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alertes de sécurité
          </CardTitle>
          <CardDescription>
            Soyez informé des événements importants concernant votre compte et vos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <ShieldCheck className="mx-auto h-12 w-12 text-green-500 opacity-50" />
              <p className="mt-2 text-muted-foreground">Aucune alerte de sécurité active</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {alerts.map((alert) => (
                <motion.li
                  key={alert.id}
                  initial={alert.isNew ? { backgroundColor: 'rgba(59, 130, 246, 0.1)' } : {}}
                  animate={{ backgroundColor: 'transparent' }}
                  transition={{ duration: 5 }}
                  className={`
                    p-4 rounded-lg border 
                    ${alert.severity === 'critical' ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/10' : 
                      alert.severity === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/10' : 
                      'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/10'}
                  `}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getSeverityBadge(alert.severity)}
                        {alert.isNew && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(alert.date)}</p>
                    </div>
                    {alert.actionRequired && (
                      <Button size="sm" className={alert.severity === 'critical' ? 'bg-red-500 hover:bg-red-600' : ''}>
                        {alert.actionText || 'Voir'}
                      </Button>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SecurityAlerts;
