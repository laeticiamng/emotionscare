import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageRoot from '@/components/common/PageRoot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { JournalRemindersList } from '@/components/journal/JournalRemindersList';
import { JournalBackupPanel } from '@/components/journal/JournalBackupPanel';

const LANGUAGE_OPTIONS = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

const THEME_OPTIONS = [
  { value: 'system', label: 'Système' },
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
];

export default function JournalSettingsPage() {
  const { toast } = useToast();
  const [autoSave, setAutoSave] = useState(true);
  const [showPanas, setShowPanas] = useState(true);
  const [showPrompts, setShowPrompts] = useState(true);
  const [language, setLanguage] = useState('fr');
  const [theme, setTheme] = useState('system');

  const handleSaveSettings = () => {
    // Sauvegarder dans localStorage ou backend
    localStorage.setItem('journal-settings', JSON.stringify({
      autoSave,
      showPanas,
      showPrompts,
      language,
      theme,
    }));

    toast({
      title: 'Paramètres enregistrés',
      description: 'Vos préférences ont été mises à jour avec succès.',
    });
  };

  return (
    <PageRoot>
      <section className="container mx-auto px-4 py-10 max-w-4xl" aria-labelledby="settings-heading">
        <header className="mb-8">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link to="/journal">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au journal
            </Link>
          </Button>
          <h1 id="settings-heading" className="text-3xl font-semibold">
            Paramètres du journal
          </h1>
          <p className="text-muted-foreground mt-2">
            Configurez votre expérience de journaling selon vos préférences.
          </p>
        </header>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="reminders">Rappels</TabsTrigger>
            <TabsTrigger value="backup">Sauvegarde</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences générales</CardTitle>
                <CardDescription>
                  Personnalisez votre expérience de journaling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Sauvegarde automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Enregistre automatiquement vos brouillons pendant la saisie
                    </p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-panas">Suggestions PANAS</Label>
                    <p className="text-sm text-muted-foreground">
                      Affiche des suggestions basées sur votre affect émotionnel
                    </p>
                  </div>
                  <Switch
                    id="show-panas"
                    checked={showPanas}
                    onCheckedChange={setShowPanas}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-prompts">Prompts quotidiens</Label>
                    <p className="text-sm text-muted-foreground">
                      Affiche des questions inspirantes pour guider votre réflexion
                    </p>
                  </div>
                  <Switch
                    id="show-prompts"
                    checked={showPrompts}
                    onCheckedChange={setShowPrompts}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Thème</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {THEME_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveSettings} className="w-full">
                  Enregistrer les modifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <JournalRemindersList />
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <JournalBackupPanel notes={[]} />
          </TabsContent>
        </Tabs>
      </section>
    </PageRoot>
  );
}
