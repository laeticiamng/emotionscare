// @ts-nocheck
/**
 * Context-Lens Anatomy API - Vision IRM Corps Entier
 * Ticket EC-ANATOMY-2026-001
 * 
 * Endpoints:
 * - GET ?action=structures&scan_id=X - Liste des structures anatomiques
 * - GET ?action=mesh_bundle&scan_id=X&zone=Y - Bundle de meshes par zone
 * - GET ?action=landmarks&scan_id=X - Landmarks anatomiques
 * - GET ?action=visible_regions&scan_id=X&depth=Z - Régions visibles
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// Registre TotalSegmentator - 104 structures
const STRUCTURE_REGISTRY: Record<string, { name: string; category: string; color: string; priority: number }> = {
  // Head (13)
  brain: { name: 'Cerveau', category: 'organ', color: '#FFB6C1', priority: 1 },
  skull: { name: 'Crâne', category: 'bone', color: '#F5F5DC', priority: 2 },
  eye_left: { name: 'Œil gauche', category: 'organ', color: '#87CEEB', priority: 3 },
  eye_right: { name: 'Œil droit', category: 'organ', color: '#87CEEB', priority: 3 },
  lens_left: { name: 'Cristallin gauche', category: 'organ', color: '#E0FFFF', priority: 4 },
  lens_right: { name: 'Cristallin droit', category: 'organ', color: '#E0FFFF', priority: 4 },
  optic_nerve_left: { name: 'Nerf optique gauche', category: 'nerve', color: '#FFD700', priority: 5 },
  optic_nerve_right: { name: 'Nerf optique droit', category: 'nerve', color: '#FFD700', priority: 5 },
  parotid_left: { name: 'Parotide gauche', category: 'gland', color: '#DDA0DD', priority: 6 },
  parotid_right: { name: 'Parotide droite', category: 'gland', color: '#DDA0DD', priority: 6 },
  submandibular_left: { name: 'Sous-maxillaire gauche', category: 'gland', color: '#DA70D6', priority: 7 },
  submandibular_right: { name: 'Sous-maxillaire droite', category: 'gland', color: '#DA70D6', priority: 7 },
  thyroid: { name: 'Thyroïde', category: 'gland', color: '#FF69B4', priority: 3 },

  // Spine (27)
  vertebrae_C1: { name: 'Vertèbre C1 (Atlas)', category: 'bone', color: '#F0E68C', priority: 1 },
  vertebrae_C2: { name: 'Vertèbre C2 (Axis)', category: 'bone', color: '#F0E68C', priority: 1 },
  vertebrae_C3: { name: 'Vertèbre C3', category: 'bone', color: '#F0E68C', priority: 2 },
  vertebrae_C4: { name: 'Vertèbre C4', category: 'bone', color: '#F0E68C', priority: 2 },
  vertebrae_C5: { name: 'Vertèbre C5', category: 'bone', color: '#F0E68C', priority: 2 },
  vertebrae_C6: { name: 'Vertèbre C6', category: 'bone', color: '#F0E68C', priority: 2 },
  vertebrae_C7: { name: 'Vertèbre C7', category: 'bone', color: '#F0E68C', priority: 2 },
  vertebrae_T1: { name: 'Vertèbre T1', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_T2: { name: 'Vertèbre T2', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_T3: { name: 'Vertèbre T3', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_T4: { name: 'Vertèbre T4', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_T5: { name: 'Vertèbre T5', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_T6: { name: 'Vertèbre T6', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_T7: { name: 'Vertèbre T7', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_T8: { name: 'Vertèbre T8', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_T9: { name: 'Vertèbre T9', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_T10: { name: 'Vertèbre T10', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_T11: { name: 'Vertèbre T11', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_T12: { name: 'Vertèbre T12', category: 'bone', color: '#EEE8AA', priority: 3 },
  vertebrae_L1: { name: 'Vertèbre L1', category: 'bone', color: '#FAFAD2', priority: 4 },
  vertebrae_L2: { name: 'Vertèbre L2', category: 'bone', color: '#FAFAD2', priority: 4 },
  vertebrae_L3: { name: 'Vertèbre L3', category: 'bone', color: '#FAFAD2', priority: 4 },
  vertebrae_L4: { name: 'Vertèbre L4', category: 'bone', color: '#FAFAD2', priority: 4 },
  vertebrae_L5: { name: 'Vertèbre L5', category: 'bone', color: '#FAFAD2', priority: 4 },
  sacrum: { name: 'Sacrum', category: 'bone', color: '#FFE4B5', priority: 5 },
  coccyx: { name: 'Coccyx', category: 'bone', color: '#FFDAB9', priority: 6 },
  spinal_cord: { name: 'Moelle épinière', category: 'nerve', color: '#FFA07A', priority: 1 },

  // Thorax (42)
  lung_upper_lobe_left: { name: 'Poumon lobe supérieur gauche', category: 'organ', color: '#FFB6C1', priority: 1 },
  lung_lower_lobe_left: { name: 'Poumon lobe inférieur gauche', category: 'organ', color: '#FFC0CB', priority: 1 },
  lung_upper_lobe_right: { name: 'Poumon lobe supérieur droit', category: 'organ', color: '#FFB6C1', priority: 1 },
  lung_middle_lobe_right: { name: 'Poumon lobe moyen droit', category: 'organ', color: '#FFD1DC', priority: 1 },
  lung_lower_lobe_right: { name: 'Poumon lobe inférieur droit', category: 'organ', color: '#FFC0CB', priority: 1 },
  trachea: { name: 'Trachée', category: 'organ', color: '#ADD8E6', priority: 2 },
  bronchus_left: { name: 'Bronche gauche', category: 'organ', color: '#87CEFA', priority: 3 },
  bronchus_right: { name: 'Bronche droite', category: 'organ', color: '#87CEFA', priority: 3 },
  heart: { name: 'Cœur', category: 'organ', color: '#DC143C', priority: 1 },
  aorta: { name: 'Aorte', category: 'vessel', color: '#FF4500', priority: 1 },
  pulmonary_artery: { name: 'Artère pulmonaire', category: 'vessel', color: '#4169E1', priority: 2 },
  esophagus: { name: 'Œsophage', category: 'organ', color: '#DEB887', priority: 4 },
  rib_left_1: { name: 'Côte gauche 1', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_left_2: { name: 'Côte gauche 2', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_left_3: { name: 'Côte gauche 3', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_left_4: { name: 'Côte gauche 4', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_left_5: { name: 'Côte gauche 5', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_left_6: { name: 'Côte gauche 6', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_left_7: { name: 'Côte gauche 7', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_left_8: { name: 'Côte gauche 8', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_left_9: { name: 'Côte gauche 9', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_left_10: { name: 'Côte gauche 10', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_left_11: { name: 'Côte gauche 11', category: 'bone', color: '#F5DEB3', priority: 6 },
  rib_left_12: { name: 'Côte gauche 12', category: 'bone', color: '#F5DEB3', priority: 6 },
  rib_right_1: { name: 'Côte droite 1', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_right_2: { name: 'Côte droite 2', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_right_3: { name: 'Côte droite 3', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_right_4: { name: 'Côte droite 4', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_right_5: { name: 'Côte droite 5', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_right_6: { name: 'Côte droite 6', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_right_7: { name: 'Côte droite 7', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_right_8: { name: 'Côte droite 8', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_right_9: { name: 'Côte droite 9', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_right_10: { name: 'Côte droite 10', category: 'bone', color: '#F5DEB3', priority: 5 },
  rib_right_11: { name: 'Côte droite 11', category: 'bone', color: '#F5DEB3', priority: 6 },
  rib_right_12: { name: 'Côte droite 12', category: 'bone', color: '#F5DEB3', priority: 6 },
  sternum: { name: 'Sternum', category: 'bone', color: '#FAEBD7', priority: 4 },
  clavicula_left: { name: 'Clavicule gauche', category: 'bone', color: '#FFE4C4', priority: 3 },
  clavicula_right: { name: 'Clavicule droite', category: 'bone', color: '#FFE4C4', priority: 3 },
  scapula_left: { name: 'Omoplate gauche', category: 'bone', color: '#FFDEAD', priority: 4 },
  scapula_right: { name: 'Omoplate droite', category: 'bone', color: '#FFDEAD', priority: 4 },

  // Abdomen (15)
  liver: { name: 'Foie', category: 'organ', color: '#8B4513', priority: 1 },
  spleen: { name: 'Rate', category: 'organ', color: '#800020', priority: 2 },
  kidney_left: { name: 'Rein gauche', category: 'organ', color: '#CD5C5C', priority: 1 },
  kidney_right: { name: 'Rein droit', category: 'organ', color: '#CD5C5C', priority: 1 },
  gallbladder: { name: 'Vésicule biliaire', category: 'organ', color: '#228B22', priority: 3 },
  stomach: { name: 'Estomac', category: 'organ', color: '#FFA500', priority: 2 },
  pancreas: { name: 'Pancréas', category: 'organ', color: '#F4A460', priority: 2 },
  adrenal_left: { name: 'Surrénale gauche', category: 'gland', color: '#DAA520', priority: 4 },
  adrenal_right: { name: 'Surrénale droite', category: 'gland', color: '#DAA520', priority: 4 },
  duodenum: { name: 'Duodénum', category: 'organ', color: '#DEB887', priority: 3 },
  small_bowel: { name: 'Intestin grêle', category: 'organ', color: '#F5DEB3', priority: 4 },
  colon: { name: 'Côlon', category: 'organ', color: '#D2B48C', priority: 3 },
  urinary_bladder: { name: 'Vessie', category: 'organ', color: '#FFD700', priority: 2 },
  prostate: { name: 'Prostate', category: 'organ', color: '#8B0000', priority: 3 },
  uterus: { name: 'Utérus', category: 'organ', color: '#FF1493', priority: 3 },

  // Pelvis (14)
  hip_left: { name: 'Hanche gauche', category: 'bone', color: '#FFEFD5', priority: 1 },
  hip_right: { name: 'Hanche droite', category: 'bone', color: '#FFEFD5', priority: 1 },
  femur_left: { name: 'Fémur gauche', category: 'bone', color: '#FFE4B5', priority: 2 },
  femur_right: { name: 'Fémur droit', category: 'bone', color: '#FFE4B5', priority: 2 },
  gluteus_maximus_left: { name: 'Grand fessier gauche', category: 'muscle', color: '#BC8F8F', priority: 3 },
  gluteus_maximus_right: { name: 'Grand fessier droit', category: 'muscle', color: '#BC8F8F', priority: 3 },
  gluteus_medius_left: { name: 'Moyen fessier gauche', category: 'muscle', color: '#C08080', priority: 4 },
  gluteus_medius_right: { name: 'Moyen fessier droit', category: 'muscle', color: '#C08080', priority: 4 },
  gluteus_minimus_left: { name: 'Petit fessier gauche', category: 'muscle', color: '#D09090', priority: 5 },
  gluteus_minimus_right: { name: 'Petit fessier droit', category: 'muscle', color: '#D09090', priority: 5 },
  iliacus_left: { name: 'Iliaque gauche', category: 'muscle', color: '#E0A0A0', priority: 4 },
  iliacus_right: { name: 'Iliaque droit', category: 'muscle', color: '#E0A0A0', priority: 4 },
  psoas_left: { name: 'Psoas gauche', category: 'muscle', color: '#CD853F', priority: 3 },
  psoas_right: { name: 'Psoas droit', category: 'muscle', color: '#CD853F', priority: 3 },

  // Vascular (7)
  inferior_vena_cava: { name: 'Veine cave inférieure', category: 'vessel', color: '#4169E1', priority: 1 },
  portal_vein: { name: 'Veine porte', category: 'vessel', color: '#6495ED', priority: 2 },
  iliac_artery_left: { name: 'Artère iliaque gauche', category: 'vessel', color: '#FF6347', priority: 3 },
  iliac_artery_right: { name: 'Artère iliaque droite', category: 'vessel', color: '#FF6347', priority: 3 },
  iliac_vein_left: { name: 'Veine iliaque gauche', category: 'vessel', color: '#4682B4', priority: 4 },
  iliac_vein_right: { name: 'Veine iliaque droite', category: 'vessel', color: '#4682B4', priority: 4 },
};

// Mapping zone -> structures
const ZONE_STRUCTURES: Record<string, string[]> = {
  head: ['brain', 'skull', 'eye_left', 'eye_right', 'lens_left', 'lens_right', 'optic_nerve_left', 'optic_nerve_right', 'parotid_left', 'parotid_right', 'submandibular_left', 'submandibular_right', 'thyroid'],
  spine: ['vertebrae_C1', 'vertebrae_C2', 'vertebrae_C3', 'vertebrae_C4', 'vertebrae_C5', 'vertebrae_C6', 'vertebrae_C7', 'vertebrae_T1', 'vertebrae_T2', 'vertebrae_T3', 'vertebrae_T4', 'vertebrae_T5', 'vertebrae_T6', 'vertebrae_T7', 'vertebrae_T8', 'vertebrae_T9', 'vertebrae_T10', 'vertebrae_T11', 'vertebrae_T12', 'vertebrae_L1', 'vertebrae_L2', 'vertebrae_L3', 'vertebrae_L4', 'vertebrae_L5', 'sacrum', 'coccyx', 'spinal_cord'],
  thorax: ['lung_upper_lobe_left', 'lung_lower_lobe_left', 'lung_upper_lobe_right', 'lung_middle_lobe_right', 'lung_lower_lobe_right', 'trachea', 'bronchus_left', 'bronchus_right', 'heart', 'aorta', 'pulmonary_artery', 'esophagus', 'rib_left_1', 'rib_left_2', 'rib_left_3', 'rib_left_4', 'rib_left_5', 'rib_left_6', 'rib_left_7', 'rib_left_8', 'rib_left_9', 'rib_left_10', 'rib_left_11', 'rib_left_12', 'rib_right_1', 'rib_right_2', 'rib_right_3', 'rib_right_4', 'rib_right_5', 'rib_right_6', 'rib_right_7', 'rib_right_8', 'rib_right_9', 'rib_right_10', 'rib_right_11', 'rib_right_12', 'sternum', 'clavicula_left', 'clavicula_right', 'scapula_left', 'scapula_right'],
  abdomen: ['liver', 'spleen', 'kidney_left', 'kidney_right', 'gallbladder', 'stomach', 'pancreas', 'adrenal_left', 'adrenal_right', 'duodenum', 'small_bowel', 'colon', 'urinary_bladder', 'prostate', 'uterus'],
  pelvis: ['hip_left', 'hip_right', 'femur_left', 'femur_right', 'gluteus_maximus_left', 'gluteus_maximus_right', 'gluteus_medius_left', 'gluteus_medius_right', 'gluteus_minimus_left', 'gluteus_minimus_right', 'iliacus_left', 'iliacus_right', 'psoas_left', 'psoas_right'],
  vascular: ['aorta', 'inferior_vena_cava', 'portal_vein', 'iliac_artery_left', 'iliac_artery_right', 'iliac_vein_left', 'iliac_vein_right'],
};

// Adjacences pour navigation
const ZONE_ADJACENCY: Record<string, string[]> = {
  head: ['spine'],
  spine: ['head', 'thorax', 'abdomen', 'pelvis'],
  thorax: ['spine', 'abdomen'],
  abdomen: ['thorax', 'spine', 'pelvis', 'vascular'],
  pelvis: ['spine', 'abdomen', 'vascular'],
  vascular: ['abdomen', 'pelvis', 'thorax'],
};

// Landmarks par défaut
const DEFAULT_LANDMARKS = [
  { code: 'C7_spinous', name: 'Processus épineux C7', position: [0, 0, 150] },
  { code: 'sternal_notch', name: 'Incisure jugulaire', position: [0, 50, 140] },
  { code: 'xiphoid', name: 'Processus xiphoïde', position: [0, 60, 100] },
  { code: 'umbilicus', name: 'Ombilic', position: [0, 70, 50] },
  { code: 'pubic_symphysis', name: 'Symphyse pubienne', position: [0, 80, 0] },
  { code: 'L4_spinous', name: 'Processus épineux L4', position: [0, -20, 40] },
  { code: 'iliac_crest_left', name: 'Crête iliaque gauche', position: [-80, 60, 30] },
  { code: 'iliac_crest_right', name: 'Crête iliaque droite', position: [80, 60, 30] },
];

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const scanId = url.searchParams.get('scan_id');

    // Authentification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', message: 'Token requis' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: authError } = await supabase.auth.getUser(token);
    if (authError || !claims?.user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', message: 'Token invalide' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!scanId) {
      return new Response(
        JSON.stringify({ error: 'bad_request', message: 'scan_id requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier que le scan existe
    const { data: scan, error: scanError } = await supabase
      .from('wholebody_scans')
      .select('*')
      .eq('id', scanId)
      .maybeSingle();

    if (scanError || !scan) {
      return new Response(
        JSON.stringify({ error: 'not_found', message: 'Scan non trouvé' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'structures': {
        const zone = url.searchParams.get('zone');
        const category = url.searchParams.get('category');
        const lod = url.searchParams.get('lod') || 'medium';

        let query = supabase
          .from('anatomical_structures')
          .select('*')
          .eq('scan_id', scanId);

        if (zone && ZONE_STRUCTURES[zone]) {
          query = query.in('structure_code', ZONE_STRUCTURES[zone]);
        }
        if (category) {
          query = query.eq('structure_category', category);
        }

        const { data: structures, error: structError } = await query.order('priority', { ascending: true });

        if (structError) {
          console.error('[ANATOMY] Erreur structures:', structError);
          return new Response(
            JSON.stringify({ error: 'db_error', message: structError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Si pas de structures en DB, retourner les structures par défaut du registre
        if (!structures || structures.length === 0) {
          const zoneStructures = zone ? ZONE_STRUCTURES[zone] : Object.keys(STRUCTURE_REGISTRY);
          const defaultStructures = zoneStructures
            .filter((code) => STRUCTURE_REGISTRY[code])
            .map((code) => ({
              id: `default-${code}`,
              scan_id: scanId,
              structure_code: code,
              structure_name: STRUCTURE_REGISTRY[code].name,
              structure_category: STRUCTURE_REGISTRY[code].category,
              body_zone: zone || 'unknown',
              default_color: STRUCTURE_REGISTRY[code].color,
              priority: STRUCTURE_REGISTRY[code].priority,
            }));

          return new Response(
            JSON.stringify({ structures: defaultStructures, source: 'registry' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ structures, source: 'database' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'mesh_bundle': {
        const zone = url.searchParams.get('zone') || 'thorax';
        const lod = url.searchParams.get('lod') || 'medium';

        const zoneStructureCodes = ZONE_STRUCTURES[zone] || [];
        const { data: structures, error } = await supabase
          .from('anatomical_structures')
          .select('structure_code, mesh_file_path_low, mesh_file_path_medium, mesh_file_path_high, default_color')
          .eq('scan_id', scanId)
          .in('structure_code', zoneStructureCodes);

        const meshField = lod === 'low' ? 'mesh_file_path_low' : lod === 'high' ? 'mesh_file_path_high' : 'mesh_file_path_medium';

        const bundle = {
          zone,
          lod,
          adjacent_zones: ZONE_ADJACENCY[zone] || [],
          structures: (structures || [])
            .filter((s: any) => s[meshField])
            .map((s: any) => ({
              code: s.structure_code,
              mesh_url: `${SUPABASE_URL}/storage/v1/object/public/anatomy-meshes/${s[meshField]}`,
              color: s.default_color,
            })),
          total_size_kb: (structures || []).length * 150, // Estimation
        };

        return new Response(
          JSON.stringify(bundle),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'landmarks': {
        const { data: landmarks, error } = await supabase
          .from('anatomical_landmarks')
          .select('*')
          .eq('scan_id', scanId);

        // Fallback sur landmarks par défaut
        const result = landmarks && landmarks.length > 0 ? landmarks : DEFAULT_LANDMARKS.map((l, i) => ({
          id: `default-landmark-${i}`,
          scan_id: scanId,
          ...l,
          confidence: 0.95,
          detection_method: 'default',
        }));

        return new Response(
          JSON.stringify({ landmarks: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'visible_regions': {
        const depth = parseFloat(url.searchParams.get('depth') || '0');
        const positionStr = url.searchParams.get('position');
        
        // Déterminer les zones visibles selon la profondeur
        const allZones = Object.keys(ZONE_STRUCTURES);
        const visibleZones = allZones.filter((_, idx) => {
          const zoneDepth = idx * 50; // Approximation
          return Math.abs(zoneDepth - depth) < 100;
        });

        const visibleStructures = visibleZones.flatMap((zone) => ZONE_STRUCTURES[zone] || []);

        return new Response(
          JSON.stringify({ 
            visible_regions: visibleStructures,
            depth,
            zones: visibleZones,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'bad_request', message: `Action inconnue: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('[ANATOMY] Erreur:', error);
    return new Response(
      JSON.stringify({ error: 'server_error', message: 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
