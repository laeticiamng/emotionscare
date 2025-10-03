
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Music, Scan, MessageSquare, Glasses, Trophy, Settings, HeartHandshake, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { routes } from '@/routerV2';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BUserNavBar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { clearUserMode } = useUserMode();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const handleLogout = async () => {
    await logout();
    clearUserMode();
    setShowConfirm(false);
    window.location.href = routes.employee.login();
  };
  
  return (
    <nav className="flex flex-col space-y-1 p-2 bg-background border-r h-full">
      <NavItem to={routes.employee.dashboard()} isActive={isActive(routes.employee.dashboard())} icon={<Home className="h-5 w-5" />} label="Accueil" />
      <NavItem to={routes.employee.journal()} isActive={isActive(routes.employee.journal())} icon={<BookOpen className="h-5 w-5" />} label="Journal" />
      <NavItem to={routes.employee.music()} isActive={isActive(routes.employee.music())} icon={<Music className="h-5 w-5" />} label="Musique" />
      <NavItem to={routes.employee.scan()} isActive={isActive(routes.employee.scan())} icon={<Scan className="h-5 w-5" />} label="Scan" />
      <NavItem to={routes.employee.coach()} isActive={isActive(routes.employee.coach())} icon={<MessageSquare className="h-5 w-5" />} label="Coach" />
      <NavItem to={routes.employee.vr()} isActive={isActive(routes.employee.vr())} icon={<Glasses className="h-5 w-5" />} label="VR" />
      <NavItem to={routes.employee.gamification()} isActive={isActive(routes.employee.gamification())} icon={<Trophy className="h-5 w-5" />} label="Défis" />
      <NavItem to={routes.employee.socialCocon()} isActive={isActive(routes.employee.socialCocon())} icon={<HeartHandshake className="h-5 w-5" />} label="Cocon" />
      <NavItem to={routes.employee.preferences()} isActive={isActive(routes.employee.preferences())} icon={<Box className="h-5 w-5" />} label="Extensions" />
      <NavItem to={routes.employee.preferences()} isActive={isActive(routes.employee.preferences())} icon={<Settings className="h-5 w-5" />} label="Paramètres" />
      
      <button 
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all mt-auto"
      >
        Déconnexion
      </button>
      
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Oui"
        cancelText="Annuler"
      />
    </nav>
  );
};

interface NavItemProps {
  to: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, isActive, icon, label }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive 
          ? "bg-blue-600 text-white" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default B2BUserNavBar;
