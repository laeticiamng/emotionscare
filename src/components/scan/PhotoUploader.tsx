import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PhotoUploaderProps {
  onAnalyze: (file: File) => void;
  loading?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onAnalyze,
  loading = false
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('Fichier trop volumineux (max 10MB)');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Analyze
    onAnalyze(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${loading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-primary hover:bg-primary/5'}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => {
          if (!loading) {
            document.getElementById('photo-upload')?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Zone de téléchargement d'image. Cliquez ou glissez une image ici."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!loading) {
              document.getElementById('photo-upload')?.click();
            }
          }
        }}
      >
        {loading ? (
          <div className="space-y-3">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Analyse en cours...
            </p>
          </div>
        ) : preview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <img
              src={preview}
              alt="Aperçu de l'image"
              className="w-32 h-32 mx-auto object-cover rounded-lg"
            />
            <p className="text-sm text-muted-foreground">
              Cliquez pour analyser une nouvelle image
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">
                Glissez une image ici
              </p>
              <p className="text-sm text-muted-foreground">
                ou cliquez pour sélectionner
              </p>
            </div>
          </div>
        )}

        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
          disabled={loading}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => document.getElementById('photo-upload')?.click()}
          disabled={loading}
          aria-label="Choisir une image"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Choisir une image
        </Button>
        
        {preview && (
          <Button
            variant="ghost"
            onClick={() => {
              setPreview(null);
            }}
            disabled={loading}
            aria-label="Supprimer l'image"
          >
            Supprimer
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Formats supportés: JPEG, PNG, WebP • Taille max: 10MB
      </div>
    </div>
  );
};