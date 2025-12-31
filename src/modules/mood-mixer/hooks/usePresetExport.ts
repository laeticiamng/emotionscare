// @ts-nocheck
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import type { MoodPreset } from '../useMoodMixerEnriched';

export interface ExportedPresetData {
  version: string;
  exportedAt: string;
  presets: MoodPreset[];
}

export interface UsePresetExportReturn {
  exportPresets: (presets: MoodPreset[], filename?: string) => void;
  importFromFile: (file: File) => Promise<MoodPreset[]>;
  exportToClipboard: (presets: MoodPreset[]) => void;
  importFromClipboard: () => Promise<MoodPreset[]>;
  isExporting: boolean;
  isImporting: boolean;
}

const EXPORT_VERSION = '1.0';

export function usePresetExport(): UsePresetExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const createExportData = (presets: MoodPreset[]): ExportedPresetData => ({
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    presets: presets.map(p => ({
      ...p,
      id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isBuiltIn: false,
    })),
  });

  const validateImportData = (data: unknown): data is ExportedPresetData => {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    
    if (typeof obj.version !== 'string') return false;
    if (!Array.isArray(obj.presets)) return false;
    
    return obj.presets.every(preset => {
      if (typeof preset !== 'object' || preset === null) return false;
      const p = preset as Record<string, unknown>;
      return typeof p.name === 'string' && Array.isArray(p.components);
    });
  };

  const exportPresets = useCallback((presets: MoodPreset[], filename = 'mood-mixer-presets') => {
    setIsExporting(true);
    try {
      const exportData = createExportData(presets);
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast.success(`${presets.length} preset(s) exporté(s)`);
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  }, []);

  const importFromFile = useCallback(async (file: File): Promise<MoodPreset[]> => {
    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!validateImportData(data)) {
        toast.error('Format de fichier invalide');
        return [];
      }

      const importedPresets = data.presets.map(p => ({
        ...p,
        id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isBuiltIn: false,
        isFavorite: false,
      }));

      toast.success(`${importedPresets.length} preset(s) importé(s)`);
      return importedPresets;
    } catch (error) {
      console.error('Erreur import:', error);
      toast.error('Erreur lors de l\'import du fichier');
      return [];
    } finally {
      setIsImporting(false);
    }
  }, []);

  const exportToClipboard = useCallback(async (presets: MoodPreset[]) => {
    setIsExporting(true);
    try {
      const exportData = createExportData(presets);
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      toast.success('Presets copiés dans le presse-papiers');
    } catch (error) {
      console.error('Erreur copie:', error);
      toast.error('Erreur lors de la copie');
    } finally {
      setIsExporting(false);
    }
  }, []);

  const importFromClipboard = useCallback(async (): Promise<MoodPreset[]> => {
    setIsImporting(true);
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);
      
      if (!validateImportData(data)) {
        toast.error('Données du presse-papiers invalides');
        return [];
      }

      const importedPresets = data.presets.map(p => ({
        ...p,
        id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isBuiltIn: false,
        isFavorite: false,
      }));

      toast.success(`${importedPresets.length} preset(s) importé(s)`);
      return importedPresets;
    } catch (error) {
      console.error('Erreur import clipboard:', error);
      toast.error('Erreur lors de l\'import depuis le presse-papiers');
      return [];
    } finally {
      setIsImporting(false);
    }
  }, []);

  return {
    exportPresets,
    importFromFile,
    exportToClipboard,
    importFromClipboard,
    isExporting,
    isImporting,
  };
}
