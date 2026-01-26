// @ts-nocheck
/**
 * Service pour l'API Vision IRM Corps Entier (TotalSegmentator)
 * Ticket EC-ANATOMY-2026-001
 */

import { supabase } from '@/lib/supabase-client';

const EDGE_BASE_URL = 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1';

export interface AnatomicalStructure {
  id: string;
  scan_id: string;
  structure_code: string;
  structure_name: string;
  structure_category: string;
  body_zone: string;
  laterality?: 'left' | 'right' | 'bilateral';
  volume_ml?: number;
  default_color: string;
  mesh_file_path_low?: string;
  mesh_file_path_medium?: string;
  mesh_file_path_high?: string;
  centroid?: number[];
  bounding_box?: number[];
  priority?: number;
  metadata?: Record<string, unknown>;
}

export interface AnatomicalLandmark {
  id: string;
  scan_id: string;
  landmark_code: string;
  landmark_name: string;
  position: number[];
  confidence?: number;
  detection_method?: string;
}

export interface WholebodyScan {
  id: string;
  patient_id: string;
  modality: string;
  body_coverage: string;
  dimensions?: number[];
  voxel_size?: number[];
  original_file_path?: string;
  processed_file_path?: string;
  thumbnail_url?: string;
  status: string;
  segmentation_model?: string;
  structures_count?: number;
  metadata?: Record<string, unknown>;
  study_date?: string;
  created_at: string;
}

export interface MeshBundle {
  zone: string;
  structures: Array<{
    code: string;
    mesh_url: string;
    color: string;
  }>;
  total_size_kb: number;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Récupère les structures anatomiques pour un scan
 */
export async function getAnatomicalStructures(
  scanId: string,
  options?: {
    zone?: string;
    category?: string;
    lod?: 'low' | 'medium' | 'high';
  }
): Promise<ApiResponse<AnatomicalStructure[]>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    const params = new URLSearchParams({ scan_id: scanId });
    if (options?.zone) params.append('zone', options.zone);
    if (options?.category) params.append('category', options.category);
    if (options?.lod) params.append('lod', options.lod);

    const response = await fetch(
      `${EDGE_BASE_URL}/context-lens-anatomy?action=structures&${params}`,
      {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Erreur lors de la récupération des structures' };
    }

    const data = await response.json();
    return { data: data.structures };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Erreur réseau' };
  }
}

/**
 * Récupère un bundle de meshes pour une zone
 */
export async function getMeshBundle(
  scanId: string,
  zone: string,
  lod: 'low' | 'medium' | 'high' = 'medium'
): Promise<ApiResponse<MeshBundle>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(
      `${EDGE_BASE_URL}/context-lens-anatomy?action=mesh_bundle&scan_id=${scanId}&zone=${zone}&lod=${lod}`,
      {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Erreur lors de la récupération du bundle' };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Erreur réseau' };
  }
}

/**
 * Récupère les landmarks anatomiques
 */
export async function getAnatomicalLandmarks(
  scanId: string
): Promise<ApiResponse<AnatomicalLandmark[]>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(
      `${EDGE_BASE_URL}/context-lens-anatomy?action=landmarks&scan_id=${scanId}`,
      {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Erreur lors de la récupération des landmarks' };
    }

    const data = await response.json();
    return { data: data.landmarks };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Erreur réseau' };
  }
}

/**
 * Récupère les régions visibles à une profondeur donnée
 */
export async function getVisibleRegions(
  scanId: string,
  depth: number,
  position: { x: number; y: number; z: number }
): Promise<ApiResponse<string[]>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    const params = new URLSearchParams({
      scan_id: scanId,
      depth: depth.toString(),
      position: JSON.stringify(position),
    });

    const response = await fetch(
      `${EDGE_BASE_URL}/context-lens-anatomy?action=visible_regions&${params}`,
      {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Erreur lors de la récupération des régions' };
    }

    const data = await response.json();
    return { data: data.visible_regions };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Erreur réseau' };
  }
}

/**
 * Récupère un scan wholebody par ID
 */
