
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Trash2, Shield, Download } from 'lucide-react';
import { toast } from 'sonner';

const AccountDeletePage: React.FC = () => {
  const [confirmText, setConfirmText] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [exportRequested, setExportRequested] = useState(false);

  const handleDeleteAccount = () => {
    if (confirmText !== 'SUPPRIMER' || !agreedToTerms) {
      toast.error('Veuillez confirmer la suppression en suivant toutes les étapes');
      return;
    }
    
    toast.success('Demande de suppression envoyée. Vous recevrez un email de confirmation.');
  };

  const handleExportData = () => {
    setExportRequested(true);
    toast.success('Export de vos données en cours. Vous recevrez un email avec le fichier.');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-red-600">Suppression de Compte</h1>
        <p className="text-xl text-muted-foreground">
          Action irréversible - Procédure sécurisée RGPD
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Attention - Action Irréversible
              </CardTitle>
              <CardDescription>
                La suppression de votre compte entraînera la perte définitive de :
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Toutes vos données émotionnelles</li>
                <li>• Votre historique d'activités</li>
                <li>• Vos préférences et paramètres</li>
                <li>• Vos connexions sociales</li>
                <li>• Vos badges et réalisations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Conformité RGPD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>Nous respectons vos droits :</p>
                <ul className="space-y-1">
                  <li>• Suppression sous 30 jours</li>
                  <li>• Conservation logs de sécurité (6 mois)</li>
                  <li>• Données agrégées anonymisées conservées</li>
                  <li>• Droit de rétractation (7 jours)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exporter vos Données
              </CardTitle>
              <CardDescription>
                Récupérez une copie de vos données avant suppression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleExportData}
                variant="outline"
                className="w-full"
                disabled={exportRequested}
              >
                <Download className="h-4 w-4 mr-2" />
                {exportRequested ? 'Export en cours...' : 'Télécharger mes données'}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Format CSV/JSON - Reçu par email sous 24h
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Confirmer la Suppression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="confirm">
                  Tapez "SUPPRIMER" pour confirmer
                </Label>
                <Input
                  id="confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                  className="mt-2"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  Je comprends que cette action est irréversible et j'accepte 
                  les conditions de suppression RGPD
                </Label>
              </div>

              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                className="w-full"
                disabled={confirmText !== 'SUPPRIMER' || !agreedToTerms}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer Définitivement mon Compte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletePage;
