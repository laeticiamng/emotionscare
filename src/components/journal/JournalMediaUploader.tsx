/**
 * Média riches pour le journal
 * Permet d'ajouter images, audio et vidéo aux entrées
 */

import { memo, useState, useRef } from 'react';
import { 
  Image, 
  Mic, 
  Video, 
  Upload, 
  X, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface MediaAttachment {
  id: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  name: string;
  size: number;
  mimeType: string;
  duration?: number; // for audio/video in seconds
  thumbnail?: string; // for video
}

interface JournalMediaUploaderProps {
  attachments: MediaAttachment[];
  onAddAttachment: (attachment: MediaAttachment) => void;
  onRemoveAttachment: (id: string) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const JournalMediaUploader = memo(function JournalMediaUploader({
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  maxFiles = 5,
  maxSizeMB = 10,
  className
}: JournalMediaUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [previewMedia, setPreviewMedia] = useState<MediaAttachment | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Validate file count
      if (attachments.length >= maxFiles) {
        toast({
          title: 'Limite atteinte',
          description: `Maximum ${maxFiles} fichiers autorisés`,
          variant: 'destructive',
        });
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: 'Fichier trop volumineux',
          description: `Maximum ${maxSizeMB} MB par fichier`,
          variant: 'destructive',
        });
        return;
      }

      // Determine type
      let type: MediaAttachment['type'] = 'image';
      if (file.type.startsWith('audio/')) type = 'audio';
      else if (file.type.startsWith('video/')) type = 'video';

      // Create preview URL
      const url = URL.createObjectURL(file);

      const attachment: MediaAttachment = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        url,
        name: file.name,
        size: file.size,
        mimeType: file.type,
      };

      // Get duration for audio/video
      if (type === 'audio' || type === 'video') {
        const media = type === 'audio' ? new Audio(url) : document.createElement('video');
        media.src = url;
        media.onloadedmetadata = () => {
          attachment.duration = media.duration;
          onAddAttachment(attachment);
        };
      } else {
        onAddAttachment(attachment);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        const attachment: MediaAttachment = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'audio',
          url,
          name: `Enregistrement-${new Date().toLocaleTimeString('fr-FR')}.webm`,
          size: blob.size,
          mimeType: 'audio/webm',
          duration: recordingTime,
        };
        
        onAddAttachment(attachment);
        setRecordingTime(0);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Erreur micro',
        description: 'Impossible d\'accéder au microphone',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const togglePlayPreview = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Buttons */}
      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,audio/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={attachments.length >= maxFiles}
        >
          <Upload className="h-4 w-4 mr-1" />
          Importer
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment';
            input.onchange = (e) => handleFileSelect(e as any);
            input.click();
          }}
          disabled={attachments.length >= maxFiles}
        >
          <Image className="h-4 w-4 mr-1" />
          Photo
        </Button>

        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="sm"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={attachments.length >= maxFiles && !isRecording}
        >
          <Mic className={cn("h-4 w-4 mr-1", isRecording && "animate-pulse")} />
          {isRecording ? `Arrêter (${formatDuration(recordingTime)})` : 'Audio'}
        </Button>
      </div>

      {/* Recording Progress */}
      {isRecording && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm font-medium">Enregistrement en cours...</span>
          <span className="text-sm text-muted-foreground">{formatDuration(recordingTime)}</span>
        </div>
      )}

      {/* Attachments Grid */}
      {attachments.length > 0 && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {attachments.map((attachment) => (
            <Card key={attachment.id} className="relative group overflow-hidden">
              <CardContent className="p-2">
                {/* Preview based on type */}
                {attachment.type === 'image' && (
                  <div 
                    className="aspect-square rounded-lg bg-muted overflow-hidden cursor-pointer"
                    onClick={() => setPreviewMedia(attachment)}
                  >
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {attachment.type === 'audio' && (
                  <div 
                    className="aspect-square rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => setPreviewMedia(attachment)}
                  >
                    <Volume2 className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-[10px] text-muted-foreground">
                      {attachment.duration ? formatDuration(attachment.duration) : 'Audio'}
                    </span>
                  </div>
                )}

                {attachment.type === 'video' && (
                  <div 
                    className="aspect-square rounded-lg bg-gradient-to-br from-pink-500/20 to-red-500/20 flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => setPreviewMedia(attachment)}
                  >
                    <Video className="h-8 w-8 text-pink-500 mb-2" />
                    <span className="text-[10px] text-muted-foreground">
                      {attachment.duration ? formatDuration(attachment.duration) : 'Vidéo'}
                    </span>
                  </div>
                )}

                {/* File info */}
                <div className="mt-2 space-y-0.5">
                  <p className="text-[10px] font-medium truncate">{attachment.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatFileSize(attachment.size)}</p>
                </div>

                {/* Actions overlay */}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setPreviewMedia(attachment)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onRemoveAttachment(attachment.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* File count indicator */}
      {attachments.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {attachments.length}/{maxFiles} fichiers
        </p>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewMedia} onOpenChange={() => setPreviewMedia(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewMedia?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {previewMedia?.type === 'image' && (
              <img 
                src={previewMedia.url} 
                alt={previewMedia.name}
                className="w-full rounded-lg"
              />
            )}

            {previewMedia?.type === 'audio' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Volume2 className="h-12 w-12 text-white" />
                </div>
                <audio 
                  ref={audioRef}
                  src={previewMedia.url}
                  controls
                  className="w-full max-w-md"
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            )}

            {previewMedia?.type === 'video' && (
              <video 
                src={previewMedia.url}
                controls
                className="w-full rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});
