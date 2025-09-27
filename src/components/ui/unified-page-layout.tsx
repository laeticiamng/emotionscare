import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export interface UnifiedPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  backButton?: boolean;
  onBack?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'destructive';
  }>;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  fullWidth?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6', 
  lg: 'p-8'
};

export const UnifiedPageLayout: React.FC<UnifiedPageLayoutProps> = ({
  children,
  title,
  subtitle,
  backButton = false,
  onBack,
  actions = [],
  className,
  headerClassName,
  contentClassName,
  fullWidth = false,
  padding = 'md'
}) => {
  return (
    <div className={cn(
      'min-h-screen bg-background',
      !fullWidth && 'container mx-auto',
      paddingClasses[padding],
      className
    )}>
      {/* Header */}
      {(title || backButton || actions.length > 0) && (
        <header className={cn(
          'flex items-center justify-between mb-6 pb-4 border-b',
          headerClassName
        )}>
          <div className="flex items-center gap-4">
            {backButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              {title && (
                <h1 className="text-2xl font-bold tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex items-center gap-2">
              {actions.length <= 2 ? (
                // Show buttons directly for 1-2 actions
                actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'default'}
                    onClick={action.onClick}
                    size="sm"
                  >
                    {action.label}
                  </Button>
                ))
              ) : (
                // Use dropdown for 3+ actions
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {actions.map((action, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={action.onClick}
                      >
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className={cn('flex-1', contentClassName)}>
        {children}
      </main>
    </div>
  );
};

export interface PageSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  headerActions?: React.ReactNode;
}

export const PageSection: React.FC<PageSectionProps> = ({
  children,
  title,
  description,
  className,
  headerActions
}) => {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || description || headerActions) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-lg font-semibold tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
};

export default UnifiedPageLayout;