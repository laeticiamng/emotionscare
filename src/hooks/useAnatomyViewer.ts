// @ts-nocheck
/**
 * Hook pour le visualiseur anatomique corps entier
 * Ticket EC-ANATOMY-2026-001
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAnatomicalStructures,
  getMeshBundle,
  getAnatomicalLandmarks,
  getVisibleRegions,
  getWholebodyScan,
  listPatientScans,
  BODY_ZONES,
  type AnatomicalStructure,
  type AnatomicalLandmark,
  type WholebodyScan,
  type MeshBundle,
} from '@/services/anatomyService';

export type LODLevel = 'low' | 'medium' | 'high';

interface UseAnatomyViewerOptions {
  scanId?: string;
  patientId?: string;
  initialZone?: string;
  initialLod?: LODLevel;
}

interface ViewerState {
  activeZone: string;
  lod: LODLevel;
  selectedStructures: string[];
  highlightedStructure: string | null;
  showLandmarks: boolean;
  opacity: number;
  clipPlane: { enabled: boolean; position: number; axis: 'x' | 'y' | 'z' };
}

export function useAnatomyViewer(options: UseAnatomyViewerOptions = {}) {
  const { scanId, patientId, initialZone = 'thorax', initialLod = 'medium' } = options;
  const queryClient = useQueryClient();

  // État du visualiseur
  const [viewerState, setViewerState] = useState<ViewerState>({
    activeZone: initialZone,
    lod: initialLod,
    selectedStructures: [],
    highlightedStructure: null,
    showLandmarks: true,
    opacity: 1,
    clipPlane: { enabled: false, position: 0.5, axis: 'z' },
  });

  // Récupérer le scan
  const scanQuery = useQuery({
    queryKey: ['wholebody-scan', scanId],
    queryFn: () => getWholebodyScan(scanId!),
    enabled: !!scanId,
    staleTime: 5 * 60 * 1000,
  });

  // Lister les scans du patient
  const patientScansQuery = useQuery({
    queryKey: ['patient-scans', patientId],
    queryFn: () => listPatientScans(patientId!),
    enabled: !!patientId && !scanId,
    staleTime: 5 * 60 * 1000,
  });

  // Récupérer les structures de la zone active
  const structuresQuery = useQuery({
    queryKey: ['anatomical-structures', scanId, viewerState.activeZone, viewerState.lod],
    queryFn: () =>
      getAnatomicalStructures(scanId!, {
        zone: viewerState.activeZone,
        lod: viewerState.lod,
      }),
    enabled: !!scanId,
    staleTime: 10 * 60 * 1000,
  });

  // Récupérer le bundle de meshes
  const meshBundleQuery = useQuery({
    queryKey: ['mesh-bundle', scanId, viewerState.activeZone, viewerState.lod],
    queryFn: () => getMeshBundle(scanId!, viewerState.activeZone, viewerState.lod),
    enabled: !!scanId,
    staleTime: 30 * 60 * 1000,
  });

  // Récupérer les landmarks
  const landmarksQuery = useQuery({
    queryKey: ['anatomical-landmarks', scanId],
    queryFn: () => getAnatomicalLandmarks(scanId!),
    enabled: !!scanId && viewerState.showLandmarks,
    staleTime: 30 * 60 * 1000,
  });

  // Actions
  const setActiveZone = useCallback((zone: string) => {
    if (BODY_ZONES.includes(zone)) {
      setViewerState((prev) => ({ ...prev, activeZone: zone }));
    }
  }, []);

  const setLod = useCallback((lod: LODLevel) => {
    setViewerState((prev) => ({ ...prev, lod }));
  }, []);

  const toggleStructure = useCallback((structureCode: string) => {
    setViewerState((prev) => ({
      ...prev,
      selectedStructures: prev.selectedStructures.includes(structureCode)
        ? prev.selectedStructures.filter((s) => s !== structureCode)
        : [...prev.selectedStructures, structureCode],
    }));
  }, []);

  const selectAllStructures = useCallback(() => {
    const allCodes = structuresQuery.data?.data?.map((s) => s.structure_code) || [];
    setViewerState((prev) => ({ ...prev, selectedStructures: allCodes }));
  }, [structuresQuery.data]);

  const clearSelection = useCallback(() => {
    setViewerState((prev) => ({ ...prev, selectedStructures: [] }));
  }, []);

  const highlightStructure = useCallback((structureCode: string | null) => {
    setViewerState((prev) => ({ ...prev, highlightedStructure: structureCode }));
  }, []);

  const toggleLandmarks = useCallback(() => {
    setViewerState((prev) => ({ ...prev, showLandmarks: !prev.showLandmarks }));
  }, []);

  const setOpacity = useCallback((opacity: number) => {
    setViewerState((prev) => ({ ...prev, opacity: Math.max(0, Math.min(1, opacity)) }));
  }, []);

  const setClipPlane = useCallback(
    (config: Partial<ViewerState['clipPlane']>) => {
      setViewerState((prev) => ({
        ...prev,
        clipPlane: { ...prev.clipPlane, ...config },
      }));
    },
    []
  );

  // Précharger les zones adjacentes
  const prefetchAdjacentZones = useCallback(() => {
    if (!scanId) return;

    const zoneIndex = BODY_ZONES.indexOf(viewerState.activeZone);
    const adjacentZones = [
      BODY_ZONES[zoneIndex - 1],
      BODY_ZONES[zoneIndex + 1],
    ].filter(Boolean);

    adjacentZones.forEach((zone) => {
      queryClient.prefetchQuery({
        queryKey: ['mesh-bundle', scanId, zone, viewerState.lod],
        queryFn: () => getMeshBundle(scanId, zone, viewerState.lod),
        staleTime: 30 * 60 * 1000,
      });
    });
  }, [scanId, viewerState.activeZone, viewerState.lod, queryClient]);

  // Structures filtrées par sélection
  const visibleStructures = useMemo(() => {
    const structures = structuresQuery.data?.data || [];
    if (viewerState.selectedStructures.length === 0) return structures;
    return structures.filter((s) =>
      viewerState.selectedStructures.includes(s.structure_code)
    );
  }, [structuresQuery.data, viewerState.selectedStructures]);

  // Stats
  const stats = useMemo(() => {
    const structures = structuresQuery.data?.data || [];
    return {
      totalStructures: structures.length,
      selectedCount: viewerState.selectedStructures.length,
      totalVolume: structures.reduce((acc, s) => acc + (s.volume_ml || 0), 0),
      categories: [...new Set(structures.map((s) => s.structure_category))],
    };
  }, [structuresQuery.data, viewerState.selectedStructures]);

  return {
    // État
    viewerState,
    scan: scanQuery.data?.data,
    patientScans: patientScansQuery.data?.data || [],
    structures: structuresQuery.data?.data || [],
    visibleStructures,
    meshBundle: meshBundleQuery.data?.data,
    landmarks: landmarksQuery.data?.data || [],
    stats,

    // Chargement
    isLoading:
      scanQuery.isLoading ||
      structuresQuery.isLoading ||
      meshBundleQuery.isLoading,
    isLoadingLandmarks: landmarksQuery.isLoading,

    // Erreurs
    error:
      scanQuery.data?.error ||
      structuresQuery.data?.error ||
      meshBundleQuery.data?.error,

    // Actions
    setActiveZone,
    setLod,
    toggleStructure,
    selectAllStructures,
    clearSelection,
    highlightStructure,
    toggleLandmarks,
    setOpacity,
    setClipPlane,
    prefetchAdjacentZones,

    // Zones disponibles
    bodyZones: BODY_ZONES,
  };
}

export type { AnatomicalStructure, AnatomicalLandmark, WholebodyScan, MeshBundle };
