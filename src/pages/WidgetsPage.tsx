import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export default function WidgetsPage() {
  const widgets = [
    { name: 'Scan quotidien', description: 'Accès rapide au scan émotionnel', enabled: true },
    { name: 'Musique adaptative', description: 'Lecture musicale personnalisée', enabled: true },
    { name: 'Statistiques', description: 'Vue d\'ensemble de vos progrès', enabled: false },
    { name: 'Citations', description: 'Citation inspirante du jour', enabled: true },
    { name: 'Météo émotionnelle', description: 'Votre état émotionnel actuel', enabled: true },
    { name: 'Objectifs', description: 'Suivi de vos objectifs', enabled: false },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Widgets</h1>
        <p className="text-muted-foreground">
          Configurez les widgets affichés sur votre tableau de bord
        </p>
      </div>

      <div className="space-y-4">
        {widgets.map((widget, i) => (
          <Card key={i} className="p-6">
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
                    <p className="text-sm text-muted-foreground">{widget.description}</p>
                  </div>
                </div>
              </div>
              <Switch defaultChecked={widget.enabled} />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Réinitialiser</Button>
        <Button>Sauvegarder</Button>
      </div>
    </div>
  );
}
