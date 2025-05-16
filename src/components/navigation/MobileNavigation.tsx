
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Bell,
  Calendar,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  User,
  BarChart3
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSoundscape } from "@/contexts/SoundscapeContext";
import NotificationDrawer from "@/components/notifications/NotificationDrawer";

const MobileNavigation: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { playFunctionalSound } = useSoundscape();
  const [open, setOpen] = React.useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    playFunctionalSound("themeToggle");
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur s'est produite lors de la déconnexion.",
        variant: "destructive",
      });
    } finally {
      playFunctionalSound("logout");
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Menu className="w-6 h-6 cursor-pointer" />
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Explorez les différentes sections de l'application.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <Separator />

          <NavLink
            to="/b2c"
            className={`flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-secondary transition-colors ${
              isActive("/b2c") ? "bg-secondary text-primary" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            <Home className="w-4 h-4" />
            <span>Accueil</span>
          </NavLink>

          <NavLink
            to="/b2c/journal"
            className={`flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-secondary transition-colors ${
              isActive("/b2c/journal") ? "bg-secondary text-primary" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            <FileText className="w-4 h-4" />
            <span>Journal</span>
          </NavLink>

          <NavLink
            to="/b2c/scan"
            className={`flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-secondary transition-colors ${
              isActive("/b2c/scan") ? "bg-secondary text-primary" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Scan</span>
          </NavLink>

          <NavLink
            to="/b2c/coach"
            className={`flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-secondary transition-colors ${
              isActive("/b2c/coach") ? "bg-secondary text-primary" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Coach</span>
          </NavLink>

          <Separator />

          <div className="py-2 px-4">
            <div className="text-sm font-medium text-muted-foreground">
              Paramètres
            </div>
          </div>

          <div className="flex items-center justify-between py-2 px-4">
            <div className="flex items-center space-x-2">
              {theme === "light" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span>Mode {theme === "light" ? "Sombre" : "Clair"}</span>
            </div>
            <button
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
              className="rounded-full p-1 hover:bg-secondary transition-colors"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>

          <Link
            to="/b2c/settings"
            className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-secondary transition-colors"
            onClick={() => setOpen(false)}
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres</span>
          </Link>

          <Separator />

          <div className="py-2 px-4">
            <div className="text-sm font-medium text-muted-foreground">
              Compte
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2 px-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user?.name}</div>
              <div className="text-muted-foreground text-sm">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-secondary transition-colors w-full justify-start"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
