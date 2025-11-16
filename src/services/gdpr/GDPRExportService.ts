/**
 * GDPR User Data Export Service
 * Complete user data export for GDPR compliance (Right to Data Portability - Article 20)
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface UserDataExport {
  exportDate: string;
  userId: string;
  profile: {
    id: string;
    email: string;
    name: string;
    role: string;
    created_at: string;
    avatar_url?: string;
    preferences?: Record<string, any>;
  };
  journalEntries: Array<{
    id: string;
    text: string;
    tags: string[];
    created_at: string;
    mode: string;
  }>;
  emotionScans: Array<{
    id: string;
    created_at: string;
    mood_score: number;
    payload: Record<string, any>;
  }>;
  activitySessions: Array<{
    id: string;
    module_name: string;
    created_at: string;
    duration_seconds: number;
  }>;
  consents: Array<{
    id: string;
    type: string;
    granted: boolean;
    granted_at: string;
  }>;
  exportLogs: Array<{
    id: string;
    export_type: string;
    created_at: string;
  }>;
}

export class GDPRExportService {
  /**
   * Collect all user data from all tables
   */
  static async collectUserData(userId: string): Promise<UserDataExport> {
    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch journal entries
      const { data: journalEntries, error: journalError } = await supabase
        .from('journal_notes')
        .select('id, text, tags, created_at, mode')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Fetch emotion scans
      const { data: emotionScans, error: scanError } = await supabase
        .from('emotion_scans')
        .select('id, created_at, mood_score, payload')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Fetch activity sessions
      const { data: activitySessions, error: activityError } = await supabase
        .from('activity_sessions')
        .select('id, module_name, created_at, duration_seconds')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Fetch consents (if table exists)
      let consents: any[] = [];
      try {
        const { data: consentData } = await supabase
          .from('user_consents')
          .select('id, type, granted, granted_at')
          .eq('user_id', userId);
        consents = consentData || [];
      } catch (e) {
        logger.warn('Consent table not found, skipping', e, 'GDPR');
      }

      // Fetch export logs
      const { data: exportLogs, error: exportError } = await supabase
        .from('export_logs')
        .select('id, export_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      const exportData: UserDataExport = {
        exportDate: new Date().toISOString(),
        userId,
        profile: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          created_at: profile.created_at,
          avatar_url: profile.avatar_url,
          preferences: profile.preferences,
        },
        journalEntries: journalEntries || [],
        emotionScans: emotionScans || [],
        activitySessions: activitySessions || [],
        consents: consents,
        exportLogs: exportLogs || [],
      };

      // Log export action
      await this.logExport(userId, 'full_data_export');

      return exportData;
    } catch (error) {
      logger.error('Error collecting user data for export', error, 'GDPR');
      throw new Error('Failed to collect user data');
    }
  }

  /**
   * Export user data as JSON
   */
  static async exportAsJSON(userId: string): Promise<void> {
    try {
      const data = await this.collectUserData(userId);

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `emotionscare-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      URL.revokeObjectURL(url);

      logger.info('User data exported as JSON', { userId }, 'GDPR');
    } catch (error) {
      logger.error('Error exporting user data as JSON', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Export user data as PDF
   */
  static async exportAsPDF(userId: string): Promise<void> {
    try {
      const data = await this.collectUserData(userId);

      const doc = new jsPDF();
      let yPosition = 20;

      // Title
      doc.setFontSize(20);
      doc.text('Export de Données Personnelles', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(`Date d'export: ${new Date(data.exportDate).toLocaleDateString('fr-FR')}`, 20, yPosition);
      yPosition += 5;
      doc.text(`User ID: ${data.userId}`, 20, yPosition);
      yPosition += 15;

      // Profile Section
      doc.setFontSize(14);
      doc.text('Profil Utilisateur', 20, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      const profileData = [
        ['Nom', data.profile.name || 'N/A'],
        ['Email', data.profile.email],
        ['Rôle', data.profile.role],
        ['Date de création', new Date(data.profile.created_at).toLocaleDateString('fr-FR')],
      ];

      (doc as any).autoTable({
        startY: yPosition,
        head: [['Champ', 'Valeur']],
        body: profileData,
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202] },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      // Journal Entries
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text(`Entrées de Journal (${data.journalEntries.length})`, 20, yPosition);
      yPosition += 8;

      if (data.journalEntries.length > 0) {
        const journalData = data.journalEntries.slice(0, 20).map((entry) => [
          new Date(entry.created_at).toLocaleDateString('fr-FR'),
          entry.mode,
          entry.text.substring(0, 80) + (entry.text.length > 80 ? '...' : ''),
        ]);

        (doc as any).autoTable({
          startY: yPosition,
          head: [['Date', 'Mode', 'Aperçu']],
          body: journalData,
          theme: 'grid',
          headStyles: { fillColor: [66, 139, 202] },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      } else {
        doc.setFontSize(10);
        doc.text('Aucune entrée de journal', 25, yPosition);
        yPosition += 15;
      }

      // Emotion Scans
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text(`Scans Émotionnels (${data.emotionScans.length})`, 20, yPosition);
      yPosition += 8;

      if (data.emotionScans.length > 0) {
        const scanData = data.emotionScans.slice(0, 20).map((scan) => [
          new Date(scan.created_at).toLocaleDateString('fr-FR'),
          scan.mood_score?.toString() || 'N/A',
          scan.payload?.dominant_emotion || 'N/A',
        ]);

        (doc as any).autoTable({
          startY: yPosition,
          head: [['Date', 'Score', 'Émotion']],
          body: scanData,
          theme: 'grid',
          headStyles: { fillColor: [66, 139, 202] },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      } else {
        doc.setFontSize(10);
        doc.text('Aucun scan émotionnel', 25, yPosition);
        yPosition += 15;
      }

      // Activity Sessions
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text(`Sessions d'Activité (${data.activitySessions.length})`, 20, yPosition);
      yPosition += 8;

      if (data.activitySessions.length > 0) {
        const activityData = data.activitySessions.slice(0, 20).map((session) => [
          new Date(session.created_at).toLocaleDateString('fr-FR'),
          session.module_name,
          `${Math.round(session.duration_seconds / 60)} min`,
        ]);

        (doc as any).autoTable({
          startY: yPosition,
          head: [['Date', 'Module', 'Durée']],
          body: activityData,
          theme: 'grid',
          headStyles: { fillColor: [66, 139, 202] },
        });
      } else {
        doc.setFontSize(10);
        doc.text('Aucune session d\'activité', 25, yPosition);
      }

      // Footer on last page
      const pageCount = doc.getNumberOfPages();
      doc.setPage(pageCount);
      doc.setFontSize(8);
      doc.text(
        `Document généré automatiquement - EmotionsCare GDPR Export - ${new Date().toLocaleDateString('fr-FR')}`,
        20,
        285
      );

      // Save PDF
      doc.save(`emotionscare-export-${userId}-${new Date().toISOString().split('T')[0]}.pdf`);

      logger.info('User data exported as PDF', { userId }, 'GDPR');
    } catch (error) {
      logger.error('Error exporting user data as PDF', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Log export action to database
   */
  private static async logExport(userId: string, exportType: string): Promise<void> {
    try {
      await supabase.from('export_logs').insert({
        user_id: userId,
        export_type: exportType,
        status: 'completed',
        file_size: 0, // Will be calculated client-side
      });
    } catch (error) {
      logger.warn('Failed to log export action', error, 'GDPR');
    }
  }

  /**
   * Get export statistics
   */
  static async getExportStats(userId: string): Promise<{
    totalExports: number;
    lastExportDate: string | null;
    exportTypes: Record<string, number>;
  }> {
    try {
      const { data: exports, error } = await supabase
        .from('export_logs')
        .select('export_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const exportTypes: Record<string, number> = {};
      exports?.forEach((exp) => {
        exportTypes[exp.export_type] = (exportTypes[exp.export_type] || 0) + 1;
      });

      return {
        totalExports: exports?.length || 0,
        lastExportDate: exports?.[0]?.created_at || null,
        exportTypes,
      };
    } catch (error) {
      logger.error('Error getting export stats', error, 'GDPR');
      return {
        totalExports: 0,
        lastExportDate: null,
        exportTypes: {},
      };
    }
  }
}
