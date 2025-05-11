
import React from 'react';
import ColorPaletteDisplay from '@/components/theme/ColorPaletteDisplay';
import ThemeColorExample from '@/components/theme/ThemeColorExample';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { Sun, Moon, Palette } from 'lucide-react';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

/**
 * Page de documentation du Design System
 * Affiche la palette de couleurs et les composants stylés
 */
const DesignSystemPage: React.FC = () => {
  const { theme, setTheme } = useTheme() || { theme: 'light' as Theme, setTheme: () => {} };

  return (
    <div className="container mx-auto py-8 space-y-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Design System</h1>
        <p className="text-muted-foreground text-xl">
          Documentation et composants de l'interface EmotionsCare
        </p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Thème actif: {theme}</h2>
          <p className="text-muted-foreground">
            Changez de thème pour voir l'adaptation des couleurs
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
          >
            <Sun className="mr-2 h-4 w-4" />
            Clair
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
          >
            <Moon className="mr-2 h-4 w-4" />
            Sombre
          </Button>
          <Button
            variant={theme === 'pastel' ? 'default' : 'outline'}
            onClick={() => setTheme('pastel')}
          >
            <Palette className="mr-2 h-4 w-4" />
            Pastel
          </Button>
          
          <ThemeSwitcher showLabel size="default" />
        </div>
      </div>

      <section className="space-y-6">
        <ColorPaletteDisplay />
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Exemples d'utilisation des couleurs du thème</CardTitle>
            <CardDescription>
              Démonstration avec le hook useThemeColors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeColorExample />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Documentation technique</CardTitle>
            <CardDescription>
              Ressources pour l'utilisation du Design System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Principes de couleur</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Primary:</strong> Bleu intense - Utilisé pour les actions principales et les éléments cliquables.</li>
                <li><strong>Secondary:</strong> Bleu pâle - Pour les actions secondaires et les éléments de moindre importance.</li>
                <li><strong>Accent:</strong> Rose vif - Pour mettre en valeur des fonctionnalités importantes ou attirer l'attention.</li>
                <li><strong>Success:</strong> Vert - Pour les confirmations, validations et processus terminés.</li>
                <li><strong>Warning:</strong> Orange - Pour les avertissements et informations importantes.</li>
                <li><strong>Info:</strong> Bleu ciel - Pour les messages informatifs neutres.</li>
                <li><strong>Error:</strong> Rouge - Pour les erreurs et actions destructives.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-lg">Utilisation dans le code</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                {`// Import du hook
import { useThemeColors } from '@/hooks/useThemeColors';

// Dans votre composant
const MyComponent = () => {
  const { colors, wellness, isDarkTheme } = useThemeColors();
  
  return (
    <div style={{ color: colors.primary }}>
      Contenu avec couleur primaire
      {isDarkTheme && <span>Mode sombre actif</span>}
    </div>
  );
};`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-lg">Classes utilitaires</h3>
              <p className="text-sm text-muted-foreground">
                Utilisez ces classes Tailwind pour appliquer facilement les couleurs sémantiques:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><code>bg-success</code>, <code>bg-success-subtle</code>, <code>text-success</code>, <code>border-success</code></li>
                <li><code>bg-warning</code>, <code>bg-warning-subtle</code>, <code>text-warning</code>, <code>border-warning</code></li>
                <li><code>bg-info</code>, <code>bg-info-subtle</code>, <code>text-info</code>, <code>border-info</code></li>
                <li><code>bg-error</code>, <code>bg-error-subtle</code>, <code>text-error</code>, <code>border-error</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DesignSystemPage;
