
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, FileBarChart, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const B2BAdminNavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <nav className="flex flex-col space-y-1 p-2 bg-slate-800 text-white border-r h-full">
      <NavItem to="/b2b/admin/dashboard" isActive={isActive('/b2b/admin/dashboard')} icon={<LayoutDashboard className="h-5 w-5" />} label="Tableau de bord" />
      <NavItem to="/b2b/admin/teams" isActive={isActive('/b2b/admin/teams')} icon={<Users className="h-5 w-5" />} label="Équipes" />
      <NavItem to="/b2b/admin/reports" isActive={isActive('/b2b/admin/reports')} icon={<FileBarChart className="h-5 w-5" />} label="Rapports" />
      <NavItem to="/b2b/admin/events" isActive={isActive('/b2b/admin/events')} icon={<Calendar className="h-5 w-5" />} label="Événements" />
      <NavItem to="/b2b/admin/settings" isActive={isActive('/b2b/admin/settings')} icon={<Settings className="h-5 w-5" />} label="Paramètres" />
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
