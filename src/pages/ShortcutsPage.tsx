import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Search } from 'lucide-react';

export default function ShortcutsPage() {
  const shortcuts = [
    { category: 'Navigation', items: [
      { keys: ['Ctrl', 'H'], action: 'Accueil' },
      { keys: ['Ctrl', 'S'], action: 'Scan émotionnel' },
      { keys: ['Ctrl', 'M'], action: 'Musique' },
      { keys: ['Ctrl', 'J'], action: 'Journal' },
    ]},
    { category: 'Actions', items: [
      { keys: ['Ctrl', 'N'], action: 'Nouvelle entrée' },
      { keys: ['Ctrl', 'K'], action: 'Recherche rapide' },
      { keys: ['Esc'], action: 'Fermer le panneau' },
    ]},
    { category: 'Paramètres', items: [
      { keys: ['Ctrl', ','], action: 'Préférences' },
      { keys: ['Ctrl', 'Shift', 'T'], action: 'Changer de thème' },
    ]},
  ];

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Raccourcis Clavier</h1>
        <p className="text-muted-foreground">
          Naviguez plus rapidement avec les raccourcis clavier
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un raccourci..." className="pl-10" />
      </div>

      <div className="space-y-6">
        {shortcuts.map((section, i) => (
          <Card key={i} className="p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              {section.category}
            </h3>
            <div className="space-y-3">
              {section.items.map((shortcut, j) => (
                <div key={j} className="flex items-center justify-between py-2">
                  <span className="text-sm">{shortcut.action}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, k) => (
                      <Badge key={k} variant="outline" className="font-mono">
                        {key}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Astuce:</strong> Appuyez sur <Badge variant="outline" className="font-mono mx-1">?</Badge> 
          n'importe où dans l'application pour afficher les raccourcis disponibles.
        </p>
      </Card>
    </div>
  );
}
