import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CAmbitionArcadePage = () => {
  usePageMetadata('Ambition Arcade', 'Jeux motivationnels pour booster vos objectifs', '/b2c/ambition-arcade', 'energized');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Ambition Arcade</h1>
        <p className="text-muted-foreground">Transformez vos objectifs en jeu</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arcade Motivationnel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p>Boostez votre motivation avec des défis ludiques</p>
            <Button size="lg">
              Entrer dans l'Arcade 🎮
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CAmbitionArcadePage;