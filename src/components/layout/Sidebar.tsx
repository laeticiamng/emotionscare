
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

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  premium?: boolean;
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

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background/95 backdrop-blur-sm border-r overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NavLink
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent group",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
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
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
