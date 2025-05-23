
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Heart, LogOut, User, Building, Shield } from 'lucide-react';

const NavBar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    switch (userMode) {
      case 'b2c':
        return '/b2c/dashboard';
      case 'b2b_user':
        return '/b2b/user/dashboard';
      case 'b2b_admin':
        return '/b2b/admin/dashboard';
      default:
        return '/choose-mode';
    }
  };

  const getModeIcon = () => {
    switch (userMode) {
      case 'b2c':
        return <User className="h-4 w-4" />;
      case 'b2b_user':
        return <Building className="h-4 w-4" />;
      case 'b2b_admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getModeLabel = () => {
    switch (userMode) {
      case 'b2c':
        return 'Personnel';
      case 'b2b_user':
        return 'Collaborateur';
      case 'b2b_admin':
        return 'Administrateur';
      default:
        return 'EmotionsCare';
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Heart className="h-6 w-6 text-primary" />
            EmotionsCare
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Mode indicator */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm">
                  {getModeIcon()}
                  {getModeLabel()}
                </div>

                {/* Dashboard link */}
                <Button asChild variant="ghost">
                  <Link to={getDashboardPath()}>
                    Tableau de bord
                  </Link>
                </Button>

                {/* User menu */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {user?.name || 'Utilisateur'}
                  </span>
                  <Button onClick={handleLogout} variant="ghost" size="sm">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/choose-mode">Se connecter</Link>
                </Button>
                <Button asChild>
                  <Link to="/b2c/register">S'inscrire</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
