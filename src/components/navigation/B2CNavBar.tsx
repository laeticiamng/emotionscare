
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Music, Scan, MessageCircle, Glasses, Trophy, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const B2CNavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <nav className="flex flex-col space-y-1 p-2 bg-background border-r h-full">
      <NavItem to="/b2c/dashboard" isActive={isActive('/b2c/dashboard')} icon={<Home className="h-5 w-5" />} label="Accueil" />
      <NavItem to="/b2c/journal" isActive={isActive('/b2c/journal')} icon={<BookOpen className="h-5 w-5" />} label="Journal" />
      <NavItem to="/b2c/music" isActive={isActive('/b2c/music')} icon={<Music className="h-5 w-5" />} label="Musique" />
      <NavItem to="/b2c/scan" isActive={isActive('/b2c/scan')} icon={<Scan className="h-5 w-5" />} label="Scan" />
      <NavItem to="/b2c/coach" isActive={isActive('/b2c/coach')} icon={<MessageCircle className="h-5 w-5" />} label="Coach" />
      <NavItem to="/b2c/vr" isActive={isActive('/b2c/vr')} icon={<Glasses className="h-5 w-5" />} label="VR" />
      <NavItem to="/b2c/gamification" isActive={isActive('/b2c/gamification')} icon={<Trophy className="h-5 w-5" />} label="Défis" />
      <NavItem to="/b2c/preferences" isActive={isActive('/b2c/preferences')} icon={<Settings className="h-5 w-5" />} label="Paramètres" />
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
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default B2CNavBar;
