
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const GdprActionsSection: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('gdpr-data-export', {
        body: { format: exportFormat }
      });

      if (error) throw error;

      // Créer et télécharger le fichier
      const blob = new Blob([JSON.stringify(data.data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mes-donnees-emotionscare.${exportFormat}`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: "Vos données ont été exportées avec succès.",
      });
    } catch (error) {
      console.error('Erreur export:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter vos données. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDataDeletion = async () => {
    if (confirmationCode !== 'DELETE_ALL_MY_DATA') {
      toast({
        title: "Code incorrect",
        description: "Veuillez saisir le code de confirmation exact.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('gdpr-data-deletion', {
        body: { confirmationCode }
      });

      if (error) throw error;

      toast({
        title: "Suppression réussie",
        description: "Toutes vos données ont été supprimées. Vous allez être déconnecté.",
      });

      // Déconnexion automatique après 2 secondes
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer vos données. Contactez le support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export des données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exporter mes données
          </CardTitle>
          <CardDescription>
            Téléchargez une copie complète de toutes vos données personnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="export-format">Format d'export</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON (recommandé)</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleDataExport} 
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? 'Export en cours...' : 'Exporter mes données'}
          </Button>
          <p className="text-sm text-muted-foreground">
            L'export comprend : profil, préférences, historique d'activités (anonymisé)
          </p>
        </CardContent>
      </Card>

      {/* Suppression des données */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Supprimer toutes mes données
          </CardTitle>
          <CardDescription>
            Action irréversible - Toutes vos données seront définitivement supprimées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-destructive">Attention !</p>
                <p className="text-sm text-muted-foreground">
                  Cette action supprimera définitivement :
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Votre profil et informations personnelles</li>
                  <li>Tout l'historique de vos émotions et activités</li>
                  <li>Vos conversations avec le coach IA</li>
                  <li>Vos préférences et paramètres</li>
                  <li>Votre compte utilisateur</li>
                </ul>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer toutes mes données
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    Cette action est <strong>irréversible</strong>. Toutes vos données seront 
                    définitivement supprimées de nos serveurs.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="confirmation">
                      Tapez exactement <code className="bg-muted px-1 rounded">DELETE_ALL_MY_DATA</code> pour confirmer :
                    </Label>
                    <Input
                      id="confirmation"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                      placeholder="DELETE_ALL_MY_DATA"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDataDeletion}
                  disabled={isDeleting || confirmationCode !== 'DELETE_ALL_MY_DATA'}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Informations légales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vos droits RGPD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p><strong>Droit d'accès :</strong> Vous pouvez demander l'accès à vos données personnelles</p>
            <p><strong>Droit de rectification :</strong> Vous pouvez corriger vos données inexactes</p>
            <p><strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données</p>
            <p><strong>Droit à la portabilité :</strong> Vous pouvez exporter vos données</p>
            <p><strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement</p>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Pour toute question relative à vos données personnelles, contactez notre DPO : 
              <a href="mailto:dpo@emotionscare.com" className="text-primary hover:underline ml-1">
                dpo@emotionscare.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GdprActionsSection;
