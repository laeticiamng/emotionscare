export interface Incident {
  id: string;
  incident_id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  started_at: string;
  resolved_at?: string;
  affected_systems?: string[];
  downtime_minutes?: number;
  users_affected?: number;
  business_impact_cost?: number;
  root_cause_analysis?: string;
  root_cause_confidence?: number;
  impact_description?: string;
  timeline?: TimelineEvent[];
  contributing_factors?: string[];
  corrective_actions?: string[];
  preventive_measures?: string[];
  lessons_learned?: string[];
  post_mortem_template?: string;
}

export interface TimelineEvent {
  event: string;
  description: string;
  timestamp: string;
}

export type ExportFormat = 'excel' | 'pdf';

export type SeverityVariant = 'destructive' | 'warning' | 'secondary' | 'outline' | 'default';
export type StatusVariant = 'destructive' | 'warning' | 'success' | 'secondary' | 'outline' | 'default';
