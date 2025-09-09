import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { routes } from '@/routerV2';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const GlobalNav: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const getInitials = (displayName: string) => {
    return displayName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header role="banner" className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to={routes.public.home()} 
            className="font-bold text-xl flex items-center gap-2 focus-enhanced"
            aria-label="EmotionsCare - Retour à l'accueil"
          >
            EmotionsCare
          </Link>
        </div>

        <nav id="main-navigation" role="navigation" aria-label="Navigation principale" className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full focus-enhanced"
                    aria-label={`Menu utilisateur pour ${user?.name || 'utilisateur'}`}
                    aria-expanded={false}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user?.avatar} 
                        alt={`Photo de profil de ${user?.name || 'utilisateur'}`} 
                      />
                      <AvatarFallback aria-label={`Initiales: ${getInitials(user?.name || 'User')}`}>
                        {getInitials(user?.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || ''}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={routes.b2c.profile()}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={routes.b2b.admin.dashboard()}>Admin Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to={routes.auth.login()} aria-label="Page de connexion">
                <Button variant="ghost" size="sm" className="focus-enhanced">
                  Se connecter
                </Button>
              </Link>
              <Link to={routes.auth.signup()} aria-label="Page d'inscription">
                <Button size="sm" className="focus-enhanced">
                  S'inscrire
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default GlobalNav;