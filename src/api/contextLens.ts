/**
 * Context-Lens-Pro API - Interface pour lunettes AR
 * EmotionsCare - Module DICOM
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { BrainScan, EmotionRegionMap } from '@/components/brain/types';
import { exportAtlasMappingForAR, segmentVolumeToAAL } from '@/services/dicom/atlasMapper';

const API_VERSION = 'v1';
const BASE_PATH = '/api/brain';

export interface ContextLensConfig {
  apiKey?: string;
  deviceId?: string;
  renderQuality: 'low' | 'medium' | 'high';
  streamingEnabled: boolean;
}

export interface ARMeshResponse {
  success: boolean;
  meshUrl?: string;
  format: 'gltf' | 'glb';
  lod: 'high' | 'medium' | 'low';
  regionsCount: number;
  timestamp: string;
  error?: string;
}

export interface EmotionStreamData {
  patientId: string;
  timestamp: string;
  emotions: EmotionRegionMap;
  brainRegions: Array<{
    code: string;
    name: string;
    intensity: number;
    color: string;
  }>;
}

/**
 * Configuration par défaut pour Context-Lens
 */
const defaultConfig: ContextLensConfig = {
  renderQuality: 'medium',
  streamingEnabled: true,
};

let config: ContextLensConfig = { ...defaultConfig };

/**
 * Initialiser l'API Context-Lens
 */
export function initContextLensAPI(customConfig?: Partial<ContextLensConfig>): void {
  config = { ...defaultConfig, ...customConfig };
  logger.info('Context-Lens API initialisée', { config }, 'CONTEXT_LENS');
}

/**
 * GET /api/brain/{patient_id}/scans
 * Liste tous les scans d'un patient
 */
export async function getPatientScans(patientId: string): Promise<BrainScan[]> {
  try {
    const { data, error } = await supabase
      .from('brain_scans')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Erreur récupération scans', error as Error, 'CONTEXT_LENS');
    return [];
  }
}

/**
 * GET /api/brain/{patient_id}/mesh
 * Récupère le mesh 3D pour affichage AR
 */
