
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Scan, Music, MessageCircle, BookOpen, Headphones, 
  Settings, Gamepad2, Users, BarChart3, Calendar, 
  TrendingUp, User, Building2, Shield, LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const UnifiedNavigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Déterminer le rôle de l'utilisateur basé sur l'URL actuelle
  const getCurrentUserRole = () => {
    if (location.pathname.startsWith('/b2c')) return 'b2c';
    if (location.pathname.startsWith('/b2b/user')) return 'b2b_user';
    if (location.pathname.startsWith('/b2b/admin')) return 'b2b_admin';
    return 'b2c'; // par défaut
  };

  const userRole = getCurrentUserRole();

  // Éléments de navigation selon le rôle
  const getNavigationItems = () => {
    const baseItems = [
      { 
        name: 'Dashboard', 
        href: userRole === 'b2c' ? '/b2c/dashboard' : 
              userRole === 'b2b_user' ? '/b2b/user/dashboard' : 
              '/b2b/admin/dashboard',
        icon: Home 
      },
      { 
        name: 'Scanner', 
        href: userRole === 'b2c' ? '/b2c/scan' : 
              userRole === 'b2b_user' ? '/b2b/user/scan' : 
              '/b2b/admin/scan',
        icon: Scan 
      },
      { 
        name: 'Musique', 
        href: userRole === 'b2c' ? '/b2c/music' : 
              userRole === 'b2b_user' ? '/b2b/user/music' : 
              '/b2b/admin/music',
        icon: Music 
      },
      { 
        name: 'Coach IA', 
        href: userRole === 'b2c' ? '/b2c/coach' : 
              userRole === 'b2b_user' ? '/b2b/user/coach' : 
              '/b2b/admin/coach',
        icon: MessageCircle 
      },
      { 
        name: 'Journal', 
        href: userRole === 'b2c' ? '/b2c/journal' : 
              userRole === 'b2b_user' ? '/b2b/user/journal' : 
              '/b2b/admin/journal',
        icon: BookOpen 
      },
      { 
        name: 'VR', 
        href: userRole === 'b2c' ? '/b2c/vr' : 
              userRole === 'b2b_user' ? '/b2b/user/vr' : 
              '/b2b/admin/vr',
        icon: Headphones 
      },
      { 
        name: 'Gamification', 
        href: userRole === 'b2c' ? '/b2c/gamification' : 
              userRole === 'b2b_user' ? '/b2b/user/gamification' : 
              '/b2b/admin/gamification',
        icon: Gamepad2 
      },
      { 
        name: 'Cocon Social', 
        href: userRole === 'b2c' ? '/b2c/social-cocon' : 
              userRole === 'b2b_user' ? '/b2b/user/social-cocon' : 
              '/b2b/admin/social-cocon',
        icon: Users 
      },
    ];

    // Ajouter les éléments spécifiques aux admins B2B
    if (userRole === 'b2b_admin') {
      baseItems.push(
        { name: 'Équipes', href: '/b2b/admin/teams', icon: Users },
        { name: 'Rapports', href: '/b2b/admin/reports', icon: BarChart3 },
        { name: 'Événements', href: '/b2b/admin/events', icon: Calendar },
        { name: 'Optimisation', href: '/b2b/admin/optimisation', icon: TrendingUp },
      );
    }

    // Ajouter les préférences pour tous
    baseItems.push({ 
      name: 'Préférences', 
      href: userRole === 'b2c' ? '/b2c/preferences' : 
            userRole === 'b2b_user' ? '/b2b/user/preferences' : 
            '/b2b/admin/settings',
      icon: Settings 
    });

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const getRoleBadge = () => {
    switch (userRole) {
      case 'b2c':
        return { icon: User, label: 'Particulier', color: 'bg-blue-500' };
      case 'b2b_user':
        return { icon: Building2, label: 'Collaborateur', color: 'bg-green-500' };
      case 'b2b_admin':
        return { icon: Shield, label: 'Admin RH', color: 'bg-purple-500' };
      default:
        return { icon: User, label: 'Utilisateur', color: 'bg-gray-500' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <nav className="fixed left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl z-50">
      <div className="flex flex-col h-full">
        {/* Header avec logo et rôle */}
        <div className="p-6 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              EmotionsCare
            </h1>
            <div className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white",
              roleBadge.color
            )}>
              <roleBadge.icon className="h-4 w-4 mr-2" />
              {roleBadge.label}
            </div>
          </motion.div>
        </div>

        {/* Navigation principale */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="space-y-2 px-4">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 group",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 mr-3 transition-transform duration-300",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )} />
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer avec profil utilisateur */}
        <div className="p-6 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {user && (
              <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {roleBadge.label}
                  </p>
                </div>
              </div>
            )}
            
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 group"
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:scale-110" />
              Déconnexion
            </button>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default UnifiedNavigation;
