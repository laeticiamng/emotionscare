
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, Settings, LogOut, Bell, BookOpen, 
  LayoutDashboard, BadgeHelp, Shield
} from 'lucide-react';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  
  // Get user initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const menuItems = [
    { 
      icon: <User className="mr-2 h-4 w-4" />, 
      label: "Profil", 
      href: "/profile",
      shortcut: "⇧⌘P"
    },
    { 
      icon: <Bell className="mr-2 h-4 w-4" />, 
      label: "Notifications", 
      href: "/notifications",
      shortcut: "⌘N" 
    },
    { 
      icon: <BookOpen className="mr-2 h-4 w-4" />, 
      label: "Journal", 
      href: "/journal",
      shortcut: "⌘J" 
    },
    { 
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />, 
      label: "Tableau de bord", 
      href: "/dashboard",
      shortcut: "⌘D" 
    }
  ];

  const accountItems = [
    { 
      icon: <Settings className="mr-2 h-4 w-4" />, 
      label: "Paramètres", 
      href: "/settings",
      shortcut: "⌘S"
    },
    { 
      icon: <Shield className="mr-2 h-4 w-4" />, 
      label: "Confidentialité", 
      href: "/privacy",
      shortcut: "⇧⌘C"
    },
    { 
      icon: <BadgeHelp className="mr-2 h-4 w-4" />, 
      label: "Aide", 
      href: "/help",
      shortcut: "⌘H"
    }
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Menu utilisateur">
          <Avatar className="h-9 w-9 border-2 hover:border-primary transition-all">
            <AvatarImage 
              src={user?.avatar || user?.avatarUrl || user?.avatar_url} 
              alt={user?.name || 'User'} 
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <AnimatePresence>
        {open && (
          <DropdownMenuContent 
            align="end" 
            className="w-56"
            forceMount
            asChild
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                {menuItems.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <DropdownMenuItem className="cursor-pointer">
                      <span className="flex items-center">
                        {item.icon}
                        {item.label}
                      </span>
                      {item.shortcut && (
                        <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                      )}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                {accountItems.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <DropdownMenuItem className="cursor-pointer">
                      <span className="flex items-center">
                        {item.icon}
                        {item.label}
                      </span>
                      {item.shortcut && (
                        <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                      )}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="cursor-pointer text-red-500 focus:text-red-500 dark:text-red-400 dark:focus:text-red-400" 
                onClick={logout}
              >
                <span className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
};

export default UserMenu;
