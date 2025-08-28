import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Download, 
  Trash2, 
  User, 
  Bell, 
  HelpCircle,
  ExternalLink,
  Settings as SettingsIcon
} from 'lucide-react';
import { PrivacyPanel } from '@/components/settings/PrivacyPanel';
import { ExportPanel } from '@/components/settings/ExportPanel';
import { DeletePanel } from '@/components/settings/DeletePanel';
import { LinksGrid } from '@/components/settings/LinksGrid';
import { useRouter } from '@/hooks/router';

/**
 * Settings Généraux - Hub centralisant toutes les options principales
 */
const SettingsGeneral: React.FC = () => {
  const router = useRouter();

  return (
    <main 
      className="min-h-screen bg-background p-4 md:p-6"
      data-testid="page-root"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Réglages généraux
            </h1>
            <p className="text-muted-foreground">
              Gérez votre confidentialité, vos données et votre compte
            </p>
          </div>
        </div>

        {/* Main Settings Panels */}
        <div className="grid gap-6">
          {/* Privacy & Capteurs */}
          <section role="region" aria-labelledby="privacy-title">
            <Card>
              <CardHeader>
                <CardTitle id="privacy-title" className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Confidentialité & Capteurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PrivacyPanel />
              </CardContent>
            </Card>
          </section>

          {/* Export RGPD */}
          <section role="region" aria-labelledby="export-title">
            <Card>
              <CardHeader>
                <CardTitle id="export-title" className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-600" />
                  Export de mes données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExportPanel />
              </CardContent>
            </Card>
          </section>

          {/* Suppression de compte */}
          <section role="region" aria-labelledby="delete-title">
            <Card className="border-amber-200 bg-amber-50/30">
              <CardHeader>
                <CardTitle id="delete-title" className="flex items-center gap-2 text-amber-800">
                  <Trash2 className="w-5 h-5" />
                  Suppression de compte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeletePanel />
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Quick Links Grid */}
        <section role="region" aria-labelledby="links-title">
          <h2 id="links-title" className="text-lg font-semibold mb-4">
            Autres réglages
          </h2>
          <LinksGrid />
        </section>

        {/* Help Links */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Besoin d'aide ?</h3>
                  <p className="text-sm text-muted-foreground">
                    Consultez notre centre d'aide pour plus d'informations sur vos données et la confidentialité.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/help')}
                className="flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Centre d'aide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SettingsGeneral;