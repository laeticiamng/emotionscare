import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Menu, 
  X, 
  Settings, 
  User, 
  LogOut, 
  Bell, 
  Search,
  Heart,
  FileText,
  Music,
  MessageSquare,
  Headphones,
  Layout,
  BarChart, 
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useNotificationBadge } from "@/hooks/useNotificationBadge";
import { motion } from "framer-motion";
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserRole, getRoleName, getRoleHomePath } from '@/utils/roleUtils';

const MainNavbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useNotificationBadge();
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const normalizedUserMode = userMode ? normalizeUserRole(userMode) : '';

  const isAdmin = normalizedUserMode === 'b2b_admin';
  
  const getNavItems = () => {
    if (isAdmin) {
      return [
        { label: "Tableau de bord", icon: <Home className="h-4 w-4 mr-2" />, path: "/b2b/admin/dashboard" },
        { label: "Équipes", icon: <User className="h-4 w-4 mr-2" />, path: "/b2b/admin/teams" },
        { label: "Rapports", icon: <FileText className="h-4 w-4 mr-2" />, path: "/b2b/admin/reports" },
        { label: "Événements", icon: <Layout className="h-4 w-4 mr-2" />, path: "/b2b/admin/events" },
        { label: "Paramètres", icon: <Settings className="h-4 w-4 mr-2" />, path: "/b2b/admin/settings" }
      ];
    }
    
    if (normalizedUserMode === 'b2b_user') {
      return [
        { label: "Accueil", icon: <Home className="h-4 w-4 mr-2" />, path: "/b2b/user/dashboard" },
        { label: "Scan", icon: <Heart className="h-4 w-4 mr-2" />, path: "/b2b/user/scan" },
        { label: "Journal", icon: <FileText className="h-4 w-4 mr-2" />, path: "/b2b/user/journal" },
        { label: "Musique", icon: <Music className="h-4 w-4 mr-2" />, path: "/b2b/user/music" },
        { label: "Coach", icon: <MessageSquare className="h-4 w-4 mr-2" />, path: "/b2b/user/coach" },
        { label: "VR", icon: <Layout className="h-4 w-4 mr-2" />, path: "/b2b/user/vr" },
        { label: "Défis", icon: <BarChart className="h-4 w-4 mr-2" />, path: "/b2b/user/gamification" },
        { label: "Paramètres", icon: <Settings className="h-4 w-4 mr-2" />, path: "/b2b/user/preferences" }
      ];
    }
    
    return [
      { label: "Accueil", icon: <Home className="h-4 w-4 mr-2" />, path: "/b2c/dashboard" },
      { label: "Scan", icon: <Heart className="h-4 w-4 mr-2" />, path: "/b2c/scan" },
      { label: "Journal", icon: <FileText className="h-4 w-4 mr-2" />, path: "/b2c/journal" },
      { label: "Musique", icon: <Music className="h-4 w-4 mr-2" />, path: "/b2c/music" },
      { label: "Coach", icon: <MessageSquare className="h-4 w-4 mr-2" />, path: "/b2c/coach" },
      { label: "VR", icon: <Layout className="h-4 w-4 mr-2" />, path: "/b2c/vr" },
      { label: "Défis", icon: <BarChart className="h-4 w-4 mr-2" />, path: "/b2c/gamification" },
      { label: "Paramètres", icon: <Settings className="h-4 w-4 mr-2" />, path: "/b2c/preferences" }
    ];
  };

  const handleLogout = () => {
    setShowConfirm(true);
  };
  
  const confirmLogout = async () => {
    await logout();
    setShowConfirm(false);
    navigate('/');
  };
  
  const cancelLogout = () => {
    setShowConfirm(false);
  };
  
  const navItems = getNavItems();
  
  const userRole = user?.role ? getRoleName(user.role) : 'Utilisateur';

  return (
    <header className="bg-background/95 backdrop-blur-md border-b sticky top-0 z-50 transition-all">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative flex items-center">
            <motion.div 
              className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
            <motion.h1 
              className="ml-2 text-lg font-bold"
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              EmotionsCare
            </motion.h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {isAuthenticated && navItems.map((link) => (
            <Button 
              key={link.path} 
              variant="ghost" 
              size="sm"
              asChild
              className="px-3"
            >
              <Link to={link.path} className="flex items-center">
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </Button>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Search button */}
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Podcast button */}
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate('/podcast')}>
                <Headphones className="h-5 w-5" />
              </Button>
              
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    {count > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white"
                      >
                        {count}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto p-2">
                    <div className="text-center text-sm text-muted-foreground py-4">
                      Aucune nouvelle notification
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button size="sm" variant="outline" className="w-full">
                      Voir toutes les notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar_url || undefined} alt={user?.name || 'Utilisateur'} />
                      <AvatarFallback className="bg-primary/10">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>{user?.name || 'Utilisateur'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart className="mr-2 h-4 w-4" />
                      <span>{userRole}</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate(getRoleHomePath(user?.role))}>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Tableau de bord</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="max-w-[300px]">
                  <div className="flex flex-col h-full">
                    <div className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold">EmotionsCare</h2>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <nav className="flex-1 space-y-2 py-4">
                      {navItems.map((link) => (
                        <Button 
                          key={link.path} 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => {
                            navigate(link.path);
                            setMobileMenuOpen(false);
                          }}
                        >
                          {link.icon}
                          {link.label}
                        </Button>
                      ))}
                    </nav>
                    
                    <div className="border-t py-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start mb-2"
                        onClick={() => {
                          navigate('/settings');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Se déconnecter
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button asChild>
                <Link to="/register">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="modal">
          <div className="modal-content">
            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <Button variant="destructive" onClick={confirmLogout}>Oui</Button>
            <Button variant="outline" onClick={cancelLogout}>Annuler</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainNavbar;
