// @ts-nocheck

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  dailyReminders: boolean;
  weeklyReports: boolean;
  criticalAlerts: boolean;
}

export const useResend = () => {
  const [isSending, setIsSending] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: false,
    dailyReminders: false,
    weeklyReports: false,
    criticalAlerts: false
  });

  const sendEmail = async (emailData: EmailData): Promise<boolean> => {
    setIsSending(true);

    try {
      // Déterminer le template basé sur le sujet
      let template = 'welcome';
      let templateData: Record<string, any> = {};

      if (emailData.subject.includes('export') || emailData.subject.includes('Export')) {
        template = 'export_ready';
        templateData = {
          userName: 'Utilisateur',
          exportUrl: '#',
          expiresIn: '24 heures',
          fileSize: 'N/A',
        };
      } else if (emailData.subject.includes('alerte') || emailData.subject.includes('Alerte')) {
        template = 'alert';
        templateData = {
          title: emailData.subject,
          message: emailData.text || emailData.html || '',
          severity: 'high',
          timestamp: new Date().toISOString(),
        };
      }

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          template,
          data: templateData,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Email envoyé avec succès');
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur envoi email';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const sendExportCSV = async (userEmail: string, exportData: any): Promise<boolean> => {
    return sendEmail({
      to: userEmail,
      subject: 'Votre export EmotionsCare',
      text: 'Votre export de données EmotionsCare est prêt.'
    });
  };

  const sendDailyReminder = async (userEmail: string, reminderType: string): Promise<boolean> => {
    const subjects = {
      hydration: '💧 N\'oubliez pas de vous hydrater',
      breathwork: '🌬️ Votre moment respiration',
      movement: '🚶 Temps de bouger un peu'
    };

    return sendEmail({
      to: userEmail,
      subject: subjects[reminderType as keyof typeof subjects] || 'Rappel EmotionsCare',
      text: 'Il est temps de prendre soin de vous !'
    });
  };

  const sendCriticalAlert = async (adminEmail: string, alertData: any): Promise<boolean> => {
    return sendEmail({
      to: adminEmail,
      subject: '🚨 Alerte critique - EmotionsCare',
      text: `Type: ${alertData.type}\nMessage: ${alertData.message}\nTimestamp: ${new Date().toLocaleString()}`
    });
  };

  const updateNotificationSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // Ici on sauvegarderait en base via Supabase
  };

  return {
    sendEmail,
    sendExportCSV,
    sendDailyReminder,
    sendCriticalAlert,
    updateNotificationSettings,
    settings,
    isSending
  };
};
