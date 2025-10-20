import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/lib/routes';
import { logger } from '@/lib/logger';

interface ComingSoonProps {
  moduleName: string;
  description: string;
  icon?: React.ReactNode;
  features?: string[];
  estimatedRelease?: string;
  notifyEnabled?: boolean;
  className?: string;
}

/**
 * Composant Coming Soon réutilisable pour modules en développement
 */
export const ComingSoon: React.FC<ComingSoonProps> = ({
  moduleName,
  description,
  icon,
  features = [],
  estimatedRelease,
  notifyEnabled = false,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleNotify = () => {
    // TODO: Implémenter notification système
    logger.info('Notification demandée pour:', { moduleName }, 'UI');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${className}`}>
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          {icon && <div className="flex justify-center text-6xl mb-4">{icon}</div>}
          <CardTitle className="text-3xl font-bold">{moduleName}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
          <Badge variant="secondary" className="mx-auto">
            En développement
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Fonctionnalités à venir</h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {estimatedRelease && (
            <div className="flex items-center gap-2 p-4 bg-secondary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Disponibilité estimée</p>
                <p className="text-sm text-muted-foreground">{estimatedRelease}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => navigate(routes.b2c.home())}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au dashboard
            </Button>

            {notifyEnabled && (
              <Button onClick={handleNotify} variant="default" className="flex-1">
                <Bell className="mr-2 h-4 w-4" />
                Me prévenir
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;
