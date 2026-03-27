// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomizationPrefs {
  darkMode: boolean;
  animations: boolean;
  transparency: boolean;
  textSize: number;
  compactSidebar: boolean;
  showBadges: boolean;
  fullscreen: boolean;
  spacing: number;
}

const STORAGE_KEY = 'emotionscare-customization';

const DEFAULT_PREFS: CustomizationPrefs = {
  darkMode: false,
  animations: true,
  transparency: true,
  textSize: 50,
  compactSidebar: false,
  showBadges: true,
  fullscreen: false,
  spacing: 50,
};

function loadPrefs(): CustomizationPrefs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
  } catch { /* use defaults */ }
  return DEFAULT_PREFS;
}

export default function CustomizationPage() {
  const [prefs, setPrefs] = useState<CustomizationPrefs>(loadPrefs);
  const { toast } = useToast();

  const update = useCallback(<K extends keyof CustomizationPrefs>(key: K, value: CustomizationPrefs[K]) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${14 + (prefs.textSize / 100) * 6}px`;
    return () => { document.documentElement.style.fontSize = ''; };
  }, [prefs.textSize]);

  useEffect(() => {
    if (prefs.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [prefs.darkMode]);

  const handleReset = () => {
    setPrefs(DEFAULT_PREFS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFS));
    toast({ title: 'Preferences reinitialisees' });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link to="/app/home" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour au dashboard
      </Link>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Personnalisation</h1>
          <p className="text-muted-foreground">
            Adaptez l'interface a vos preferences
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          Reinitialiser
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Apparence</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Mode sombre</Label>
                <Switch id="dark-mode" checked={prefs.darkMode} onCheckedChange={v => update('darkMode', v)} aria-label="Mode sombre" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="animations">Animations</Label>
                <Switch id="animations" checked={prefs.animations} onCheckedChange={v => update('animations', v)} aria-label="Animations" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="transparency">Effets de transparence</Label>
                <Switch id="transparency" checked={prefs.transparency} onCheckedChange={v => update('transparency', v)} aria-label="Effets de transparence" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Taille du texte ({prefs.textSize}%)</h3>
            <Slider value={[prefs.textSize]} max={100} step={1} onValueChange={v => update('textSize', v[0])} aria-label="Taille du texte" />
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Disposition</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-sidebar">Barre laterale compacte</Label>
                <Switch id="compact-sidebar" checked={prefs.compactSidebar} onCheckedChange={v => update('compactSidebar', v)} aria-label="Barre laterale compacte" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-badges">Afficher les badges</Label>
                <Switch id="show-badges" checked={prefs.showBadges} onCheckedChange={v => update('showBadges', v)} aria-label="Afficher les badges" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="fullscreen">Mode plein ecran</Label>
                <Switch id="fullscreen" checked={prefs.fullscreen} onCheckedChange={v => {
                  update('fullscreen', v);
                  if (v) document.documentElement.requestFullscreen?.();
                  else document.exitFullscreen?.();
                }} aria-label="Mode plein ecran" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Espacement ({prefs.spacing}%)</h3>
            <Slider value={[prefs.spacing]} max={100} step={1} onValueChange={v => update('spacing', v[0])} aria-label="Espacement" />
          </div>
        </Card>
      </div>
    </div>
  );
}
