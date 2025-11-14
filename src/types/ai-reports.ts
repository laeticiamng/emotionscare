/**
 * Types pour les rapports automatiques enrichis IA
 * Phase 3 - Excellence
 */

export type ReportType =
  | 'weekly_summary'
  | 'monthly_summary'
  | 'quarterly_review'
  | 'mood_analysis'
  | 'progress_report'
  | 'health_insights'
  | 'therapy_notes'
  | 'custom';

export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on_demand';

export type ReportFormat = 'pdf' | 'html' | 'markdown' | 'json';

export interface ReportSection {
  id: string;
  title: string;
  type: 'summary' | 'chart' | 'table' | 'text' | 'insights' | 'recommendations';
  content: string | ReportChart | ReportTable | ReportInsights;
  order: number;
}

export interface ReportChart {
  type: 'line' | 'bar' | 'pie' | 'radar' | 'scatter';
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
    }[];
  };
  options?: Record<string, unknown>;
}

export interface ReportTable {
  headers: string[];
  rows: (string | number)[][];
  footer?: string[];
}

export interface ReportInsights {
  insights: {
    type: 'positive' | 'neutral' | 'concern' | 'recommendation';
    title: string;
    description: string;
    confidence: number; // 0-100
    evidence?: string[];
    actionItems?: string[];
  }[];
}

export interface AIReport {
  id: string;
  user_id: string;
  type: ReportType;
  title: string;
  summary: string; // Résumé généré par IA
  period_start: string;
  period_end: string;
  sections: ReportSection[];
  ai_insights: {
    overall_sentiment: 'positive' | 'neutral' | 'negative';
    key_trends: string[];
    recommendations: string[];
    concerns: string[];
    achievements: string[];
    confidence_score: number;
  };
  metadata: {
    data_points_analyzed: number;
    ai_model_version: string;
    generation_time_ms: number;
    language: string;
  };
  format: ReportFormat;
  file_url?: string;
  is_shared: boolean;
  shared_with?: string[]; // User IDs ou emails
  created_at: string;
  generated_at: string;
  expires_at?: string;
}

export interface ReportSchedule {
  id: string;
  user_id: string;
  report_type: ReportType;
  frequency: ReportFrequency;
  enabled: boolean;
  recipients: {
    user_id?: string;
    email?: string;
    notify_in_app: boolean;
    notify_by_email: boolean;
  }[];
  preferences: {
    include_charts: boolean;
    include_raw_data: boolean;
    include_ai_insights: boolean;
    format: ReportFormat;
    language: string;
  };
  next_generation_at?: string;
  last_generated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  sections: Omit<ReportSection, 'id' | 'content'>[];
  is_built_in: boolean;
  is_premium: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportGenerationRequest {
  user_id: string;
  type: ReportType;
  period_start: Date;
  period_end: Date;
  format?: ReportFormat;
  template_id?: string;
  options?: {
    include_charts?: boolean;
    include_raw_data?: boolean;
    language?: string;
    custom_sections?: string[];
  };
}

export interface ReportAnalytics {
  report_id: string;
  views: number;
  downloads: number;
  shares: number;
  average_read_time_seconds: number;
  last_viewed_at?: string;
}
