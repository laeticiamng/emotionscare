
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft, Home, User, Settings } from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
import { getUserModeDisplayName, getModeDashboardPath } from '@/utils/userModeHelpers';

interface EnhancedPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showBreadcrumb?: boolean;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}

const EnhancedPageLayout: React.FC<EnhancedPageLayoutProps> = ({
  children,
  title,
  description,
  showBreadcrumb = true,
  showBackButton = false,
  actions
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Accueil', href: UNIFIED_ROUTES.HOME, icon: Home }
    ];

    // Ajouter le dashboard selon le mode
    if (userMode) {
      items.push({
        label: 'Dashboard',
        href: getModeDashboardPath(userMode),
        icon: User
      });
    }

    // Ajouter la page actuelle
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    if (pathSegments.length > 0) {
      const pageName = pathSegments[pathSegments.length - 1];
      items.push({
        label: getPageDisplayName(pageName),
        href: currentPath,
        icon: Settings
      });
    }

    return items;
  };

  const getPageDisplayName = (path: string): string => {
    const displayNames: Record<string, string> = {
      'scan': 'Scanner',
      'music': 'Musicothérapie',
      'coach': 'Coach IA',
      'journal': 'Journal',
      'vr': 'Réalité Virtuelle',
      'gamification': 'Gamification',
      'notifications': 'Notifications',
      'security': 'Sécurité',
      'teams': 'Équipes',
      'reports': 'Rapports',
      'events': 'Événements',
      'optimisation': 'Optimisation',
      'settings': 'Paramètres',
      'preferences': 'Préférences'
    };
    return displayNames[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  if (!pageLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Chargement de la page...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* En-tête de page */}
        <div className="space-y-4">
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <Breadcrumb>
              <BreadcrumbList>
                {getBreadcrumbItems().map((item, index) => (
                  <React.Fragment key={item.href}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={item.href} className="flex items-center gap-1">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < getBreadcrumbItems().length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {/* Titre et actions */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {showBackButton && (
                  <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {userMode && (
                  <Badge variant="outline">
                    {getUserModeDisplayName(userMode)}
                  </Badge>
                )}
              </div>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>

          <Separator />
        </div>

        {/* Contenu de la page */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Pied de page de debug en développement */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-8 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>Route: {location.pathname}</div>
              <div>User Role: {user?.role || 'Non défini'}</div>
              <div>User Mode: {userMode || 'Non défini'}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedPageLayout;
