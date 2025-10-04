/**
 * AppSidebar - Navigation immersive avec sidebar moderne
 */

import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from '@/lib/routes';
import { LucideIconType } from '@/types/common';
import { 
  Heart, 
  Scan, 
  Music, 
  MessageCircle, 
  Brain, 
  Gamepad2, 
  Users, 
  BarChart3, 
  Settings, 
  Home,
  Camera,
  Headphones,
  BookOpen,
  Zap,
  Star,
  Shield,
  Sparkles
} from "lucide-react";

// Types
interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIconType;
  badge?: string;
  gradient?: string;
  description?: string;
}

interface NavigationGroup {
  label: string;
  items: NavigationItem[];
  icon?: LucideIconType;
}

export function AppSidebar() {
  const { state, open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const isCollapsed = state !== "open";

  const isActive = (path: string) => currentPath === path;

  // Navigation structure pour une expérience immersive
  const navigationGroups: NavigationGroup[] = [
    {
      label: "Dashboard",
      icon: Home,
      items: [
        {
          title: "Accueil",
          url: routes.public.home(),
          icon: Home,
          description: "Votre tableau de bord principal"
        },
        {
          title: "Dashboard B2C",
          url: routes.b2c.dashboard(),
          icon: Heart,
          gradient: "from-pink-500 to-rose-500",
          description: "Suivi personnel de votre bien-être"
        }
      ]
    },
    {
      label: "Émotions & Analyse",
      icon: Brain,
      items: [
        {
          title: "Scanner Émotions",
          url: routes.b2c.scan(),
          icon: Scan,
          badge: "IA",
          gradient: "from-blue-500 to-cyan-500",
          description: "Analysez vos émotions en temps réel"
        },
        {
          title: "Scores & vibes",
          url: routes.b2c.heatmap(),
          icon: BarChart3,
          gradient: "from-orange-500 to-red-500",
          description: "Courbes d’humeur et heatmap quotidienne"
        }
      ]
    },
    {
      label: "Thérapies Immersives",
      icon: Sparkles,
      items: [
        {
          title: "Musicothérapie",
          url: routes.b2c.music(),
          icon: Music,
          gradient: "from-purple-500 to-violet-500",
          description: "Playlists thérapeutiques personnalisées"
        },
        {
          title: "Réalité Virtuelle",
          url: routes.b2c.vr(),
          icon: Camera,
          badge: "VR",
          gradient: "from-green-500 to-emerald-500",
          description: "Expériences immersives de relaxation"
        },
        {
          title: "Flash Glow",
          url: routes.b2c.flashGlow(),
          icon: Zap,
          badge: "Nouveau",
          gradient: "from-yellow-500 to-orange-500",
          description: "Boost instantané de bien-être"
        }
      ]
    },
    {
      label: "Coaching & Développement",
      icon: Brain,
      items: [
        {
          title: "Coach IA",
          url: routes.b2c.coach(),
          icon: MessageCircle,
          badge: "24/7",
          gradient: "from-indigo-500 to-purple-500",
          description: "Assistant IA pour votre développement"
        },
        {
          title: "Journal Privé",
          url: routes.b2c.journal(),
          icon: BookOpen,
          gradient: "from-slate-500 to-gray-500",
          description: "Réflexions et suivi personnel"
        }
      ]
    },
    {
      label: "Gamification",
      icon: Gamepad2,
      items: [
        {
          title: "Espace Gamification",
          url: routes.b2c.bossLevel(),
          icon: Star,
          badge: "XP",
          gradient: "from-amber-500 to-yellow-500",
          description: "Défis et récompenses"
        },
        {
          title: "Boss Grit",
          url: routes.b2c.bossLevel(),
          icon: Shield,
          description: "Défiez-vous avec nos boss levels"
        },
        {
          title: "Mood Mixer",
          url: routes.b2c.moodMixer(),
          icon: Headphones,
          description: "Créez vos ambiances émotionnelles"
        }
      ]
    },
    {
      label: "Social & Communauté",
      icon: Users,
      items: [
        {
          title: "Cocon Social",
          url: routes.b2c.community(),
          icon: Users,
          gradient: "from-teal-500 to-cyan-500",
          description: "Connectez-vous avec la communauté"
        }
      ]
    },
    {
      label: "Paramètres",
      icon: Settings,
      items: [
        {
          title: "Préférences",
          url: routes.b2c.settings(),
          icon: Settings,
          description: "Personnalisez votre expérience"
        }
      ]
    }
  ];

  const getNavClassName = (isActive: boolean) =>
    isActive 
      ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-md border border-primary/20" 
      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      className={`${isCollapsed ? "w-16" : "w-80"} transition-all duration-300 border-r-0 shadow-xl bg-card/95 backdrop-blur-lg`}
      collapsible="icon"
    >
      <SidebarContent className="p-4 space-y-6">
        {/* User Profile Section */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
                  👤
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  Utilisateur
                </p>
                <p className="text-xs text-muted-foreground">
                  Niveau Explorateur
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs">
                Pro
              </Badge>
            </div>
          </motion.div>
        )}

        {/* Navigation Groups */}
        {navigationGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label}>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
                {group.icon && <group.icon className="w-4 h-4 mr-2" />}
                {group.label}
              </SidebarGroupLabel>
            )}

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  const isItemActive = isActive(item.url);
                  const itemKey = `${group.label}-${item.title}`;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (groupIndex * 0.1) + (itemIndex * 0.05) }}
                        onHoverStart={() => setHoveredItem(itemKey)}
                        onHoverEnd={() => setHoveredItem(null)}
                      >
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={item.url} 
                            className={`group relative flex items-center rounded-xl px-3 py-3 transition-all duration-300 ${getNavClassName(isItemActive)}`}
                          >
                            {/* Icon avec gradient si défini */}
                            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg ${
                              item.gradient 
                                ? `bg-gradient-to-r ${item.gradient} text-primary-foreground shadow-lg` 
                                : isItemActive 
                                  ? "bg-primary/10 text-primary" 
                                  : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                            }`}>
                              <item.icon className="w-4 h-4" />
                            </div>

                            {/* Titre et description */}
                            <AnimatePresence>
                              {!isCollapsed && (
                                <motion.div
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: "auto" }}
                                  exit={{ opacity: 0, width: 0 }}
                                  className="flex-1 ml-3 min-w-0"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium truncate">{item.title}</span>
                                    {item.badge && (
                                      <Badge variant="secondary" className="ml-2 text-xs bg-primary/10 text-primary">
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  {hoveredItem === itemKey && item.description && (
                                    <motion.p
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="text-xs text-muted-foreground mt-1 leading-tight"
                                    >
                                      {item.description}
                                    </motion.p>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Indicateur actif */}
                            {isItemActive && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-l-full"
                              />
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </motion.div>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Quick Actions (mode non-collapsed) */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-muted/50 to-primary/5 rounded-2xl p-4 border border-border"
          >
            <h4 className="text-sm font-semibold text-foreground mb-3">Actions Rapides</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                <Zap className="w-4 h-4 mr-2" />
                Scan Express
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                <Heart className="w-4 h-4 mr-2" />
                SOS Bien-être
              </Button>
            </div>
          </motion.div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}