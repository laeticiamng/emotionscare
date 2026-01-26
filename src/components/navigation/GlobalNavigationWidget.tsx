// @ts-nocheck
/**
 * GlobalNavigationWidget - Widget de navigation globale pour HomePage
 * Accès rapide à toutes les fonctionnalités depuis l'accueil
 */

// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Heart, Music, Gamepad2, Users, BarChart3, Zap, Shield, Grid3X3, ArrowRight, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
  badge?: string;
}

const GlobalNavigationWidget: React.FC = () => {
  const quickActions: QuickAction[] = [
    {
      title: 'Dashboard',
      description: 'Centre de contrôle principal',
      icon: Grid3X3,
      path: routes.b2c.dashboard(),
      color: 'from-blue-500 to-purple-500',
      badge: 'Principal'
    },
    {
      title: 'Scan Émotionnel',
      description: 'Analyse IA instantanée',
      icon: Brain,
      path: routes.b2c.scan(),
      color: 'from-purple-500 to-pink-500',
      badge: 'IA'
    },
    {
      title: 'Coach Personnel',
      description: 'Assistant empathique 24/7',
      icon: Sparkles,
      path: routes.b2c.coach(),
      color: 'from-pink-500 to-red-500',
      badge: 'Premium'
    },
    {
      title: 'Thérapie Musicale',
      description: 'Playlists adaptatives',
      icon: Music,
      path: routes.b2c.music(),
      color: 'from-green-500 to-teal-500',
      badge: 'Audio'
    },
    {
      title: 'Jeux Thérapeutiques',
      description: 'Fun-First experiences',
      icon: Gamepad2,
      path: routes.b2c.bubbleBeat(),
      color: 'from-orange-500 to-amber-500',
      badge: 'Fun'
    },
    {
      title: 'Communauté',
      description: 'Partage et entraide',
      icon: Users,
      path: routes.b2c.community(),
      color: 'from-cyan-500 to-blue-500',
      badge: 'Social'
    },
    {
      title: 'Analytics',
      description: 'Suivi de progression',
      icon: BarChart3,
      path: routes.b2c.activity(),
      color: 'from-indigo-500 to-purple-500',
      badge: 'Data'
    },
    {
      title: 'Navigation Complète',
      description: 'Toutes les fonctionnalités',
      icon: Grid3X3,
      path: '/navigation',
      color: 'from-gray-600 to-gray-800',
      badge: 'Complet'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-white via-blue-50 to-purple-50 border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Accès Rapide aux Fonctionnalités
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Explorez toutes les possibilités d'EmotionsCare
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to={action.path}>
                      <Card className="h-full cursor-pointer group transition-all duration-300 hover:shadow-lg bg-white/80 backdrop-blur-sm border-2 hover:border-primary/30">
                        <CardContent className="p-4 text-center">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <h3 className="font-semibold text-sm text-gray-800 group-hover:text-primary transition-colors">
                                {action.title}
                              </h3>
                              {action.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {action.badge}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-xs text-muted-foreground leading-tight">
                              {action.description}
                            </p>
                          </div>
                          
                          <ArrowRight className="h-4 w-4 mx-auto mt-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Actions supplémentaires */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Link to={routes.auth.login()}>
                    <Heart className="w-5 h-5 mr-2" />
                    Commencer Votre Parcours
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="outline" size="lg" className="border-2">
                  <Link to="/demo">
                    <Zap className="w-5 h-5 mr-2" />
                    Voir la Démo
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="ghost" size="lg">
                  <Link to={routes.b2b.home()}>
                    <Shield className="w-5 h-5 mr-2" />
                    Solutions Entreprise
                  </Link>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default GlobalNavigationWidget;