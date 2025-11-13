/**
 * Service d'envoi de rapports hebdomadaires par email
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface WeeklyReportEmailData {
  userName: string;
  userEmail: string;
  weekStart: string;
  weekEnd: string;
  totalSessions: number;
  emotionalScore: number;
  topEmotion: string;
  mindfulnessMinutes: number;
  achievements: string[];
  recommendedActions: string[];
}

export const weeklyReportEmailService = {
  /**
   * Envoyer un rapport hebdomadaire par email
   */
  async sendWeeklyReport(reportData: WeeklyReportEmailData): Promise<boolean> {
    try {
      logger.info('📧 Sending weekly report email', { email: reportData.userEmail }, 'EMAIL');

      const { data, error } = await supabase.functions.invoke('send-weekly-email', {
        body: reportData,
      });

      if (error) {
        logger.error('Failed to send weekly report', error as Error, 'EMAIL');
        throw error;
      }

      logger.info('✅ Weekly report sent successfully', { emailId: data?.emailId }, 'EMAIL');
      return true;
    } catch (error) {
      logger.error('Error sending weekly report', error as Error, 'EMAIL');
      return false;
    }
  },

  /**
   * Envoyer des rapports en batch
   */
  async sendBatchReports(reports: WeeklyReportEmailData[]): Promise<{
    success: number;
    failed: number;
  }> {
    let success = 0;
    let failed = 0;

    for (const report of reports) {
      const sent = await this.sendWeeklyReport(report);
      if (sent) {
        success++;
      } else {
        failed++;
      }

      // Petit délai pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    logger.info(
      `📊 Batch email sending complete: ${success} success, ${failed} failed`,
      undefined,
      'EMAIL'
    );

    return { success, failed };
  },
};

export default weeklyReportEmailService;
