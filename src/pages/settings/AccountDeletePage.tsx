
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Trash2, Download, Clock } from 'lucide-react';

const AccountDeletePage: React.FC = () => {
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [downloadData, setDownloadData] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  const userEmail = 'user@example.com'; // À récupérer du contexte auth
  const isConfirmValid = confirmEmail === userEmail && confirmText === 'SUPPRIMER MON COMPTE';

  const dataToDelete = [
    'Profil utilisateur et informations personnelles',
    'Historique des émotions et analyses',
    'Entrées de journal personnel',
    'Sessions de méditation et VR',
    'Données de respiration et bien-être',
    'Achievements et progression',
    'Interactions sociales dans le cocon',
    'Préférences et paramètres'
  ];

  const handleDelete = async () => {
    if (!isConfirmValid || !agreeTerms) return;
    
    // Ici, traitement de la suppression du compte
    console.log('Suppression du compte demandée', {
      email: confirmEmail,
      downloadData,
      reason: deleteReason
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-red-600">Suppression de Compte</h1>
          <p className="text-muted-foreground">Cette action est irréversible et supprimera définitivement toutes vos données</p>
        </div>

        <div className="space-y-6">
          {/* Avertissement principal */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Attention - Action Irréversible
              </CardTitle>
              <CardDescription className="text-red-600">
                La suppression de votre compte ne peut pas être annulée. Toutes vos données seront définitivement perdues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">Délai de grâce : 30 jours avant suppression définitive</span>
              </div>
            </CardContent>
          </Card>

          {/* Données qui seront supprimées */}
          <Card>
            <CardHeader>
              <CardTitle>Données qui seront supprimées</CardTitle>
              <CardDescription>Liste complète des informations qui seront définitivement effacées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {dataToDelete.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Option de sauvegarde */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Sauvegarder vos données
              </CardTitle>
              <CardDescription>Téléchargez une copie de vos données avant la suppression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="download-data"
                  checked={downloadData}
                  onCheckedChange={(checked) => setDownloadData(checked as boolean)}
                />
                <label htmlFor="download-data" className="text-sm font-medium">
                  Télécharger mes données avant suppression
                </label>
              </div>
              
              {downloadData && (
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-700">
                    Un export complet de vos données sera généré et envoyé à votre email avant la suppression définitive.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Raison de suppression */}
          <Card>
            <CardHeader>
              <CardTitle>Raison de la suppression (optionnel)</CardTitle>
              <CardDescription>Aidez-nous à améliorer notre service</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Pourquoi souhaitez-vous supprimer votre compte ?"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Confirmation */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Confirmation de Suppression</CardTitle>
              <CardDescription>Veuillez confirmer votre intention de supprimer définitivement votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmez votre email :</label>
                <Input
                  type="email"
                  placeholder={userEmail}
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className={confirmEmail === userEmail ? 'border-green-500' : 'border-red-300'}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tapez "SUPPRIMER MON COMPTE" pour confirmer :</label>
                <Input
                  placeholder="SUPPRIMER MON COMPTE"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className={confirmText === 'SUPPRIMER MON COMPTE' ? 'border-green-500' : 'border-red-300'}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agree-terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <label htmlFor="agree-terms" className="text-sm">
                  Je comprends que cette action est irréversible et accepte la suppression définitive de mon compte
                </label>
              </div>

              <Button
                onClick={handleDelete}
                disabled={!isConfirmValid || !agreeTerms}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer définitivement mon compte
              </Button>

              {!isConfirmValid && (
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-700">
                    Veuillez confirmer votre email et taper exactement le texte de confirmation pour continuer.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletePage;
