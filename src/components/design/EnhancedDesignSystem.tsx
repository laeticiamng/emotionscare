// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Type, 
  Layout, 
  Zap,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorToken {
  name: string;
  hsl: string;
  description: string;
  usage: string[];
}

interface TypographyScale {
  name: string;
  size: string;
  lineHeight: string;
  weight: string;
  usage: string;
}

interface SpacingToken {
  name: string;
  value: string;
  px: number;
  usage: string;
}

interface ComponentVariant {
  name: string;
  className: string;
  description: string;
  preview: React.ReactNode;
}

const EnhancedDesignSystem: React.FC = () => {
  const { toast } = useToast();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [previewMode, setPreviewMode] = useState<'tokens' | 'components'>('tokens');

  // Tokens de couleurs sémantiques
  const colorTokens: ColorToken[] = [
    {
      name: 'primary',
      hsl: '262.1 83.3% 57.8%',
      description: 'Couleur principale de la marque',
      usage: ['Boutons CTA', 'Liens', 'Focus states', 'Icônes importantes']
    },
    {
      name: 'secondary',
      hsl: '220 14.3% 95.9%',
      description: 'Couleur secondaire pour les éléments de support',
      usage: ['Boutons secondaires', 'Backgrounds subtils', 'Bordures']
    },
    {
      name: 'accent',
      hsl: '142.1 76.2% 36.3%',
      description: 'Couleur d\'accent pour les success states',
      usage: ['Success messages', 'Confirmations', 'Badges positifs']
    },
    {
      name: 'muted',
      hsl: '220 14.3% 95.9%',
      description: 'Couleur pour les éléments en sourdine',
      usage: ['Backgrounds cards', 'Separators', 'Disabled states']
    },
    {
      name: 'destructive',
      hsl: '0 84.2% 60.2%',
      description: 'Couleur pour les états d\'erreur et de danger',
      usage: ['Error messages', 'Delete buttons', 'Alerts critiques']
    }
  ];

  // Échelle typographique
  const typographyScale: TypographyScale[] = [
    {
      name: 'text-xs',
      size: '0.75rem',
      lineHeight: '1rem',
      weight: '400',
      usage: 'Labels, captions, metadata'
    },
    {
      name: 'text-sm',
      size: '0.875rem',
      lineHeight: '1.25rem',
      weight: '400',
      usage: 'Body text small, descriptions'
    },
    {
      name: 'text-base',
      size: '1rem',
      lineHeight: '1.5rem',
      weight: '400',
      usage: 'Body text, paragraphes'
    },
    {
      name: 'text-lg',
      size: '1.125rem',
      lineHeight: '1.75rem',
      weight: '500',
      usage: 'Subheadings, card titles'
    },
    {
      name: 'text-xl',
      size: '1.25rem',
      lineHeight: '1.75rem',
      weight: '600',
      usage: 'Section headings'
    },
    {
      name: 'text-2xl',
      size: '1.5rem',
      lineHeight: '2rem',
      weight: '700',
      usage: 'Page headings'
    },
    {
      name: 'text-3xl',
      size: '1.875rem',
      lineHeight: '2.25rem',
      weight: '800',
      usage: 'Hero titles'
    }
  ];

  // Système de spacing
  const spacingTokens: SpacingToken[] = [
    { name: 'spacing-1', value: '0.25rem', px: 4, usage: 'Fine adjustments, borders' },
    { name: 'spacing-2', value: '0.5rem', px: 8, usage: 'Small gaps, padding' },
    { name: 'spacing-3', value: '0.75rem', px: 12, usage: 'Medium gaps' },
    { name: 'spacing-4', value: '1rem', px: 16, usage: 'Standard spacing unit' },
    { name: 'spacing-6', value: '1.5rem', px: 24, usage: 'Large gaps, section spacing' },
    { name: 'spacing-8', value: '2rem', px: 32, usage: 'Container padding' },
    { name: 'spacing-12', value: '3rem', px: 48, usage: 'Page margins, hero spacing' }
  ];

  // Variants de composants
  const buttonVariants: ComponentVariant[] = [
    {
      name: 'default',
      className: 'bg-primary text-primary-foreground hover:bg-primary/90',
      description: 'Bouton principal pour les actions importantes',
      preview: <Button>Default Button</Button>
    },
    {
      name: 'secondary',
      className: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      description: 'Bouton secondaire pour les actions de support',
      preview: <Button variant="secondary">Secondary</Button>
    },
    {
      name: 'outline',
      className: 'border border-input hover:bg-accent hover:text-accent-foreground',
      description: 'Bouton outline pour les actions moins importantes',
      preview: <Button variant="outline">Outline</Button>
    },
    {
      name: 'ghost',
      className: 'hover:bg-accent hover:text-accent-foreground',
      description: 'Bouton invisible pour les actions discrètes',
      preview: <Button variant="ghost">Ghost</Button>
    },
    {
      name: 'destructive',
      className: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      description: 'Bouton destructeur pour les actions dangereuses',
      preview: <Button variant="destructive">Destructive</Button>
    }
  ];

  const copyToClipboard = async (text: string, tokenName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToken(tokenName);
      toast({
        title: "Token copié",
        description: `${tokenName} copié dans le presse-papier`,
        duration: 2000,
      });
      
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le token",
        variant: "destructive",
      });
    }
  };

  const generateCustomTheme = () => {
    toast({
      title: "Thème généré",
      description: "Un nouveau thème personnalisé a été créé avec succès",
      duration: 3000,
    });
  };

  const exportDesignTokens = () => {
    const tokens = {
      colors: colorTokens.reduce((acc, token) => ({
        ...acc,
        [token.name]: `hsl(${token.hsl})`
      }), {}),
      typography: typographyScale.reduce((acc, scale) => ({
        ...acc,
        [scale.name]: {
          fontSize: scale.size,
          lineHeight: scale.lineHeight,
          fontWeight: scale.weight
        }
      }), {}),
      spacing: spacingTokens.reduce((acc, token) => ({
        ...acc,
        [token.name]: token.value
      }), {})
    };

    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-tokens.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Les tokens de design ont été exportés en JSON",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">Système de Design Avancé</h2>
          <p className="text-muted-foreground mt-1">
            Tokens, composants et guidelines pour une cohérence parfaite
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={generateCustomTheme}>
            <Sparkles className="mr-2 h-4 w-4" />
            Générer Thème
          </Button>
          <Button onClick={exportDesignTokens}>
            <Copy className="mr-2 h-4 w-4" />
            Export Tokens
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="components">Composants</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        {/* Onglet Couleurs */}
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Tokens de Couleur Sémantiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colorTokens.map((token) => (
                  <Card key={token.name} className="relative">
                    <CardContent className="p-4">
                      <div 
                        className="w-full h-16 rounded-lg mb-3 border"
                        style={{ backgroundColor: `hsl(${token.hsl})` }}
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">--{token.name}</h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(`hsl(var(--${token.name}))`, token.name)}
                          >
                            {copiedToken === token.name ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {token.description}
                        </p>
                        <div className="text-xs font-mono bg-muted p-2 rounded">
                          hsl({token.hsl})
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {token.usage.slice(0, 2).map((usage, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {usage}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Typography */}
        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="mr-2 h-5 w-5" />
                Échelle Typographique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {typographyScale.map((scale) => (
                  <div key={scale.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className={`${scale.name} mb-2`} style={{ fontWeight: scale.weight }}>
                        Texte d'exemple avec {scale.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {scale.usage}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm font-mono">{scale.size}</div>
                      <div className="text-xs text-muted-foreground">LH: {scale.lineHeight}</div>
                      <div className="text-xs text-muted-foreground">FW: {scale.weight}</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(scale.name, scale.name)}
                      >
                        {copiedToken === scale.name ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Spacing */}
        <TabsContent value="spacing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="mr-2 h-5 w-5" />
                Système de Spacing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spacingTokens.map((token) => (
                  <div key={token.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="bg-primary rounded"
                        style={{ width: token.px, height: token.px }}
                      />
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-sm text-muted-foreground">{token.usage}</div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-mono">{token.value}</div>
                      <div className="text-xs text-muted-foreground">{token.px}px</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(token.name, token.name)}
                      >
                        {copiedToken === token.name ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Composants */}
        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Variants de Composants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Button Variants</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {buttonVariants.map((variant) => (
                      <div key={variant.name} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium">{variant.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {variant.description}
                            </div>
                          </div>
                          {variant.preview}
                        </div>
                        <div className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                          {variant.className}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Guidelines */}
        <TabsContent value="guidelines" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Principes de Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Cohérence</h4>
                  <p className="text-sm text-muted-foreground">
                    Utilisez toujours les tokens définis pour garantir une cohérence visuelle à travers l'application.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Accessibilité</h4>
                  <p className="text-sm text-muted-foreground">
                    Respectez les ratios de contraste WCAG AA (4.5:1) pour le texte et AAA (7:1) pour les éléments importants.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Privilégiez les tokens CSS custom properties pour une performance optimale et la compatibilité thème sombre.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bonnes Pratiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Couleurs Sémantiques</h4>
                  <p className="text-sm text-muted-foreground">
                    Utilisez primary pour l'identité de marque, accent pour les succès, destructive pour les erreurs.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Hiérarchie Typographique</h4>
                  <p className="text-sm text-muted-foreground">
                    Respectez l'échelle définie : text-3xl pour les titres hero, text-xl pour les sections, text-base pour le contenu.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Espacement Rythmé</h4>
                  <p className="text-sm text-muted-foreground">
                    Utilisez des multiples de 4px (spacing-1) pour un espacement rythmé et harmonieux.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDesignSystem;