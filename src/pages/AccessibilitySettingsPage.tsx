import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AccessibilitySettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Paramètres d'Accessibilité</h1>
        <p className="text-muted-foreground">
          Personnalisez l'accessibilité selon vos besoins
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Vision</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Contraste élevé</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mode daltonien</Label>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Taille du texte</Label>
                <Slider defaultValue={[100]} min={75} max={150} step={5} />
              </div>
              <div className="space-y-2">
                <Label>Espacement des lignes</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Navigation au clavier</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Lecteur d'écran</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Descriptions audio</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Réduire les animations</Label>
                <Switch />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
