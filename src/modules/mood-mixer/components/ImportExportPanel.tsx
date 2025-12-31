// @ts-nocheck
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download, Upload, Copy, FileJson, AlertCircle
} from 'lucide-react';
import type { MoodPreset } from '../useMoodMixerEnriched';

interface ImportExportPanelProps {
  presets: MoodPreset[];
  onExport: (presets: MoodPreset[], filename?: string) => void;
  onImportFromFile: (file: File) => Promise<MoodPreset[]>;
  onExportToClipboard: (presets: MoodPreset[]) => void;
  onImportFromClipboard: () => Promise<MoodPreset[]>;
  onPresetsImported: (presets: MoodPreset[]) => void;
  isExporting?: boolean;
  isImporting?: boolean;
}

export const ImportExportPanel: React.FC<ImportExportPanelProps> = ({
  presets,
  onExport,
  onImportFromFile,
  onExportToClipboard,
  onImportFromClipboard,
  onPresetsImported,
  isExporting = false,
  isImporting = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customPresets = presets.filter(p => !p.isBuiltIn);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imported = await onImportFromFile(file);
      if (imported.length > 0) {
        onPresetsImported(imported);
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClipboardImport = async () => {
    const imported = await onImportFromClipboard();
    if (imported.length > 0) {
      onPresetsImported(imported);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileJson className="h-5 w-5" />
          Import / Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Exporter</p>
            <Badge variant="outline">
              {customPresets.length} preset{customPresets.length > 1 ? 's' : ''} personnalisé{customPresets.length > 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport(customPresets)}
              disabled={customPresets.length === 0 || isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              Fichier JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExportToClipboard(customPresets)}
              disabled={customPresets.length === 0 || isExporting}
            >
              <Copy className="h-4 w-4 mr-2" />
              Presse-papiers
            </Button>
          </div>

          {customPresets.length === 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
              <AlertCircle className="h-3 w-3" />
              Créez des presets personnalisés pour les exporter
            </div>
          )}
        </div>

        <div className="border-t border-border" />

        {/* Import section */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Importer</p>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              <Upload className="h-4 w-4 mr-2" />
              Depuis fichier
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClipboardImport}
              disabled={isImporting}
            >
              <Copy className="h-4 w-4 mr-2" />
              Depuis clipboard
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-xs text-muted-foreground">
            Formats supportés : JSON exporté depuis Mood Mixer
          </p>
        </div>

        {/* Recent imports preview */}
        {presets.some(p => p.id.startsWith('imported-')) && (
          <>
            <div className="border-t border-border" />
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Presets importés récemment
              </p>
              <div className="flex flex-wrap gap-1">
                {presets
                  .filter(p => p.id.startsWith('imported-'))
                  .slice(0, 5)
                  .map(p => (
                    <Badge key={p.id} variant="secondary" className="text-xs">
                      {p.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportExportPanel;