export async function getBrainMesh(
  patientId: string,
  options: {
    scanId?: string;
    format?: 'gltf' | 'glb';
    lod?: 'high' | 'medium' | 'low';
  } = {}
): Promise<ARMeshResponse> {
  const { scanId, format = 'glb', lod = config.renderQuality } = options;

  try {
    // Récupérer le scan
    let query = supabase
      .from('brain_scans')
      .select('*')
      .eq('patient_id', patientId)
      .eq('status', 'ready');

    if (scanId) {
      query = query.eq('id', scanId);
    }

    const { data: scans, error } = await query.limit(1).single();

    if (error || !scans) {
      return {
        success: false,
        format,
        lod,
        regionsCount: 0,
        timestamp: new Date().toISOString(),
        error: 'Scan non trouvé',
      };
    }

    // Générer l'URL du mesh
    const meshUrl = scans.mesh_file_path 
      ? await getMeshPublicUrl(scans.mesh_file_path)
      : undefined;

    return {
      success: true,
      meshUrl,
      format,
      lod,
      regionsCount: 116, // Atlas AAL standard
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Erreur récupération mesh', error as Error, 'CONTEXT_LENS');
    return {
      success: false,
      format,
      lod,
      regionsCount: 0,
      timestamp: new Date().toISOString(),
      error: (error as Error).message,
    };
  }
}

/**
 * GET /api/brain/{patient_id}/emotions
 * Récupère les dernières émotions mappées sur les régions cérébrales
 */
export async function getBrainEmotions(patientId: string): Promise<EmotionStreamData | null> {
  try {
    const { data, error } = await supabase
      .from('emotion_brain_mappings')
      .select('*')
      .eq('patient_id', patientId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    const mappings = data.mappings as EmotionRegionMap;
    const brainRegions = Object.entries(mappings)
      .filter(([, v]) => v)
      .map(([emotion, value]) => ({
        code: value!.region,
        name: emotion,
        intensity: value!.intensity,
        color: value!.color,
      }));

    return {
      patientId,
      timestamp: data.timestamp,
      emotions: mappings,
      brainRegions,
    };
  } catch (error) {
    logger.error('Erreur récupération émotions', error as Error, 'CONTEXT_LENS');
    return null;
  }
}

/**
 * WebSocket /ws/emotions/{patientId}
 * Stream temps réel des émotions (via Supabase Realtime)
 */
export function subscribeToEmotionStream(
  patientId: string,
  onData: (data: EmotionStreamData) => void,
  onError?: (error: Error) => void
): () => void {
  logger.info('Abonnement stream émotions', { patientId }, 'CONTEXT_LENS');

  const channel = supabase
    .channel(`emotions:${patientId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'emotion_brain_mappings',
        filter: `patient_id=eq.${patientId}`,
      },
      (payload) => {
        const data = payload.new as { timestamp: string; mappings: EmotionRegionMap };
        const mappings = data.mappings;

        const brainRegions = Object.entries(mappings)
          .filter(([, v]) => v)
          .map(([emotion, value]) => ({
            code: value!.region,
            name: emotion,
            intensity: value!.intensity,
            color: value!.color,
          }));

        onData({
          patientId,
          timestamp: data.timestamp,
          emotions: mappings,
          brainRegions,
        });
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        onError?.(new Error('Erreur connexion channel'));
      }
    });

  // Retourner fonction de désabonnement
  return () => {
    logger.info('Désabonnement stream émotions', { patientId }, 'CONTEXT_LENS');
    supabase.removeChannel(channel);
  };
}

/**
 * POST /api/brain/upload
 * Upload et traite un nouveau scan
 */
export async function uploadBrainScan(
  file: File,
  patientId: string,
  options: {
    anonymize?: boolean;
    autoSegment?: boolean;
  } = {}
): Promise<{ scanId: string; status: string } | { error: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('brain-upload', {
      body: {
        patientId,
        fileName: file.name,
        fileSize: file.size,
        anonymize: options.anonymize ?? true,
        autoSegment: options.autoSegment ?? true,
      },
    });

    if (error) throw error;

    return {
      scanId: data.scanId,
      status: data.status,
    };
  } catch (error) {
    logger.error('Erreur upload scan', error as Error, 'CONTEXT_LENS');
    return { error: (error as Error).message };
  }
}

/**
 * Obtenir l'URL publique d'un mesh stocké
 */
async function getMeshPublicUrl(filePath: string): Promise<string | undefined> {
  try {
    const { data } = supabase.storage
      .from('brain-scans')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch {
    return undefined;
  }
}

/**
 * Générer les endpoints REST pour documentation
 */
export function getAPIDocumentation(): object {
  return {
    version: API_VERSION,
    basePath: BASE_PATH,
    endpoints: [
      {
        method: 'POST',
        path: '/upload',
        description: 'Upload fichier DICOM/NIfTI',
        body: { file: 'multipart', patient_id: 'string', anonymize: 'boolean' },
        response: { scan_id: 'string', status: 'string', metadata: 'object' },
      },
      {
        method: 'GET',
        path: '/{patient_id}/scans',
        description: 'Liste des scans du patient',
        response: { scans: 'BrainScan[]' },
      },
      {
        method: 'GET',
        path: '/{patient_id}/mesh',
        description: 'Mesh 3D pour AR',
        query: { format: 'gltf|glb', lod: 'high|medium|low' },
        response: 'Binary glTF',
      },
      {
        method: 'GET',
        path: '/{patient_id}/emotions',
        description: 'Dernières émotions mappées',
        response: { timestamp: 'string', emotions: 'EmotionRegionMap', brain_regions: 'array' },
      },
      {
        method: 'WS',
        path: '/ws/emotions/{patient_id}',
        description: 'Stream temps réel émotions',
        message: { type: 'emotion_update', data: 'EmotionStreamData' },
      },
    ],
  };
}
