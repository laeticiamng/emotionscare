/**
 * Email Integration Service - Gestion des digests hebdomadaires
 * Composition et envoi de rapports email personnalisés
 */

import { logger } from '@/lib/logger';

interface EmailTemplate {
  type: 'weekly_digest' | 'monthly_report' | 'achievement_unlock' | 'personalized_recommendation';
  subject: string;
  template: string;
  variables: Record<string, string | number>;
}

interface WeeklyDigestData {
  userId: string;
  weekStartDate: Date;
  weekEndDate: Date;
  totalSessionCount: number;
  totalListeningTime: number; // in minutes
  topMoods: Array<{ mood: string; count: number }>;
  topArtists: Array<{ name: string; count: number }>;
  topGenres: Array<{ name: string; count: number }>;
  newPlaylistsCreated: number;
  collaborationInvites: number;
  achievementsUnlocked: string[];
  streakDays: number;
  favoriteTrack?: {
    title: string;
    artist: string;
    playCount: number;
  };
  recommendations: Array<{
    title: string;
    reason: string;
    mood: string;
  }>;
}

interface EmailPreference {
  enabled: boolean;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  timeOfDay?: string; // HH:MM format
  includeStats: boolean;
  includeRecommendations: boolean;
  includeAchievements: boolean;
  includeCollaborationUpdates: boolean;
}

interface ScheduledEmail {
  id: string;
  userId: string;
  type: string;
  recipient: string;
  subject: string;
  content: string;
  scheduledTime: Date;
  sent: boolean;
  sentTime?: Date;
  retryCount: number;
}

