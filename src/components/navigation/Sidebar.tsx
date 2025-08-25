import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationConfig, NavigationItem } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, X, ChevronDown, ChevronRight, 
  Heart, Crown, FlaskConical, Clock 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Composant Sidebar avec navigation hiérarchique et gestion des permissions
 */
export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set(['main', 'wellbeing']));

  // Fonction pour basculer l'expansion d'un groupe
  const toggleGroup = (category: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedGroups(newExpanded);
  };

  // Vérifier si un item est accessible
  const isAccessible = (item: NavigationItem): boolean => {
    if (!item.permissions) return true;
    const userPermissions = user?.permissions || [];
    return item.permissions.some(permission => userPermissions.includes(permission));
  };

  // Vérifier si un item est actif
  const isActive = (path: string): boolean => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Obtenir l'icône de statut pour un item
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'beta':
        return <FlaskConical className="h-3 w-3 text-blue-500" />;
      case 'coming-soon':
        return <Clock className="h-3 w-3 text-orange-500" />;
      case 'maintenance':
        return <X className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  // Regrouper les items par catégorie
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, NavigationItem[]> = {};
    
    navigationConfig.forEach(item => {
      if (isAccessible(item)) {
        if (!groups[item.category]) {
          groups[item.category] = [];
        }
        groups[item.category].push(item);
      }
    });
    
    return groups;
  }, [user]);

  // Labels pour les catégories
  const categoryLabels: Record<string, string> = {
    main: 'Principal',
    wellbeing: 'Bien-être',
    analysis: 'Analyse',
    social: 'Social',
    settings: 'Paramètres',
    admin: 'Administration'
  };

  return (
    <motion.div
      initial={{ width: collapsed ? 80 : 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="bg-card border-r border-border flex flex-col"
    >
      {/* Header avec logo et toggle */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center space-x-3"
              >
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    EmotionsCare
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Dashboard
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-2">
            {/* En-tête de catégorie */}
            {!collapsed && (
              <Button
                variant="ghost"
                onClick={() => toggleGroup(category)}
                className="w-full justify-between p-2 h-auto text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {categoryLabels[category] || category}
                {expandedGroups.has(category) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}

            {/* Items de navigation */}
            <AnimatePresence>
              {(collapsed || expandedGroups.has(category)) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  {items.map(item => (
                    <NavigationItem
                      key={item.id}
                      item={item}
                      collapsed={collapsed}
                      isActive={isActive(item.path)}
                      level={0}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Footer avec infos utilisateur */}
      {!collapsed && user && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.email}
              </p>
              <p className="text-xs text-muted-foreground">
                Connecté
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Composant pour un item de navigation individuel
 */
interface NavigationItemProps {
  item: NavigationItem;
  collapsed: boolean;
  isActive: boolean;
  level: number;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  collapsed,
  isActive,
  level
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const Icon = item.icon;
  
  const hasChildren = item.children && item.children.length > 0;
  const isDisabled = item.status === 'maintenance' || item.status === 'coming-soon';

  const handleClick = () => {
    if (hasChildren && !collapsed) {
      setExpanded(!expanded);
    }
  };

  return (
    <div>
      {/* Item principal */}
      <div className="relative">
        {hasChildren && !collapsed ? (
          <Button
            variant="ghost"
            onClick={handleClick}
            disabled={isDisabled}
            className={cn(
              "w-full justify-start p-3 h-auto",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              isActive && "bg-primary/10 text-primary font-medium",
              isDisabled && "opacity-50 cursor-not-allowed",
              level > 0 && "ml-4"
            )}
          >
            <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
            <span className="flex-1 text-left">{item.title}</span>
            <div className="flex items-center space-x-1">
              {item.metadata?.premium && (
                <Crown className="h-3 w-3 text-yellow-500" />
              )}
              {item.status !== 'active' && (
                <Badge variant="outline" className="text-xs py-0">
                  {item.status}
                </Badge>
              )}
              {expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </div>
          </Button>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive: linkActive }) =>
              cn(
                "flex items-center w-full p-3 rounded-md transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
                (linkActive || isActive) && "bg-primary/10 text-primary font-medium",
                isDisabled && "pointer-events-none opacity-50",
                level > 0 && "ml-4"
              )
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="ml-3 flex-1">{item.title}</span>
                <div className="flex items-center space-x-1">
                  {item.metadata?.premium && (
                    <Crown className="h-3 w-3 text-yellow-500" />
                  )}
                  {item.status !== 'active' && (
                    <Badge variant="outline" className="text-xs py-0">
                      {item.status}
                    </Badge>
                  )}
                </div>
              </>
            )}
          </NavLink>
        )}
      </div>

      {/* Items enfants */}
      {hasChildren && !collapsed && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-4 mt-1 space-y-1"
            >
              {item.children!.map(child => (
                <NavigationItem
                  key={child.id}
                  item={child}
                  collapsed={collapsed}
                  isActive={isActive}
                  level={level + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};