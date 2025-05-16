
import { PropsWithChildren } from 'react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Menu, X, Home } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type ShellProps = PropsWithChildren<{
  hideNav?: boolean;
}>;

export default function Shell({ children, hideNav }: ShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate('/');
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      {!hideNav && (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="font-bold text-white">EC</span>
                </div>
                <span className="hidden md:inline-block font-bold text-xl text-blue-700 dark:text-blue-300">
                  EmotionsCare
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Accueil
              </Link>
              <Link to="/b2c" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Particulier
              </Link>
              <Link to="/b2b/selection" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Entreprise
              </Link>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                {isAuthenticated ? (
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                ) : (
                  <Button onClick={handleLogin} variant="default" size="sm">
                    <LogIn className="mr-2 h-4 w-4" />
                    Connexion
                  </Button>
                )}
              </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle size="icon" variant="ghost" />

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-8 py-8">
                    <Link
                      to="/"
                      className="flex items-center gap-2 text-lg font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Home className="h-5 w-5" />
                      Accueil
                    </Link>
                    <div className="flex flex-col gap-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Navigation</h4>
                      <div className="flex flex-col gap-2">
                        <Link
                          to="/b2c"
                          className="text-sm font-medium text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Particulier
                        </Link>
                        <Link
                          to="/b2b/selection"
                          className="text-sm font-medium text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Entreprise
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {isAuthenticated ? (
                        <Button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Déconnexion
                        </Button>
                      ) : (
                        <Button onClick={() => { handleLogin(); setMobileMenuOpen(false); }}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Connexion
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {!hideNav && (
        <footer className="border-t border-border/40 bg-muted/40">
          <div className="container flex flex-col sm:flex-row py-6 items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} EmotionsCare. Tous droits réservés.
              </p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                Politique de confidentialité
              </Link>
              <Link to="/" className="hover:text-foreground">
                Conditions d'utilisation
              </Link>
              <Link to="/" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
