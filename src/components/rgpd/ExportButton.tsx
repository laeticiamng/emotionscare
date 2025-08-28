import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileArchive, 
  Clock,
  AlertCircle,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { useExportJob } from '@/hooks/useExportJob';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ExportButton: React.FC = () => {
  const { job, loading, error, start, cancel, downloadAndTrack, reset } = useExportJob();

  const formatExpiry = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM 'à' HH:mm", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileArchive className="w-5 h-5" />
          Export de mes données
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Récupère toutes tes données personnelles au format CSV conforme RGPD.
        </p>

        {/* Offline Warning */}
        {!isOnline && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Hors ligne - L'export nécessite une connexion internet
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* No Job State */}
        {!job && (
          <Button
            onClick={start}
            disabled={loading || !isOnline}
            className="w-full h-12"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Démarrage...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exporter mes données
              </>
            )}
          </Button>
        )}

        {/* Processing State */}
        {job?.status === 'processing' && (
          <div className="space-y-3" aria-live="polite">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Préparation en cours...</span>
              </div>
              <Badge variant="secondary">En cours</Badge>
            </div>
            
            <Progress value={undefined} className="w-full" />
            
            <p className="text-xs text-muted-foreground">
              Cela peut prendre quelques minutes selon la quantité de données.
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={cancel}
              className="w-full"
            >
              Annuler
            </Button>
          </div>
        )}

        {/* Ready State */}
        {job?.status === 'ready' && job.download_url && (
          <div className="space-y-3" aria-live="polite">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileArchive className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Archive prête</span>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Prêt
              </Badge>
            </div>

            {job.size_mb && (
              <p className="text-xs text-muted-foreground">
                Taille: {job.size_mb.toFixed(1)} MB
              </p>
            )}

            <Button
              onClick={() => downloadAndTrack(job.download_url!)}
              className="w-full h-12"
              aria-label="Télécharger mon export de données"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>

            {job.expires_at && (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Expire le {formatExpiry(job.expires_at)}
                </p>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="w-full"
            >
              Nouvel export
            </Button>
          </div>
        )}

        {/* Error State in job */}
        {job?.status === 'error' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">
                {job.error_message || 'Erreur lors de la génération'}
              </p>
            </div>

            <Button
              onClick={start}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        )}

        {/* Privacy Note */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 Le lien expire automatiquement. Conserve ce fichier en lieu sûr 
            une fois téléchargé.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};