/**
 * ImageUpload - Generic reusable image upload component
 * Features: drag & drop, preview, validation, multiple files support
 */

import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  maxDimensions?: { width: number; height: number };
  minDimensions?: { width: number; height: number };
  className?: string;
  showPreview?: boolean;
  disabled?: boolean;
}

export function ImageUpload({
  onImagesChange,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  maxDimensions,
  minDimensions,
  className,
  showPreview = true,
  disabled = false,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const validateImage = useCallback(
    async (file: File): Promise<{ valid: boolean; error?: string }> => {
      // Check file type
      if (!acceptedFormats.includes(file.type)) {
        return {
          valid: false,
          error: `Format non supporté. Formats acceptés: ${acceptedFormats
            .map((f) => f.split('/')[1].toUpperCase())
            .join(', ')}`,
        };
      }

      // Check file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        return {
          valid: false,
          error: `La taille du fichier dépasse ${maxSizeMB}MB (taille: ${sizeMB.toFixed(
            2
          )}MB)`,
        };
      }

      // Check image dimensions
      if (maxDimensions || minDimensions) {
        try {
          const dimensions = await getImageDimensions(file);

          if (maxDimensions) {
            if (
              dimensions.width > maxDimensions.width ||
              dimensions.height > maxDimensions.height
            ) {
              return {
                valid: false,
                error: `Dimensions maximales: ${maxDimensions.width}x${maxDimensions.height}px (image: ${dimensions.width}x${dimensions.height}px)`,
              };
            }
          }

          if (minDimensions) {
            if (
              dimensions.width < minDimensions.width ||
              dimensions.height < minDimensions.height
            ) {
              return {
                valid: false,
                error: `Dimensions minimales: ${minDimensions.width}x${minDimensions.height}px (image: ${dimensions.width}x${dimensions.height}px)`,
              };
            }
          }
        } catch (error) {
          return {
            valid: false,
            error: 'Impossible de vérifier les dimensions de l\'image',
          };
        }
      }

      return { valid: true };
    },
    [acceptedFormats, maxSizeMB, maxDimensions, minDimensions]
  );

  const getImageDimensions = (
    file: File
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  };

  const processFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || disabled) return;

      const files = Array.from(fileList);

      // Check max files limit
      if (images.length + files.length > maxFiles) {
        toast({
          title: 'Limite dépassée',
          description: `Vous ne pouvez télécharger que ${maxFiles} images maximum`,
          variant: 'destructive',
        });
        return;
      }

      const validatedImages: ImageFile[] = [];

      for (const file of files) {
        const validation = await validateImage(file);

        if (!validation.valid) {
          toast({
            title: 'Erreur de validation',
            description: validation.error,
            variant: 'destructive',
          });
          continue;
        }

        const preview = URL.createObjectURL(file);
        const id = `${file.name}-${Date.now()}`;

        validatedImages.push({ file, preview, id });
      }

      if (validatedImages.length > 0) {
        const newImages = [...images, ...validatedImages];
        setImages(newImages);
        onImagesChange(newImages.map((img) => img.file));

        toast({
          title: 'Images ajoutées',
          description: `${validatedImages.length} image(s) téléchargée(s) avec succès`,
        });
      }
    },
    [images, maxFiles, validateImage, onImagesChange, toast, disabled]
  );

  const removeImage = useCallback(
    (id: string) => {
      const newImages = images.filter((img) => {
        if (img.id === id) {
          URL.revokeObjectURL(img.preview);
          return false;
        }
        return true;
      });

      setImages(newImages);
      onImagesChange(newImages.map((img) => img.file));
    },
    [images, onImagesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
      // Reset input to allow re-selecting the same file
      e.target.value = '';
    },
    [processFiles]
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload zone */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragging && 'border-primary bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center p-6">
          <input
            type="file"
            id="image-upload-input"
            className="sr-only"
            accept={acceptedFormats.join(',')}
            multiple={maxFiles > 1}
            onChange={handleFileInput}
            disabled={disabled || images.length >= maxFiles}
          />

          <label
            htmlFor="image-upload-input"
            className={cn(
              'flex flex-col items-center justify-center w-full cursor-pointer',
              disabled && 'cursor-not-allowed'
            )}
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-center mb-2">
              Glissez vos images ici ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Formats: {acceptedFormats.map((f) => f.split('/')[1].toUpperCase()).join(', ')}
              {' • '}
              Max: {maxSizeMB}MB par fichier
              {' • '}
              {images.length}/{maxFiles} images
            </p>
            {(maxDimensions || minDimensions) && (
              <p className="text-xs text-muted-foreground text-center mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {minDimensions &&
                  `Min: ${minDimensions.width}x${minDimensions.height}px`}
                {minDimensions && maxDimensions && ' • '}
                {maxDimensions &&
                  `Max: ${maxDimensions.width}x${maxDimensions.height}px`}
              </p>
            )}
          </label>
        </CardContent>
      </Card>

      {/* Preview grid */}
      {showPreview && images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square group rounded-lg overflow-hidden border"
            >
              <img
                src={image.preview}
                alt={image.file.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(image.id)}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Retirer
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                <p className="text-xs text-white truncate">{image.file.name}</p>
                <p className="text-xs text-gray-300">
                  {(image.file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state when no images and preview enabled */}
      {showPreview && images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucune image sélectionnée</p>
        </div>
      )}
    </div>
  );
}
