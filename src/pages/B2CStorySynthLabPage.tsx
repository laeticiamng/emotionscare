import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CStorySynthLabPage = () => {
  usePageMetadata('Story Synth Lab', 'Laboratoire de création d\'histoires personnalisées', '/b2c/story-synth-lab', 'engaged');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Story Synth Lab</h1>
        <p className="text-muted-foreground">Créez vos histoires personnalisées</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Laboratoire de Création</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p>Explorez votre créativité narrative</p>
            <Button size="lg">
              Créer une Histoire 📖
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CStorySynthLabPage;