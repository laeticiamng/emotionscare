import { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

const PREFERENCES_KEY = 'journal-user-preferences';

export interface UserPreferences {
  // Apparence
  defaultView: 'grid' | 'list';
  notesPerPage: number;
  showPreview: boolean;
  compactMode: boolean;

  // Édition
  autoSave: boolean;
  autoSaveDelay: number; // en secondes
  confirmDelete: boolean;
  spellCheck: boolean;

  // Fonctionnalités
  enableVoiceNotes: boolean;
  showPanasSuggestions: boolean;
  showPrompts: boolean;
  showQuickTips: boolean;

  // Notifications
  reminderNotifications: boolean;
  achievementNotifications: boolean;
  weeklyDigest: boolean;

  // Confidentialité
  analytics: boolean;
  shareUsageData: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultView: 'list',
  notesPerPage: 10,
  showPreview: true,
  compactMode: false,
  autoSave: true,
  autoSaveDelay: 30,
  confirmDelete: true,
  spellCheck: true,
  enableVoiceNotes: true,
  showPanasSuggestions: true,
  showPrompts: true,
  showQuickTips: true,
  reminderNotifications: true,
  achievementNotifications: true,
  weeklyDigest: false,
  analytics: true,
  shareUsageData: false,
};

interface JournalUserPreferencesProps {
  onPreferencesChange?: (preferences: UserPreferences) => void;
}

/**
 * Composant de gestion des préférences utilisateur
 * Permet de personnaliser l'expérience du journal
 */
export function JournalUserPreferences({ onPreferencesChange }: JournalUserPreferencesProps) {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [hasChanges, setHasChanges] = useState(false);

  // Charger les préférences au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      logger.error('Failed to load preferences', error as Error, 'UI');
    }
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
      onPreferencesChange?.(preferences);
      setHasChanges(false);
      
      toast({
        title: 'Préférences enregistrées',
        description: 'Vos préférences ont été mises à jour avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder vos préférences.',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setHasChanges(true);
    
    toast({
      title: 'Préférences réinitialisées',
      description: 'Les paramètres par défaut ont été restaurés.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Préférences
            </CardTitle>
            <CardDescription>
              Personnalisez votre expérience de journaling
            </CardDescription>
          </div>
          {hasChanges && (
            <Button onClick={handleSave} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Apparence */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Apparence</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="default-view">Vue par défaut</Label>
                <p className="text-sm text-muted-foreground">
                  Comment afficher vos notes
                </p>
              </div>
              <Select
                value={preferences.defaultView}
                onValueChange={(v: 'grid' | 'list') => updatePreference('defaultView', v)}
              >
                <SelectTrigger id="default-view" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">Liste</SelectItem>
                  <SelectItem value="grid">Grille</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notes-per-page">Notes par page</Label>
                <span className="text-sm text-muted-foreground">
                  {preferences.notesPerPage}
                </span>
              </div>
              <Slider
                id="notes-per-page"
                min={5}
                max={50}
                step={5}
                value={[preferences.notesPerPage]}
                onValueChange={([v]) => updatePreference('notesPerPage', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-preview">Aperçu des notes</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher un extrait dans la liste
                </p>
              </div>
              <Switch
                id="show-preview"
                checked={preferences.showPreview}
                onCheckedChange={(v) => updatePreference('showPreview', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-mode">Mode compact</Label>
                <p className="text-sm text-muted-foreground">
                  Réduire l'espacement entre les éléments
                </p>
              </div>
              <Switch
                id="compact-mode"
                checked={preferences.compactMode}
                onCheckedChange={(v) => updatePreference('compactMode', v)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Édition */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Édition</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">Sauvegarde automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Enregistrer pendant la saisie
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={preferences.autoSave}
                onCheckedChange={(v) => updatePreference('autoSave', v)}
              />
            </div>

            {preferences.autoSave && (
              <div className="space-y-2 ml-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-save-delay">Délai (secondes)</Label>
                  <span className="text-sm text-muted-foreground">
                    {preferences.autoSaveDelay}s
                  </span>
                </div>
                <Slider
                  id="auto-save-delay"
                  min={10}
                  max={120}
                  step={10}
                  value={[preferences.autoSaveDelay]}
                  onValueChange={([v]) => updatePreference('autoSaveDelay', v)}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="confirm-delete">Confirmer la suppression</Label>
                <p className="text-sm text-muted-foreground">
                  Demander confirmation avant de supprimer
                </p>
              </div>
              <Switch
                id="confirm-delete"
                checked={preferences.confirmDelete}
                onCheckedChange={(v) => updatePreference('confirmDelete', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="spell-check">Vérification orthographique</Label>
                <p className="text-sm text-muted-foreground">
                  Activer le correcteur orthographique
                </p>
              </div>
              <Switch
                id="spell-check"
                checked={preferences.spellCheck}
                onCheckedChange={(v) => updatePreference('spellCheck', v)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Fonctionnalités */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Fonctionnalités</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="voice-notes">Notes vocales</Label>
                <p className="text-sm text-muted-foreground">
                  Activer l'enregistrement audio
                </p>
              </div>
              <Switch
                id="voice-notes"
                checked={preferences.enableVoiceNotes}
                onCheckedChange={(v) => updatePreference('enableVoiceNotes', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="panas">Suggestions PANAS</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher les suggestions émotionnelles
                </p>
              </div>
              <Switch
                id="panas"
                checked={preferences.showPanasSuggestions}
                onCheckedChange={(v) => updatePreference('showPanasSuggestions', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="prompts">Prompts quotidiens</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher des questions inspirantes
                </p>
              </div>
              <Switch
                id="prompts"
                checked={preferences.showPrompts}
                onCheckedChange={(v) => updatePreference('showPrompts', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quick-tips">Conseils rapides</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher des astuces d'utilisation
                </p>
              </div>
              <Switch
                id="quick-tips"
                checked={preferences.showQuickTips}
                onCheckedChange={(v) => updatePreference('showQuickTips', v)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminders">Rappels</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des rappels de journaling
                </p>
              </div>
              <Switch
                id="reminders"
                checked={preferences.reminderNotifications}
                onCheckedChange={(v) => updatePreference('reminderNotifications', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="achievements">Achievements</Label>
                <p className="text-sm text-muted-foreground">
                  Célébrer les achievements débloqués
                </p>
              </div>
              <Switch
                id="achievements"
                checked={preferences.achievementNotifications}
                onCheckedChange={(v) => updatePreference('achievementNotifications', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="digest">Résumé hebdomadaire</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir un résumé par email
                </p>
              </div>
              <Switch
                id="digest"
                checked={preferences.weeklyDigest}
                onCheckedChange={(v) => updatePreference('weeklyDigest', v)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!hasChanges} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
