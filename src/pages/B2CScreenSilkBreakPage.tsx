import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CScreenSilkBreakPage = () => {
  usePageMetadata('Screen Silk Break', 'Pause écran apaisante', '/b2c/screen-silk-break', 'calm');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Screen Silk Break</h1>
        <p className="text-muted-foreground">Une pause écran douce comme de la soie</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pause Silk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p>Accordez-vous une pause apaisante</p>
            <Button size="lg">
              Commencer la Pause 🌸
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CScreenSilkBreakPage;