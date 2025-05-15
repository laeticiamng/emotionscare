
import React from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const B2CNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    localStorage.removeItem("auth_session");
    localStorage.removeItem("user_role");
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur EmotionsCare !",
    });
    
    navigate("/");
  };
  
  return (
    <div className="h-full flex flex-col bg-muted/40 border-r">
      <div className="p-4 border-b">
        <Link to="/b2c/dashboard" className="flex items-center gap-2">
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
        <Link to="/b2c/dashboard">
          <Button
            variant={location.pathname === "/b2c/dashboard" ? "default" : "ghost"}
            className={cn("w-full justify-start", {
              "bg-accent": location.pathname === "/b2c/dashboard",
            })}
          >
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </Link>
        
        <Link to="/b2c/journal">
          <Button
            variant={location.pathname === "/b2c/journal" ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Journal émotionnel
          </Button>
        </Link>
        
        <Link to="/b2c/music">
          <Button
            variant={location.pathname === "/b2c/music" ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Music className="mr-2 h-4 w-4" />
            Musicothérapie
          </Button>
        </Link>
        
        <Link to="/b2c/scan">
          <Button
            variant={location.pathname === "/b2c/scan" ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Heart className="mr-2 h-4 w-4" />
            Scan émotionnel
          </Button>
        </Link>
      </nav>
      
      <div className="p-4 border-t mt-auto">
        <div className="space-y-2">
          <Link to="/b2c/preferences">
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
