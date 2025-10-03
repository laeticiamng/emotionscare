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
  Download, 
  Trash2, 
  Shield, 
  Database, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DataSettingsPageProps {
  'data-testid'?: string;
}

interface DataExport {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  expiresAt?: string;
}

export const DataSettingsPage: React.FC<DataSettingsPageProps> = ({ 'data-testid': testId }) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [exports, setExports] = React.useState<DataExport[]>([
    {
      id: '1',
      type: 'complete',
      status: 'completed',
      requestedAt: '2024-01-15T10:00:00Z',
      completedAt: '2024-01-15T10:05:00Z',
      downloadUrl: '/exports/data-export-1.zip',
      expiresAt: '2024-01-22T10:05:00Z'
    }
  ]);

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

  const handleExportData = async (type: 'partial' | 'complete') => {
    setIsExporting(true);
    try {
      // Simulate export request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newExport: DataExport = {
        id: Date.now().toString(),
        type,
        status: 'processing',
        requestedAt: new Date().toISOString(),
      };
      
      setExports(prev => [newExport, ...prev]);
      
      toast({
        title: "Export demandé",
        description: "Votre demande d'export a été prise en compte. Vous recevrez un email quand il sera prêt.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de lancer l'export des données.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Suppression programmée",
        description: "Votre compte sera supprimé dans 30 jours. Vous pouvez annuler cette action en vous reconnectant.",
      });
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
            Téléchargez une copie de toutes vos données au format JSON
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Vos données seront chiffrées et le lien de téléchargement expirera après 7 jours.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button 
              onClick={() => handleExportData('partial')}
              disabled={isExporting}
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export partiel (profil uniquement)
            </Button>
            
            <Button 
              onClick={() => handleExportData('complete')}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Export en cours...' : 'Export complet'}
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
                        Export {exp.type === 'complete' ? 'complet' : 'partiel'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Demandé le {new Date(exp.requestedAt).toLocaleDateString('fr-FR')}
                      </p>
                      {exp.expiresAt && (
                        <p className="text-xs text-muted-foreground">
                          Expire le {new Date(exp.expiresAt).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(exp.status)}
                    {exp.status === 'completed' && exp.downloadUrl && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
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
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer définitivement mon compte'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};