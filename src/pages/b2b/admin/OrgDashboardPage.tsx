// @ts-nocheck
/**
 * Page du tableau de bord organisation B2B
 * Vue macro avec données agrégées anonymisées
 */
import React, { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  BarChart3,
  QrCode,
  FileText,
  Settings,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrgDashboard } from '@/components/b2b/dashboard/OrgDashboard';
import { AccessCodeManager } from '@/components/b2b/admin/AccessCodeManager';

const OrgDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const orgId = (user?.user_metadata?.org_id as string) || '';
  const orgName = (user?.user_metadata?.org_name as string) || 'Votre organisation';

  usePageSEO({
    title: `Dashboard - ${orgName} | EmotionsCare B2B`,
    description: 'Tableau de bord institutionnel pour le suivi anonymisé du bien-être collectif.',
    keywords: ['B2B', 'bien-être', 'institution', 'dashboard', 'EmotionsCare'],
  });

  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1500);
    }
  }, [runAudit]);

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Links */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller au contenu principal
      </a>

      {/* Navigation */}
      <nav className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/b2b" className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">EmotionsCare</h2>
                <Badge variant="outline" className="gap-1">
                  <Building2 className="h-3 w-3" />
                  B2B
                </Badge>
              </Link>
              <span className="text-xs text-muted-foreground hidden md:inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Mode institutionnel
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/b2b/reports">
                  <FileText className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/b2b/admin/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/help">
                  <HelpCircle className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="access-codes" className="gap-2">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">Accès</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Rapports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <OrgDashboard orgId={orgId} orgName={orgName} />
          </TabsContent>

          <TabsContent value="access-codes">
            <AccessCodeManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Rapports mensuels</h2>
                <Button asChild>
                  <Link to="/b2b/reports">
                    <FileText className="h-4 w-4 mr-2" />
                    Voir tous les rapports
                  </Link>
                </Button>
              </div>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Les rapports mensuels seront générés automatiquement à la fin de chaque mois.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer éthique */}
        <footer className="mt-12 pt-6 border-t">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>
              EmotionsCare B2B — Outil de bien-être collectif • Données anonymisées • Aucune
              surveillance individuelle
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default OrgDashboardPage;
