import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { rgpdService } from '@/services/rgpdService';
import { analyticsService } from '@/services/analyticsService';

interface ExportJob {
  id: string;
  status: 'idle' | 'processing' | 'ready' | 'error';
  progress: number;
  downloadUrl?: string;
  expiresAt?: string;
  error?: string;
}

export const RGPDExportDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [job, setJob] = useState<ExportJob | null>(null);
  const { toast } = useToast();

  const startExport = async () => {
    setJob({ id: 'temp', status: 'processing', progress: 0 });
    analyticsService.trackRGPDExportRequest();

    try {
      const result = await rgpdService.requestDataExport({ format: 'json' });
      
      if (result.success && result.jobId) {
        // Simuler progression
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setJob(prev => prev ? { ...prev, progress } : null);
          
          if (progress >= 100) {
            clearInterval(interval);
            setJob({
              id: result.jobId!,
              status: 'ready',
              progress: 100,
              downloadUrl: result.downloadUrl,
              expiresAt: result.expiresAt
            });
            analyticsService.trackRGPDExportReady();
            toast({
              title: "Export terminé",
              description: "Vos données sont prêtes au téléchargement",
            });
          }
        }, 500);
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (error) {
      setJob({
        id: 'error',
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
      toast({
        title: "Erreur d'export",
        description: "Impossible de créer l'export. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const downloadExport = () => {
    if (job?.downloadUrl) {
      // Simuler téléchargement
      const link = document.createElement('a');
      link.href = '#'; // Dans la vraie implémentation, utiliser job.downloadUrl
      link.download = 'mes_donnees_emotionscare.json';
      link.click();
      
      toast({
        title: "Téléchargement lancé",
        description: "Vos données sont en cours de téléchargement",
      });
    }
  };

  const getStatusIcon = () => {
    switch (job?.status) {
      case 'processing':
        return <Clock className="w-4 h-4 animate-spin" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusLabel = () => {
    switch (job?.status) {
      case 'processing':
        return 'En cours';
      case 'ready':
        return 'Prêt';
      case 'error':
        return 'Erreur';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = () => {
    switch (job?.status) {
      case 'processing':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter mes données
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export de vos données personnelles</DialogTitle>
          <DialogDescription>
            Conformément au RGPD, vous pouvez exporter toutes vos données personnelles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!job && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Données incluses:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Profil utilisateur</li>
                  <li>• Préférences et paramètres</li>
                  <li>• Historique d'activité (anonymisé)</li>
                  <li>• Métriques de bien-être</li>
                </ul>
              </div>
              
              <Button onClick={startExport} className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Créer l'export
              </Button>
            </div>
          )}

          {job && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="font-medium">Export des données</span>
                </div>
                <Badge className={getStatusColor()}>
                  {getStatusLabel()}
                </Badge>
              </div>

              {job.status === 'processing' && (
                <div className="space-y-2">
                  <Progress value={job.progress} />
                  <p className="text-sm text-gray-600 text-center">
                    {job.progress}% terminé
                  </p>
                </div>
              )}

              {job.status === 'ready' && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Export terminé</span>
                    </div>
                    <p className="text-sm text-green-600">
                      Vos données sont prêtes au téléchargement. 
                      Le lien expire dans 7 jours.
                    </p>
                  </div>
                  
                  <Button onClick={downloadExport} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger (JSON)
                  </Button>
                </div>
              )}

              {job.status === 'error' && (
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Erreur d'export</span>
                    </div>
                    <p className="text-sm text-red-600">
                      {job.error || 'Une erreur est survenue lors de l\'export.'}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => setJob(null)} 
                    variant="outline" 
                    className="w-full"
                  >
                    Réessayer
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};