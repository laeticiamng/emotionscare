import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CHeatmapVibesPage = () => {
  usePageMetadata('Heatmap Vibes', 'Carte thermique de vos émotions', '/b2c/heatmap-vibes', 'engaged');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Heatmap Vibes</h1>
        <p className="text-muted-foreground">Visualisez vos émotions dans le temps</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Carte Émotionnelle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="text-center">
              <p>Votre carte thermique émotionnelle</p>
            </div>
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 84 }, (_, index) => (
                <div key={index} className="h-4 bg-muted rounded-sm"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CHeatmapVibesPage;