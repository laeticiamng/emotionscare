import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Brain, 
  Heart, 
  Music, 
  Headphones, 
  Settings, 
  Users,
  BarChart3,
  MessageSquare,
  X,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  active?: boolean;
}

interface EnhancedSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  collapsed?: boolean;
  onCollapseToggle?: () => void;
  navItems?: NavItem[];
  className?: string;
}

const defaultNavItems: NavItem[] = [
  { title: 'Accueil', href: '/', icon: Home },
  { title: 'Scan émotionnel', href: '/scan', icon: Brain },
  { title: 'Respiration', href: '/breath', icon: Heart },
  { title: 'Musique', href: '/music', icon: Music },
  { title: 'VR Thérapie', href: '/vr', icon: Headphones },
  { title: 'Coach IA', href: '/coach', icon: MessageSquare, badge: 'AI' },
  { title: 'Communauté', href: '/community', icon: Users },
  { title: 'Statistiques', href: '/stats', icon: BarChart3 },
  { title: 'Paramètres', href: '/settings', icon: Settings },
];

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({
  isOpen,
  onToggle,
  collapsed = false,
  onCollapseToggle,
  navItems = defaultNavItems,
  className = ''
}) => {
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: { 
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={cn(
          'fixed left-0 top-0 h-full z-50 md:relative md:translate-x-0',
          collapsed ? 'w-16' : 'w-64',
          'transition-all duration-300',
          className
        )}
      >
        <Card className="h-full rounded-none border-r">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                {!collapsed && (
                  <motion.h2 
                    className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    EmotionsCare
                  </motion.h2>
                )}
                <div className="flex gap-1">
                  {onCollapseToggle && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onCollapseToggle}
                      className="hidden md:flex"
                      aria-label={collapsed ? "Développer le menu" : "Réduire le menu"}
                    >
                      <ChevronLeft className={cn(
                        'h-4 w-4 transition-transform',
                        collapsed && 'rotate-180'
                      )} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className="md:hidden"
                    aria-label="Fermer le menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <motion.ul className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant={item.active ? "default" : "ghost"}
                      className={cn(
                        'w-full justify-start h-10',
                        collapsed ? 'px-2' : 'px-3'
                      )}
                      asChild
                    >
                      <Link to={item.href}>
                        <item.icon className={cn(
                          'h-4 w-4',
                          collapsed ? 'mx-auto' : 'mr-2'
                        )} />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </Button>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
              <motion.div 
                className={cn(
                  'text-xs text-muted-foreground',
                  collapsed ? 'text-center' : 'text-left'
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {collapsed ? '©' : '© 2024 EmotionsCare'}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.aside>
    </>
  );
};

export default EnhancedSidebar;
