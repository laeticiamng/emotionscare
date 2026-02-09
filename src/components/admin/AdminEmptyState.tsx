import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LucideIcon, Inbox, Search, FileX, AlertCircle } from 'lucide-react';

type EmptyStatePreset = 'no-data' | 'no-results' | 'error' | 'no-items';

interface AdminEmptyStateProps {
  preset?: EmptyStatePreset;
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const presetConfig: Record<EmptyStatePreset, { icon: LucideIcon; defaultTitle: string }> = {
  'no-data': { icon: Inbox, defaultTitle: 'Aucune donnée disponible' },
  'no-results': { icon: Search, defaultTitle: 'Aucun résultat trouvé' },
  'error': { icon: AlertCircle, defaultTitle: 'Erreur de chargement' },
  'no-items': { icon: FileX, defaultTitle: 'Aucun élément' },
};

const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  preset = 'no-data',
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}) => {
  const config = presetConfig[preset];
  const IconComponent = icon || config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        'border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/10',
        className
      )}
      role="status"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
        <IconComponent className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex gap-3 mt-2">
          {action && (
            <Button onClick={action.onClick} size="sm">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick} variant="outline" size="sm">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminEmptyState;
