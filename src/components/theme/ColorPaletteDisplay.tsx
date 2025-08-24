import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

/**
 * Composant affichant une section de couleurs par gamme
 */
interface ColorScaleProps {
  title: string;
  prefix: string;
  scales?: string[];
}

const ColorScale: React.FC<ColorScaleProps> = ({ title, prefix, scales = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-base text-foreground">{title}</h3>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {scales.map((scale) => (
          <div key={scale} className="flex flex-col items-center">
            <div 
              className={`w-12 h-12 rounded-lg shadow-sm bg-${prefix}-${scale}`} 
              style={{ backgroundColor: `var(--${prefix}-${scale})` }}
            />
            <span className="text-xs text-muted-foreground mt-1">{scale}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Composant affichant une couleur simple
 */
interface ColorSampleProps {
  name: string;
  bgClass: string;
  textClass: string;
}

const ColorSample: React.FC<ColorSampleProps> = ({ name, bgClass, textClass }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-12 h-12 rounded-lg ${bgClass}`} />
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">
          {bgClass}, {textClass}
        </p>
      </div>
    </div>
  );
};

/**
 * Composant principal affichant la palette complète
 */
const ColorPaletteDisplay: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Palette de couleurs EmotionsCare</CardTitle>
          <CardDescription>
            Thème actif: <Badge className="ml-2">{theme}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Couleurs principales</h2>

            <ColorScale title="Primary" prefix="primary" />
            <ColorScale title="Secondary" prefix="secondary" />
            <ColorScale title="Accent" prefix="accent" />
            <ColorScale title="Neutral" prefix="neutral" />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Couleurs sémantiques</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorScale title="Success" prefix="success" />
              <ColorScale title="Warning" prefix="warning" />
              <ColorScale title="Info" prefix="info" />
              <ColorScale title="Error / Destructive" prefix="destructive" />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Tokens appliqués aux composants</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Boutons</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Success</Button>
                  <Button variant="outline">Warning</Button>
                  <Button variant="outline">Info</Button>
                  <Button variant="destructive">Error</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>

                <h3 className="text-lg font-medium">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="success-subtle">Success Subtle</Badge>
                  <Badge variant="warning-subtle">Warning Subtle</Badge>
                  <Badge variant="info-subtle">Info Subtle</Badge>
                  <Badge variant="error-subtle">Error Subtle</Badge>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Alertes</h3>
                <Alert>
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    Une alerte standard.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Succès</AlertTitle>
                  <AlertDescription>
                    L'opération a été réalisée avec succès.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Attention</AlertTitle>
                  <AlertDescription>
                    Assurez-vous de vérifier les informations.
                  </AlertDescription>
                </Alert>

                <Alert variant="info">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    Voici une information importante.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="error">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>
                    Une erreur s'est produite. Veuillez réessayer.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Couleurs bien-être</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorSample name="Purple" bgClass="bg-wellness-purple" textClass="text-white" />
              <ColorSample name="Dark Purple" bgClass="bg-wellness-darkPurple" textClass="text-white" />
              <ColorSample name="Soft Purple" bgClass="bg-wellness-softPurple" textClass="text-dark-800" />
              <ColorSample name="Coral" bgClass="bg-wellness-coral" textClass="text-white" />
              <ColorSample name="Mint" bgClass="bg-wellness-mint" textClass="text-dark-800" />
              <ColorSample name="Soft Blue" bgClass="bg-wellness-softBlue" textClass="text-dark-800" />
            </div>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentation couleurs</CardTitle>
          <CardDescription>
            Référence technique pour les développeurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="font-medium text-lg mb-4">Utilisation des classes sémantiques</h3>
            
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2 bg-secondary">Composant</th>
                  <th className="text-left p-2 bg-secondary">État</th>
                  <th className="text-left p-2 bg-secondary">Light Mode</th>
                  <th className="text-left p-2 bg-secondary">Dark Mode</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Button primary</td>
                  <td className="p-2">Default</td>
                  <td className="p-2">bg-primary text-white</td>
                  <td className="p-2">bg-primary text-white</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Button success</td>
                  <td className="p-2">Default</td>
                  <td className="p-2">bg-success-500 text-white</td>
                  <td className="p-2">bg-success-500 text-white</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Alert success</td>
                  <td className="p-2">Info</td>
                  <td className="p-2">bg-success-50 text-success-800</td>
                  <td className="p-2">bg-success-900/20 text-success-200</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Badge warning</td>
                  <td className="p-2">Default</td>
                  <td className="p-2">bg-warning-500 text-white</td>
                  <td className="p-2">bg-warning-500 text-white</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Badge subtle</td>
                  <td className="p-2">Info</td>
                  <td className="p-2">bg-info-50 text-info-700</td>
                  <td className="p-2">bg-info-900/30 text-info-300</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h3 className="font-medium text-lg mb-4">Recommandations d'accessibilité</h3>
            <p className="text-muted-foreground mb-4">
              Toutes les combinaisons de couleurs ont été testées pour assurer un contraste minimum de:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Texte normal: <Badge variant="success-subtle">AAA (7:1)</Badge> ou au minimum <Badge variant="info-subtle">AA (4.5:1)</Badge></li>
              <li>Texte large: <Badge variant="info-subtle">AA (3:1)</Badge></li>
              <li>Éléments non textuels: <Badge variant="info-subtle">AA (3:1)</Badge></li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorPaletteDisplay;
