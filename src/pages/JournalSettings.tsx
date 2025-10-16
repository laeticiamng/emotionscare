import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JournalRemindersList } from '@/modules/journal/components/JournalRemindersList';
import { JournalReminderForm } from '@/modules/journal/components/JournalReminderForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings, Bell, Sparkles } from 'lucide-react';
import { useJournalSettings } from '@/hooks/useJournalSettings';
import type { JournalReminder, CreateReminderParams } from '@/services/journalReminders';

/**
 * Page de paramètres du journal
 */
const JournalSettingsPage = memo(() => {
  const {
    settings,
    updateSettings,
    reminders,
    createReminder,
    updateReminder,
    toggleReminder,
    deleteReminder,
  } = useJournalSettings();

  const [editingReminder, setEditingReminder] = useState<JournalReminder | null>(null);
  const [showReminderForm, setShowReminderForm] = useState(false);

  const handleCreateReminder = async (data: CreateReminderParams) => {
    await createReminder(data);
    setShowReminderForm(false);
  };

  const handleUpdateReminder = async (data: CreateReminderParams) => {
    if (editingReminder) {
      await updateReminder({ id: editingReminder.id, updates: data });
      setEditingReminder(null);
    }
  };

  const handleEditReminder = (reminder: JournalReminder) => {
    setEditingReminder(reminder);
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Paramètres du Journal</h1>
          <p className="text-sm text-muted-foreground">
            Personnalisez votre expérience d'écriture
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="reminders" className="gap-2">
            <Bell className="h-4 w-4" />
            Rappels
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suggestions d'écriture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-prompts">Afficher les suggestions</Label>
                  <p className="text-sm text-muted-foreground">
                    Proposer des idées d'écriture
                  </p>
                </div>
                <Switch
                  id="show-prompts"
                  checked={settings.showPrompts}
                  onCheckedChange={(checked) => updateSettings({ showPrompts: checked })}
                />
              </div>

              {settings.showPrompts && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="prompt-category">Catégorie préférée</Label>
                    <Select
                      value={settings.promptCategory}
                      onValueChange={(value: any) => updateSettings({ promptCategory: value })}
                    >
                      <SelectTrigger id="prompt-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        <SelectItem value="reflection">Réflexion</SelectItem>
                        <SelectItem value="gratitude">Gratitude</SelectItem>
                        <SelectItem value="goals">Objectifs</SelectItem>
                        <SelectItem value="emotions">Émotions</SelectItem>
                        <SelectItem value="creativity">Créativité</SelectItem>
                        <SelectItem value="mindfulness">Pleine conscience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-suggest">Suggestion automatique</Label>
                      <p className="text-sm text-muted-foreground">
                        Afficher une suggestion au démarrage
                      </p>
                    </div>
                    <Switch
                      id="auto-suggest"
                      checked={settings.autoSuggestPrompt}
                      onCheckedChange={(checked) => updateSettings({ autoSuggestPrompt: checked })}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Mes rappels</CardTitle>
              <Button onClick={() => setShowReminderForm(true)} size="sm">
                Nouveau rappel
              </Button>
            </CardHeader>
            <CardContent>
              <JournalRemindersList
                reminders={reminders}
                onToggle={(id, isActive) => toggleReminder({ id, isActive })}
                onEdit={handleEditReminder}
                onDelete={deleteReminder}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog pour créer un rappel */}
      <Dialog open={showReminderForm} onOpenChange={setShowReminderForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau rappel</DialogTitle>
          </DialogHeader>
          <JournalReminderForm
            onSubmit={handleCreateReminder}
            onCancel={() => setShowReminderForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog pour éditer un rappel */}
      <Dialog open={!!editingReminder} onOpenChange={(open) => !open && setEditingReminder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le rappel</DialogTitle>
          </DialogHeader>
          {editingReminder && (
            <JournalReminderForm
              reminder={editingReminder}
              onSubmit={handleUpdateReminder}
              onCancel={() => setEditingReminder(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

JournalSettingsPage.displayName = 'JournalSettingsPage';

export default JournalSettingsPage;
