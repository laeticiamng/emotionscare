import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CExportCSVPage = () => {
  usePageMetadata('Export CSV', 'Exportez vos données personnelles', '/b2c/export-csv', 'confident');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Export CSV</h1>
        <p className="text-muted-foreground">Exportez vos données en format CSV</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export de Données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <p>Téléchargez vos données personnelles au format CSV</p>
            <Button size="lg">
              Télécharger mes Données 📊
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CExportCSVPage;