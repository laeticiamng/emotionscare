/**
 * Galerie des photos capturées avec les filtres AR
 */

import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trash2, Image, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ARPhotoGalleryProps {
  photos: string[];
  onClearPhotos: () => void;
}

export const ARPhotoGallery = memo<ARPhotoGalleryProps>(({
  photos,
  onClearPhotos,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleDownload = (photoUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `ar-photo-${Date.now()}-${index}.png`;
    link.click();
    toast.success('Photo téléchargée !');
  };

  const handleDeletePhoto = (index: number) => {
    // Note: This would need to be implemented in the hook to properly remove photos
    toast.info('Fonctionnalité de suppression individuelle à venir');
  };

  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune photo capturée</p>
            <p className="text-sm mt-1">Utilisez le bouton de capture pour prendre des photos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Image className="w-5 h-5" />
            Galerie ({photos.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearPhotos}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Effacer tout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {photos.map((photo, index) => (
                <motion.div
                  key={`photo-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-border"
                >
                  <img
                    src={photo}
                    alt={`Capture AR ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-8 h-8"
                      onClick={() => setSelectedPhoto(photo)}
                      aria-label="Agrandir la photo"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-8 h-8"
                      onClick={() => handleDownload(photo, index)}
                      aria-label="Télécharger la photo"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Photo Number */}
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-5 h-5" />
            </Button>
            {selectedPhoto && (
              <img
                src={selectedPhoto}
                alt="Photo AR en plein écran"
                className="w-full h-auto"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

ARPhotoGallery.displayName = 'ARPhotoGallery';

export default ARPhotoGallery;