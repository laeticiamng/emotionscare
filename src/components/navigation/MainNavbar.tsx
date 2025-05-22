
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainNavbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b sticky top-0 bg-background z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            EmotionsCare
          </Link>

          <nav className="hidden md:flex items-center gap-6 ml-6">
            <NavLink to="/" label="Accueil" onClick={closeMobileMenu} />
            
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" label="Dashboard" onClick={closeMobileMenu} />
                <NavDropdown 
                  label="Modules" 
                  items={[
                    { to: '/scan', label: 'Scan Émotionnel' },
                    { to: '/journal', label: 'Journal' },
                    { to: '/music', label: 'Musicothérapie' },
                    { to: '/social', label: 'Communauté' },
                    { to: '/sessions', label: 'Sessions' },
                  ]}
                  onClick={closeMobileMenu}
                />
              </>
            )}
            
            <NavLink to="/team" label="Notre équipe" onClick={closeMobileMenu} />
            <NavLink to="/contact" label="Contact" onClick={closeMobileMenu} />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Se connecter
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden"
          >
            <nav className="flex flex-col p-4">
              <MobileNavLink to="/" label="Accueil" onClick={closeMobileMenu} />
              
              {isAuthenticated && (
                <>
                  <MobileNavLink to="/dashboard" label="Dashboard" onClick={closeMobileMenu} />
                  <MobileNavLink to="/scan" label="Scan Émotionnel" onClick={closeMobileMenu} />
                  <MobileNavLink to="/journal" label="Journal" onClick={closeMobileMenu} />
                  <MobileNavLink to="/music" label="Musicothérapie" onClick={closeMobileMenu} />
                  <MobileNavLink to="/social" label="Communauté" onClick={closeMobileMenu} />
                  <MobileNavLink to="/sessions" label="Sessions" onClick={closeMobileMenu} />
                </>
              )}
              
              <MobileNavLink to="/team" label="Notre équipe" onClick={closeMobileMenu} />
              <MobileNavLink to="/contact" label="Contact" onClick={closeMobileMenu} />
              
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 mt-4">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full">
                      Se connecter
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMobileMenu}>
                    <Button className="w-full">
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, onClick }) => {
  return (
    <Link
      to={to}
      className="text-sm font-medium transition-colors hover:text-primary"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ to, label, onClick }) => {
  return (
    <Link
      to={to}
      className="text-sm font-medium transition-colors hover:text-primary py-3 border-b border-muted"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

interface NavDropdownProps {
  label: string;
  items: { to: string; label: string }[];
  onClick?: () => void;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ label, items, onClick }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-sm font-medium transition-colors hover:text-primary">
          {label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map((item) => (
          <DropdownMenuItem key={item.to} asChild>
            <Link to={item.to} onClick={onClick}>
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainNavbar;
