// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DeleteAccountButton } from '@/components/account/DeleteAccountButton';
import { 
  AlertTriangle, 
  Download, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';
import { useRouter } from '@/hooks/router';

/**
 * Panel de suppression de compte avec protection et réversibilité
 */
export const DeletePanel: React.FC = () => {
  const { status, purgeAt, undelete } = useAccountDeletion();
  const router = useRouter();

  // Si le compte est en cours de suppression
  if (status === 'soft_deleted' && purgeAt) {
    const purgeDate = new Date(purgeAt);
    const remainingDays = Math.ceil((purgeDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>Suppression planifiée</strong><br />
            Votre compte sera définitivement supprimé le {purgeDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric', 
              month: 'long',
              year: 'numeric'
            })} ({remainingDays} jour{remainingDays > 1 ? 's' : ''} restant{remainingDays > 1 ? 's' : ''}).
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            onClick={undelete}
            className="flex-1"
          >
            Annuler la suppression
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push('/export')}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Sauvegarder mes données
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Vous pouvez annuler la suppression à tout moment avant la date limite. 
          Après cette date, toutes vos données seront définitivement perdues.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Warning */}
      <Alert>
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription>
          <strong>Attention :</strong> Cette action déclenchera une suppression 
          différée de 30 jours. Vous pourrez annuler pendant cette période.
        </AlertDescription>
      </Alert>

      {/* Pre-deletion recommendations */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Avant de supprimer votre compte :</h4>
        
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
            <Download className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Exportez vos données</p>
              <p className="text-muted-foreground text-xs">
                Sauvegardez vos activités et statistiques
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/export')}
            >
              Exporter
            </Button>
          </div>

          <div className="flex items-center gap-3 p-2 bg-amber-50 rounded">
            <ExternalLink className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Consultez nos conditions</p>
              <p className="text-muted-foreground text-xs">
                Comprenez ce qui sera supprimé
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/help/deletion')}
            >
              Voir
            </Button>
          </div>
        </div>
      </div>

      {/* Deletion Process */}
      <div className="bg-muted/50 p-3 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Processus de suppression :</h4>
        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Confirmation en deux étapes</li>
          <li>Suppression immédiate de l'accès</li>
          <li>Période de grâce de 30 jours</li>
          <li>Purge définitive des données</li>
        </ol>
      </div>

      {/* Delete Button */}
      <DeleteAccountButton />

      {/* Legal notice */}
      <div className="text-xs text-muted-foreground">
        Conformément au RGPD, vous avez le droit de supprimer vos données personnelles. 
        Cette suppression est irréversible après la période de grâce.
      </div>
    </div>
  );
};