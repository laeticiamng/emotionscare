/**
 * Carte de notification individuelle
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle,
  Trophy,
  Users,
  Settings,
  Clock,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Notification, NotificationType } from '../types';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

const typeConfig: Record<NotificationType, { icon: React.ComponentType<{ className?: string }>, color: string }> = {
  info: { icon: Info, color: 'text-info' },
  success: { icon: CheckCircle, color: 'text-success' },
  warning: { icon: AlertTriangle, color: 'text-warning' },
  error: { icon: XCircle, color: 'text-destructive' },
  reminder: { icon: Clock, color: 'text-primary' },
  achievement: { icon: Trophy, color: 'text-amber-500' },
  social: { icon: Users, color: 'text-violet-500' },
  system: { icon: Settings, color: 'text-muted-foreground' },
};

export function NotificationCard({ 
  notification, 
  onMarkAsRead, 
  onDismiss,
  onClick 
}: NotificationCardProps) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        notification.read ? 'opacity-70' : 'border-l-4 border-l-primary'
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full bg-muted ${config.color}`}>
            <Icon className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium text-sm leading-tight">
                  {notification.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {notification.message}
                </p>
              </div>

              {!notification.read && (
                <Badge variant="default" className="shrink-0">
                  Nouveau
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(notification.createdAt, { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </span>

              <div className="flex items-center gap-2">
                {notification.actionUrl && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(notification.actionUrl, '_blank');
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {notification.actionLabel || 'Voir'}
                  </Button>
                )}

                {onDismiss && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(notification.id);
                    }}
                  >
                    Ignorer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
