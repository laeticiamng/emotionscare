/**
 * Page de gestion des données utilisateur - Remplace TODO
 * Conformité RGPD et export/suppression des données
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Download,
  Trash2,
  Shield,
  Database,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { exportService, type ExportType } from '@/services/exportService';
import { AccountDeletionService } from '@/services/gdpr/AccountDeletionService';

interface DataSettingsPageProps {
  'data-testid'?: string;
}

interface DataExport {
  id: string;
  type: ExportType;
  label: string;
  format: 'json' | 'csv' | 'xlsx' | 'pdf';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  expiresAt?: string;
  error?: string;
}

export const DataSettingsPage: React.FC<DataSettingsPageProps> = ({ 'data-testid': testId }) => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [exports, setExports] = React.useState<DataExport[]>([]);

  const dataCategories = [
    {
      name: 'Profil utilisateur',
      description: 'Nom, email, préférences',
      size: '2.1 KB',
      lastUpdated: '2024-01-15',
    },
    {
      name: 'Conversations coach IA',
      description: 'Historique des conversations',
      size: '45.3 KB',
      lastUpdated: '2024-01-10',
    },
    {
      name: 'Musique et playlists',
      description: 'Préférences musicales, playlists',
      size: '12.7 KB',
      lastUpdated: '2024-01-12',
    },
    {
      name: 'Données émotionnelles',
      description: 'Analyses d\'émotions, journaux',
      size: '78.9 KB',
      lastUpdated: '2024-01-14',
    },
    {
      name: 'Notifications',
      description: 'Historique des notifications',
      size: '5.4 KB',
      lastUpdated: '2024-01-13',
    },
  ];

  const formatExportLabel = (type: ExportType) => {
    const labels: Record<ExportType, string> = {
      mood_history: 'Historique des humeurs',
      journal_entries: 'Entrées de journal',
      assessments: 'Évaluations',
      sessions: 'Sessions coach',
      achievements: 'Succès et badges',
      music_history: 'Historique musical',
      breathing_sessions: 'Sessions respiration',
      full_profile: 'Profil complet',
    };
    return labels[type];
  };

  const pushExportHistory = (entry: DataExport) => {
    setExports(prev => [entry, ...prev].slice(0, 5));
  };

  const handleExportData = async (type: ExportType, format: DataExport['format']) => {
    if (!user?.id) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous reconnecter pour exporter vos données.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    const requestId = Date.now().toString();
    try {
      const pendingExport: DataExport = {
        id: requestId,
        type,
        label: formatExportLabel(type),
        format,
        status: 'processing',
        requestedAt: new Date().toISOString(),
      };
      pushExportHistory(pendingExport);

      const result = await exportService.export(user.id, {
        type,
        format,
      });

      if (!result.success) {
        throw new Error(result.error || "Impossible de générer l'export");
      }

      const completedExport: DataExport = {
        ...pendingExport,
        status: 'completed',
        completedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      setExports(prev => prev.map(item => (item.id === pendingExport.id ? completedExport : item)));

      toast({
        title: 'Export prêt',
        description: "Votre fichier est prêt au téléchargement.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de lancer l'export des données.";
      setExports(prev =>
        prev.map(item =>
          item.id === requestId
            ? { ...item, status: 'failed', error: message, completedAt: new Date().toISOString() }
            : item
        )
      );
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }

      await AccountDeletionService.requestDeletion(user.id);

      toast({
        title: "Suppression programmée",
        description: "Votre compte sera supprimé dans 30 jours. Vous pouvez annuler cette action en vous reconnectant.",
      });

      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (status: DataExport['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: DataExport['status']) => {
    const variants = {
      completed: 'default',
      processing: 'secondary',
      pending: 'outline',
      failed: 'destructive',
    } as const;

    const labels = {
      completed: 'Terminé',
      processing: 'En cours',
      pending: 'En attente',
      failed: 'Échec',
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6" data-testid={testId}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des données</h1>
        <p className="text-muted-foreground">
          Exportez, visualisez ou supprimez vos données personnelles (conformité RGPD)
        </p>
      </div>

      {/* Aperçu des données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Vos données
          </CardTitle>
          <CardDescription>
            Aperçu des données stockées dans votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Dernière mise à jour: {new Date(category.lastUpdated).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">{category.size}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export des données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exporter mes données
          </CardTitle>
          <CardDescription>
            Téléchargez une copie de vos données selon le format souhaité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Vos données seront chiffrées et le lien de téléchargement expirera après 7 jours.
            </AlertDescription>
          </Alert>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button 
              onClick={() => handleExportData('full_profile', 'json')}
              disabled={isExporting}
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export profil (JSON)
            </Button>
            
            <Button 
              onClick={() => handleExportData('journal_entries', 'pdf')}
              disabled={isExporting}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export journal (PDF)
            </Button>

            <Button 
              onClick={() => handleExportData('mood_history', 'csv')}
              disabled={isExporting}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export humeurs (CSV)
            </Button>

            <Button 
              onClick={() => handleExportData('full_profile', 'xlsx')}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Export en cours...' : 'Export complet (Excel)'}
            </Button>
          </div>

          {isExporting && (
            <div className="space-y-2">
              <Progress value={33} className="w-full" />
              <p className="text-sm text-muted-foreground">Préparation de l'export...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique des exports */}
      <Card>
        <CardHeader>
          <CardTitle>Exports récents</CardTitle>
          <CardDescription>
            Historique de vos demandes d'export
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exports.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucun export demandé
              </p>
            ) : (
              exports.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(exp.status)}
                    <div>
                      <p className="font-medium">
                        {exp.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Demandé le {new Date(exp.requestedAt).toLocaleDateString('fr-FR')}
                      </p>
                      {exp.error && (
                        <p className="text-xs text-destructive">
                          {exp.error}
                        </p>
                      )}
                      {exp.expiresAt && (
                        <p className="text-xs text-muted-foreground">
                          Expire le {new Date(exp.expiresAt).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(exp.status)}
                    {exp.status === 'completed' && (
                      <Badge variant="outline" className="text-xs">
                        {exp.format.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suppression du compte */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Zone dangereuse
          </CardTitle>
          <CardDescription>
            Actions irréversibles sur votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              La suppression de votre compte est définitive. Toutes vos données seront supprimées après 30 jours.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-medium">Supprimer mon compte</h4>
            <p className="text-sm text-muted-foreground">
              Cette action supprimera définitivement votre compte et toutes les données associées.
              Vous avez 30 jours pour annuler cette action en vous reconnectant.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer définitivement mon compte'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Supprimer définitivement votre compte ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Votre compte sera désactivé immédiatement et
              supprimé définitivement après 30 jours. Durant cette période, vous pouvez
              annuler la suppression en vous reconnectant.
              <br /><br />
              <strong>Toutes vos données seront supprimées :</strong>
              <ul className="list-disc list-inside mt-2">
                <li>Profil et informations personnelles</li>
                <li>Scans émotionnels et journal</li>
                <li>Historique et statistiques</li>
                <li>Préférences et paramètres</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Suppression...' : 'Confirmer la suppression'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
