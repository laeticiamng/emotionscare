// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Bell, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/lib/routes';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
  const { toast } = useToast();
  const [isNotifying, setIsNotifying] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);

  const handleNotify = async () => {
    try {
      setIsNotifying(true);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Connectez-vous d\'abord',
          description: 'Vous devez être connecté pour recevoir des notifications.',
          variant: 'destructive',
        });
        return;
      }

      // Enregistrer la notification dans la base de données
      const { error } = await supabase
        .from('coming_soon_notifications')
        .insert({
          user_id: user.id,
          module_name: moduleName,
          email: user.email,
        })
        .select()
        .single();

      if (error) {
        if (error.code !== '23505') { // Ignore duplicate key error
          throw error;
        }
      }

      setHasNotified(true);

      toast({
        title: 'ça marche! 🎉',
        description: `Vous serez averti dès que ${moduleName} sera disponible.`,
      });

      logger.info('Notification enregistrée pour:', { moduleName, userId: user.id }, 'UI');
    } catch (error) {
      logger.error('Erreur enregistrement notification', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer votre notification.',
        variant: 'destructive',
      });
    } finally {
      setIsNotifying(false);
    }
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
              <Button
                onClick={handleNotify}
                variant="default"
                className="flex-1"
                disabled={hasNotified || isNotifying}
              >
                {hasNotified ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Notification enregistrée
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    {isNotifying ? 'En cours...' : 'Me prévenir'}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;
