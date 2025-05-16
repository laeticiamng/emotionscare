import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/theme/ModeToggle"
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserMode, getUserModeDisplayName } from '@/utils/userModeUtils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/types/navigation';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  AlignJustify,
  Home,
  LayoutDashboard,
  Book,
  Music,
  Camera,
  Headphones,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Users,
  Activity,
  FileBarGraph,
  Calendar,
  SunMoon,
} from 'lucide-react';

const MainNavbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error("Logout failed", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur s'est produite lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>Mon Profil</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <span className="mr-2">Mode:</span> {getUserModeDisplayName(userMode)}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(ROUTES[normalizeUserMode(userMode)].preferences)}>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2c.login}>Se connecter</Link>
          </Button>
          <Button asChild>
            <Link to={ROUTES.b2c.register}>S'inscrire</Link>
          </Button>
        </>
      );
    }
  };

  const renderNavigationLinks = () => {
    const normalizedMode = normalizeUserMode(userMode);

    if (normalizedMode === 'b2b_admin') {
      return (
        <>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bAdmin.dashboard}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tableau de bord
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bAdmin.journal}>
              <Book className="mr-2 h-4 w-4" />
              Journal
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bAdmin.scan}>
              <Camera className="mr-2 h-4 w-4" />
              Analyse
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bAdmin.music}>
              <Music className="mr-2 h-4 w-4" />
              Musique
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bAdmin.teams}>
              <Users className="mr-2 h-4 w-4" />
              Équipes
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bAdmin.reports}>
              <FileBarGraph className="mr-2 h-4 w-4" />
              Rapports
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bAdmin.events}>
              <Calendar className="mr-2 h-4 w-4" />
              Événements
            </Link>
          </Button>
        </>
      );
    } else if (normalizedMode === 'b2b_user') {
      return (
        <>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bUser.dashboard}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tableau de bord
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bUser.journal}>
              <Book className="mr-2 h-4 w-4" />
              Journal
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bUser.music}>
              <Music className="mr-2 h-4 w-4" />
              Musique
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bUser.scan}>
              <Camera className="mr-2 h-4 w-4" />
              Analyse
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bUser.coach}>
              <Headphones className="mr-2 h-4 w-4" />
              Coach IA
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2bUser.vr}>
              <Activity className="mr-2 h-4 w-4" />
              VR
            </Link>
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2c.dashboard}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tableau de bord
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2c.journal}>
              <Book className="mr-2 h-4 w-4" />
              Journal
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2c.music}>
              <Music className="mr-2 h-4 w-4" />
              Musique
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2c.scan}>
              <Camera className="mr-2 h-4 w-4" />
              Analyse
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2c.coach}>
              <Headphones className="mr-2 h-4 w-4" />
              Coach IA
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={ROUTES.b2c.vr}>
              <Activity className="mr-2 h-4 w-4" />
              VR
            </Link>
          </Button>
        </>
      );
    }
  };

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="mr-4 flex items-center space-x-2">
          <span className="font-bold">EmotionsCare</span>
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          {renderNavigationLinks()}
        </div>
        <div className="hidden md:flex items-center space-x-2">
          {renderAuthButtons()}
          <ModeToggle />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <AlignJustify className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="sm:hidden">
            <SheetHeader>
              <SheetTitle>EmotionsCare</SheetTitle>
              <SheetDescription>
                {user ? `Bienvenue, ${user.name}!` : "Menu"}
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Accueil
                </Link>
              </Button>
              {renderNavigationLinks()}
              <div className="flex flex-col items-center justify-center space-y-2">
                {!isAuthenticated && (
                  <>
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link to={ROUTES.b2c.login}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Se connecter
                      </Link>
                    </Button>
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link to={ROUTES.b2c.register}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        S'inscrire
                      </Link>
                    </Button>
                  </>
                )}
                {isAuthenticated && (
                  <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </Button>
                )}
                <ModeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MainNavbar;
