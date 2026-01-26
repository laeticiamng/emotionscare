/**
 * Hook pour gérer les données du cerveau (scans, régions, annotations)
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { parseDicomFile, isDicomFile, anonymizeDicomMetadata } from '@/services/dicom/dicomParser';
import { parseNiftiFile, isNiftiFile } from '@/services/dicom/niftiParser';
import { generateBrainMesh, generatePlaceholderBrain, type GeneratedMesh } from '@/services/dicom/meshGenerator';
import type { BrainScan, BrainRegion, BrainAnnotation, ScanModality } from '@/components/brain/types';

export interface UseBrainDataReturn {
  scans: BrainScan[];
  currentScan: BrainScan | null;
  regions: BrainRegion[];
  annotations: BrainAnnotation[];
  mesh: GeneratedMesh | null;
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  uploadScan: (file: File, anonymize?: boolean) => Promise<BrainScan | null>;
  selectScan: (scanId: string) => Promise<void>;
  deleteScan: (scanId: string) => Promise<boolean>;
  addAnnotation: (annotation: Omit<BrainAnnotation, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  refreshScans: () => Promise<void>;
}

export function useBrainData(): UseBrainDataReturn {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [scans, setScans] = useState<BrainScan[]>([]);
  const [currentScan, setCurrentScan] = useState<BrainScan | null>(null);
  const [regions, setRegions] = useState<BrainRegion[]>([]);
  const [annotations, setAnnotations] = useState<BrainAnnotation[]>([]);
  const [mesh, setMesh] = useState<GeneratedMesh | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les scans de l'utilisateur
  const refreshScans = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('brain_scans')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setScans(data as BrainScan[]);
    } catch (err) {
      logger.error('Erreur chargement scans', err as Error, 'BRAIN_DATA');
      setError('Impossible de charger les scans');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  useEffect(() => {
    refreshScans();
  }, [refreshScans]);
  
  // Upload d'un scan
  const uploadScan = useCallback(async (file: File, anonymize = false): Promise<BrainScan | null> => {
    if (!user?.id) {
      toast({ title: 'Erreur', description: 'Vous devez être connecté', variant: 'destructive' });
      return null;
    }
    
    // Validation taille
    const maxSize = 500 * 1024 * 1024; // 500 MB
    if (file.size > maxSize) {
      toast({ 
        title: 'Fichier trop volumineux', 
        description: 'La taille maximale est de 500 MB',
        variant: 'destructive'
      });
      return null;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      let modality: ScanModality = 'MRI_T1';
      let metadata: Record<string, unknown> = {};
      let dimensions: [number, number, number] | undefined;
      let voxelSize: [number, number, number] | undefined;
      let volumeData: Float32Array | undefined;
      
      // Parser selon le type de fichier
      if (isDicomFile(file)) {
        const result = await parseDicomFile(file);
        if (!result.success) throw new Error(result.error);
        
        modality = (result.metadata?.modality as ScanModality) || 'MRI_T1';
        dimensions = result.metadata?.dimensions;
        const dicomMeta = anonymize && result.metadata 
          ? anonymizeDicomMetadata(result.metadata) 
          : result.metadata;
        metadata = dicomMeta ? { ...dicomMeta } : {};
          
      } else if (isNiftiFile(file)) {
        const result = await parseNiftiFile(file);
        if (!result.success) throw new Error(result.error);
        
        modality = 'NIfTI';
        dimensions = result.dimensions;
        voxelSize = result.voxelSize;
        volumeData = result.data;
        metadata = { header: result.header };
        
      } else {
        throw new Error('Format de fichier non supporté. Utilisez DICOM (.dcm) ou NIfTI (.nii, .nii.gz)');
      }
      
      // Upload du fichier vers Supabase Storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('brain-scans')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Créer l'entrée en base
      const { data: scanData, error: insertError } = await supabase
        .from('brain_scans')
        .insert({
          patient_id: user.id,
          modality,
          dimensions: dimensions || [256, 256, 128],
          voxel_size: voxelSize || [1, 1, 1],
          original_file_path: filePath,
          status: 'processing',
          metadata,
          is_anonymized: anonymize,
          study_date: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      const scan = scanData as BrainScan;
      
      // Générer le maillage si on a des données volumétriques
      if (volumeData && dimensions && voxelSize) {
        const generatedMesh = generateBrainMesh(volumeData, dimensions, voxelSize);
        setMesh(generatedMesh);
        
        // Sauvegarder les régions
        for (const region of generatedMesh.regions) {
          await supabase.from('brain_regions').insert({
            scan_id: scan.id,
            region_code: region.regionCode,
            region_name: region.regionName,
            hemisphere: region.hemisphere as 'left' | 'right' | 'bilateral',
            default_color: region.color,
          });
        }
      }
      
      // Mettre à jour le statut
      await supabase
        .from('brain_scans')
        .update({ status: 'ready' })
        .eq('id', scan.id);
      
      scan.status = 'ready';
      setScans(prev => [scan, ...prev]);
      setCurrentScan(scan);
      
      toast({
        title: 'Scan importé avec succès',
        description: `${file.name} est prêt pour la visualisation`,
      });
      
      logger.info('Scan uploadé', { scanId: scan.id, modality }, 'BRAIN_DATA');
      
      return scan;
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'import';
      logger.error('Erreur upload scan', err as Error, 'BRAIN_DATA');
      setError(message);
      toast({ title: 'Erreur', description: message, variant: 'destructive' });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, toast]);
  
  // Sélectionner un scan
  const selectScan = useCallback(async (scanId: string) => {
    setIsLoading(true);
    try {
      // Charger le scan
      const { data: scanData, error: scanError } = await supabase
        .from('brain_scans')
        .select('*')
        .eq('id', scanId)
        .single();
      
      if (scanError) throw scanError;
      
      setCurrentScan(scanData as BrainScan);
      
      // Charger les régions
      const { data: regionsData } = await supabase
        .from('brain_regions')
        .select('*')
        .eq('scan_id', scanId);
      
      setRegions((regionsData as BrainRegion[]) || []);
      
      // Charger les annotations
      const { data: annotationsData } = await supabase
        .from('brain_annotations')
        .select('*')
        .eq('scan_id', scanId);
      
      setAnnotations((annotationsData as BrainAnnotation[]) || []);
      
      // Générer un mesh placeholder si pas de données
      if (!mesh) {
        const placeholderGeometry = generatePlaceholderBrain();
        setMesh({
          geometry: placeholderGeometry,
          regions: [],
          boundingBox: placeholderGeometry.boundingBox!,
        });
      }
      
    } catch (err) {
      logger.error('Erreur sélection scan', err as Error, 'BRAIN_DATA');
      setError('Impossible de charger le scan');
    } finally {
      setIsLoading(false);
    }
  }, [mesh]);
  
  // Supprimer un scan
  const deleteScan = useCallback(async (scanId: string): Promise<boolean> => {
    try {
      const scan = scans.find(s => s.id === scanId);
      
      // Supprimer le fichier du storage
      if (scan?.original_file_path) {
        await supabase.storage
          .from('brain-scans')
          .remove([scan.original_file_path]);
      }
      
      // Supprimer de la base
      const { error } = await supabase
        .from('brain_scans')
        .delete()
        .eq('id', scanId);
      
      if (error) throw error;
      
      setScans(prev => prev.filter(s => s.id !== scanId));
      if (currentScan?.id === scanId) {
        setCurrentScan(null);
        setMesh(null);
      }
      
      toast({ title: 'Scan supprimé' });
      return true;
      
    } catch (err) {
      logger.error('Erreur suppression scan', err as Error, 'BRAIN_DATA');
      toast({ title: 'Erreur', description: 'Impossible de supprimer le scan', variant: 'destructive' });
      return false;
    }
  }, [scans, currentScan, toast]);
  
  // Ajouter une annotation
  const addAnnotation = useCallback(async (
    annotation: Omit<BrainAnnotation, 'id' | 'created_at' | 'updated_at'>
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('brain_annotations')
        .insert(annotation)
        .select()
        .single();
      
      if (error) throw error;
      
      setAnnotations(prev => [...prev, data as BrainAnnotation]);
      toast({ title: 'Annotation ajoutée' });
      return true;
      
    } catch (err) {
      logger.error('Erreur ajout annotation', err as Error, 'BRAIN_DATA');
      return false;
    }
  }, [toast]);
  
  return {
    scans,
    currentScan,
    regions,
    annotations,
    mesh,
    isLoading,
    isProcessing,
    error,
    uploadScan,
    selectScan,
    deleteScan,
    addAnnotation,
    refreshScans,
  };
}
