/**
 * Context Lens Types - MODULE 8 EmotionsCare 2.0
 * NLP multilingue, patterns émotionnels, insights personnalisés
 */

// ============ PATIENT TYPES ============

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'O';
  email?: string;
  phone?: string;
  diagnosis?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientSearchResult {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  last_visit?: string;
  thumbnail_url?: string;
  diagnosis?: string;
}

export interface Assessment {
  id: string;
  patient_id: string;
  type: string;
  score: number;
  date: string;
  notes?: string;
}

// ============ BRAIN TYPES ============

export interface BrainRegion {
  id: string;
  region_code: string;
  region_name: string;
  hemisphere: 'Left' | 'Right' | 'Bilateral';
  volume_mm3?: number;
  default_color: string;
  position: [number, number, number];
}

export interface BrainMeshResponse {
  mesh_url: string;
  format: 'gltf' | 'obj';
  lod: 'high' | 'medium' | 'low';
  regions: BrainRegion[];
  patient_id: string;
}

// ============ EMOTION TYPES ============

export interface EmotionData {
  anxiety: number;
  joy: number;
  sadness: number;
  anger: number;
  disgust: number;
  surprise?: number;
  timestamp: string;
  [key: string]: number | string | undefined;
}

export interface BrainRegionMapping {
  region: string;
  emotion: string;
  intensity: number;
  color: string;
  animation: 'pulse' | 'glow' | 'fade' | 'flash' | 'wave';
}

export interface EmotionWithBrainMapping {
  timestamp: string;
  emotions: EmotionData;
  dominant: string;
  brain_regions: BrainRegionMapping[];
}

export interface EmotionHistory {
  data: Array<{
    timestamp: string;
    emotions: EmotionData;
  }>;
  interval: 'hour' | 'day' | 'week';
  patient_id: string;
}

// ============ CONTEXT LENS INSIGHTS ============

export interface ContextLensInsight {
  id: string;
  user_id: string;
  type: 'pattern' | 'trigger' | 'recommendation' | 'correlation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  data: Record<string, unknown>;
  created_at: string;
  expires_at?: string;
  is_read: boolean;
}

export interface EmotionPattern {
  id: string;
  name: string;
  description: string;
  emotions: string[];
  frequency: 'daily' | 'weekly' | 'monthly';
  triggers: string[];
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'night';
  day_of_week?: number[];
  confidence: number;
}

export interface ContextLensReport {
  id: string;
  user_id: string;
  period: 'daily' | 'weekly' | 'monthly';
  start_date: string;
  end_date: string;
  insights: ContextLensInsight[];
  patterns: EmotionPattern[];
  emotion_summary: {
    dominant: string;
    average_scores: EmotionData;
    trend: 'improving' | 'stable' | 'declining';
  };
  recommendations: string[];
  generated_at: string;
}

// ============ NLP ANALYSIS ============

export interface NLPAnalysisResult {
  text: string;
  language: 'fr' | 'en' | 'es' | 'de' | 'it';
  sentiment: {
    score: number;
    label: 'positive' | 'neutral' | 'negative';
  };
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  entities: Array<{
    text: string;
    type: 'person' | 'location' | 'organization' | 'date' | 'emotion' | 'activity';
    confidence: number;
  }>;
  keywords: string[];
  topics: string[];
}

// ============ NOTES TYPES ============

export interface ContextLensNote {
  id: string;
  patient_id?: string;
  user_id: string;
  content: string;
  source: 'context-lens' | 'emotionscare' | 'manual' | 'voice';
  ar_context?: ARContext;
  nlp_analysis?: NLPAnalysisResult;
  created_at: string;
  updated_at: string;
}

export interface ARContext {
  focused_region?: string;
  view_angle?: 'axial' | 'sagittal' | 'coronal' | 'default';
  zoom_level?: number;
  emotions_snapshot?: EmotionData;
  session_id?: string;
}

// ============ REPORT TYPES ============

export interface ReportConfig {
  include_3d_captures?: boolean;
  include_emotion_graphs?: boolean;
  include_assessments?: boolean;
  include_insights?: boolean;
  include_patterns?: boolean;
  date_range?: {
    from: string;
    to: string;
  };
  clinician_notes?: string;
  format?: 'pdf' | 'docx' | 'json';
}

export interface ReportStatus {
  id: string;
  status: 'pending' | 'generating' | 'ready' | 'error';
  progress?: number;
  file_url?: string;
  error?: string;
  created_at: string;
}

// ============ VITALS TYPES ============

export interface VitalSigns {
  heart_rate: number;
  hrv?: number;
  stress_level: number;
  respiratory_rate?: number;
  blood_pressure?: {
    systolic: number;
    diastolic: number;
  };
  coherence_score?: number;
  timestamp: string;
}

// ============ WEBSOCKET TYPES ============

export type WSMessageType =
  | 'emotion_update'
  | 'insight_new'
  | 'pattern_detected'
  | 'subscribed'
  | 'unsubscribed'
  | 'pong'
  | 'error'
  | 'alert';

export interface WSMessage {
  type: WSMessageType;
  payload?: unknown;
  timestamp: string;
}

export interface WSEmotionUpdate {
  type: 'emotion_update';
  emotions: EmotionData;
  brain_regions: BrainRegionMapping[];
  timestamp: string;
}

export interface WSInsightNew {
  type: 'insight_new';
  insight: ContextLensInsight;
  timestamp: string;
}

export interface WSAlert {
  type: 'alert';
  level: 'info' | 'warning' | 'critical';
  message: string;
  emotion?: string;
  value?: number;
}

// ============ TEMPLATE TYPES ============

export interface InsightTemplate {
  id: string;
  type: ContextLensInsight['type'];
  title_template: string;
  description_template: string;
  conditions: Record<string, unknown>;
  priority: number;
  category: 'wellness' | 'clinical' | 'behavioral' | 'social';
}

// ============ API ERROR ============

export interface ContextLensApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status: number;
}
