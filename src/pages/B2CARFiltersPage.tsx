import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CARFiltersPage = () => {
  usePageMetadata('AR Filters', 'Filtres de réalité augmentée émotionnels', '/b2c/ar-filters', 'energized');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AR Filters</h1>
        <p className="text-muted-foreground">Filtres AR basés sur vos émotions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres Émotionnels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p>Découvrez des filtres adaptés à votre état émotionnel</p>
            <Button size="lg">
              Activer les Filtres AR 🎭
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CARFiltersPage;