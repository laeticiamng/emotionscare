/**
 * CoachKeyboardShortcuts - Aide raccourcis clavier
 */

import { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShortcutItem {
  keys: string[];
  description: string;
}

const shortcuts: ShortcutItem[] = [
  { keys: ['Ctrl', 'Enter'], description: 'Envoyer le message' },
  { keys: ['Ctrl', 'L'], description: 'Effacer la conversation' },
  { keys: ['Ctrl', 'N'], description: 'Nouvelle conversation' },
  { keys: ['Ctrl', 'E'], description: 'Exporter la conversation' },
  { keys: ['Esc'], description: 'Annuler l\'enregistrement vocal' },
  { keys: ['Tab'], description: 'Navigation entre les éléments' },
  { keys: ['↑', '↓'], description: 'Naviguer dans les suggestions' },
];

interface CoachKeyboardShortcutsProps {
  className?: string;
}

export const CoachKeyboardShortcuts = memo(function CoachKeyboardShortcuts({
  className
}: CoachKeyboardShortcutsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('gap-2 text-muted-foreground', className)}
        >
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">Raccourcis</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Raccourcis clavier
          </DialogTitle>
          <DialogDescription>
            Utilise ces raccourcis pour naviguer plus rapidement
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <span key={keyIndex}>
                    <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
                      {key}
                    </kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-muted-foreground mx-1">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Les raccourcis peuvent varier selon ton navigateur
        </p>
      </DialogContent>
    </Dialog>
  );
});
