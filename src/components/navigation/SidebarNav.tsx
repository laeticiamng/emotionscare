import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { NavLink } from 'react-router-dom';
import { Home, Settings, User, BarChart2, BookOpen, Calendar, MessageSquare, Users, Building, Shield, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/utils/roleUtils';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, title, badge }) => {
  return (
    <NavLink 
      to={href}
      className={({ isActive }) => cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

const SidebarNav: React.FC = () => {
  const { userMode } = useUserMode();
  const { user } = useAuth();
  
  // Convert 'personal' to 'b2c' for backwards compatibility
  const normalizedUserMode = userMode === 'personal' ? 'b2c' : userMode;
  
  // Check if user is admin
  const isAdmin = user ? isAdminRole(user.role) : false;
  
  return (
    <nav className="space-y-1 px-2 py-3">
      {normalizedUserMode === 'b2c' && (
        <>
          <NavItem href="/dashboard" icon={Home} title="Tableau de bord" />
          <NavItem href="/journal" icon={BookOpen} title="Journal émotionnel" />
          <NavItem href="/coach" icon={MessageSquare} title="Coach IA" />
          <NavItem href="/calendar" icon={Calendar} title="Calendrier" />
          <NavItem href="/profile" icon={User} title="Profil" />
          <NavItem href="/settings" icon={Settings} title="Paramètres" />
        </>
      )}
      
      {normalizedUserMode === 'b2b-user' && (
        <>
          <NavItem href="/dashboard" icon={Home} title="Tableau de bord" />
          <NavItem href="/team" icon={Users} title="Mon équipe" />
          <NavItem href="/journal" icon={BookOpen} title="Journal émotionnel" />
          <NavItem href="/coach" icon={MessageSquare} title="Coach IA" badge={2} />
          <NavItem href="/profile" icon={User} title="Profil" />
          <NavItem href="/settings" icon={Settings} title="Paramètres" />
        </>
      )}
      
      {normalizedUserMode === 'b2b-admin' && (
        <>
          <NavItem href="/admin/dashboard" icon={BarChart2} title="Dashboard" />
          <NavItem href="/admin/organization" icon={Building} title="Organisation" />
          <NavItem href="/admin/teams" icon={Users} title="Équipes" />
          <NavItem href="/admin/users" icon={User} title="Utilisateurs" />
          <NavItem href="/admin/reports" icon={BarChart2} title="Rapports" />
          <NavItem href="/admin/settings" icon={Settings} title="Paramètres" />
          {isAdmin && (
            <NavItem href="/admin/security" icon={Shield} title="Sécurité" />
          )}
        </>
      )}
      
      {normalizedUserMode === 'b2b-collaborator' && (
        <>
          <NavItem href="/dashboard" icon={Home} title="Tableau de bord" />
          <NavItem href="/team" icon={Users} title="Mon équipe" />
          <NavItem href="/journal" icon={BookOpen} title="Journal émotionnel" />
          <NavItem href="/coach" icon={MessageSquare} title="Coach IA" />
          <NavItem href="/achievements" icon={Award} title="Réalisations" />
          <NavItem href="/profile" icon={User} title="Profil" />
          <NavItem href="/settings" icon={Settings} title="Paramètres" />
        </>
      )}
    </nav>
  );
};

export default SidebarNav;
