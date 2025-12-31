/**
 * Widget de notifications et rappels du dashboard
 */
import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Clock, Sparkles, Heart, Brain, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'tip' | 'alert';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  action_url?: string;
}

async function fetchNotifications(userId: string): Promise<Notification[]> {
  // Récupérer les rappels d'activités
  const { data: reminders } = await supabase
    .from('activity_reminders')
    .select('id, activity_id, reminder_time, message, is_active, last_sent_at')
    .eq('user_id', userId)
    .eq('is_active', true)
    .limit(3);

  const notifications: Notification[] = [];

  // Convertir les rappels en notifications
  if (reminders) {
    reminders.forEach(reminder => {
      notifications.push({
        id: `reminder-${reminder.id}`,
        type: 'reminder',
        title: 'Rappel d\'activité',
        message: reminder.message || 'C\'est l\'heure de votre session de bien-être',
        created_at: reminder.last_sent_at || new Date().toISOString(),
        read: false,
        action_url: reminder.activity_id ? `/app/activity/${reminder.activity_id}` : '/app/activities'
      });
    });
  }

  // Ajouter des conseils contextuels basés sur l'heure
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 10) {
    notifications.push({
      id: 'tip-morning',
      type: 'tip',
      title: 'Conseil du matin',
      message: 'Commencez la journée par une respiration profonde pour vous recentrer',
      created_at: new Date().toISOString(),
      read: false,
      action_url: '/app/breath'
    });
  } else if (hour >= 12 && hour < 14) {
    notifications.push({
      id: 'tip-lunch',
      type: 'tip',
      title: 'Pause méridienne',
      message: 'Profitez de votre pause pour un moment de pleine conscience',
      created_at: new Date().toISOString(),
      read: false,
      action_url: '/app/scan'
    });
  } else if (hour >= 21 || hour < 6) {
    notifications.push({
      id: 'tip-evening',
      type: 'tip',
      title: 'Routine du soir',
      message: 'Préparez votre sommeil avec une musique apaisante',
      created_at: new Date().toISOString(),
      read: false,
      action_url: '/app/music'
    });
  }

  // Vérifier s'il y a des achievements récents non vus
  const { data: recentAchievements } = await supabase
    .from('user_achievements')
    .select('id, achievement_id, unlocked_at')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false })
    .limit(1);

  if (recentAchievements && recentAchievements.length > 0) {
    const achievement = recentAchievements[0];
    const unlockedAt = new Date(achievement.unlocked_at);
    const now = new Date();
    // Si débloqué dans les dernières 24h
    if (now.getTime() - unlockedAt.getTime() < 24 * 60 * 60 * 1000) {
      notifications.push({
        id: `achievement-${achievement.id}`,
        type: 'achievement',
        title: 'Nouveau badge débloqué !',
        message: 'Félicitations ! Vous avez gagné une nouvelle récompense',
        created_at: achievement.unlocked_at,
        read: false,
        action_url: '/app/achievements'
      });
    }
  }

  return notifications.slice(0, 4);
}

const iconMap = {
  reminder: Clock,
  achievement: Sparkles,
  tip: Heart,
  alert: Brain
} as const;

const colorMap: Record<Notification['type'], string> = {
  reminder: 'bg-info/10 text-info',
  achievement: 'bg-warning/10 text-warning',
  tip: 'bg-success/10 text-success',
  alert: 'bg-destructive/10 text-destructive'
};

export default function NotificationsWidget() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const { data: notifications, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-notifications', user?.id],
    queryFn: () => fetchNotifications(user!.id),
    enabled: !!user?.id,
    staleTime: 3 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // Marquer comme lu
  const markAsRead = useCallback((id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  }, []);

  // Supprimer une notification
  const dismissNotification = useCallback((id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  }, []);

  // Filtrer les notifications non supprimées
  const visibleNotifications = notifications?.filter(n => !dismissedIds.has(n.id)) || [];
  const unreadCount = visibleNotifications.filter(n => !n.read && !readIds.has(n.id)).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
              Notifications
            </CardTitle>
            <CardDescription>Rappels et conseils personnalisés</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Badge variant="default" className="text-xs">
              {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div className="text-center py-4">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Aucune notification pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-2" role="list" aria-label="Liste des notifications">
            {visibleNotifications.map((notification) => {
              const IconComponent = iconMap[notification.type];
              const colorClass = colorMap[notification.type];
              const isRead = notification.read || readIds.has(notification.id);
              
              return (
                <div 
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg transition-colors group',
                    isRead ? 'bg-muted/20' : 'bg-muted/40 hover:bg-muted/60'
                  )}
                  role="listitem"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={cn('h-8 w-8 rounded-full flex items-center justify-center shrink-0', colorClass)}>
                    <IconComponent className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn('text-sm', isRead ? 'font-normal' : 'font-medium')}>
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(notification.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id);
                          }}
                          aria-label="Supprimer cette notification"
                        >
                          <X className="h-3 w-3" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.action_url && (
                      <Button 
                        asChild 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 mt-1 text-xs"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Link to={notification.action_url}>
                          Voir plus →
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Lien vers toutes les notifications */}
        <div className="flex justify-center mt-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/notifications" className="text-xs">
              Voir toutes les notifications
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
