
import React, { useEffect, useState } from 'react';
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
  Music, 
  MessageCircle, 
  Settings, 
  Users, 
  User, 
  Bookmark,
  Calendar,
  Clock,
  Search,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [inputValue, setInputValue] = useState('');

  const handleSelect = (value: string) => {
    onOpenChange(false);
    
    if (value === 'logout') {
      logout && logout();
      navigate('/login');
      return;
    }
    
    navigate(value);
  };
  
  useEffect(() => {
    if (!open) {
      setInputValue('');
    }
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Tapez une commande ou recherchez..." 
        value={inputValue}
        onValueChange={setInputValue}
      />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem value="/" onSelect={handleSelect}>
            <Home className="mr-2 h-4 w-4" />
            <span>Accueil</span>
          </CommandItem>
          <CommandItem value="/dashboard" onSelect={handleSelect}>
            <Home className="mr-2 h-4 w-4" />
            <span>Tableau de bord</span>
          </CommandItem>
          <CommandItem value="/music" onSelect={handleSelect}>
            <Music className="mr-2 h-4 w-4" />
            <span>Musique</span>
          </CommandItem>
          <CommandItem value="/coach" onSelect={handleSelect}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Coach IA</span>
          </CommandItem>
          <CommandItem value="/community" onSelect={handleSelect}>
            <Users className="mr-2 h-4 w-4" />
            <span>Communauté</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Compte">
          <CommandItem value="/profile" onSelect={handleSelect}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </CommandItem>
          <CommandItem value="/settings" onSelect={handleSelect}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </CommandItem>
          <CommandItem value="/bookmarks" onSelect={handleSelect}>
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Favoris</span>
          </CommandItem>
          <CommandItem value="logout" onSelect={handleSelect}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Outils">
          <CommandItem value="/calendar" onSelect={handleSelect}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendrier</span>
          </CommandItem>
          <CommandItem value="/timer" onSelect={handleSelect}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Minuteur</span>
          </CommandItem>
          <CommandItem value="/search" onSelect={handleSelect}>
            <Search className="mr-2 h-4 w-4" />
            <span>Recherche avancée</span>
          </CommandItem>
          <CommandItem value="/help" onSelect={handleSelect}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Aide</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandMenu;
