import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Theme {
  id: string;
  name: string;
  preview: string;
  description: string;
}

const AVAILABLE_THEMES: Theme[] = [
  { id: 'light', name: 'Clair', preview: 'bg-white border-2 border-gray-200', description: 'Thème lumineux et épuré' },
  { id: 'dark', name: 'Sombre', preview: 'bg-gray-900', description: 'Thème sombre pour réduire la fatigue oculaire' },
  { id: 'ocean', name: 'Océan', preview: 'bg-blue-500', description: 'Nuances apaisantes de bleu' },
  { id: 'forest', name: 'Forêt', preview: 'bg-green-600', description: 'Tons naturels et relaxants' },
  { id: 'sunset', name: 'Sunset', preview: 'bg-orange-500', description: 'Chaleur et énergie' },
  { id: 'lavender', name: 'Lavande', preview: 'bg-purple-500', description: 'Douceur et créativité' },
];

export default function ThemesPage() {
  const { toast } = useToast();
  const [activeTheme, setActiveTheme] = useState<string>('light');

  // Charger le thème depuis localStorage au montage
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      setActiveTheme(savedTheme);
      applyThemeToDocument(savedTheme);
    }
  }, []);

  const applyThemeToDocument = (themeId: string) => {
    // Appliquer le thème au document
    const root = document.documentElement;

    // Retirer toutes les classes de thème existantes
    AVAILABLE_THEMES.forEach(theme => {
      root.classList.remove(`theme-${theme.id}`);
    });

    // Ajouter la nouvelle classe de thème
    root.classList.add(`theme-${themeId}`);

    // Si c'est dark/light, utiliser aussi l'attribut data-theme pour compatibilité
    if (themeId === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (themeId === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  };

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);

    // Sauvegarder dans localStorage
    localStorage.setItem('app-theme', themeId);

    // Appliquer le thème
    applyThemeToDocument(themeId);

    // Notification
    const theme = AVAILABLE_THEMES.find(t => t.id === themeId);
    toast({
      title: 'Thème appliqué',
      description: `Le thème "${theme?.name}" est maintenant actif.`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Thèmes</h1>
        <p className="text-muted-foreground">
          Personnalisez l'apparence de votre application
        </p>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {AVAILABLE_THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;

          return (
            <Card
              key={theme.id}
              className="p-6 space-y-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => !isActive && handleThemeChange(theme.id)}
            >
              <div className={`h-32 rounded-lg ${theme.preview} relative`}>
                {isActive && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{theme.name}</h3>
                <p className="text-xs text-muted-foreground">{theme.description}</p>
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThemeChange(theme.id);
                  }}
                  disabled={isActive}
                >
                  {isActive ? 'Actif' : 'Appliquer'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
