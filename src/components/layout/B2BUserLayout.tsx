// @ts-nocheck
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, BarChart3, BookOpen, Music, MessageCircle, Settings, LogOut, Menu, X, ChevronRight, User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  notification?: number;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, notification, isActive }) => {
  return (
    <Link to={to} className="w-full">
      <motion.div 
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          isActive 
            ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-50" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
        )}
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <span className={cn(
          "p-1 rounded-md",
          isActive ? "bg-blue-200 dark:bg-blue-800/50" : "bg-gray-100 dark:bg-gray-800"
        )}>
          {icon}
        </span>
        <span className="flex-1 font-medium">{label}</span>
        {notification && (
          <Badge variant="default" className="ml-auto bg-blue-500 hover:bg-blue-600">
            {notification}
          </Badge>
        )}
        {isActive && (
          <ChevronRight className="h-4 w-4 ml-auto text-blue-500" />
        )}
      </motion.div>
    </Link>
  );
};

const B2BUserLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const navItems = [
    { to: "/app/collab", icon: <Home className="h-5 w-5" />, label: "Tableau de bord" },
    { to: "/app/journal", icon: <BookOpen className="h-5 w-5" />, label: "Journal émotionnel", notification: 2 },
    { to: "/app/music", icon: <Music className="h-5 w-5" />, label: "Musicothérapie" },
    { to: "/app/coach", icon: <MessageCircle className="h-5 w-5" />, label: "Coach IA" },
    { to: "/app/analytics", icon: <BarChart3 className="h-5 w-5" />, label: "Statistiques" },
    { to: "/settings/general", icon: <Settings className="h-5 w-5" />, label: "Paramètres" }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion réussie",
        description: "Au revoir, à bientôt sur EmotionsCare !",
      });
      navigate('/');
    } catch (error) {
      logger.error("Erreur lors de la déconnexion", error as Error, 'AUTH');
    }
  };

  const sidebarVariants = {
    closed: {
      width: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      width: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Utilisateur';
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 flex-col bg-gray-50 dark:bg-slate-900/50 border-r border-gray-200 dark:border-gray-800">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-800">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                    {user?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium truncate max-w-[120px]">{user?.name || 'Chargement...'}</span>
                <span className="text-xs text-muted-foreground">Collaborateur</span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  notification={item.notification}
                  isActive={location.pathname === item.to}
                />
              ))}
            </nav>
          </ScrollArea>

          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="ghost"
              className="w-full text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed top-0 left-0 z-50 h-screen md:hidden bg-white dark:bg-slate-900 max-w-[260px]"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-blue-200 dark:border-blue-800">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                        {user?.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.name || 'Chargement...'}</span>
                    <span className="text-xs text-muted-foreground">Collaborateur</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 py-4 px-3">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <div
                      key={item.to}
                      onClick={() => {
                        navigate(item.to);
                        setIsSidebarOpen(false);
                      }}
                    >
                      <NavItem
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        notification={item.notification}
                        isActive={location.pathname === item.to}
                      />
                    </div>
                  ))}
                </nav>
              </ScrollArea>

              <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                <Button
                  variant="ghost"
                  className="w-full text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 justify-start gap-3"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Déconnexion</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between border-b px-4 md:px-6 bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <motion.h1 
                  className="text-lg font-semibold"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {getGreeting()}, {firstName}
                </motion.h1>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ModeToggle />
            
            <div className="md:hidden">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-full"
                aria-label="Ouvrir le menu de navigation"
              >
                <Avatar className="h-8 w-8 border border-blue-200 dark:border-blue-800 cursor-pointer">
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                      {user?.name?.charAt(0) || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-gray-50/50 dark:bg-slate-950/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default B2BUserLayout;
