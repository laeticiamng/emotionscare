
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebar } from './SidebarContext';
import {
  Home,
  BarChart2,
  Calendar,
  Settings,
  MessageSquare,
  Music,
  Book,
  Award,
  HeartPulse,
  FileText,
  Headphones,
  Smile
} from 'lucide-react';

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  isActive,
  onClick
}) => {
  return (
    <Link to={href} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-2 text-muted-foreground",
          isActive && "bg-muted font-medium text-foreground"
        )}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isOpen, setIsOpen } = useSidebar();
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, setIsOpen]);
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <div className={cn(
      "border-r bg-background w-[250px] h-screen overflow-hidden",
      "fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300",
      !isOpen && "-translate-x-full lg:translate-x-0"
    )}>
      <div className="flex flex-col h-full">
        <div className="px-4 py-4 border-b">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <HeartPulse className="w-5 h-5 text-primary" />
            <span>EmotionsCare</span>
          </Link>
        </div>
        
        <ScrollArea className="flex-1 py-3">
          <div className="flex flex-col gap-1 px-2">
            <SidebarItem
              href="/"
              icon={<Home size={18} />}
              label="Tableau de bord"
              isActive={isActive('/')}
              onClick={() => setIsOpen(false)}
            />
            
            <SidebarItem
              href="/scan"
              icon={<Smile size={18} />}
              label="Scan émotionnel"
              isActive={isActive('/scan')}
              onClick={() => setIsOpen(false)}
            />
            
            <SidebarItem
              href="/journal"
              icon={<Book size={18} />}
              label="Journal"
              isActive={isActive('/journal')}
              onClick={() => setIsOpen(false)}
            />
            
            <SidebarItem
              href="/music"
              icon={<Music size={18} />}
              label="Musicothérapie"
              isActive={isActive('/music')}
              onClick={() => setIsOpen(false)}
            />
            
            <SidebarItem
              href="/coach"
              icon={<MessageSquare size={18} />}
              label="Coach IA"
              isActive={isActive('/coach')}
              onClick={() => setIsOpen(false)}
            />
            
            <SidebarItem
              href="/gamification"
              icon={<Award size={18} />}
              label="Gamification"
              isActive={isActive('/gamification')}
              onClick={() => setIsOpen(false)}
            />
            
            <SidebarItem
              href="/reports"
              icon={<BarChart2 size={18} />}
              label="Rapports"
              isActive={isActive('/reports')}
              onClick={() => setIsOpen(false)}
            />
            
            <SidebarItem
              href="/sessions"
              icon={<Calendar size={18} />}
              label="Sessions"
              isActive={isActive('/sessions')}
              onClick={() => setIsOpen(false)}
            />
            
            <SidebarItem
              href="/audio"
              icon={<Headphones size={18} />}
              label="Audio"
              isActive={isActive('/audio')}
              onClick={() => setIsOpen(false)}
            />
            
            <SidebarItem
              href="/documents"
              icon={<FileText size={18} />}
              label="Documents"
              isActive={isActive('/documents')}
              onClick={() => setIsOpen(false)}
            />
            
            <SidebarItem
              href="/settings"
              icon={<Settings size={18} />}
              label="Paramètres"
              isActive={isActive('/settings')}
              onClick={() => setIsOpen(false)}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;
