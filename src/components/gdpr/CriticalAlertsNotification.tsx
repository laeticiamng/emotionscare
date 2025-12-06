import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GDPRAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string | null;
  metadata: any;
  user_id: string | null;
  resolved: boolean;
  created_at: string;
}

interface CriticalAlertsNotificationProps {
  alerts: GDPRAlert[];
  onResolve: (alertId: string) => void;
  onViewAll: () => void;
}

/**
 * Bannière de notification persistante pour les alertes RGPD critiques
 * Affichée en haut de la page tant qu'il y a des alertes non résolues
 */
export const CriticalAlertsNotification: React.FC<CriticalAlertsNotificationProps> = ({
  alerts,
  onResolve,
  onViewAll,
}) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (alerts.length === 0 || dismissed) {
    return null;
  }

  const firstAlert = alerts[0];
  const additionalCount = alerts.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <div className="container mx-auto px-4 pt-4 pointer-events-auto">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(239, 68, 68, 0.4)',
                '0 0 0 8px rgba(239, 68, 68, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
            }}
            className="bg-destructive text-destructive-foreground rounded-lg shadow-lg p-4"
          >
            <div className="flex items-start gap-4">
              {/* Icône animée */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                className="flex-shrink-0"
              >
                <AlertTriangle className="h-6 w-6" />
              </motion.div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">
                    🚨 Alerte RGPD Critique
                  </h3>
                  <Badge variant="outline" className="bg-destructive-foreground/10">
                    {alerts.length} {alerts.length > 1 ? 'alertes' : 'alerte'}
                  </Badge>
                </div>
                <p className="text-sm opacity-90">
                  {firstAlert.title}
                  {additionalCount > 0 && (
                    <span className="ml-2 font-medium">
                      + {additionalCount} autre{additionalCount > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
                {firstAlert.description && (
                  <p className="text-xs opacity-75 mt-1 line-clamp-1">
                    {firstAlert.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onViewAll}
                  className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
                >
                  Voir tout
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onResolve(firstAlert.id)}
                  className="hover:bg-destructive-foreground/10"
                >
                  Résoudre
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setDismissed(true)}
                  className="h-8 w-8 hover:bg-destructive-foreground/10"
                  aria-label="Fermer la notification"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CriticalAlertsNotification;
