
export interface FeedbackEntry {
  id: string;
  user_id: string;
  module: string;
  type: 'bug' | 'suggestion' | 'compliment' | 'feature_request';
  rating: number; // 1-5
  title: string;
  description: string;
  emotion_context?: string;
  screenshot_url?: string;
  audio_url?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'reviewed' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  tags?: string[];
  response?: string;
  admin_notes?: string;
}

export interface ImprovementSuggestion {
  id: string;
  user_id: string;
  type: 'feature' | 'ui_improvement' | 'workflow' | 'performance';
  title: string;
  description: string;
  confidence: number;
  impact_score: number;
  effort_estimation: 'low' | 'medium' | 'high';
  reasoning: string;
  feedback_ids: string[];
  status: 'generated' | 'reviewed' | 'approved' | 'implemented';
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  module: string;
  impact: 'low' | 'medium' | 'high';
  details: Record<string, any>;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

export interface QualityMetrics {
  satisfaction_score: number;
  nps_score: number;
  feature_adoption_rate: number;
  bug_report_frequency: number;
  improvement_implementation_rate: number;
  user_retention_rate: number;
}
