import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Bell,
  Calendar,
  Code,
  Cog,
  FileBarGraph,
  Plus,
  Settings,
  CreditCard,
  Keyboard,
  HelpCircle,
  LogOut,
  BarChart3,
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";

const MainNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
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
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Code className="h-6 w-6" />
          <span className="font-bold">EmotionsCare</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-4 sm:space-x-6">
          <Button variant="ghost" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Calendrier
          </Button>
          <Button variant="ghost" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Aide
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Paramètres</SheetTitle>
                <SheetDescription>
                  Gérez les paramètres de votre compte et définissez vos préférences.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={user?.name}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="username" className="text-right">
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={user?.email}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url} alt={user?.name} />
                  <AvatarFallback>{getInitials(user?.name || '??')}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </div>
  );
};

export default MainNavbar;
