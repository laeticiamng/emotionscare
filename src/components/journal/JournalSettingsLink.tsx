import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface JournalSettingsLinkProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * Bouton de lien vers les paramètres du journal
 */
export const JournalSettingsLink = memo<JournalSettingsLinkProps>(({
  variant = 'ghost',
  size = 'sm',
  className = '',
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      asChild
    >
      <Link to="/settings/journal">
        <Settings className="h-4 w-4 mr-2" />
        Paramètres du journal
      </Link>
    </Button>
  );
});

JournalSettingsLink.displayName = 'JournalSettingsLink';
