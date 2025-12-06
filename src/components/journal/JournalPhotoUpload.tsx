/**
 * JournalPhotoUpload - Upload photo pour journal avec analyse IA
 * Fonctionnalité: Upload image + analyse émotionnelle optionnelle
 */

import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

interface JournalPhotoUploadProps {
  onPhotoAdded: (photoUrl: string, analysis?: PhotoAnalysis) => void;
  enableAIAnalysis?: boolean;
}

interface PhotoAnalysis {
  emotions: string[];
  description: string;
  mood: string;
  tags: string[];
}

export const JournalPhotoUpload: React.FC<JournalPhotoUploadProps> = ({
  onPhotoAdded,
  enableAIAnalysis = true,
}) => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Fichier invalide',
        description: 'Veuillez sélectionner une image (JPG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB max
      toast({
        title: 'Fichier trop volumineux',
        description: 'La taille maximale est de 10MB.',
        variant: 'destructive',
      });
      return;
    }

    // Créer URL preview
    const photoUrl = URL.createObjectURL(file);
    setPhotos([...photos, photoUrl]);

    logger.info('Photo ajoutée au journal', { fileName: file.name, size: file.size }, 'JOURNAL');

    // Analyse IA optionnelle
    if (enableAIAnalysis) {
      await analyzePhoto(file, photoUrl);
    } else {
      onPhotoAdded(photoUrl);
    }
  };

  const analyzePhoto = async (file: File, photoUrl: string) => {
    setIsAnalyzing(true);
    try {
      logger.info('Analyse photo démarrée', { fileName: file.name }, 'JOURNAL');

      // Convertir l'image en base64 pour l'envoyer à l'API
      const reader = new FileReader();
      reader.readAsDataURL(file);

      const base64Image = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      // Appeler l'edge function pour analyser avec GPT-4 Vision
      const { data, error } = await supabase.functions.invoke('analyze-image', {
        body: {
          image: base64Image,
          fileName: file.name,
          mimeType: file.type,
        },
      });

      if (error) {
        throw new Error(`Image analysis failed: ${error.message}`);
      }

      const analysis: PhotoAnalysis = {
        emotions: data?.emotions || [],
        description: data?.description || '',
        mood: data?.mood || 'neutral',
        tags: data?.tags || [],
      };

      setPhotoAnalysis(analysis);
      onPhotoAdded(photoUrl, analysis);

      toast({
        title: 'Analyse terminée',
        description: 'Votre photo a été analysée avec succès.',
      });

      logger.info('Analyse photo réussie', { analysis }, 'JOURNAL');
    } catch (error) {
      logger.error('Erreur analyse photo', { error }, 'JOURNAL');
      toast({
        title: 'Erreur d\'analyse',
        description: 'Impossible d\'analyser la photo. Elle sera ajoutée sans analyse.',
        variant: 'destructive',
      });
      onPhotoAdded(photoUrl);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    setPhotoAnalysis(null);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Photos & Images
        </h3>
        {enableAIAnalysis && (
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Analyse IA
          </Badge>
        )}
      </div>

      {/* Boutons d'upload */}
      {photos.length === 0 && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => cameraInputRef.current?.click()}
            className="flex-col h-auto py-4"
          >
            <Camera className="h-6 w-6 mb-2" />
            <span className="text-sm">Prendre Photo</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-col h-auto py-4"
          >
            <Upload className="h-6 w-6 mb-2" />
            <span className="text-sm">Importer Fichier</span>
          </Button>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Preview des photos */}
      {photos.length > 0 && (
        <div className="space-y-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden border">
              <img
                src={photo}
                alt={`Journal photo ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              <Button
                onClick={() => removePhoto(index)}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>

              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="h-8 w-8 mx-auto mb-2 animate-spin rounded-full border-4 border-white border-t-transparent" />
                    <p className="text-sm">Analyse IA en cours...</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Résultats de l'analyse */}
      {photoAnalysis && (
        <div className="p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium text-sm">Analyse IA de l'image</span>
          </div>

          <div>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
              {photoAnalysis.description}
            </p>

            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-purple-800 dark:text-purple-200">
                  Émotions détectées:
                </span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {photoAnalysis.emotions.map((emotion, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-purple-800 dark:text-purple-200">
                  Tags suggérés:
                </span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {photoAnalysis.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        {enableAIAnalysis
          ? '💡 Vos photos seront analysées par IA pour détecter émotions et suggérer des tags.'
          : '📸 Formats acceptés: JPG, PNG, GIF. Taille max: 10MB.'}
      </p>
    </Card>
  );
};

export default JournalPhotoUpload;