export async function getWholebodyScan(scanId: string): Promise<ApiResponse<WholebodyScan>> {
  try {
    const { data, error } = await supabase
      .from('wholebody_scans')
      .select('*')
      .eq('id', scanId)
      .maybeSingle();

    if (error) return { error: error.message };
    if (!data) return { error: 'Scan non trouvé' };

    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Erreur' };
  }
}

/**
 * Liste les scans wholebody d'un patient
 */
export async function listPatientScans(patientId: string): Promise<ApiResponse<WholebodyScan[]>> {
  try {
    const { data, error } = await supabase
      .from('wholebody_scans')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) return { error: error.message };

    return { data: data || [] };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Erreur' };
  }
}

/**
 * Registre des 104 structures TotalSegmentator
 */
export const TOTALSEGMENTATOR_STRUCTURES = {
  head: [
    'brain', 'skull', 'eye_left', 'eye_right', 'lens_left', 'lens_right',
    'optic_nerve_left', 'optic_nerve_right', 'parotid_left', 'parotid_right',
    'submandibular_left', 'submandibular_right', 'thyroid',
  ],
  spine: [
    'vertebrae_C1', 'vertebrae_C2', 'vertebrae_C3', 'vertebrae_C4', 'vertebrae_C5',
    'vertebrae_C6', 'vertebrae_C7', 'vertebrae_T1', 'vertebrae_T2', 'vertebrae_T3',
    'vertebrae_T4', 'vertebrae_T5', 'vertebrae_T6', 'vertebrae_T7', 'vertebrae_T8',
    'vertebrae_T9', 'vertebrae_T10', 'vertebrae_T11', 'vertebrae_T12', 'vertebrae_L1',
    'vertebrae_L2', 'vertebrae_L3', 'vertebrae_L4', 'vertebrae_L5', 'sacrum', 'coccyx',
    'spinal_cord',
  ],
  thorax: [
    'lung_upper_lobe_left', 'lung_lower_lobe_left', 'lung_upper_lobe_right',
    'lung_middle_lobe_right', 'lung_lower_lobe_right', 'trachea', 'bronchus_left',
    'bronchus_right', 'heart', 'aorta', 'pulmonary_artery', 'esophagus',
    'rib_left_1', 'rib_left_2', 'rib_left_3', 'rib_left_4', 'rib_left_5',
    'rib_left_6', 'rib_left_7', 'rib_left_8', 'rib_left_9', 'rib_left_10',
    'rib_left_11', 'rib_left_12', 'rib_right_1', 'rib_right_2', 'rib_right_3',
    'rib_right_4', 'rib_right_5', 'rib_right_6', 'rib_right_7', 'rib_right_8',
    'rib_right_9', 'rib_right_10', 'rib_right_11', 'rib_right_12', 'sternum',
    'clavicula_left', 'clavicula_right', 'scapula_left', 'scapula_right',
  ],
  abdomen: [
    'liver', 'spleen', 'kidney_left', 'kidney_right', 'gallbladder', 'stomach',
    'pancreas', 'adrenal_left', 'adrenal_right', 'duodenum', 'small_bowel',
    'colon', 'urinary_bladder', 'prostate', 'uterus',
  ],
  pelvis: [
    'hip_left', 'hip_right', 'femur_left', 'femur_right', 'gluteus_maximus_left',
    'gluteus_maximus_right', 'gluteus_medius_left', 'gluteus_medius_right',
    'gluteus_minimus_left', 'gluteus_minimus_right', 'iliacus_left', 'iliacus_right',
    'psoas_left', 'psoas_right',
  ],
  vascular: [
    'aorta', 'inferior_vena_cava', 'portal_vein', 'iliac_artery_left',
    'iliac_artery_right', 'iliac_vein_left', 'iliac_vein_right',
  ],
};

export const BODY_ZONES = Object.keys(TOTALSEGMENTATOR_STRUCTURES);

export const STRUCTURE_CATEGORIES = [
  'bone', 'organ', 'muscle', 'vessel', 'nerve', 'gland', 'soft_tissue',
];
