import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Download, 
  FileAudio, 
  FileText, 
  ExternalLink,
  Mail,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useStorySession } from '@/hooks/useStorySession';
import { toast } from '@/hooks/use-toast';

interface ExportButtonProps {
  sessionId?: string;
  className?: string;
  variant?: 'button' | 'card';
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  sessionId,
  className = '',
  variant = 'button'
}) => {
  const { state, exportStory } = useStorySession();
  const [isExporting, setIsExporting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const hasSession = sessionId || state.sessionId;
  const canExport = hasSession && state.chapters.length > 0;
  const hasExportReady = state.exportUrl && state.transcriptUrl;

  const handleExport = async () => {
    if (!canExport || isExporting) return;

    setIsExporting(true);
    
    try {
      await exportStory('mp3', true);
      
      // Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'story.export.requested', {
          session_id: sessionId || state.sessionId,
          chapters: state.chapters.length,
        });
      }
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!state.exportUrl) return;
    
    try {
      await navigator.clipboard.writeText(state.exportUrl);
      toast({
        title: "Lien copié",
        description: "Le lien de téléchargement a été copié dans le presse-papier",
      });
    } catch (error) {
      console.warn('Copy failed:', error);
    }
  };

  const handleEmailRequest = async () => {
    // Simulation d'envoi par email (nécessite API backend)
    setEmailSent(true);
    toast({
      title: "Email programmé",
      description: "Vous recevrez le podcast par email dans quelques minutes",
    });
  };

  // Mode bouton simple
  if (variant === 'button') {
    return (
      <Button
        onClick={handleExport}
        disabled={!canExport || isExporting}
        className={className}
        size="lg"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            Génération...
          </>
        ) : (
          <>
            <FileAudio className="h-4 w-4 mr-2" />
            Exporter en podcast
          </>
        )}
      </Button>
    );
  }

  // Mode card complète
  return (
    <Card className={`export-card ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <FileAudio className="h-5 w-5 text-primary" />
                Export Podcast
              </h3>
              <p className="text-sm text-muted-foreground">
                Transformez votre histoire en podcast audio
              </p>
            </div>
            <Badge variant={hasExportReady ? "default" : "outline"}>
              {hasExportReady ? "Prêt" : canExport ? "Disponible" : "En attente"}
            </Badge>
          </div>

          {/* État d'export */}
          {!hasExportReady ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Download className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {!canExport ? 
                    "Terminez au moins un chapitre pour exporter" :
                    "Créez votre podcast personnalisé"
                  }
                </p>
              </div>

              <Button
                onClick={handleExport}
                disabled={!canExport || isExporting}
                className="w-full"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Génération du podcast...
                  </>
                ) : (
                  <>
                    <FileAudio className="h-4 w-4 mr-2" />
                    Générer le podcast MP3
                  </>
                )}
              </Button>

              {canExport && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>✅ Audio narration + musique</p>
                  <p>✅ Illustrations incluses</p>
                  <p>✅ Transcript JSON</p>
                </div>
              )}
            </div>
          ) : (
            /* Export prêt */
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Podcast généré !</span>
                </div>
                <p className="text-sm text-green-700">
                  Votre histoire audio est prête à écouter 🎧
                </p>
              </div>

              {/* Actions de téléchargement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  asChild
                  className="w-full"
                >
                  <a 
                    href={state.exportUrl} 
                    download 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileAudio className="h-4 w-4 mr-2" />
                    Télécharger MP3
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <a 
                    href={state.transcriptUrl} 
                    download 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Transcript
                  </a>
                </Button>
              </div>

              {/* Actions secondaires */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex-1"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copier le lien
                </Button>

                {!emailSent ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEmailRequest}
                    className="flex-1"
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Envoyer par email
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="flex-1"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Email programmé
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a 
                    href={state.exportUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ouvrir dans un nouvel onglet"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>

              {/* Info */}
              <div className="text-xs text-muted-foreground text-center">
                💡 Les liens restent valides 24h
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportButton;