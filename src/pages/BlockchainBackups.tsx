import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBlockchainBackups } from '@/hooks/useBlockchainBackups';
import { 
  Database, 
  Download, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Shield,
  Activity,
  HardDrive,
  TrendingUp
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BlockchainRestore } from '@/components/BlockchainRestore';

/**
 * Page complète de gestion des backups blockchain
 */
const BlockchainBackups = () => {
  const {
    backups,
    integrityStats,
    isLoading,
    createBackup,
    deleteBackup,
    isCreatingBackup,
    isDeletingBackup,
  } = useBlockchainBackups();

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getIntegrityColor = (score: number) => {
    if (score >= 95) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getIntegrityBadge = (score: number) => {
    if (score >= 95) {
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Excellent</Badge>;
    }
    if (score >= 80) {
      return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" />Bon</Badge>;
    }
    return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Compromis</Badge>;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Gestion des Backups Blockchain</h1>
        <p className="text-muted-foreground">
          Surveillance de l'intégrité de la chaîne d'audit et gestion des sauvegardes sécurisées
        </p>
      </div>

      {/* Statistiques d'intégrité */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Total Blocs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{integrityStats?.totalBlocks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Blocs dans la chaîne</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Score d'Intégrité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getIntegrityColor(integrityStats?.integrityScore || 0)}`}>
              {integrityStats?.integrityScore || 0}%
            </div>
            <Progress value={integrityStats?.integrityScore || 0} className="mt-2" />
            <div className="mt-2">{getIntegrityBadge(integrityStats?.integrityScore || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Blocs Valides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {integrityStats?.validBlocks || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Hash cohérents avec le bloc précédent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Chaînes Brisées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${integrityStats?.brokenChainCount ? 'text-red-500' : 'text-green-500'}`}>
              {integrityStats?.brokenChainCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Incohérences détectées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informations sur le premier et dernier bloc */}
      {integrityStats?.firstBlock && integrityStats?.lastBlock && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Premier Bloc (Genesis)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bloc #:</span>
                <span className="font-mono">{integrityStats.firstBlock.block_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date(integrityStats.firstBlock.timestamp).toLocaleString('fr-FR')}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Hash:</span>
                <code className="block mt-1 text-xs bg-muted p-2 rounded break-all">
                  {integrityStats.firstBlock.block_hash}
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Dernier Bloc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bloc #:</span>
                <span className="font-mono">{integrityStats.lastBlock.block_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date(integrityStats.lastBlock.timestamp).toLocaleString('fr-FR')}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Hash:</span>
                <code className="block mt-1 text-xs bg-muted p-2 rounded break-all">
                  {integrityStats.lastBlock.block_hash}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions de backup */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Actions de Sauvegarde</CardTitle>
                <CardDescription>
                  Créer un nouveau backup chiffré de la blockchain complète
                </CardDescription>
              </div>
              <Button
                onClick={() => createBackup()}
                disabled={isCreatingBackup}
                size="lg"
              >
                {isCreatingBackup ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <HardDrive className="h-4 w-4 mr-2" />
                    Créer un Backup
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Composant de restauration */}
      <div className="mb-8">
        <BlockchainRestore />
      </div>

      {/* Liste des backups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Historique des Backups
          </CardTitle>
          <CardDescription>
            {backups?.length || 0} backup(s) disponible(s) dans le stockage sécurisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !backups || backups.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Aucun backup disponible</p>
              <p className="text-sm text-muted-foreground mt-2">
                Créez votre premier backup pour sécuriser la blockchain
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-6 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-semibold text-lg">
                        {new Date(backup.backup_date).toLocaleString('fr-FR')}
                      </span>
                      <Badge variant="outline">{backup.status}</Badge>
                      {backup.restored_at && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Restauré
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Blocs:</span>
                        <span className="ml-2 font-mono font-semibold">{backup.block_count}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Taille:</span>
                        <span className="ml-2 font-semibold">{formatFileSize(backup.file_size_bytes)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Checksum:</span>
                        <code className="ml-2 text-xs">{backup.checksum.substring(0, 8)}...</code>
                      </div>
                    </div>

                    {backup.restored_at && (
                      <div className="text-xs text-muted-foreground mt-2">
                        📅 Restauré le {new Date(backup.restored_at).toLocaleString('fr-FR')}
                      </div>
                    )}

                    {backup.encryption_key_hash && (
                      <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Backup chiffré
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const { data, error } = await supabase.storage
                          .from('blockchain-backups')
                          .download(backup.file_path);
                        
                        if (error) {
                          toast.error('Erreur de téléchargement');
                          return;
                        }

                        const url = URL.createObjectURL(data);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `blockchain-backup-${backup.backup_date}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast.success('Téléchargement démarré');
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce backup ?')) {
                          deleteBackup(backup.id);
                        }
                      }}
                      disabled={isDeletingBackup}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainBackups;
