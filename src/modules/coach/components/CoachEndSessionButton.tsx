/**
 * CoachEndSessionButton - Bouton de fin de session
 */

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface CoachEndSessionButtonProps {
  hasMessages: boolean;
  disabled: boolean;
  onEnd: () => void;
}

export const CoachEndSessionButton = memo(function CoachEndSessionButton({
  hasMessages,
  disabled,
  onEnd,
}: CoachEndSessionButtonProps) {
  if (!hasMessages) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onEnd}
      disabled={disabled}
      className="gap-2 text-muted-foreground hover:text-destructive hover:border-destructive"
    >
      <LogOut className="h-4 w-4" />
      Terminer la session
    </Button>
  );
});
