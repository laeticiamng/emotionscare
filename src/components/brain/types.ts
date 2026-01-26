/**
 * Types pour le module DICOM Brain Viewer
 * EmotionsCare - Psychiatrie Augmentée
 */

export type ScanModality = 'MRI_T1' | 'MRI_T2' | 'MRI_FLAIR' | 'CT' | 'NIfTI';
export type ScanStatus = 'processing' | 'ready' | 'error' | 'archived';
export type Hemisphere = 'left' | 'right' | 'bilateral';
export type AnnotationType = 'note' | 'marker' | 'measurement' | 'highlight';

export interface BrainScan {
  id: string;
  patient_id: string;
  modality: ScanModality;
  dimensions?: [number, number, number];
  voxel_size?: [number, number, number];
  original_file_path?: string;
  mesh_file_path?: string;
  thumbnail_url?: string;
  status: ScanStatus;
  metadata?: Record<string, unknown>;
  is_anonymized: boolean;
  study_date?: string;
  series_description?: string;
  created_at: string;
  updated_at: string;
}

export interface BrainRegion {
  id: string;
  scan_id: string;
  region_code: string;
  region_name: string;
  hemisphere?: Hemisphere;
  volume_mm3?: number;
  default_color: string;
  mesh_data?: Record<string, unknown>;
  created_at: string;
}

export interface EmotionBrainMapping {
  id: string;
  patient_id: string;
  scan_id?: string;
  timestamp: string;
  mappings: EmotionRegionMap;
  hume_session_id?: string;
  source: 'hume_ai' | 'manual' | 'import';
  created_at: string;
}

export interface EmotionRegionMap {
  anxiety?: { region: string; intensity: number; color: string };
  joy?: { region: string; intensity: number; color: string };
  sadness?: { region: string; intensity: number; color: string };
  anger?: { region: string; intensity: number; color: string };
  disgust?: { region: string; intensity: number; color: string };
  fear?: { region: string; intensity: number; color: string };
  surprise?: { region: string; intensity: number; color: string };
  [key: string]: { region: string; intensity: number; color: string } | undefined;
}

export interface BrainAnnotation {
  id: string;
  scan_id: string;
  region_id?: string;
  author_id?: string;
  annotation_type: AnnotationType;
  content: string;
  position?: { x: number; y: number; z: number };
  created_at: string;
  updated_at: string;
}

export interface BrainViewSession {
  id: string;
  scan_id: string;
  user_id: string;
  duration_seconds: number;
  regions_viewed: string[];
  emotions_overlaid: boolean;
  export_formats: string[];
  started_at: string;
  ended_at?: string;
}

// Atlas AAL - 116 régions cérébrales
export interface AALRegion {
  code: string;
  name: string;
  hemisphere: Hemisphere;
  color: string;
  emotionAffinity?: string[];
}

// Mapping émotions -> régions cérébrales (basé sur neurosciences)
export const EMOTION_BRAIN_MAPPING: Record<string, { regions: string[]; color: string }> = {
  anxiety: { regions: ['Amygdala', 'Insula', 'ACC'], color: '#EF4444' },
  fear: { regions: ['Amygdala', 'PAG', 'Hypothalamus'], color: '#DC2626' },
  joy: { regions: ['Nucleus_Accumbens', 'VTA', 'OFC'], color: '#10B981' },
  happiness: { regions: ['Nucleus_Accumbens', 'Striatum'], color: '#22C55E' },
  sadness: { regions: ['Prefrontal_Cortex', 'Hippocampus', 'Amygdala'], color: '#3B82F6' },
  anger: { regions: ['Hypothalamus', 'Amygdala', 'PAG'], color: '#F59E0B' },
  disgust: { regions: ['Insula', 'Basal_Ganglia'], color: '#8B5CF6' },
  surprise: { regions: ['Amygdala', 'Hippocampus', 'Prefrontal_Cortex'], color: '#EC4899' },
  contempt: { regions: ['Prefrontal_Cortex', 'Insula'], color: '#6B7280' },
};

// Régions clés de l'atlas AAL simplifiées
export const AAL_REGIONS: AALRegion[] = [
  { code: 'Amygdala_L', name: 'Amygdale', hemisphere: 'left', color: '#EF4444', emotionAffinity: ['fear', 'anxiety'] },
  { code: 'Amygdala_R', name: 'Amygdale', hemisphere: 'right', color: '#EF4444', emotionAffinity: ['fear', 'anxiety'] },
  { code: 'Hippocampus_L', name: 'Hippocampe', hemisphere: 'left', color: '#3B82F6', emotionAffinity: ['sadness', 'memory'] },
  { code: 'Hippocampus_R', name: 'Hippocampe', hemisphere: 'right', color: '#3B82F6', emotionAffinity: ['sadness', 'memory'] },
  { code: 'Prefrontal_L', name: 'Cortex Préfrontal', hemisphere: 'left', color: '#8B5CF6', emotionAffinity: ['sadness', 'regulation'] },
  { code: 'Prefrontal_R', name: 'Cortex Préfrontal', hemisphere: 'right', color: '#8B5CF6', emotionAffinity: ['sadness', 'regulation'] },
  { code: 'Insula_L', name: 'Insula', hemisphere: 'left', color: '#F59E0B', emotionAffinity: ['disgust', 'interoception'] },
  { code: 'Insula_R', name: 'Insula', hemisphere: 'right', color: '#F59E0B', emotionAffinity: ['disgust', 'interoception'] },
  { code: 'ACC', name: 'Cortex Cingulaire Antérieur', hemisphere: 'bilateral', color: '#EC4899', emotionAffinity: ['anxiety', 'conflict'] },
  { code: 'Nucleus_Accumbens_L', name: 'Noyau Accumbens', hemisphere: 'left', color: '#10B981', emotionAffinity: ['joy', 'reward'] },
  { code: 'Nucleus_Accumbens_R', name: 'Noyau Accumbens', hemisphere: 'right', color: '#10B981', emotionAffinity: ['joy', 'reward'] },
  { code: 'Hypothalamus', name: 'Hypothalamus', hemisphere: 'bilateral', color: '#F97316', emotionAffinity: ['anger', 'stress'] },
  { code: 'Thalamus_L', name: 'Thalamus', hemisphere: 'left', color: '#6366F1' },
  { code: 'Thalamus_R', name: 'Thalamus', hemisphere: 'right', color: '#6366F1' },
  { code: 'Caudate_L', name: 'Noyau Caudé', hemisphere: 'left', color: '#14B8A6' },
  { code: 'Caudate_R', name: 'Noyau Caudé', hemisphere: 'right', color: '#14B8A6' },
  { code: 'Putamen_L', name: 'Putamen', hemisphere: 'left', color: '#0EA5E9' },
  { code: 'Putamen_R', name: 'Putamen', hemisphere: 'right', color: '#0EA5E9' },
  { code: 'Cerebellum_L', name: 'Cervelet', hemisphere: 'left', color: '#84CC16' },
  { code: 'Cerebellum_R', name: 'Cervelet', hemisphere: 'right', color: '#84CC16' },
];

export interface ViewMode {
  type: 'axial' | 'sagittal' | 'coronal' | '3d';
  label: string;
  shortcut: string;
}

export const VIEW_MODES: ViewMode[] = [
  { type: 'axial', label: 'Axiale', shortcut: 'A' },
  { type: 'sagittal', label: 'Sagittale', shortcut: 'S' },
  { type: 'coronal', label: 'Coronale', shortcut: 'C' },
  { type: '3d', label: '3D Libre', shortcut: 'D' },
];
