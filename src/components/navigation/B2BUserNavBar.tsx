
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Music, Scan, MessageCircle, Glasses, Trophy, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmationModal from '@/components/ui/confirmation-modal';

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
    window.location.href = '/b2b/user/login';
  };
  
  return (
    <nav className="flex flex-col space-y-1 p-2 bg-background border-r h-full">
      <NavItem to="/b2b/user/dashboard" isActive={isActive('/b2b/user/dashboard')} icon={<Home className="h-5 w-5" />} label="Accueil" />
      <NavItem to="/b2b/user/journal" isActive={isActive('/b2b/user/journal')} icon={<BookOpen className="h-5 w-5" />} label="Journal" />
      <NavItem to="/b2b/user/music" isActive={isActive('/b2b/user/music')} icon={<Music className="h-5 w-5" />} label="Musique" />
      <NavItem to="/b2b/user/scan" isActive={isActive('/b2b/user/scan')} icon={<Scan className="h-5 w-5" />} label="Scan" />
      <NavItem to="/b2b/user/coach" isActive={isActive('/b2b/user/coach')} icon={<MessageCircle className="h-5 w-5" />} label="Coach" />
      <NavItem to="/b2b/user/vr" isActive={isActive('/b2b/user/vr')} icon={<Glasses className="h-5 w-5" />} label="VR" />
      <NavItem to="/b2b/user/gamification" isActive={isActive('/b2b/user/gamification')} icon={<Trophy className="h-5 w-5" />} label="Défis" />
      <NavItem to="/b2b/user/preferences" isActive={isActive('/b2b/user/preferences')} icon={<Settings className="h-5 w-5" />} label="Paramètres" />
      
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
