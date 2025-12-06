
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
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
          from: emailData.from || 'noreply@emotionscare.app'
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
      html: `
        <h2>Votre export de données</h2>
        <p>Bonjour,</p>
        <p>Votre export de données EmotionsCare est prêt.</p>
        <p>Vous pouvez le télécharger via le lien sécurisé ci-dessous :</p>
        <a href="#" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Télécharger mon export</a>
        <p><small>Ce lien expire dans 24h pour votre sécurité.</small></p>
      `
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
      html: `
        <h2>Votre rappel bien-être</h2>
        <p>Il est temps de prendre soin de vous !</p>
        <a href="https://app.emotionscare.com" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Ouvrir l'app</a>
      `
    });
  };

  const sendCriticalAlert = async (adminEmail: string, alertData: any): Promise<boolean> => {
    return sendEmail({
      to: adminEmail,
      subject: '🚨 Alerte critique - EmotionsCare',
      html: `
        <h2>Alerte système</h2>
        <p><strong>Type:</strong> ${alertData.type}</p>
        <p><strong>Message:</strong> ${alertData.message}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <a href="https://admin.emotionscare.com" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Accéder admin</a>
      `
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
