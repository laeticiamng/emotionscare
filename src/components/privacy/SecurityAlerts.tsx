
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bell, AlertTriangle, Shield, CheckCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface SecurityAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  date: string;
  isNew: boolean;
  actionText?: string;
}

const SecurityAlerts: React.FC = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading alerts
    const timeout = setTimeout(() => {
      setAlerts([
        {
          id: '1',
          severity: 'warning',
          title: 'Nouvelle connexion depuis un appareil inconnu',
          description: 'Une connexion a été détectée depuis Paris, France sur un nouvel appareil le 18/05/2025.',
          date: '2025-05-18T14:23:00Z',
          isNew: true,
          actionText: 'Vérifier l\'appareil'
        },
        {
          id: '2',
          severity: 'info',
          title: 'Mise à jour de la politique de confidentialité',
          description: 'Notre politique de confidentialité a été mise à jour. Veuillez la consulter.',
          date: '2025-05-10T09:15:00Z',
          isNew: false,
          actionText: 'Consulter'
        }
      ]);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast({
      title: "Alerte ignorée",
      description: "L'alerte a été retirée de votre liste.",
      variant: "success",
    });
  };

  const handleAlertAction = (alert: SecurityAlert) => {
    toast({
      title: "Action en cours",
      description: `Action "${alert.actionText}" pour l'alerte "${alert.title}"`,
      variant: "default",
    });
    
    // Mark as read
    setAlerts(prev => 
      prev.map(a => 
        a.id === alert.id 
          ? { ...a, isNew: false } 
          : a
      )
    );
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alertes de sécurité
          </CardTitle>
          <CardDescription>
            Soyez informé des événements importants concernant la sécurité de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Shield className="h-12 w-12 text-muted-foreground/50" />
              </motion.div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="py-8 text-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-medium">Tout est sécurisé</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Aucune alerte de sécurité à afficher
                </p>
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <Alert className={`relative mb-4 ${getSeverityColor(alert.severity)}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                      onClick={() => handleDismissAlert(alert.id)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Fermer</span>
                    </Button>
                    
                    {getSeverityIcon(alert.severity)}
                    <div className="flex items-center gap-2">
                      <AlertTitle>{alert.title}</AlertTitle>
                      {alert.isNew && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 10,
                          }}
                        >
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Nouveau
                          </span>
                        </motion.div>
                      )}
                    </div>
                    <AlertDescription className="mt-2 space-y-3">
                      <p>{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-70">{formatDate(alert.date)}</span>
                        {alert.actionText && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => handleAlertAction(alert)}
                          >
                            {alert.actionText}
                          </Button>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">
              Dernière vérification: {new Date().toLocaleTimeString()}
            </span>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Vérifier maintenant
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SecurityAlerts;
