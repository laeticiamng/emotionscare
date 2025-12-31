// @ts-nocheck
/**
 * JournalPageLayout - Layout principal du module Journal
 * SEO, accessibilité, navigation sticky entre sous-pages
 */
import { memo, Suspense, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Book, 
  Home, 
  FileText, 
  Heart, 
  BarChart3, 
  Search, 
  Archive, 
  Settings, 
  Target,
  Calendar,
  Shield,
} from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/app/journal', label: 'Notes', icon: FileText, exact: true },
  { path: '/app/journal/favorites', label: 'Favoris', icon: Heart },
  { path: '/app/journal/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/app/journal/activity', label: 'Activité', icon: Calendar },
  { path: '/app/journal/goals', label: 'Objectifs', icon: Target },
  { path: '/app/journal/search', label: 'Recherche', icon: Search },
  { path: '/app/journal/archive', label: 'Archive', icon: Archive },
  { path: '/app/journal/settings', label: 'Paramètres', icon: Settings },
];

const JournalPageLayout = memo(() => {
  const location = useLocation();

  usePageSEO({
    title: 'Journal Émotionnel - EmotionsCare',
    description: 'Tenez votre journal émotionnel vocal et textuel. Analysez vos émotions, suivez vos progrès et développez votre bien-être mental.',
    keywords: ['journal', 'émotions', 'bien-être', 'écriture', 'vocal', 'EmotionsCare'],
  });

  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1000);
    }
  }, [runAudit]);

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller au contenu principal
      </a>

      {/* Navigation sticky */}
      <nav role="navigation" aria-label="Navigation journal" className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/"><Home className="h-4 w-4" /></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Accueil</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="font-semibold hidden sm:inline">Journal</span>
              </div>
              <Badge variant="outline" className="hidden md:inline-flex gap-1 text-success border-success/30">
                <Shield className="h-3 w-3" aria-hidden="true" />
                Chiffré
              </Badge>
            </div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <TooltipProvider key={item.path}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={active ? 'default' : 'ghost'}
                          size="sm"
                          asChild
                          className={cn(
                            'gap-1.5',
                            active && 'bg-primary text-primary-foreground'
                          )}
                        >
                          <Link to={item.path}>
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            <span className="hidden xl:inline">{item.label}</span>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{item.label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>

            {/* Mobile nav scroll */}
            <div className="lg:hidden flex items-center gap-1 overflow-x-auto max-w-[60vw] scrollbar-hide">
              {NAV_ITEMS.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <Button
                    key={item.path}
                    variant={active ? 'default' : 'ghost'}
                    size="icon"
                    asChild
                    className={cn(active && 'bg-primary text-primary-foreground')}
                  >
                    <Link to={item.path} aria-label={item.label}>
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" role="main" className="container mx-auto px-4 py-6">
        <Suspense fallback={<JournalLoadingSkeleton />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer RGPD */}
      <footer className="border-t bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-success" aria-hidden="true" />
              <span>Données chiffrées AES-256</span>
            </div>
            <span>•</span>
            <Link to="/legal/privacy" className="hover:text-foreground transition-colors">
              Confidentialité
            </Link>
            <span>•</span>
            <Link to="/data-export" className="hover:text-foreground transition-colors">
              Exporter mes données
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
});

const JournalLoadingSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-64" />
    <div className="grid gap-4 md:grid-cols-2">
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  </div>
);

JournalPageLayout.displayName = 'JournalPageLayout';

export default JournalPageLayout;
