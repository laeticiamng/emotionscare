
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Music, Scan, MessageCircle, Glasses, Trophy, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const B2BUserNavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
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
