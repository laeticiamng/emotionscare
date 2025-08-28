import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CVRGalactiquePage = () => {
  usePageMetadata('VR Galactique', 'Expérience VR immersive dans l\'espace', '/b2c/vr-galactique', 'engaged');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">VR Galactique</h1>
        <p className="text-muted-foreground">Voyage immersif dans l'espace</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lancement VR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p>Préparez-vous pour un voyage galactique immersif</p>
            <Button size="lg">
              Démarrer l'Expérience VR 🚀
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CVRGalactiquePage;