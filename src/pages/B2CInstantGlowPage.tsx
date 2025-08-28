import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CInstantGlowPage = () => {
  usePageMetadata('Instant Glow', 'Boost instantané de positivité', '/b2c/instant-glow', 'energized');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Instant Glow</h1>
        <p className="text-muted-foreground">Votre boost de positivité instantané</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activation du Glow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p>Prêt pour votre dose de positivité ?</p>
            <Button size="lg">
              Activer l'Instant Glow ✨
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CInstantGlowPage;