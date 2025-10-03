
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  User,
  Home,
  BookOpen,
  Music,
  Heart,
  Settings,
  LogOut,
  MessageSquare, 
  Glasses,
  Trophy,
  HeartHandshake,
  Box,
  ShoppingCart
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useToast } from "@/hooks/use-toast";
import { routes } from '@/routerV2';

const B2CNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();
  const { clearUserMode } = useUserMode();
  
  const handleLogout = () => {
    localStorage.removeItem("auth_session");
    localStorage.removeItem("user_role");
    clearUserMode();
    
    logout();
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur EmotionsCare !",
    });
    
    navigate("/");
  };
  
  return (
    <div className="h-full flex flex-col bg-muted/40 border-r">
      <div className="p-4 border-b">
        <Link to={routes.consumer.dashboard()} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg leading-none">EmotionsCare</h2>
            <p className="text-xs text-muted-foreground">Espace Personnel</p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 p-2 space-y-1">
        <Link to={routes.consumer.dashboard()}>
          <Button
            variant={location.pathname === routes.consumer.dashboard() ? "default" : "ghost"}
            className={cn("w-full justify-start", {
              "bg-accent": location.pathname === routes.consumer.dashboard(),
            })}
          >
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </Link>
        
        <Link to={routes.consumer.journal()}>
          <Button
            variant={location.pathname === routes.consumer.journal() ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Journal émotionnel
          </Button>
        </Link>
        
        <Link to={routes.consumer.music()}>
          <Button
            variant={location.pathname === routes.consumer.music() ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Music className="mr-2 h-4 w-4" />
            Musicothérapie
          </Button>
        </Link>
        
        <Link to={routes.consumer.scan()}>
          <Button
            variant={location.pathname === routes.consumer.scan() ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Heart className="mr-2 h-4 w-4" />
            Scan émotionnel
          </Button>
        </Link>

        <Link to={routes.consumer.coach()}>
          <Button
            variant={location.pathname === routes.consumer.coach() ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Coach
          </Button>
        </Link>

        <Link to={routes.consumer.vr()}>
          <Button
            variant={location.pathname === routes.consumer.vr() ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Glasses className="mr-2 h-4 w-4" />
            Réalité virtuelle
          </Button>
        </Link>

        <Link to={routes.consumer.gamification()}>
          <Button
            variant={location.pathname === routes.consumer.gamification() ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Défis
          </Button>
        </Link>

        <Link to={routes.consumer.socialCocon()}>
          <Button
            variant={location.pathname === routes.consumer.socialCocon() ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <HeartHandshake className="mr-2 h-4 w-4" />
            Cocon
          </Button>
        </Link>

        <Link to={routes.public.about()}>
          <Button
            variant={location.pathname === routes.public.about() ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Boutique
          </Button>
        </Link>

        <Link to={routes.public.about()}>
          <Button
            variant={location.pathname === routes.public.about() ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <Box className="mr-2 h-4 w-4" />
            Extensions
          </Button>
        </Link>
      </nav>
      
      <div className="p-4 border-t mt-auto">
        <div className="space-y-2">
          <Link to={routes.consumer.preferences()}>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Préférences
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 dark:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2CNavBar;
