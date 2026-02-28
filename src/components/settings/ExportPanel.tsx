import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Info
} from 'lucide-react';
import { useExportJob } from '@/hooks/useExportJob';

/**
 * Panel d'export des données personnelles (RGPD)
 */
export const ExportPanel: React.FC = () => {
  const { 
    job, 
    start, 
    poll, 
    loading, 
    error, 
    downloadAndTrack 
  } = useExportJob();

  const isReady = job?.status === 'ready';
  const hasError = !!error;

  const handleDownload = () => {
    if (job && isReady && job.download_url) {
      downloadAndTrack(job.download_url);
    }
  };

  const getStatusDisplay = () => {
    if (!job) {
      return {
        icon: <Info className="w-4 h-4 text-blue-600" />,
        text: 'Aucun export récent',
      };
    }

    if (loading) {
      return {
        icon: <Clock className="w-4 h-4 text-amber-600" />,
        text: 'Export en cours...',
      };
    }

    if (isReady) {
      return {
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        text: 'Export prêt',
      };
    }

    if (hasError) {
      return {
        icon: <AlertCircle className="w-4 h-4 text-red-600" />,
        text: 'Erreur export',
      };
    }

    return {
      icon: <Clock className="w-4 h-4 text-gray-600" />,
      text: 'Statut inconnu',
    };
  };

  const status = getStatusDisplay();
  const exportDate = job ? new Date((job as any).timestamp || (job as any).created_at || Date.now()).toLocaleDateString('fr-FR') : null;

  return (
    <div className="space-y-4">
      {/* RGPD Info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Droit RGPD :</strong> Vous pouvez télécharger une copie complète 
          de toutes vos données personnelles au format JSON et CSV.
        </AlertDescription>
      </Alert>

      {/* Export Status */}
      {job && (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {status.icon}
            <div>
              <p className="text-sm font-medium">
                {status.text}
              </p>
              {exportDate && (
                <p className="text-xs text-muted-foreground">
                  Demandé le {exportDate}
                </p>
              )}
            </div>
          </div>
          
          {isReady && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          )}
        </div>
      )}

      {/* Export Actions */}
      <div className="space-y-3">
        <Button
          onClick={start}
          disabled={loading}
          className="w-full"
        >
          <FileText className="w-4 h-4 mr-2" />
          {loading ? 'Préparation en cours...' : 'Démarrer un nouvel export'}
        </Button>

        {/* Export Details */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• <strong>Contenu :</strong> Profil, activités, préférences, données de capteurs</p>
          <p>• <strong>Format :</strong> Archive ZIP avec fichiers JSON et CSV</p>
          <p>• <strong>Délai :</strong> Généralement prêt sous 5-10 minutes</p>
          <p>• <strong>Expiration :</strong> Lien valable 24h après génération</p>
        </div>

        {/* Privacy Notice */}
        <Alert>
          <AlertDescription className="text-xs">
            L'export ne contient aucune donnée d'autres utilisateurs. 
            Toutes les données sont chiffrées pendant le transit.
          </AlertDescription>
        </Alert>
      </div>

      {/* Error State */}
      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Une erreur s'est produite lors de l'export. 
            Veuillez réessayer ou contacter le support si le problème persiste.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
