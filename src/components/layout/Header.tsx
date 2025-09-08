
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { HealthBadge } from "@/components/transverse";
import { 
  Home, 
  Sparkles, 
  Settings, 
  User, 
  Database, 
  LogOut,
  Bell,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [nyveePressed, setNyveePressed] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Nyvée FAB - long press handler
  const handleNyveePress = () => {
    setNyveePressed(true);
    setTimeout(() => {
      if (nyveePressed) {
        navigate('/app/nyvee');
      }
      setNyveePressed(false);
    }, 1000); // 1 second long press
  };

  const getUserInitials = (user: any) => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo / Home Link */}
        <Link 
          to={isAuthenticated ? "/app/home" : "/"} 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          aria-label="Retour à l'accueil"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">EmotionsCare</span>
        </Link>

        {/* Center - Nyvée FAB (only when authenticated) */}
        {isAuthenticated && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <motion.button
              onMouseDown={handleNyveePress}
              onMouseUp={() => setNyveePressed(false)}
              onMouseLeave={() => setNyveePressed(false)}
              onTouchStart={handleNyveePress}
              onTouchEnd={() => setNyveePressed(false)}
              className={`
                relative h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary/80 
                text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200
                ${nyveePressed ? 'scale-95 shadow-md' : 'hover:scale-105'}
              `}
              aria-label="Assistant Nyvée - Appuyez longuement"
              title="Nyvée Assistant (appui long 1s)"
            >
              <Sparkles className="h-6 w-6 mx-auto" />
              {nyveePressed && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary-foreground"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              )}
            </motion.button>
          </div>
        )}

        {/* Right side - Health Badge & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Health Badge */}
          <HealthBadge />

          {/* Authentication */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 leading-none p-2">
                  <p className="font-medium">{user?.user_metadata?.name || 'Utilisateur'}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to="/settings/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/settings/general" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/settings/privacy" className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Confidentialité</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/settings/notifications" className="flex items-center">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/settings/data" className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>Mes Données</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/help">Aide</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/login">Entrer</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
