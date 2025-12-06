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
                <Label htmlFor="dark-mode">Mode sombre</Label>
                <Switch id="dark-mode" aria-label="Mode sombre" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="animations">Animations</Label>
                <Switch id="animations" defaultChecked aria-label="Animations" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="transparency">Effets de transparence</Label>
                <Switch id="transparency" defaultChecked aria-label="Effets de transparence" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Taille du texte</h3>
            <Slider defaultValue={[50]} max={100} step={1} aria-label="Taille du texte" />
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Disposition</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-sidebar">Barre latérale compacte</Label>
                <Switch id="compact-sidebar" aria-label="Barre latérale compacte" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-badges">Afficher les badges</Label>
                <Switch id="show-badges" defaultChecked aria-label="Afficher les badges" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="fullscreen">Mode plein écran</Label>
                <Switch id="fullscreen" aria-label="Mode plein écran" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Espacement</h3>
            <Slider defaultValue={[50]} max={100} step={1} aria-label="Espacement" />
          </div>
        </Card>
      </div>
    </div>
  );
}
