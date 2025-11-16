/**
 * Account Deletion Page with Grace Period
 * GDPR Article 17 - Right to Erasure
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Trash2,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  Calendar,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  AccountDeletionService,
  type DeletionRequest,
} from '@/services/gdpr/AccountDeletionService';
import { logger } from '@/lib/logger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AccountDeletionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingDeletion, setPendingDeletion] = useState<DeletionRequest | null>(null);
  const [deletionHistory, setDeletionHistory] = useState<DeletionRequest[]>([]);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadDeletionStatus();
    }
  }, [user?.id]);

  const loadDeletionStatus = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const [pending, history] = await Promise.all([
        AccountDeletionService.getPendingDeletionRequest(user.id),
        AccountDeletionService.getDeletionHistory(user.id),
      ]);

      setPendingDeletion(pending);
      setDeletionHistory(history);
    } catch (error) {
      logger.error('Failed to load deletion status', error, 'GDPR');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (!user?.id) return;

    setIsProcessing(true);
    try {
      const deletionRequest = await AccountDeletionService.requestDeletion(
        user.id,
        reason || undefined
      );

      setPendingDeletion(deletionRequest);
      setShowConfirmDialog(false);
      setReason('');

      toast({
        title: 'Demande de suppression envoyée',
        description: `Votre compte sera supprimé le ${new Date(
          deletionRequest.scheduled_deletion_at
        ).toLocaleDateString('fr-FR')}`,
      });

      await loadDeletionStatus();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de traiter votre demande',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelDeletion = async () => {
    if (!user?.id) return;

    setIsProcessing(true);
    try {
      await AccountDeletionService.cancelDeletion(user.id);

      setPendingDeletion(null);

      toast({
        title: 'Suppression annulée',
        description: 'Votre compte a été conservé avec succès',
      });

      await loadDeletionStatus();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'annuler la suppression',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const remainingDays = pendingDeletion
    ? AccountDeletionService.getRemainingDays(pendingDeletion)
    : 0;

  const progressPercentage = pendingDeletion
    ? ((pendingDeletion.grace_period_days - remainingDays) /
        pendingDeletion.grace_period_days) *
      100
    : 0;

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Chargement...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-destructive/10 rounded-lg">
          <Trash2 className="h-8 w-8 text-destructive" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Suppression de compte</h1>
          <p className="text-muted-foreground mt-2">
            Conformément au RGPD (Article 17 - Droit à l'effacement), vous pouvez demander la
            suppression définitive de votre compte et de toutes vos données.
          </p>
        </div>
      </div>

      {/* Pending Deletion Status */}
      {pendingDeletion && (
        <Alert variant="destructive" className="border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">
            Suppression planifiée
          </AlertTitle>
          <AlertDescription className="space-y-4 mt-3">
            <div className="space-y-2">
              <p>
                Votre compte sera définitivement supprimé le{' '}
                <strong>
                  {new Date(pendingDeletion.scheduled_deletion_at).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </strong>
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  <strong>{remainingDays}</strong> jours restants pour annuler
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progression de la période de grâce</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <Button
              onClick={handleCancelDeletion}
              disabled={isProcessing}
              variant="default"
              size="lg"
              className="w-full mt-4"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Annuler la suppression
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* What happens section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Qu'est-ce qui sera supprimé ?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium">Toutes vos données personnelles</p>
              <p className="text-sm text-muted-foreground">
                Profil, préférences, paramètres de confidentialité
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium">Tout votre contenu</p>
              <p className="text-sm text-muted-foreground">
                Entrées de journal, scans émotionnels, sessions d'activité
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium">Votre compte utilisateur</p>
              <p className="text-sm text-muted-foreground">
                Accès définitivement révoqué, impossible de se reconnecter
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grace Period Info */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-2">Période de grâce de 30 jours</p>
              <p className="text-sm text-blue-800">
                Après avoir demandé la suppression, vous disposez de 30 jours pour changer d'avis.
                Durant cette période, votre compte reste actif et vous pouvez annuler la demande à
                tout moment.
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Mail className="h-4 w-4" />
                  <span>Vous recevrez des rappels par email</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Calendar className="h-4 w-4" />
                  <span>Rappels à J-7, J-3 et J-1 avant la suppression</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Deletion Form */}
      {!pendingDeletion && (
        <Card>
          <CardHeader>
            <CardTitle>Demander la suppression de mon compte</CardTitle>
            <CardDescription>
              Cette action est irréversible après la période de grâce
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Raison de la suppression (optionnel)
              </label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Dites-nous pourquoi vous souhaitez supprimer votre compte..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Vos retours nous aident à améliorer notre service
              </p>
            </div>

            <Button
              onClick={() => setShowConfirmDialog(true)}
              variant="destructive"
              size="lg"
              className="w-full"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Demander la suppression
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Deletion History */}
      {deletionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historique des demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deletionHistory.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Demandée le{' '}
                      {new Date(request.requested_at).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Suppression prévue le{' '}
                      {new Date(request.scheduled_deletion_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Badge
                    variant={
                      request.status === 'completed'
                        ? 'destructive'
                        : request.status === 'cancelled'
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {request.status === 'completed'
                      ? 'Terminée'
                      : request.status === 'cancelled'
                      ? 'Annulée'
                      : 'En cours'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-3">
              <p>
                Vous êtes sur le point de demander la suppression de votre compte. Cette action :
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Supprimera toutes vos données après 30 jours</li>
                <li>Peut être annulée pendant la période de grâce</li>
                <li>Est définitive après expiration du délai</li>
              </ul>
              <p className="font-medium text-foreground pt-2">Êtes-vous sûr de vouloir continuer ?</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isProcessing}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleRequestDeletion}
              disabled={isProcessing}
            >
              {isProcessing ? 'Traitement...' : 'Confirmer la suppression'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
