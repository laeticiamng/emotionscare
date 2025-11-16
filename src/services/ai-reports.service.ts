/**
 * Service de génération de rapports automatiques enrichis IA
 * Phase 3 - Excellence
 */

import { supabase } from '@/lib/supabase';
import type {
  AIReport,
  ReportSchedule,
  ReportTemplate,
  ReportGenerationRequest,
  ReportAnalytics,
  ReportType,
} from '@/types/ai-reports';

/**
 * Générer un rapport enrichi IA
 */
export async function generateReport(
  request: ReportGenerationRequest
): Promise<AIReport> {
  const { data, error } = await supabase.functions.invoke('ai-reports-generate', {
    body: request,
  });

  if (error) throw new Error(`Failed to generate report: ${error.message}`);
  return data.report;
}

/**
 * Récupérer tous les rapports d'un utilisateur
 */
export async function getUserReports(
  userId: string,
  options?: {
    type?: ReportType;
    limit?: number;
    offset?: number;
  }
): Promise<{ reports: AIReport[]; total: number }> {
  let query = supabase
    .from('ai_reports')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('generated_at', { ascending: false });

  if (options?.type) {
    query = query.eq('type', options.type);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(`Failed to fetch reports: ${error.message}`);
  return { reports: data || [], total: count || 0 };
}

/**
 * Récupérer un rapport spécifique
 */
export async function getReportById(reportId: string): Promise<AIReport | null> {
  const { data, error } = await supabase
    .from('ai_reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch report: ${error.message}`);
  }

  return data;
}

/**
 * Supprimer un rapport
 */
export async function deleteReport(reportId: string): Promise<void> {
  const { error } = await supabase.from('ai_reports').delete().eq('id', reportId);

  if (error) throw new Error(`Failed to delete report: ${error.message}`);
}

/**
 * Partager un rapport
 */
export async function shareReport(
  reportId: string,
  recipients: string[]
): Promise<{ shareUrl: string }> {
  const { data, error } = await supabase.functions.invoke('ai-reports-share', {
    body: { reportId, recipients },
  });

  if (error) throw new Error(`Failed to share report: ${error.message}`);
  return data;
}

/**
 * Exporter un rapport
 */
export async function exportReport(
  reportId: string,
  format: 'pdf' | 'html' | 'markdown' | 'json'
): Promise<{ url: string }> {
  const { data, error } = await supabase.functions.invoke('ai-reports-export', {
    body: { reportId, format },
  });

  if (error) throw new Error(`Failed to export report: ${error.message}`);
  return data;
}

/**
 * Récupérer les planifications de rapports
 */
export async function getReportSchedules(userId: string): Promise<ReportSchedule[]> {
  const { data, error } = await supabase
    .from('report_schedules')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch report schedules: ${error.message}`);
  return data || [];
}

/**
 * Créer une planification de rapport
 */
export async function createReportSchedule(
  userId: string,
  schedule: Omit<ReportSchedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<ReportSchedule> {
  const { user_id, ...scheduleWithoutUserId } = schedule as any;
  const { data, error } = await supabase
    .from('report_schedules')
    .insert({
      user_id: userId,
      ...scheduleWithoutUserId,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create report schedule: ${error.message}`);
  return data;
}

/**
 * Mettre à jour une planification
 */
export async function updateReportSchedule(
  scheduleId: string,
  updates: Partial<ReportSchedule>
): Promise<ReportSchedule> {
  const { data, error } = await supabase
    .from('report_schedules')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', scheduleId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update report schedule: ${error.message}`);
  return data;
}

/**
 * Supprimer une planification
 */
export async function deleteReportSchedule(scheduleId: string): Promise<void> {
  const { error } = await supabase.from('report_schedules').delete().eq('id', scheduleId);

  if (error) throw new Error(`Failed to delete report schedule: ${error.message}`);
}

/**
 * Récupérer les modèles de rapport
 */
export async function getReportTemplates(
  options?: {
    type?: ReportType;
    includeCustom?: boolean;
    userId?: string;
  }
): Promise<ReportTemplate[]> {
  let query = supabase.from('report_templates').select('*').order('name');

  if (options?.type) {
    query = query.eq('type', options.type);
  }

  if (!options?.includeCustom) {
    query = query.eq('is_built_in', true);
  } else if (options.userId) {
    query = query.or(`is_built_in.eq.true,created_by.eq.${options.userId}`);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch report templates: ${error.message}`);
  return data || [];
}

/**
 * Créer un modèle personnalisé
 */
export async function createReportTemplate(
  userId: string,
  template: Omit<ReportTemplate, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>
): Promise<ReportTemplate> {
  const { data, error } = await supabase
    .from('report_templates')
    .insert({
      created_by: userId,
      ...template,
      is_built_in: false,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create report template: ${error.message}`);
  return data;
}

/**
 * Récupérer les analytics d'un rapport
 */
export async function getReportAnalytics(reportId: string): Promise<ReportAnalytics | null> {
  const { data, error } = await supabase
    .from('report_analytics')
    .select('*')
    .eq('report_id', reportId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch report analytics: ${error.message}`);
  }

  return data;
}

/**
 * Enregistrer une vue de rapport
 */
export async function trackReportView(reportId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_report_views', {
    p_report_id: reportId,
  });

  if (error) console.error('Failed to track report view:', error);
}

/**
 * Enregistrer un téléchargement de rapport
 */
export async function trackReportDownload(reportId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_report_downloads', {
    p_report_id: reportId,
  });

  if (error) console.error('Failed to track report download:', error);
}

/**
 * Analyser les tendances avec IA
 */
export async function analyzeTrends(
  userId: string,
  startDate: Date,
  endDate: Date,
  dataTypes: string[]
): Promise<{
  trends: {
    dataType: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    change_percent: number;
    confidence: number;
    description: string;
  }[];
  anomalies: {
    dataType: string;
    date: string;
    value: number;
    expected_range: [number, number];
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
}> {
  const { data, error } = await supabase.functions.invoke('ai-reports-analyze-trends', {
    body: {
      userId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      dataTypes,
    },
  });

  if (error) throw new Error(`Failed to analyze trends: ${error.message}`);
  return data;
}

/**
 * Générer des recommandations personnalisées avec IA
 */
export async function generateRecommendations(
  userId: string,
  context?: {
    currentMood?: string;
    recentActivities?: string[];
    goals?: string[];
  }
): Promise<{
  recommendations: {
    category: 'exercise' | 'mindfulness' | 'social' | 'therapy' | 'lifestyle';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    expectedBenefit: string;
    steps: string[];
    resources?: { title: string; url: string }[];
  }[];
}> {
  const { data, error } = await supabase.functions.invoke('ai-reports-recommendations', {
    body: { userId, context },
  });

  if (error) throw new Error(`Failed to generate recommendations: ${error.message}`);
  return data;
}

/**
 * Générer un résumé de rapport avec IA
 */
export async function generateReportSummary(
  reportData: {
    type: ReportType;
    periodStart: string;
    periodEnd: string;
    metrics: Record<string, unknown>;
  }
): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ai-reports-summarize', {
    body: reportData,
  });

  if (error) throw new Error(`Failed to generate summary: ${error.message}`);
  return data.summary;
}
