
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  icon?: string;
  image?: string;
  metadata?: Record<string, any>;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  categories: {
    achievements: boolean;
    reminders: boolean;
    social: boolean;
    system: boolean;
  };
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private settings: NotificationSettings = {
    pushEnabled: true,
    emailEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    categories: {
      achievements: true,
      reminders: true,
      social: true,
      system: true
    }
  };

  constructor() {
    this.loadNotifications();
    this.loadSettings();
    this.requestPermission();
  }

  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  private isQuietHours(): boolean {
    if (!this.settings.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return currentTime >= this.settings.quietHours.start || currentTime <= this.settings.quietHours.end;
  }

  async sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Send browser notification if enabled and not in quiet hours
    if (this.settings.pushEnabled && !this.isQuietHours()) {
      await this.sendBrowserNotification(newNotification);
    }

    // Play sound if enabled
    if (this.settings.soundEnabled && !this.isQuietHours()) {
      this.playNotificationSound();
    }

    // Vibrate if enabled (mobile)
    if (this.settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  private async sendBrowserNotification(notification: Notification): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon || '/favicon.ico',
        image: notification.image,
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'high'
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // Auto-close after 5 seconds for non-critical notifications
      if (notification.priority !== 'high') {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }
  }

  private playNotificationSound(): void {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Fallback to system beep
      console.beep?.();
    });
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
    this.notifyListeners();
  }

  clearAll(): void {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  private saveNotifications(): void {
    localStorage.setItem('emotionscare_notifications', JSON.stringify(this.notifications));
  }

  private loadNotifications(): void {
    try {
      const saved = localStorage.getItem('emotionscare_notifications');
      if (saved) {
        this.notifications = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  private saveSettings(): void {
    localStorage.setItem('emotionscare_notification_settings', JSON.stringify(this.settings));
  }

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('emotionscare_notification_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  }

  // Predefined notification templates
  async sendAchievementNotification(achievement: string, points: number): Promise<void> {
    await this.sendNotification({
      title: '🏆 Nouveau Succès !',
      message: `Vous avez débloqué : ${achievement} (+${points} points)`,
      type: 'success',
      priority: 'medium',
      icon: '🏆',
      actionUrl: '/gamification',
      actionText: 'Voir mes succès'
    });
  }

  async sendReminderNotification(title: string, message: string): Promise<void> {
    await this.sendNotification({
      title: `⏰ ${title}`,
      message,
      type: 'info',
      priority: 'high',
      icon: '⏰'
    });
  }

  async sendWelcomeNotification(): Promise<void> {
    await this.sendNotification({
      title: '👋 Bienvenue dans EmotionsCare !',
      message: 'Découvrez toutes les fonctionnalités pour améliorer votre bien-être émotionnel.',
      type: 'info',
      priority: 'medium',
      icon: '👋',
      actionUrl: '/dashboard',
      actionText: 'Commencer'
    });
  }

  async sendCoachSuggestion(suggestion: string): Promise<void> {
    await this.sendNotification({
      title: '💡 Suggestion de votre Coach IA',
      message: suggestion,
      type: 'info',
      priority: 'medium',
      icon: '💡',
      actionUrl: '/coach',
      actionText: 'Parler au coach'
    });
  }
}

export const notificationService = new NotificationService();