class EmailIntegrationService {
  private static instance: EmailIntegrationService;
  private emailPreferences: Map<string, EmailPreference> = new Map();
  private scheduledEmails: ScheduledEmail[] = [];
  private emailQueue: ScheduledEmail[] = [];
  private sendInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.loadFromLocalStorage();
    logger.info('Email Integration Service initialized', {}, 'EMAIL_SERVICE');
  }

  static getInstance(): EmailIntegrationService {
    if (!EmailIntegrationService.instance) {
      EmailIntegrationService.instance = new EmailIntegrationService();
    }
    return EmailIntegrationService.instance;
  }

  /**
   * Set email preferences for a user
   */
  setEmailPreferences(userId: string, preferences: EmailPreference): void {
    this.emailPreferences.set(userId, preferences);
    this.saveToLocalStorage();

    logger.info(`Email preferences updated for user ${userId}`, { userId }, 'EMAIL_SERVICE');
  }

  /**
   * Get email preferences
   */
  getEmailPreferences(userId: string): EmailPreference {
    return (
      this.emailPreferences.get(userId) || {
        enabled: true,
        frequency: 'weekly',
        dayOfWeek: 0, // Sunday
        timeOfDay: '09:00',
        includeStats: true,
        includeRecommendations: true,
        includeAchievements: true,
        includeCollaborationUpdates: true,
      }
    );
  }

  /**
   * Generate weekly digest template
   */
  generateWeeklyDigestTemplate(data: WeeklyDigestData): EmailTemplate {
    const formatMinutes = (mins: number) => {
      const hours = Math.floor(mins / 60);
      const minutes = mins % 60;
      return `${hours}h ${minutes}m`;
    };

    const topMoodsHtml = data.topMoods
      .slice(0, 3)
      .map((m) => `<li>${m.mood}: ${m.count} sessions</li>`)
      .join('');

    const topArtistsHtml = data.topArtists
      .slice(0, 5)
      .map((a) => `<li>${a.name} (${a.count} plays)</li>`)
      .join('');

    const recommendationsHtml = data.recommendations
      .slice(0, 3)
      .map((r) => `<li><strong>${r.title}</strong> by ${r.reason}</li>`)
      .join('');

    const template = `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="color: #3b82f6; margin: 0;">🎵 Your Weekly Music Journey</h1>
            <p style="color: #666; margin: 5px 0;">Week of ${data.weekStartDate.toLocaleDateString()} to ${data.weekEndDate.toLocaleDateString()}</p>
          </div>

          <!-- Stats Section -->
          <div style="margin-bottom: 20px;">
            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">📊 Weekly Statistics</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
              <div style="background: #f0f9ff; padding: 15px; border-radius: 5px;">
                <p style="margin: 0; color: #666; font-size: 12px;">Total Sessions</p>
                <p style="margin: 5px 0; color: #3b82f6; font-size: 24px; font-weight: bold;">${data.totalSessionCount}</p>
              </div>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 5px;">
                <p style="margin: 0; color: #666; font-size: 12px;">Total Time</p>
                <p style="margin: 5px 0; color: #10b981; font-size: 24px; font-weight: bold;">${formatMinutes(data.totalListeningTime)}</p>
              </div>
              <div style="background: #fdf2f8; padding: 15px; border-radius: 5px;">
                <p style="margin: 0; color: #666; font-size: 12px;">Playlists Created</p>
                <p style="margin: 5px 0; color: #ec4899; font-size: 24px; font-weight: bold;">${data.newPlaylistsCreated}</p>
              </div>
              <div style="background: #fffbeb; padding: 15px; border-radius: 5px;">
                <p style="margin: 0; color: #666; font-size: 12px;">Current Streak</p>
                <p style="margin: 5px 0; color: #f59e0b; font-size: 24px; font-weight: bold;">${data.streakDays} days 🔥</p>
              </div>
            </div>
          </div>

          <!-- Top Moods -->
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">😊 Top Moods</h3>
            <ul style="list-style: none; padding: 0; margin-top: 10px;">${topMoodsHtml}</ul>
          </div>

          <!-- Top Artists -->
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">🎤 Top Artists</h3>
            <ul style="list-style: none; padding: 0; margin-top: 10px;">${topArtistsHtml}</ul>
          </div>

          <!-- Achievements -->
          ${
            data.achievementsUnlocked.length > 0
              ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">🏆 Achievements Unlocked</h3>
            <ul style="list-style: none; padding: 0; margin-top: 10px;">
              ${data.achievementsUnlocked.map((a) => `<li>🎖️ ${a}</li>`).join('')}
            </ul>
          </div>
          `
              : ''
          }

          <!-- Recommendations -->
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">💡 Personalized Recommendations</h3>
            <ul style="list-style: none; padding: 0; margin-top: 10px;">${recommendationsHtml}</ul>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <a href="https://emotionscare.com/music" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Continue Your Journey 🎵
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>Emotions Care - Your Personal Music Therapy Assistant</p>
            <p>You're receiving this because you have email digests enabled. <a href="#" style="color: #3b82f6; text-decoration: none;">Manage preferences</a></p>
          </div>
        </div>
      </body>
    </html>
    `;

    return {
      type: 'weekly_digest',
      subject: `🎵 Your Weekly Music Digest - ${data.topMoods[0]?.mood || 'Mixed'} Week!`,
      template,
      variables: {
        userId: data.userId,
        sessionCount: data.totalSessionCount,
        listeningTime: data.totalListeningTime,
        streakDays: data.streakDays,
        topMood: data.topMoods[0]?.mood || 'Mixed',
      },
    };
  }

  /**
   * Schedule weekly digest email
   */
  async scheduleWeeklyDigest(userId: string, digestData: WeeklyDigestData, recipientEmail: string): Promise<void> {
    const emailTemplate = this.generateWeeklyDigestTemplate(digestData);

    const scheduledEmail: ScheduledEmail = {
      id: `email_${userId}_${Date.now()}`,
      userId,
      type: 'weekly_digest',
      recipient: recipientEmail,
      subject: emailTemplate.subject,
      content: emailTemplate.template,
      scheduledTime: new Date(),
      sent: false,
      retryCount: 0,
    };

    this.scheduledEmails.push(scheduledEmail);
    this.emailQueue.push(scheduledEmail);
    this.saveToLocalStorage();

    logger.info(`Weekly digest scheduled for ${userId}`, { userId, recipient: recipientEmail }, 'EMAIL_SERVICE');
  }

  /**
   * Send scheduled emails
   */
  async sendScheduledEmails(): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const email of this.emailQueue) {
      try {
        // Simulate email sending
        await new Promise((resolve) => setTimeout(resolve, 500));

        email.sent = true;
        email.sentTime = new Date();

        sent++;

        logger.info(`Email sent to ${email.recipient}`, { emailId: email.id }, 'EMAIL_SERVICE');
      } catch (error) {
        email.retryCount++;
        failed++;

        logger.error(`Failed to send email ${email.id}`, error as Error, 'EMAIL_SERVICE');
      }
    }

    // Clear queue
    this.emailQueue = this.emailQueue.filter((e) => !e.sent);
    this.saveToLocalStorage();

    return { sent, failed };
  }

  /**
   * Start auto-send process
   */
  startAutoSend(intervalMs: number = 60000): void {
    if (this.sendInterval) {
      clearInterval(this.sendInterval);
    }

    this.sendInterval = setInterval(() => {
      this.sendScheduledEmails().catch((error) => {
        logger.error('Auto-send failed', error, 'EMAIL_SERVICE');
      });
    }, intervalMs);

    logger.info('Auto-send started', { intervalMs }, 'EMAIL_SERVICE');
  }

  /**
   * Stop auto-send
   */
  stopAutoSend(): void {
    if (this.sendInterval) {
      clearInterval(this.sendInterval);
      this.sendInterval = null;
    }

    logger.info('Auto-send stopped', {}, 'EMAIL_SERVICE');
  }

  /**
   * Get scheduled emails
   */
  getScheduledEmails(userId?: string): ScheduledEmail[] {
    return userId ? this.scheduledEmails.filter((e) => e.userId === userId) : this.scheduledEmails;
  }

  /**
   * Get email stats
   */
  getEmailStats(): {
    totalScheduled: number;
    totalSent: number;
    totalFailed: number;
    pendingCount: number;
  } {
    const totalScheduled = this.scheduledEmails.length;
    const totalSent = this.scheduledEmails.filter((e) => e.sent).length;
    const totalFailed = this.scheduledEmails.filter((e) => e.retryCount > 0).length;
    const pendingCount = this.emailQueue.length;

    return {
      totalScheduled,
      totalSent,
      totalFailed,
      pendingCount,
    };
  }

  /**
   * Clear all emails
   */
  clearAll(): void {
    this.emailPreferences.clear();
    this.scheduledEmails = [];
    this.emailQueue = [];
    localStorage.removeItem('music:email');

    logger.info('Cleared all email data', {}, 'EMAIL_SERVICE');
  }

  /**
   * Save to localStorage
   */
  private saveToLocalStorage(): void {
    try {
      const data = {
        preferences: Array.from(this.emailPreferences.entries()),
        scheduledEmails: this.scheduledEmails,
        emailQueue: this.emailQueue,
      };
      localStorage.setItem('music:email', JSON.stringify(data));
    } catch (error) {
      logger.error('Failed to save email data to localStorage', error as Error, 'EMAIL_SERVICE');
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('music:email');
      if (stored) {
        const data = JSON.parse(stored);
        this.emailPreferences = new Map(data.preferences || []);
        this.scheduledEmails = data.scheduledEmails || [];
        this.emailQueue = data.emailQueue || [];
      }
    } catch (error) {
      logger.error('Failed to load email data from localStorage', error as Error, 'EMAIL_SERVICE');
    }
  }
}

export const emailIntegrationService = EmailIntegrationService.getInstance();
export type { EmailTemplate, WeeklyDigestData, EmailPreference, ScheduledEmail };
