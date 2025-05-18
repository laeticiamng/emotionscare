
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Music, Scan, MessageSquare, Glasses, Trophy, Settings, HeartHandshake, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { ROUTES } from '@/types/navigation';

const B2BUserNavBar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const handleLogout = async () => {
    await logout();
    setShowConfirm(false);
    window.location.href = ROUTES.b2bUser.login;
  };
  
  return (
    <nav className="flex flex-col space-y-1 p-2 bg-background border-r h-full">
      <NavItem to={ROUTES.b2bUser.dashboard} isActive={isActive(ROUTES.b2bUser.dashboard)} icon={<Home className="h-5 w-5" />} label="Accueil" />
      <NavItem to={ROUTES.b2bUser.journal} isActive={isActive(ROUTES.b2bUser.journal)} icon={<BookOpen className="h-5 w-5" />} label="Journal" />
      <NavItem to={ROUTES.b2bUser.music} isActive={isActive(ROUTES.b2bUser.music)} icon={<Music className="h-5 w-5" />} label="Musique" />
      <NavItem to={ROUTES.b2bUser.scan} isActive={isActive(ROUTES.b2bUser.scan)} icon={<Scan className="h-5 w-5" />} label="Scan" />
      <NavItem to={ROUTES.b2bUser.coach} isActive={isActive(ROUTES.b2bUser.coach)} icon={<MessageSquare className="h-5 w-5" />} label="Coach" />
      <NavItem to={ROUTES.b2bUser.vr} isActive={isActive(ROUTES.b2bUser.vr)} icon={<Glasses className="h-5 w-5" />} label="VR" />
      <NavItem to={ROUTES.b2bUser.gamification} isActive={isActive(ROUTES.b2bUser.gamification)} icon={<Trophy className="h-5 w-5" />} label="Défis" />
      <NavItem to={ROUTES.b2bUser.cocon} isActive={isActive(ROUTES.b2bUser.cocon)} icon={<HeartHandshake className="h-5 w-5" />} label="Cocon" />
      <NavItem to={ROUTES.b2bUser.preferences} isActive={isActive(ROUTES.b2bUser.preferences)} icon={<Settings className="h-5 w-5" />} label="Paramètres" />
      <NavItem to={ROUTES.common.ethics} isActive={isActive(ROUTES.common.ethics)} icon={<ShieldCheck className="h-5 w-5" />} label="Éthique" />
      
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
