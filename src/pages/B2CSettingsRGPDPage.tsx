import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Download, Trash2, AlertTriangle, Info } from 'lucide-react';
import { RGPDExportDialog } from '@/components/rgpd/RGPDExportDialog';
import { AccountDeletionDialog } from '@/components/rgpd/AccountDeletionDialog';
import { rgpdService } from '@/services/rgpdService';

const B2CSettingsRGPDPage: React.FC = () => {
  const navigate = useNavigate();
  const [accountStatus, setAccountStatus] = useState<{
    status: 'active' | 'pending_deletion' | 'deleted';
    scheduledDeletion?: string;
    canUndelete?: boolean;
  }>({ status: 'active' });

  useEffect(() => {
    loadAccountStatus();
  }, []);

  const loadAccountStatus = async () => {
    const status = await rgpdService.getAccountStatus();
    setAccountStatus(status);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/b2c/preferences')}
            className="hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Droits RGPD</h1>
            <p className="text-gray-600">Gérez vos données personnelles conformément au RGPD</p>
          </div>
        </div>

        {/* Statut du compte */}
        {accountStatus.status === 'pending_deletion' && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-orange-800">
                    Suppression programmée
                  </h3>
                  <p className="text-sm text-orange-700">
                    Votre compte sera supprimé le {accountStatus.scheduledDeletion}. 
                    Vous pouvez encore annuler cette action.
                  </p>
                </div>
                {accountStatus.canUndelete && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Annuler la suppression
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informations RGPD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Vos droits selon le RGPD
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Droit d'accès</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Vous pouvez obtenir une copie de toutes vos données personnelles.
                </p>
                <RGPDExportDialog />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Droit de portabilité</h4>
                <p className="text-sm text-green-700 mb-3">
                  Récupérez vos données dans un format lisible pour les transférer.
                </p>
                <Button variant="outline" size="sm" disabled>
                  Export CSV (bientôt)
                </Button>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Droit de rectification</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Modifiez vos informations personnelles directement dans vos paramètres.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/b2c/preferences')}
                >
                  Modifier le profil
                </Button>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Droit à l'effacement</h4>
                <p className="text-sm text-red-700 mb-3">
                  Supprimez définitivement votre compte et toutes vos données.
                </p>
                <AccountDeletionDialog />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails sur les données collectées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Données collectées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Données de profil</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Nom, email et préférences utilisateur</li>
                  <li>• Paramètres de confidentialité</li>
                  <li>• Langue et thème d'interface</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Données de bien-être</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Métriques émotionnelles anonymisées</li>
                  <li>• Historique d'utilisation des modules</li>
                  <li>• Préférences musicales et de relaxation</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Données techniques</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Logs d'erreurs (sans contenu personnel)</li>
                  <li>• Métriques de performance anonymes</li>
                  <li>• Préférences d'accessibilité</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Données NON collectées
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Aucune donnée biométrique brute</li>
                  <li>• Aucun enregistrement audio/vidéo</li>
                  <li>• Aucune géolocalisation précise</li>
                  <li>• Aucune donnée de santé sensible</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Base légale et contact */}
        <Card>
          <CardHeader>
            <CardTitle>Base légale du traitement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge className="mb-2">Consentement</Badge>
              <p className="text-sm text-gray-600">
                Le traitement de vos données de bien-être est basé sur votre consentement explicite,
                que vous pouvez retirer à tout moment.
              </p>
            </div>

            <div>
              <Badge className="mb-2" variant="secondary">Exécution du contrat</Badge>
              <p className="text-sm text-gray-600">
                Certaines données sont nécessaires pour fournir nos services 
                (compte utilisateur, préférences de base).
              </p>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Contact DPO</h4>
              <p className="text-sm text-gray-600">
                Pour toute question concernant vos données personnelles :<br />
                <strong>dpo@emotionscare.com</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CSettingsRGPDPage;