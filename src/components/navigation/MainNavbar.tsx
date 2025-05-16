import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useTheme } from "@/components/theme-provider";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  isAdminRole,
  getRoleName,
  getRoleLoginPath,
} from "@/utils/roleUtils";
import { useSoundscape } from "@/contexts/SoundscapeContext";
import NotificationDrawer from "@/components/notifications/NotificationDrawer";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface MainNavbarProps {
  isMobile?: boolean;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ isMobile }) => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { playFunctionalSound } = useSoundscape();
  const [open, setOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    playFunctionalSound("logout");
    const loginPath = getRoleLoginPath(user?.role || "b2c");
    navigate(loginPath);
  };

  return (
    <div className="border-b bg-background sticky top-0 z-50">
      <div className="flex h-16 items-center px-4">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-sm" side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Explorez les différentes sections de l'application.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Link to="/" className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Accueil</span>
                </Link>
                <Link to="/journal" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Journal</span>
                </Link>
                <Link to="/scan" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Scan</span>
                </Link>
                <Link to="/calendar" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Calendrier</span>
                </Link>
                <Link to="/messages" className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Messages</span>
                </Link>
                {isAdminRole(user?.role) && (
                  <Link to="/admin" className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Administration</span>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Link to="/" className="mr-6 font-bold">
            EmotionsCare
          </Link>
        )}
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setTheme(theme === "light" ? "dark" : "light");
              playFunctionalSound("themeToggle");
            }}
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </Button>

          <NotificationDrawer />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 lg:h-auto lg:w-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {!isMobile && (
                  <span className="ml-2 text-sm font-normal">
                    {user?.name}
                  </span>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon profil</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{user?.email}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>{getRoleName(user?.role)}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
