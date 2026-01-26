/**
 * ScanUploadDialog - Dialog d'import de scans DICOM/NIfTI
 */

import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  FileImage, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  X,
  Brain,
  HardDrive,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { ScanModality } from './types';

// ============================================================================
// Types
// ============================================================================

interface ScanUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, options: UploadOptions) => Promise<void>;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
}

interface UploadOptions {
  modality: ScanModality;
  anonymize: boolean;
  patientId?: string;
  seriesDescription?: string;
}

// ============================================================================
// Constants
// ============================================================================

const ACCEPTED_FORMATS = {
  'application/dicom': ['.dcm', '.dicom'],
  'application/x-nifti': ['.nii', '.nii.gz'],
  'application/gzip': ['.nii.gz'],
};

const MODALITIES: { value: ScanModality; label: string }[] = [
  { value: 'MRI_T1', label: 'IRM T1' },
  { value: 'MRI_T2', label: 'IRM T2' },
  { value: 'MRI_FLAIR', label: 'IRM FLAIR' },
  { value: 'CT', label: 'CT Scan' },
  { value: 'NIfTI', label: 'NIfTI générique' },
];

// ============================================================================
// Composant
// ============================================================================

export const ScanUploadDialog: React.FC<ScanUploadDialogProps> = ({
  open,
  onOpenChange,
  onUpload,
  isUploading = false,
  uploadProgress = 0,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [options, setOptions] = useState<UploadOptions>({
    modality: 'MRI_T1',
    anonymize: true,
  });

  // Gestion du drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFile) {
      await onUpload(selectedFile, options);
    }
  }, [selectedFile, options, onUpload]);

  const handleClose = useCallback(() => {
    if (!isUploading) {
      setSelectedFile(null);
      onOpenChange(false);
    }
  }, [isUploading, onOpenChange]);

  // Détection automatique de la modalité
  const detectModality = useCallback((filename: string): ScanModality => {
    const lower = filename.toLowerCase();
    if (lower.includes('t1')) return 'MRI_T1';
    if (lower.includes('t2')) return 'MRI_T2';
    if (lower.includes('flair')) return 'MRI_FLAIR';
    if (lower.includes('ct')) return 'CT';
    if (lower.endsWith('.nii') || lower.endsWith('.nii.gz')) return 'NIfTI';
    return 'MRI_T1';
  }, []);

  // Mise à jour automatique de la modalité
  React.useEffect(() => {
    if (selectedFile) {
      const detected = detectModality(selectedFile.name);
      setOptions(prev => ({ ...prev, modality: detected }));
    }
  }, [selectedFile, detectModality]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Importer un scan cérébral
          </DialogTitle>
          <DialogDescription>
            Formats supportés : DICOM (.dcm), NIfTI (.nii, .nii.gz)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Zone de drop */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/10'
                : selectedFile
                ? 'border-green-500 bg-green-500/10'
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".dcm,.dicom,.nii,.nii.gz"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />

            {selectedFile ? (
              <div className="space-y-2">
                <CheckCircle className="h-10 w-10 mx-auto text-green-500" />
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="mt-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="text-foreground">
                  Glissez-déposez un fichier ici
                </p>
                <p className="text-sm text-muted-foreground">ou</p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  Parcourir
                </Button>
              </div>
            )}
          </div>

          {/* Options */}
          {selectedFile && (
            <div className="space-y-4 border rounded-lg p-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Modalité</Label>
                  <Select
                    value={options.modality}
                    onValueChange={(v) => 
                      setOptions(prev => ({ ...prev, modality: v as ScanModality }))
                    }
                    disabled={isUploading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MODALITIES.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description (optionnel)</Label>
                  <Input
                    placeholder="Ex: IRM pré-opératoire"
                    value={options.seriesDescription || ''}
                    onChange={(e) => 
                      setOptions(prev => ({ ...prev, seriesDescription: e.target.value }))
                    }
                    disabled={isUploading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Anonymisation</Label>
                    <p className="text-xs text-muted-foreground">
                      Supprimer les données personnelles du fichier
                    </p>
                  </div>
                  <Switch
                    checked={options.anonymize}
                    onCheckedChange={(v) => 
                      setOptions(prev => ({ ...prev, anonymize: v }))
                    }
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Traitement en cours...</span>
                <span className="font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Erreur */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Limite de taille */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HardDrive className="h-3 w-3" />
            Taille maximale : 500 MB
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Importer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScanUploadDialog;
