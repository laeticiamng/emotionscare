import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CHealthCheckBadgePage = () => {
  usePageMetadata('Health Check Badge', 'Votre badge de santé émotionnelle', '/b2c/health-check-badge', 'confident');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Health Check Badge</h1>
        <p className="text-muted-foreground">Votre badge de santé émotionnelle</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badge de Santé</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                🏆 Badge Santé Émotionnelle
              </Badge>
              <p>Félicitations ! Vous maintenez un bon équilibre émotionnel.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CHealthCheckBadgePage;