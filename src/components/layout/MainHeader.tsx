import React from 'react';
import { logger } from '@/lib/logger';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Building2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const MainHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/');
    } catch (error) {
      logger.error('Error signing out', error as Error, 'AUTH');
    }
  };

  const getIcon = () => {
    const role = user?.user_metadata?.role;
    if (role === 'b2c') {
      return <Heart className="h-6 w-6 text-pink-500" />;
    }
    return <Building2 className="h-6 w-6 text-blue-600" />;
  };

  const getTitle = () => {
    const role = user?.user_metadata?.role;
    if (role === 'b2c') {
      return 'EmotionsCare';
    }
    return 'EmotionsCare B2B';
  };

  const getDashboardLink = () => {
    const role = user?.user_metadata?.role;
    switch (role) {
      case 'b2c':
        return '/app/consumer/home';
      case 'b2b_user':
        return '/app/employee/home';
      case 'b2b_admin':
        return '/entreprise';
      default:
        return '/';
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to={getDashboardLink()} className="flex items-center gap-2 hover:opacity-80">
            {getIcon()}
            <span className="text-xl font-bold">{getTitle()}</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-muted-foreground">
                  Bonjour, {user?.user_metadata?.full_name || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Déconnexion
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
