
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Home,
  User,
  Building2,
  Shield,
  LogOut,
  Settings,
  BarChart3,
  Users,
  Calendar,
  FileText,
  Brain,
  Music,
  Heart,
  Gamepad2,
  MessageCircle
} from 'lucide-react';

const UnifiedNavigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { userMode, setUserMode } = useUserMode();
  const location = useLocation();
  const navigate = useNavigate();

  const handleModeChange = (mode: string) => {
    setUserMode(mode as any);
    switch (mode) {
      case 'b2c':
        navigate('/b2c/dashboard');
        break;
      case 'b2b_user':
        navigate('/b2b/user/dashboard');
        break;
      case 'b2b_admin':
        navigate('/b2b/admin/dashboard');
        break;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Navigation items selon le mode utilisateur
  const getNavigationItems = () => {
    const commonItems = [
      { icon: Brain, label: 'Scanner émotions', path: '/scan' },
      { icon: Music, label: 'Musique thérapeutique', path: '/music' },
      { icon: MessageCircle, label: 'Coach IA', path: '/coach' },
      { icon: FileText, label: 'Journal', path: '/journal' },
      { icon: Heart, label: 'VR Thérapie', path: '/vr' },
      { icon: Settings, label: 'Préférences', path: '/preferences' },
    ];

    switch (userMode) {
      case 'b2c':
        return [
          { icon: Home, label: 'Dashboard', path: '/b2c/dashboard' },
          ...commonItems,
          { icon: Gamepad2, label: 'Gamification', path: '/gamification' },
          { icon: Users, label: 'Cocon social', path: '/social-cocon' },
        ];
      case 'b2b_user':
        return [
          { icon: Home, label: 'Dashboard', path: '/b2b/user/dashboard' },
          ...commonItems,
          { icon: Users, label: 'Mon équipe', path: '/team' },
          { icon: Gamepad2, label: 'Challenges', path: '/gamification' },
        ];
      case 'b2b_admin':
        return [
          { icon: Home, label: 'Dashboard Admin', path: '/b2b/admin/dashboard' },
          ...commonItems,
          { icon: Users, label: 'Gestion équipes', path: '/teams' },
          { icon: BarChart3, label: 'Rapports', path: '/reports' },
          { icon: Calendar, label: 'Événements', path: '/events' },
          { icon: Settings, label: 'Administration', path: '/settings' },
        ];
      default:
        return [];
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'b2c': return User;
      case 'b2b_user': return Building2;
      case 'b2b_admin': return Shield;
      default: return User;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'b2c': return 'Particulier';
      case 'b2b_user': return 'Collaborateur';
      case 'b2b_admin': return 'Administrateur RH';
      default: return 'Non défini';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/choose-mode">Se connecter</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const navigationItems = getNavigationItems();
  const currentPath = location.pathname;

  return (
    <motion.div 
      className="fixed left-4 top-4 bottom-4 w-64 z-50"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-white/20 shadow-2xl">
        <CardContent className="p-6 h-full flex flex-col">
          {/* Header avec mode utilisateur */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EmotionsCare
              </h2>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Sélecteur de mode */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Mode actuel :</p>
              <div className="flex flex-wrap gap-1">
                {['b2c', 'b2b_user', 'b2b_admin'].map((mode) => {
                  const Icon = getModeIcon(mode);
                  const isActive = userMode === mode;
                  return (
                    <Button
                      key={mode}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleModeChange(mode)}
                      className={`flex-1 ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}`}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      <span className="text-xs">{getModeLabel(mode).split(' ')[0]}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Informations utilisateur */}
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <p className="text-sm font-medium">{user?.email}</p>
              <Badge variant="secondary" className="mt-1">
                {getModeLabel(userMode || 'b2c')}
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Link to={item.path}>
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-xs text-center text-muted-foreground">
              EmotionsCare Premium
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UnifiedNavigation;
