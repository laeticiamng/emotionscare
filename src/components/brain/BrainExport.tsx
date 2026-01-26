/**
 * BrainExport - Export glTF/PDF pour Context-Lens-Pro et rapports
 * EmotionsCare - Module DICOM
 */

import React, { memo, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileText, 
  Glasses, 
  Image as ImageIcon, 
  Loader2,
  Share2,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import type { BrainScan, EmotionRegionMap } from './types';

export interface BrainExportProps {
  scan?: BrainScan | null;
  meshData?: unknown;
  emotionMappings?: EmotionRegionMap;
  patientName?: string;
  onExportComplete?: (format: string, url: string) => void;
  className?: string;
}

type ExportFormat = 'gltf' | 'glb' | 'pdf' | 'png' | 'json';
type LodLevel = 'high' | 'medium' | 'low';

interface ExportOptions {
  format: ExportFormat;
  lod: LodLevel;
  includeEmotions: boolean;
  includeAnnotations: boolean;
  includeMetadata: boolean;
}

export const BrainExport = memo<BrainExportProps>(({
  scan,
  meshData,
  emotionMappings,
  patientName = 'Patient',
  onExportComplete,
  className = '',
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'gltf',
    lod: 'medium',
    includeEmotions: true,
    includeAnnotations: true,
    includeMetadata: true,
  });

  const handleExport = useCallback(async () => {
    if (!scan && !meshData) {
      toast.error('Aucun scan à exporter');
      return;
    }

    setIsExporting(true);
    setProgress(0);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      let blob: Blob;
      let filename: string;
      const timestamp = new Date().toISOString().split('T')[0];

      switch (options.format) {
        case 'gltf':
        case 'glb':
          blob = await exportToGLTF(meshData, emotionMappings, options);
          filename = `brain_${patientName}_${timestamp}.${options.format}`;
          break;

        case 'pdf':
          blob = await exportToPDF(scan, emotionMappings, patientName, options);
          filename = `rapport_cerebral_${patientName}_${timestamp}.pdf`;
          break;

        case 'png':
          blob = await exportToImage();
          filename = `capture_3d_${patientName}_${timestamp}.png`;
          break;

        case 'json':
          blob = await exportToJSON(scan, emotionMappings, options);
          filename = `data_${patientName}_${timestamp}.json`;
          break;

        default:
          throw new Error('Format non supporté');
      }

      clearInterval(progressInterval);
      setProgress(100);

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onExportComplete?.(options.format, filename);
      toast.success(`Export ${options.format.toUpperCase()} réussi !`);

    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  }, [scan, meshData, emotionMappings, patientName, options, onExportComplete]);

  const handleShareAR = useCallback(async () => {
    if (!scan?.id) {
      toast.error('Aucun scan sélectionné');
      return;
    }

    try {
      // Generate AR-ready URL for Context-Lens-Pro
      const arUrl = `/api/brain/${scan.patient_id}/mesh?format=glb&lod=${options.lod}&scan_id=${scan.id}`;
      
      await navigator.clipboard.writeText(window.location.origin + arUrl);
      toast.success('Lien AR copié dans le presse-papiers !');
    } catch {
      toast.error('Impossible de copier le lien');
    }
  }, [scan, options.lod]);

  return (
    <Card className={`bg-card ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export & Partage
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Format Selection */}
        <div className="space-y-2">
          <Label>Format d'export</Label>
          <Select
            value={options.format}
            onValueChange={(v) => setOptions(prev => ({ ...prev, format: v as ExportFormat }))}
            disabled={isExporting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gltf">
                <div className="flex items-center gap-2">
                  <Glasses className="h-4 w-4" />
                  glTF (AR/3D Web)
                </div>
              </SelectItem>
              <SelectItem value="glb">
                <div className="flex items-center gap-2">
                  <Glasses className="h-4 w-4" />
                  GLB (Binaire compact)
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Rapport PDF
                </div>
              </SelectItem>
              <SelectItem value="png">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Capture PNG
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Données JSON
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* LOD Selection (for 3D formats) */}
        {['gltf', 'glb'].includes(options.format) && (
          <div className="space-y-2">
            <Label>Niveau de détail (LOD)</Label>
            <Select
              value={options.lod}
              onValueChange={(v) => setOptions(prev => ({ ...prev, lod: v as LodLevel }))}
              disabled={isExporting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Haute qualité (~50MB)</SelectItem>
                <SelectItem value="medium">Qualité moyenne (~15MB)</SelectItem>
                <SelectItem value="low">Basse qualité (~5MB)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Export Options */}
        <div className="space-y-3 pt-2 border-t">
          <Label className="text-sm text-muted-foreground">Options</Label>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeEmotions"
              checked={options.includeEmotions}
              onCheckedChange={(checked) => 
                setOptions(prev => ({ ...prev, includeEmotions: !!checked }))
              }
              disabled={isExporting}
            />
            <Label htmlFor="includeEmotions" className="text-sm font-normal cursor-pointer">
              Inclure overlay émotionnel
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeAnnotations"
              checked={options.includeAnnotations}
              onCheckedChange={(checked) => 
                setOptions(prev => ({ ...prev, includeAnnotations: !!checked }))
              }
              disabled={isExporting}
            />
            <Label htmlFor="includeAnnotations" className="text-sm font-normal cursor-pointer">
              Inclure annotations
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeMetadata"
              checked={options.includeMetadata}
              onCheckedChange={(checked) => 
                setOptions(prev => ({ ...prev, includeMetadata: !!checked }))
              }
              disabled={isExporting}
            />
            <Label htmlFor="includeMetadata" className="text-sm font-normal cursor-pointer">
              Inclure métadonnées DICOM
            </Label>
          </div>
        </div>

        {/* Progress */}
        {isExporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Export en cours...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleExport} 
            disabled={isExporting || (!scan && !meshData)}
            className="flex-1"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Export...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </>
            )}
          </Button>

          {['gltf', 'glb'].includes(options.format) && (
            <Button
              variant="outline"
              onClick={handleShareAR}
              disabled={!scan?.id}
              title="Partager pour Context-Lens-Pro"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Success indicator */}
        {progress === 100 && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <CheckCircle className="h-4 w-4" />
            Export terminé avec succès
          </div>
        )}
      </CardContent>
    </Card>
  );
});

BrainExport.displayName = 'BrainExport';

// Export helper functions
async function exportToGLTF(
  meshData: unknown,
  emotionMappings: EmotionRegionMap | undefined,
  options: ExportOptions
): Promise<Blob> {
  // Generate glTF structure
  const gltfData = {
    asset: {
      version: '2.0',
      generator: 'EmotionsCare Brain Viewer',
    },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [
      {
        name: 'Brain',
        mesh: 0,
      },
    ],
    meshes: [
      {
        name: 'BrainMesh',
        primitives: [
          {
            attributes: {
              POSITION: 0,
              NORMAL: 1,
            },
            indices: 2,
          },
        ],
      },
    ],
    // Add emotion data as extras if requested
    extras: options.includeEmotions && emotionMappings ? {
      emotionMappings,
      timestamp: new Date().toISOString(),
    } : undefined,
  };

  const jsonStr = JSON.stringify(gltfData, null, 2);
  return new Blob([jsonStr], { type: 'model/gltf+json' });
}

async function exportToPDF(
  scan: BrainScan | undefined | null,
  emotionMappings: EmotionRegionMap | undefined,
  patientName: string,
  options: ExportOptions
): Promise<Blob> {
  // Generate PDF content (simplified - in production use @react-pdf/renderer)
  const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 500 >>
stream
BT
/F1 24 Tf
50 750 Td
(EmotionsCare - Rapport Cerebral) Tj
0 -40 Td
/F1 14 Tf
(Patient: ${patientName}) Tj
0 -25 Td
(Date: ${new Date().toLocaleDateString('fr-FR')}) Tj
0 -25 Td
(Scan ID: ${scan?.id || 'N/A'}) Tj
0 -25 Td
(Modalite: ${scan?.modality || 'N/A'}) Tj
${options.includeEmotions && emotionMappings ? `
0 -40 Td
/F1 16 Tf
(Analyse Emotionnelle:) Tj
0 -25 Td
/F1 12 Tf
${Object.entries(emotionMappings)
  .filter(([, v]) => v)
  .map(([k, v]) => `(${k}: ${((v?.intensity || 0) * 100).toFixed(0)}% - ${v?.region}) Tj 0 -20 Td`)
  .join('\n')}
` : ''}
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000266 00000 n
0000000800 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
879
%%EOF
`;

  return new Blob([pdfContent], { type: 'application/pdf' });
}

async function exportToImage(): Promise<Blob> {
  // Capture canvas from Three.js scene
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    throw new Error('Aucun canvas 3D trouvé');
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Échec de la capture'));
      }
    }, 'image/png');
  });
}

async function exportToJSON(
  scan: BrainScan | undefined | null,
  emotionMappings: EmotionRegionMap | undefined,
  options: ExportOptions
): Promise<Blob> {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    scan: options.includeMetadata ? scan : { id: scan?.id },
    emotions: options.includeEmotions ? emotionMappings : undefined,
  };

  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
}

export default BrainExport;
