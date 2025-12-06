// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Brain, 
  Music, 
  BookOpen, 
  Wind, 
  Heart,
  Zap,
  Search,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  description: string;
  category: 'action' | 'tool' | 'help';
}

const quickActions: QuickAction[] = [
  // Actions principales
  { 
    id: 'scan', 
    label: 'Scanner', 
    icon: Brain, 
    href: '/scan', 
    color: 'from-blue-500 to-cyan-500',
    description: 'Analyse émotionnelle rapide',
    category: 'action'
  },
  { 
    id: 'music', 
    label: 'Musique', 
    icon: Music, 
    href: '/music', 
    color: 'from-purple-500 to-pink-500',
    description: 'Musicothérapie personnalisée',
    category: 'action'
  },
  { 
    id: 'journal', 
    label: 'Journal', 
    icon: BookOpen, 
    href: '/journal', 
    color: 'from-green-500 to-emerald-500',
    description: 'Nouvelle entrée journal',
    category: 'action'
  },
  { 
    id: 'breathwork', 
    label: 'Respiration', 
    icon: Wind, 
    href: '/breathwork', 
    color: 'from-cyan-500 to-blue-500',
    description: 'Exercice de respiration',
    category: 'action'
  },
  
  // Outils rapides
  { 
    id: 'mood-mixer', 
    label: 'Mood Mix', 
    icon: Heart, 
    href: '/mood-mixer', 
    color: 'from-rose-500 to-pink-500',
    description: 'Créer un mix d\'humeur',
    category: 'tool'
  },
  { 
    id: 'flash-glow', 
    label: 'Flash Glow', 
    icon: Zap, 
    href: '/flash-glow', 
    color: 'from-yellow-500 to-orange-500',
    description: 'Boost instantané',
    category: 'tool'
  },
  
  // Aide et paramètres
  { 
    id: 'search', 
    label: 'Recherche', 
    icon: Search, 
    href: '/search', 
    color: 'from-gray-500 to-slate-500',
    description: 'Rechercher dans la plateforme',
    category: 'help'
  },
  { 
    id: 'help', 
    label: 'Aide', 
    icon: HelpCircle, 
    href: '/help-center', 
    color: 'from-indigo-500 to-purple-500',
    description: 'Centre d\'aide et support',
    category: 'help'
  }
];

const FloatingQuickActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const getActionsByCategory = (category: 'action' | 'tool' | 'help') => {
    return quickActions.filter(action => action.category === category);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Actions menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 w-72 bg-background border rounded-2xl shadow-2xl p-4 mb-2"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-semibold text-sm">Actions Rapides</h3>
                <Button variant="ghost" size="icon" onClick={toggleMenu} className="h-6 w-6" aria-label="Fermer le menu">
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {/* Actions principales */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {getActionsByCategory('action').map((action, index) => {
                    const IconComponent = action.icon;
                    const isHovered = hoveredAction === action.id;
                    
                    return (
                      <Link
                        key={action.id}
                        to={action.href}
                        onClick={() => setIsOpen(false)}
                        onMouseEnter={() => setHoveredAction(action.id)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className="group"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            "p-3 rounded-xl border transition-all duration-200",
                            "hover:shadow-lg hover:-translate-y-1",
                            isHovered ? "border-primary/50" : "border-border"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg mb-2 flex items-center justify-center",
                            `bg-gradient-to-br ${action.color}`,
                            "group-hover:scale-110 transition-transform"
                          )}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <h4 className="font-medium text-xs mb-1">{action.label}</h4>
                          <p className="text-xs text-muted-foreground leading-tight">
                            {action.description}
                          </p>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Outils */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Outils
                </p>
                <div className="space-y-1">
                  {getActionsByCategory('tool').map((action, index) => {
                    const IconComponent = action.icon;
                    
                    return (
                      <Link
                        key={action.id}
                        to={action.href}
                        onClick={() => setIsOpen(false)}
                        className="group"
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center",
                            `bg-gradient-to-br ${action.color}`,
                            "group-hover:scale-110 transition-transform"
                          )}>
                            <IconComponent className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium">{action.label}</p>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Aide */}
              <div className="pt-2 border-t">
                <div className="space-y-1">
                  {getActionsByCategory('help').map((action, index) => {
                    const IconComponent = action.icon;
                    
                    return (
                      <Link
                        key={action.id}
                        to={action.href}
                        onClick={() => setIsOpen(false)}
                        className="group"
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center",
                            `bg-gradient-to-br ${action.color}`,
                            "group-hover:scale-110 transition-transform"
                          )}>
                            <IconComponent className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium">{action.label}</p>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton principal */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={toggleMenu}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl",
            "bg-gradient-to-br from-primary to-primary/80",
            "hover:shadow-primary/25 transition-all duration-300",
            "border-2 border-background",
            isOpen && "rotate-45"
          )}
        >
          <Plus className={cn(
            "h-6 w-6 transition-transform duration-300",
            isOpen && "rotate-45"
          )} />
        </Button>
      </motion.div>

      {/* Badge de notification */}
      <Badge 
        variant="destructive" 
        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
      >
        3
      </Badge>
    </div>
  );
};

export default FloatingQuickActions;