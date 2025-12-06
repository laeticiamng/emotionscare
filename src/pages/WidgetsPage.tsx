import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Widget {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const STORAGE_KEY = 'emotionscare_widgets';

const defaultWidgets: Widget[] = [
  {
    id: 'widget-scan',
    name: 'Scan quotidien',
    description: 'Accès rapide au scan émotionnel',
    enabled: true,
  },
  {
    id: 'widget-music',
    name: 'Musique adaptative',
    description: 'Lecture musicale personnalisée',
    enabled: true,
  },
  {
    id: 'widget-stats',
    name: 'Statistiques',
    description: "Vue d'ensemble de vos progrès",
    enabled: false,
  },
  {
    id: 'widget-quotes',
    name: 'Citations',
    description: 'Citation inspirante du jour',
    enabled: true,
  },
  {
    id: 'widget-mood',
    name: 'Météo émotionnelle',
    description: 'Votre état émotionnel actuel',
    enabled: true,
  },
  {
    id: 'widget-goals',
    name: 'Objectifs',
    description: 'Suivi de vos objectifs',
    enabled: false,
  },
];

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [savedWidgets, setSavedWidgets] = useState<Widget[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Load widgets from localStorage on mount
  useEffect(() => {
    const storedWidgets = localStorage.getItem(STORAGE_KEY);

    if (storedWidgets) {
      try {
        const parsed = JSON.parse(storedWidgets);
        setWidgets(parsed);
        setSavedWidgets(parsed);
      } catch (error) {
        console.error('Error loading widgets:', error);
        setWidgets(defaultWidgets);
        setSavedWidgets(defaultWidgets);
      }
    } else {
      setWidgets(defaultWidgets);
      setSavedWidgets(defaultWidgets);
    }
  }, []);

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(widgets) !== JSON.stringify(savedWidgets);
    setHasChanges(changed);
  }, [widgets, savedWidgets]);

  const handleToggle = (widgetId: string) => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
      )
    );
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
      setSavedWidgets(widgets);

      toast({
        title: 'Configuration sauvegardée',
        description: 'Vos préférences de widgets ont été enregistrées',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error saving widgets:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la configuration',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setWidgets(defaultWidgets);
    setSavedWidgets(defaultWidgets);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWidgets));

    toast({
      title: 'Configuration réinitialisée',
      description: 'Les widgets par défaut ont été restaurés',
      variant: 'info',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Widgets</h1>
        <p className="text-muted-foreground">
          Configurez les widgets affichés sur votre tableau de bord
        </p>
      </div>

      <div className="space-y-4">
        {widgets.map((widget) => (
          <Card key={widget.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {widget.enabled ? (
                    <Eye className="h-5 w-5 text-primary" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <Label className="text-base font-semibold">{widget.name}</Label>
                    <p className="text-sm text-muted-foreground">
                      {widget.description}
                    </p>
                  </div>
                </div>
              </div>
              <Switch
                checked={widget.enabled}
                onCheckedChange={() => handleToggle(widget.id)}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>
          Réinitialiser
        </Button>
        <Button onClick={handleSave} disabled={!hasChanges}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}
