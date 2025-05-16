import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  HeartHandshake
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/types/navigation";
import { cn } from "@/lib/utils";

const MobileNavigation: React.FC = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem("auth_session");
    localStorage.removeItem("user_role");
    
    logout();
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur EmotionsCare !",
    });
    
    navigate("/");
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <User className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85%] rounded-t-xl">
        <SheetHeader className="space-y-2 text-left">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Explorez votre espace EmotionsCare
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Link to={ROUTES.b2c.dashboard}>
            <Button
              variant={location.pathname === ROUTES.b2c.dashboard ? "default" : "ghost"}
              className={cn("w-full justify-start", {
                "bg-accent": location.pathname === ROUTES.b2c.dashboard,
              })}
            >
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Button>
          </Link>
          
          <Link to={ROUTES.b2c.journal}>
            <Button
              variant={location.pathname === ROUTES.b2c.journal ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Journal émotionnel
            </Button>
          </Link>
          
          <Link to={ROUTES.b2c.music}>
            <Button
              variant={location.pathname === ROUTES.b2c.music ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <Music className="mr-2 h-4 w-4" />
              Musicothérapie
            </Button>
          </Link>
          
          <Link to={ROUTES.b2c.scan}>
            <Button
              variant={location.pathname === ROUTES.b2c.scan ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <Heart className="mr-2 h-4 w-4" />
              Scan émotionnel
            </Button>
          </Link>

          <Link to={ROUTES.b2c.coach}>
            <Button
              variant={location.pathname === ROUTES.b2c.coach ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Coach
            </Button>
          </Link>

          <Link to={ROUTES.b2c.vr}>
            <Button
              variant={location.pathname === ROUTES.b2c.vr ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <Glasses className="mr-2 h-4 w-4" />
              Réalité virtuelle
            </Button>
          </Link>

          <Link to={ROUTES.b2c.gamification}>
            <Button
              variant={location.pathname === ROUTES.b2c.gamification ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Défis
            </Button>
          </Link>

          <Link to={ROUTES.b2c.cocon}>
            <Button
              variant={location.pathname === ROUTES.b2c.cocon ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <HeartHandshake className="mr-2 h-4 w-4" />
              Cocon
            </Button>
          </Link>
          
          <Link to={ROUTES.b2c.preferences}>
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
