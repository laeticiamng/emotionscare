// @ts-nocheck
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, BarChart, Settings, User, Heart, Music, 
  Camera, Activity, Zap, Star, Brain, Gamepad2,
  HelpCircle, MessageSquare 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  premium?: boolean;
}

interface SidebarProps {
  collapsed?: boolean;
}

const navigation: NavItem[] = [
  { name: 'Accueil', href: ROUTES.HOME, icon: Home },
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: BarChart },
  { name: 'Audit', href: ROUTES.AUDIT, icon: Activity },
  
  // Modules émotionnels
  { name: 'Boss Level', href: ROUTES.BOSS_LEVEL, icon: Star, premium: true },
  { name: 'Mood Mixer', href: ROUTES.MOOD_MIXER, icon: Heart },
  { name: 'Ambition Arcade', href: ROUTES.AMBITION_ARCADE, icon: Gamepad2, premium: true },
  { name: 'Flash Glow', href: ROUTES.FLASH_GLOW, icon: Zap },
  { name: 'Filtres AR', href: ROUTES.AR_FILTERS, icon: Camera, premium: true },
  { name: 'VR Galactique', href: ROUTES.VR_GALACTIC, icon: Brain, premium: true },
  
  // Analytics
  { name: 'Journal', href: ROUTES.JOURNAL, icon: MessageSquare },
  { name: 'Musicothérapie', href: ROUTES.MUSIC_THERAPY, icon: Music, premium: true },
  { name: 'Scan Émotionnel', href: ROUTES.EMOTION_SCAN, icon: Activity },
  
  // Paramètres
  { name: 'Profil', href: ROUTES.PROFILE, icon: User },
  { name: 'Paramètres', href: ROUTES.SETTINGS, icon: Settings },
  { name: 'Aide', href: ROUTES.HELP, icon: HelpCircle }
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const NavItem = ({ item, index }: { item: NavItem; index: number }) => {
    const navContent = (
      <NavLink
        to={item.href}
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent group w-full",
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        <item.icon className="h-4 w-4 flex-shrink-0" />
        
        {!collapsed && (
          <>
            <span className="flex-1">{item.name}</span>
            
            {item.premium && (
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                PRO
              </Badge>
            )}
            
            {item.badge && (
              <Badge variant="destructive" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {navContent}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <span>{item.name}</span>
            {item.premium && (
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                PRO
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <motion.div
        key={item.name}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        {navContent}
      </motion.div>
    );
  };

  return (
    <TooltipProvider>
      <div className="h-full bg-background/95 backdrop-blur-sm overflow-y-auto">
        <nav className={cn("p-4 space-y-2", collapsed && "px-2")}>
          {navigation.map((item, index) => (
            <NavItem key={item.name} item={item} index={index} />
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
