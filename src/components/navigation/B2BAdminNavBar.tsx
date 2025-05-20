
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileBarChart, Calendar, Settings, BookOpen, Scan, Music, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { ROUTES } from '@/types/navigation';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BAdminNavBar: React.FC = () => {
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
    window.location.href = ROUTES.b2bAdmin.login;
  };
  
  return (
    <nav className="flex flex-col space-y-1 p-2 bg-slate-800 text-white border-r h-full">
      <NavItem to={ROUTES.b2bAdmin.dashboard} isActive={isActive(ROUTES.b2bAdmin.dashboard)} icon={<LayoutDashboard className="h-5 w-5" />} label="Tableau de bord" />
      <NavItem to={ROUTES.b2bAdmin.journal} isActive={isActive(ROUTES.b2bAdmin.journal)} icon={<BookOpen className="h-5 w-5" />} label="Journal" />
      <NavItem to={ROUTES.b2bAdmin.scan} isActive={isActive(ROUTES.b2bAdmin.scan)} icon={<Scan className="h-5 w-5" />} label="Scan" />
      <NavItem to={ROUTES.b2bAdmin.music} isActive={isActive(ROUTES.b2bAdmin.music)} icon={<Music className="h-5 w-5" />} label="Musique" />
      <NavItem to={ROUTES.b2bAdmin.teams} isActive={isActive(ROUTES.b2bAdmin.teams)} icon={<Users className="h-5 w-5" />} label="Équipes" />
      <NavItem to={ROUTES.b2bAdmin.reports} isActive={isActive(ROUTES.b2bAdmin.reports)} icon={<FileBarChart className="h-5 w-5" />} label="Rapports" />
      <NavItem to={ROUTES.b2bAdmin.events} isActive={isActive(ROUTES.b2bAdmin.events)} icon={<Calendar className="h-5 w-5" />} label="Événements" />
      <NavItem to="/extensions" isActive={isActive('/extensions')} icon={<Box className="h-5 w-5" />} label="Extensions" />
      <NavItem to={ROUTES.b2bAdmin.optimisation} isActive={isActive(ROUTES.b2bAdmin.optimisation)} icon={<FileBarChart className="h-5 w-5" />} label="Optimisation" />
      <NavItem to={ROUTES.b2bAdmin.settings} isActive={isActive(ROUTES.b2bAdmin.settings)} icon={<Settings className="h-5 w-5" />} label="Paramètres" />
      
      <button 
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-900/30 transition-all mt-auto"
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
          ? "bg-purple-700 text-white" 
          : "text-slate-300 hover:bg-slate-700 hover:text-white"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default B2BAdminNavBar;
