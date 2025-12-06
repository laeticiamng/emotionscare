// @ts-nocheck

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';
import {
  Home,
  Settings,
  User,
  Music,
  MessageCircle,
  Heart,
  BarChart,
  Calendar,
  Search,
  Users,
  HelpCircle,
  LogOut
} from 'lucide-react';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({
  open,
  onOpenChange
}) => {
  const navigate = useNavigate();

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Tapez une commande ou cherchez..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/'))}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Accueil</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/home'))}
          >
            <BarChart className="mr-2 h-4 w-4" />
            <span>Tableau de bord</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/music'))}
          >
            <Music className="mr-2 h-4 w-4" />
            <span>Musique</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/coach'))}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Coach IA</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/community'))}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Communauté</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Compte">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/settings/profile'))}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Mon profil</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/settings'))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/scan'))}
          >
            <Heart className="mr-2 h-4 w-4" />
            <span>Historique émotionnel</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/activity'))}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Mon calendrier</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Aide">
          <CommandItem
            onSelect={() => runCommand(() => window.open('https://docs.emotions-care.com', '_blank'))}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Centre d'aide</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/scan'))}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Recherche</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/logout'))}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandMenu;
