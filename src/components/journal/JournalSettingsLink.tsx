import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JournalSettingsLinkProps extends Omit<ButtonProps, 'asChild'> {
  className?: string;
}

/**
 * Lien vers la page de paramètres du journal
 * Utilisé dans l'en-tête de la page principale
 */
export function JournalSettingsLink({ 
  className, 
  variant = "outline", 
  size = "sm",
  ...props 
}: JournalSettingsLinkProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
      asChild
      {...props}
    >
      <Link to="/settings/journal" aria-label="Paramètres du journal">
        <Settings className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Paramètres</span>
      </Link>
    </Button>
  );
}
