/**
 * ScanReminderService - Service de rappels pour les scans émotionnels
 * Gère les notifications et rappels pour encourager la régularité
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface ScanReminder {
  id: string;
  userId: string;
  time: string; // HH:mm format
  daysOfWeek: number[]; // 0-6 (dimanche-samedi)
  enabled: boolean;
  message: string;
  type: 'push' | 'email' | 'in-app';
  lastTriggered?: string;
  createdAt: string;
}

export interface ReminderStats {
  totalReminders: number;
  activeReminders: number;
  triggeredToday: number;
  streakDays: number;
  lastScanDate: string | null;
}

const REMINDER_SETTINGS_KEY = 'scan:reminder_settings';
const REMINDER_HISTORY_KEY = 'scan:reminder_history';

class ScanReminderService {
  private reminders: ScanReminder[] = [];
  private userId: string | null = null;
  private notificationPermission: NotificationPermission = 'default';

  // Initialiser le service
  async initialize(userId: string): Promise<void> {
    this.userId = userId;
    
    // Demander la permission des notifications
    if ('Notification' in window) {
      this.notificationPermission = Notification.permission;
      if (this.notificationPermission === 'default') {
        this.notificationPermission = await Notification.requestPermission();
      }
    }

    // Charger les rappels existants
    await this.loadReminders();

    // Démarrer le scheduler
    this.startScheduler();

    logger.info('[ScanReminderService] Initialized', { userId }, 'SCAN');
  }

  // Charger les rappels depuis Supabase
  private async loadReminders(): Promise<void> {
    if (!this.userId) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', this.userId)
        .eq('key', REMINDER_SETTINGS_KEY)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('[ScanReminderService] Load error', error, 'SCAN');
        return;
      }

      if (data?.value) {
        this.reminders = JSON.parse(data.value);
      }
    } catch (e) {
      logger.error('[ScanReminderService] Parse error', e, 'SCAN');
    }
  }

  // Sauvegarder les rappels
  private async saveReminders(): Promise<void> {
    if (!this.userId) return;

    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: this.userId,
          key: REMINDER_SETTINGS_KEY,
          value: JSON.stringify(this.reminders),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,key'
        });
    } catch (e) {
      logger.error('[ScanReminderService] Save error', e, 'SCAN');
    }
  }

  // Créer un nouveau rappel
  async createReminder(params: {
    time: string;
    daysOfWeek?: number[];
    message?: string;
    type?: ScanReminder['type'];
  }): Promise<ScanReminder> {
    const reminder: ScanReminder = {
      id: crypto.randomUUID(),
      userId: this.userId!,
      time: params.time,
      daysOfWeek: params.daysOfWeek || [1, 2, 3, 4, 5], // Lun-Ven par défaut
      enabled: true,
      message: params.message || 'C\'est le moment de faire votre scan émotionnel ! 🧘',
      type: params.type || 'in-app',
      createdAt: new Date().toISOString()
    };

    this.reminders.push(reminder);
    await this.saveReminders();

    logger.info('[ScanReminderService] Reminder created', { id: reminder.id }, 'SCAN');
    return reminder;
  }

  // Mettre à jour un rappel
  async updateReminder(id: string, updates: Partial<ScanReminder>): Promise<ScanReminder | null> {
    const index = this.reminders.findIndex(r => r.id === id);
    if (index === -1) return null;

    this.reminders[index] = { ...this.reminders[index], ...updates };
    await this.saveReminders();

    return this.reminders[index];
  }

  // Supprimer un rappel
  async deleteReminder(id: string): Promise<boolean> {
    const initialLength = this.reminders.length;
    this.reminders = this.reminders.filter(r => r.id !== id);
    
    if (this.reminders.length < initialLength) {
      await this.saveReminders();
      return true;
    }
    return false;
  }

  // Récupérer tous les rappels
  getReminders(): ScanReminder[] {
    return [...this.reminders];
  }

  // Activer/désactiver un rappel
  async toggleReminder(id: string): Promise<boolean> {
    const reminder = this.reminders.find(r => r.id === id);
    if (!reminder) return false;

    reminder.enabled = !reminder.enabled;
    await this.saveReminders();
    return reminder.enabled;
  }

  // Vérifier si un rappel doit être déclenché
  private shouldTrigger(reminder: ScanReminder): boolean {
    if (!reminder.enabled) return false;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Vérifier le jour
    if (!reminder.daysOfWeek.includes(currentDay)) return false;

    // Vérifier l'heure (avec une marge de 1 minute)
    if (currentTime !== reminder.time) return false;

    // Vérifier si déjà déclenché aujourd'hui
    if (reminder.lastTriggered) {
      const lastDate = new Date(reminder.lastTriggered).toDateString();
      if (lastDate === now.toDateString()) return false;
    }

    return true;
  }

  // Déclencher une notification
  private async triggerNotification(reminder: ScanReminder): Promise<void> {
    logger.info('[ScanReminderService] Triggering reminder', { id: reminder.id }, 'SCAN');

    // Mettre à jour lastTriggered
    reminder.lastTriggered = new Date().toISOString();
    await this.saveReminders();

    // Notification push
    if (reminder.type === 'push' && this.notificationPermission === 'granted') {
      new Notification('EmotionsCare - Scan émotionnel', {
        body: reminder.message,
        icon: '/favicon.ico',
        tag: `scan-reminder-${reminder.id}`,
        requireInteraction: true
      });
    }

    // Notification in-app (via événement personnalisé)
    if (reminder.type === 'in-app') {
      window.dispatchEvent(new CustomEvent('scan-reminder', {
        detail: {
          id: reminder.id,
          message: reminder.message
        }
      }));
    }

    // Enregistrer dans l'historique
    await this.logReminderHistory(reminder);
  }

  // Enregistrer l'historique des rappels
  private async logReminderHistory(reminder: ScanReminder): Promise<void> {
    if (!this.userId) return;

    try {
      const { data: existing } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', this.userId)
        .eq('key', REMINDER_HISTORY_KEY)
        .single();

      const history = existing?.value ? JSON.parse(existing.value) : [];
      history.unshift({
        reminderId: reminder.id,
        triggeredAt: new Date().toISOString(),
        message: reminder.message
      });

      // Garder les 100 derniers
      const trimmedHistory = history.slice(0, 100);

      await supabase
        .from('user_settings')
        .upsert({
          user_id: this.userId,
          key: REMINDER_HISTORY_KEY,
          value: JSON.stringify(trimmedHistory),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,key'
        });
    } catch (e) {
      logger.warn('[ScanReminderService] History log failed', {}, 'SCAN');
    }
  }

  // Scheduler pour vérifier les rappels
  private schedulerInterval: number | null = null;

  private startScheduler(): void {
    // Vérifier toutes les minutes
    this.schedulerInterval = window.setInterval(() => {
      this.checkReminders();
    }, 60000);

    // Vérifier immédiatement
    this.checkReminders();
  }

  private checkReminders(): void {
    for (const reminder of this.reminders) {
      if (this.shouldTrigger(reminder)) {
        this.triggerNotification(reminder);
      }
    }
  }

  // Arrêter le service
  stop(): void {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
  }

  // Obtenir les statistiques de rappels
  async getStats(): Promise<ReminderStats> {
    const activeReminders = this.reminders.filter(r => r.enabled).length;
    const triggeredToday = this.reminders.filter(r => {
      if (!r.lastTriggered) return false;
      return new Date(r.lastTriggered).toDateString() === new Date().toDateString();
    }).length;

    // Calculer le streak (jours consécutifs avec scan)
    let streakDays = 0;
    let lastScanDate: string | null = null;

    if (this.userId) {
      const { data: signals } = await supabase
        .from('clinical_signals')
        .select('created_at')
        .eq('user_id', this.userId)
        .ilike('source_instrument', '%scan%')
        .order('created_at', { ascending: false })
        .limit(30);

      if (signals && signals.length > 0) {
        lastScanDate = signals[0].created_at;
        
        // Calculer le streak
        const dates = signals.map(s => new Date(s.created_at).toDateString());
        const uniqueDates = [...new Set(dates)];
        
        const today = new Date().toDateString();
        let checkDate = new Date();
        
        for (let i = 0; i < 30; i++) {
          if (uniqueDates.includes(checkDate.toDateString())) {
            streakDays++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else if (checkDate.toDateString() !== today) {
            break;
          } else {
            checkDate.setDate(checkDate.getDate() - 1);
          }
        }
      }
    }

    return {
      totalReminders: this.reminders.length,
      activeReminders,
      triggeredToday,
      streakDays,
      lastScanDate
    };
  }

  // Créer des rappels par défaut pour un nouvel utilisateur
  async setupDefaultReminders(): Promise<void> {
    if (this.reminders.length > 0) return;

    // Rappel du matin
    await this.createReminder({
      time: '09:00',
      daysOfWeek: [1, 2, 3, 4, 5],
      message: 'Bonjour ! Comment vous sentez-vous ce matin ? 🌅',
      type: 'in-app'
    });

    // Rappel après-midi
    await this.createReminder({
      time: '14:00',
      daysOfWeek: [1, 2, 3, 4, 5],
      message: 'Pause émotionnelle de l\'après-midi 🧘',
      type: 'in-app'
    });

    logger.info('[ScanReminderService] Default reminders created', {}, 'SCAN');
  }
}

export const scanReminderService = new ScanReminderService();
export default scanReminderService;
