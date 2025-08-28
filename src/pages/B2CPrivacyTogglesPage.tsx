import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrivacyToggleManager } from '@/components/privacy/PrivacyToggleManager';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CPrivacyTogglesPage = () => {
  usePageMetadata('Privacy Toggles', 'Gérez vos préférences de confidentialité', '/b2c/privacy-toggles', 'confident');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Confidentialité</h1>
        <p className="text-muted-foreground">Gérez vos préférences de confidentialité</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres de Confidentialité</CardTitle>
        </CardHeader>
        <CardContent>
          <PrivacyToggleManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CPrivacyTogglesPage;