import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export default function CustomizationPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Personnalisation</h1>
        <p className="text-muted-foreground">
          Adaptez l'interface à vos préférences
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Apparence</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Mode sombre</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Animations</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Effets de transparence</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Taille du texte</h3>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Disposition</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Barre latérale compacte</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Afficher les badges</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mode plein écran</Label>
                <Switch />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Espacement</h3>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </Card>
      </div>
    </div>
  );
}
