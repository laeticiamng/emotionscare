import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { 
  ArrowLeft, 
  HelpCircle, 
  Home, 
  User, 
  Settings, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const pageLayoutVariants = cva(
  "min-h-screen min-h-[100dvh]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-background via-background/95 to-primary/5",
        plain: "bg-background",
        elevated: "bg-gradient-to-br from-background to-muted/20"
      },
      container: {
        default: "w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-8",
        full: "w-full px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6",
        narrow: "w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6"
      }
    },
    defaultVariants: {
      variant: "default",
      container: "default"
    }
  }
);

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'outline' | 'ghost';
  icon?: React.ComponentType<any>;
}

interface UnifiedPageLayoutProps extends VariantProps<typeof pageLayoutVariants> {
  children: React.ReactNode;
  title: string;
  description?: string;
  
  // Navigation
  backUrl?: string;
  backLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumb?: boolean;
  
  // Actions
  actions?: PageAction[];
  primaryAction?: PageAction;
  
  // States
  loading?: boolean;
  error?: string;
  emptyState?: React.ReactNode;
  
  // Help & SEO
  helpUrl?: string;
  metaDescription?: string;
  
  // Layout
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  
  // Features
  animated?: boolean;
  showSkipLink?: boolean;
}

const UnifiedPageLayout: React.FC<UnifiedPageLayoutProps> = ({
  children,
  title,
  description,
  backUrl,
  backLabel = 'Retour',
  breadcrumbs,
  showBreadcrumb = false,
  actions = [],
  primaryAction,
  loading = false,
  error,
  emptyState,
  helpUrl,
  metaDescription,
  className,
  headerClassName,
  contentClassName,
  variant,
  container,
  animated = true,
  showSkipLink = true
}) => {
  const location = useLocation();

  // Generate breadcrumbs from route if not provided
  const generatedBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs) return breadcrumbs;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: 'Accueil', href: '/' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      if (index < pathSegments.length - 1) { // Don't link the current page
        crumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath
        });
      }
    });
    
    return crumbs;
  }, [location.pathname, breadcrumbs]);

  const renderContent = () => {
    if (error) return <ErrorState error={error} />;
    if (loading) return <LoadingState />;
    if (emptyState) return emptyState;
    return children;
  };

  const contentElement = (
    <div className={cn(contentClassName)}>
      {renderContent()}
    </div>
  );

  return (
    <>
      {/* SEO et métadonnées */}
      <Helmet>
        <title>{title} - EmotionsCare</title>
        {(metaDescription || description) && (
          <meta name="description" content={metaDescription || description} />
        )}
      </Helmet>

      <div className={cn(pageLayoutVariants({ variant }), className)}>
        {/* Skip link pour l'accessibilité */}
        {showSkipLink && (
          <a 
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium"
          >
            Aller au contenu principal
          </a>
        )}

        <div className={cn(pageLayoutVariants({ container }))}>
          {/* Header de page */}
          <header className={cn("mb-4 sm:mb-6 md:mb-8", headerClassName)}>
            {/* Breadcrumbs - responsive */}
            {showBreadcrumb && generatedBreadcrumbs.length > 1 && (
              <nav aria-label="Fil d'Ariane" className="mb-3 sm:mb-4 overflow-x-auto">
                <ol className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {generatedBreadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center shrink-0">
                      {index > 0 && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />}
                      {crumb.href ? (
                        <Link 
                          to={crumb.href}
                          className="hover:text-foreground transition-colors"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="font-medium text-foreground">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                {/* Bouton retour - responsive */}
                {backUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-primary/10 shrink-0 h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <Link to={backUrl}>
                      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                      <span className="hidden sm:inline">{backLabel}</span>
                    </Link>
                  </Button>
                )}

                {/* Titre et description - responsive */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2 break-words leading-tight">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions et aide - responsive */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap">
                {/* Actions secondaires - hidden on mobile */}
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "ghost"}
                    size="sm"
                    onClick={action.onClick}
                    asChild={!!action.href}
                    className="text-muted-foreground hover:text-foreground h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm hidden sm:inline-flex"
                  >
                    {action.href ? (
                      <Link to={action.href}>
                        {action.icon && <action.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />}
                        <span className="hidden md:inline">{action.label}</span>
                      </Link>
                    ) : (
                      <>
                        {action.icon && <action.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />}
                        <span className="hidden md:inline">{action.label}</span>
                      </>
                    )}
                  </Button>
                ))}

                {/* Action principale - always visible */}
                {primaryAction && (
                  <>
                    {actions.length > 0 && <Separator orientation="vertical" className="h-5 sm:h-6 hidden sm:block" />}
                    <Button
                      variant={primaryAction.variant || "default"}
                      onClick={primaryAction.onClick}
                      asChild={!!primaryAction.href}
                      size="sm"
                      className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm"
                    >
                      {primaryAction.href ? (
                        <Link to={primaryAction.href}>
                          {primaryAction.icon && <primaryAction.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />}
                          {primaryAction.label}
                        </Link>
                      ) : (
                        <>
                          {primaryAction.icon && <primaryAction.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />}
                          {primaryAction.label}
                        </>
                      )}
                    </Button>
                  </>
                )}

                {/* Lien d'aide - icon only on mobile */}
                {helpUrl && (
                  <>
                    {(actions.length > 0 || primaryAction) && <Separator orientation="vertical" className="h-5 sm:h-6 hidden sm:block" />}
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-muted-foreground hover:text-foreground h-8 sm:h-9 px-2 sm:px-3"
                    >
                      <Link to={helpUrl}>
                        <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Aide</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Contenu principal */}
          <main id="main-content" role="main">
            {animated ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {contentElement}
              </motion.div>
            ) : (
              contentElement
            )}
          </main>
        </div>
      </div>
    </>
  );
};

// État d'erreur standardisé
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
      <HelpCircle className="w-8 h-8 text-destructive" />
    </div>
    <h2 className="text-xl font-semibold text-foreground mb-2">
      Une erreur s'est produite
    </h2>
    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
      {error}
    </p>
    <Button onClick={() => window.location.reload()}>
      Réessayer
    </Button>
  </div>
);

// État de chargement standardisé
const LoadingState: React.FC = () => (
  <div className="space-y-4">
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-32 bg-muted rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-24 bg-muted rounded"></div>
        <div className="h-24 bg-muted rounded"></div>
      </div>
    </div>
  </div>
);

export { UnifiedPageLayout, pageLayoutVariants };
export type { UnifiedPageLayoutProps, BreadcrumbItem, PageAction };