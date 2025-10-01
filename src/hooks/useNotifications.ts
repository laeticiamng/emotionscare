// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  created_at: string;
  action_link?: string;
  action_text?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

interface FilterOptions {
  tab: string;
  search?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Nouvelle connexion détectée',
        message: 'Une connexion depuis un nouvel appareil a été détectée sur votre compte',
        category: 'security',
        priority: 'high',
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        action_link: '/security',
        action_text: 'Vérifier',
        icon: '🔐'
      },
      {
        id: '2',
        title: 'Mise à jour système disponible',
        message: 'Une nouvelle version de l\'application est disponible avec des améliorations de sécurité',
        category: 'system',
        priority: 'medium',
        read: false,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        action_link: '/settings',
        action_text: 'Mettre à jour',
        icon: '🔄'
      },
      {
        id: '3',
        title: 'Nouveau message dans le groupe',
        message: 'Sarah a publié un nouveau message dans le groupe "Équipe Développement"',
        category: 'social',
        priority: 'low',
        read: true,
        created_at: new Date(Date.now() - 14400000).toISOString(),
        action_link: '/community',
        action_text: 'Voir',
        icon: '💬'
      },
      {
        id: '4',
        title: 'Rapport hebdomadaire prêt',
        message: 'Votre rapport d\'activité hebdomadaire est maintenant disponible',
        category: 'system',
        priority: 'medium',
        read: false,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        action_link: '/reports',
        action_text: 'Consulter',
        icon: '📊'
      },
      {
        id: '5',
        title: 'Certificat de sécurité expiré',
        message: 'Le certificat SSL de votre domaine expire dans 7 jours',
        category: 'security',
        priority: 'urgent',
        read: false,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        action_link: '/security',
        action_text: 'Renouveler',
        icon: '⚠️'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  const filterNotifications = useCallback((notifications: Notification[], options: FilterOptions) => {
    let filtered = [...notifications];

    // Filter by tab
    if (options.tab === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (options.tab !== 'all') {
      filtered = filtered.filter(n => n.category === options.tab);
    }

    // Filter by search
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchLower) ||
        n.message.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created_at (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return filtered;
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filterNotifications,
    addNotification
  };
};
