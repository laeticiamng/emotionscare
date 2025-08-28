import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteAccountButton } from '@/components/account/DeleteAccountButton';
import { DeletePendingBanner } from '@/components/account/DeletePendingBanner';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';
import { AlertTriangle, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DeleteAccountPage: React.FC = () => {
  const { status } = useAccountDeletion();

  return (
    <Shell>
      <div className="container mx-auto py-6 max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Supprimer mon compte</h1>
          <p className="text-muted-foreground">
            Gère la suppression de ton compte et de tes données
          </p>
        </header>

        {/* Pending deletion banner */}
        <div className="mb-6">
          <DeletePendingBanner />
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Export recommendation */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Download className="w-5 h-5" />
                Recommandation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Avant de supprimer ton compte, nous te recommandons d'exporter tes données 
                  pour en conserver une copie personnelle.
                </p>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/40"
                  onClick={() => window.location.href = '/settings/privacy'}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter mes données
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Deletion process explanation */}
          <Card>
            <CardHeader>
              <CardTitle>Comment ça fonctionne</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Demande de suppression</p>
                    <p className="text-sm text-muted-foreground">
                      Ton compte est immédiatement désactivé
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-amber-700">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Période de grâce (30 jours)</p>
                    <p className="text-sm text-muted-foreground">
                      Tu peux annuler la suppression à tout moment
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-red-700">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Suppression définitive</p>
                    <p className="text-sm text-muted-foreground">
                      Toutes tes données sont supprimées définitivement
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What gets deleted */}
          <Card>
            <CardHeader>
              <CardTitle>Données concernées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Seront supprimées :</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Profil utilisateur et préférences</li>
                  <li>Données de bien-être et métriques</li>
                  <li>Historique d'utilisation des modules</li>
                  <li>Badges et progression gamification</li>
                  <li>Données de notifications et paramètres</li>
                </ul>

                <h4 className="font-medium text-sm mt-4">Peuvent être conservées (anonymisées) :</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Statistiques d'usage agrégées et anonymes</li>
                  <li>Logs techniques (sans données personnelles)</li>
                  <li>Données de facturation (si applicable, selon obligations légales)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Warning and action */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="font-medium text-destructive">
                      Action irréversible après 30 jours
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Une fois le délai de grâce écoulé, tes données ne pourront plus être récupérées.
                    </p>
                  </div>

                  {/* Only show delete button if account is not already soft deleted */}
                  {status === 'active' && (
                    <DeleteAccountButton className="w-full sm:w-auto" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

export default DeleteAccountPage;