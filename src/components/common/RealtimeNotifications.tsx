import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

const RealtimeNotifications: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          try {
            const notification = payload.new as NotificationData;
            
            toast({
              title: notification.title || 'Nouvelle notification',
              description: notification.message || 'Vous avez une nouvelle notification',
              variant: notification.type === 'error' ? 'destructive' : 'default',
            });
          } catch (error) {
            console.error('Error processing notification:', error);
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  return null;
};

export default RealtimeNotifications;