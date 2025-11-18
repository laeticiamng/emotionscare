import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import {
  Shield, Download, Trash2, Edit, CheckCircle2,
  AlertTriangle, Loader2, FileText, Mail
} from 'lucide-react';
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

interface PrivacySettings {
  analytics_enabled: boolean;
  personalization_enabled: boolean;
  marketing_emails: boolean;
  push_notifications: boolean;
  share_with_partners: boolean;
}

export const PrivacySettingsPage: React.FC<{ 'data-testid'?: string }> = ({
  'data-testid': testId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [settings, setSettings] = useState<PrivacySettings>({
    analytics_enabled: true,
    personalization_enabled: true,
    marketing_emails: false,
    push_notifications: true,
    share_with_partners: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Charger les paramètres au montage
  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        throw error;
      }

      if (data) {
        setSettings({
          analytics_enabled: data.analytics_enabled ?? true,
          personalization_enabled: data.personalization_enabled ?? true,
          marketing_emails: data.marketing_emails ?? false,
          push_notifications: data.push_notifications ?? true,
          share_with_partners: data.share_with_partners ?? false,
        });
      }
    } catch (error) {
      logger.error('Error loading privacy settings', error as Error, 'COMPONENT');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos paramètres',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: keyof PrivacySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('user_privacy_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setHasChanges(false);
      toast({
        title: 'Paramètres sauvegardés',
        description: 'Vos préférences de confidentialité ont été mises à jour',
      });
    } catch (error) {
      logger.error('Error saving privacy settings', error as Error, 'COMPONENT');
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder vos paramètres',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    try {
      setIsExporting(true);

      // Récupérer toutes les données utilisateur
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Récupérer les signals cliniques
      const { data: clinicalData } = await supabase
        .from('clinical_signals')
        .select('*')
        .eq('user_id', user.id);

      // Créer un export JSON conforme RGPD
      const exportData = {
        export_date: new Date().toISOString(),
        user_id: user.id,
        email: user.email,
        profile: userData,
        clinical_signals: clinicalData || [],
        privacy_settings: settings,
      };

      // Télécharger le fichier
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `emotionscare-data-${user.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: 'Vos données ont été téléchargées',
      });
    } catch (error) {
      logger.error('Error exporting data', error as Error, 'COMPONENT');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'exporter vos données',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
      setShowExportDialog(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);

      // Soft delete: marquer le compte comme supprimé
      const { error } = await supabase
        .from('profiles')
        .update({
          deleted_at: new Date().toISOString(),
          email: `deleted_${Date.now()}@emotionscare.com`
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Compte supprimé',
        description: 'Votre compte sera définitivement supprimé sous 30 jours',
      });

      // Déconnecter l'utilisateur
      await supabase.auth.signOut();

    } catch (error) {
      logger.error('Error deleting account', error as Error, 'COMPONENT');
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer votre compte',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid={testId || "page-root"}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid={testId || "page-root"}>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Paramètres de confidentialité
            </h1>
          </div>
          <p className="text-muted-foreground">
            Gérez vos données personnelles et vos préférences de confidentialité conformément au RGPD
          </p>
          <Badge variant="outline" className="mt-2">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Conforme RGPD
          </Badge>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Contrôle des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Contrôle des données
              </CardTitle>
              <CardDescription>
                Gérez comment vos données sont utilisées pour améliorer votre expérience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="analytics" className="text-base font-medium">
                    Collecte de données analytiques
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre la collecte de données d'usage pour améliorer l'expérience
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={settings.analytics_enabled}
                  onCheckedChange={(checked) => handleSettingChange('analytics_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="personalization" className="text-base font-medium">
                    Personnalisation du contenu
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Utiliser vos données pour personnaliser les recommandations
                  </p>
                </div>
                <Switch
                  id="personalization"
                  checked={settings.personalization_enabled}
                  onCheckedChange={(checked) => handleSettingChange('personalization_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="partners" className="text-base font-medium">
                    Partage avec partenaires
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Partager des données anonymisées avec nos partenaires de recherche
                  </p>
                </div>
                <Switch
                  id="partners"
                  checked={settings.share_with_partners}
                  onCheckedChange={(checked) => handleSettingChange('share_with_partners', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications et communications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Notifications et communications
              </CardTitle>
              <CardDescription>
                Contrôlez les communications que vous recevez
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="marketing" className="text-base font-medium">
                    Emails marketing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des informations sur nos nouveautés et conseils
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={settings.marketing_emails}
                  onCheckedChange={(checked) => handleSettingChange('marketing_emails', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="push" className="text-base font-medium">
                    Notifications push
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des rappels et notifications personnalisées
                  </p>
                </div>
                <Switch
                  id="push"
                  checked={settings.push_notifications}
                  onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bouton de sauvegarde */}
          {hasChanges && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Vous avez des modifications non sauvegardées</span>
                  </div>
                  <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Sauvegarder les modifications
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gestion des données RGPD */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gestion de vos données (RGPD)
              </CardTitle>
              <CardDescription>
                Exercez vos droits sur vos données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
                onClick={() => setShowExportDialog(true)}
              >
                <Download className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Télécharger mes données</div>
                  <div className="text-sm text-muted-foreground">
                    Export complet de toutes vos données au format JSON
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
                onClick={() => { window.location.href = '/support?subject=correction'; }}
              >
                <Edit className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Demander une correction</div>
                  <div className="text-sm text-muted-foreground">
                    Contactez-nous pour corriger vos informations
                  </div>
                </div>
              </Button>

              <Button
                variant="destructive"
                className="w-full justify-start h-auto py-4"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Supprimer mon compte</div>
                  <div className="text-sm text-destructive-foreground/80">
                    Suppression définitive après 30 jours de réflexion
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog d'export */}
      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exporter vos données</AlertDialogTitle>
            <AlertDialogDescription>
              Nous allons générer un fichier JSON contenant toutes vos données personnelles :
              profil, signaux cliniques, paramètres de confidentialité. Ce fichier sera
              téléchargé sur votre appareil.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleExportData} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Export en cours...
                </>
              ) : (
                'Confirmer l\'export'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Supprimer définitivement votre compte ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Votre compte sera désactivé immédiatement et
              supprimé définitivement après 30 jours. Durant cette période, vous pouvez
              annuler la suppression en nous contactant.
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
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Confirmer la suppression'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
