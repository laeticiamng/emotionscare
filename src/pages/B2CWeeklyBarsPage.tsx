import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CWeeklyBarsPage = () => {
  usePageMetadata('Weekly Bars', 'Visualisation hebdomadaire de votre progression', '/b2c/weekly-bars', 'confident');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Weekly Bars</h1>
        <p className="text-muted-foreground">Votre progression hebdomadaire visualisée</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progression de la Semaine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="text-center">
              <p>Visualisation de vos progrès hebdomadaires</p>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm font-medium">{day}</div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CWeeklyBarsPage;