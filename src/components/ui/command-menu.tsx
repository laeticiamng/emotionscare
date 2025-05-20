
import React from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './command';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands?: Array<{
    category: string;
    command: string;
    shortcut?: string;
    action?: () => void;
  }>;
  placeholder?: string;
}

export function CommandMenu({ 
  open, 
  onOpenChange, 
  commands = [],
  placeholder = "Tapez une commande ou recherchez..."
}: CommandMenuProps) {
  // Group commands by category
  const categories = commands.reduce<Record<string, typeof commands>>((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {});

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>Aucune commande trouvée.</CommandEmpty>
        
        {Object.entries(categories).map(([category, categoryCommands], index) => (
          <React.Fragment key={category}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={category}>
              {categoryCommands.map((command) => (
                <CommandItem
                  key={`${category}-${command.command}`}
                  onSelect={() => {
                    if (command.action) {
                      command.action();
                    }
                    onOpenChange(false);
                  }}
                >
                  {command.command}
                  {command.shortcut && <CommandShortcut>{command.shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
