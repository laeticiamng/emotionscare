
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  FileBarChart, 
  Calendar, 
  Bell, 
  BarChart3,
  Settings,
  ShieldAlert,
  HeartHandshake
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.4
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

const B2BAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Show welcome toast only on first mount
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('hasShownAdminWelcomeToast');
    
    if (!hasShownWelcome && user) {
      toast({
        title: `Bienvenue ${user.name || 'Administrateur'}`,
        description: "Votre espace d'administration EmotionsCare est prêt.",
      });
      sessionStorage.setItem('hasShownAdminWelcomeToast', 'true');
    }
  }, [user, toast]);

  const handleLogout = () => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    logout?.();
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt dans votre espace d'administration EmotionsCare."
    });
    
    navigate('/');
  };

  // Mock data for team summary
  const teamSummary = {
    memberCount: 24,
    averageMood: "Stable",
    alertCount: 2,
    trendDirection: "up"
  };

  return (
    <motion.div 
      className="container mx-auto p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
            Administration EmotionsCare
          </h1>
          <p className="text-muted-foreground mt-1">
            Pilotez le bien-être de vos équipes
          </p>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap gap-2"
        >
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "Alertes consultées",
                description: "Vous êtes à jour de toutes vos alertes."
              });
            }}
            className="flex items-center gap-1 border-purple-200 dark:border-purple-800"
          >
            <ShieldAlert className="h-4 w-4 text-purple-600" />
            <span className="hidden sm:inline">Alertes</span>
            {teamSummary.alertCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-600 rounded-full">
                {teamSummary.alertCount}
              </span>
            )}
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate('/b2b/admin/settings')}
            className="flex items-center gap-1 border-purple-200 dark:border-purple-800"
          >
            <Settings className="h-4 w-4 text-purple-600" />
            <span className="hidden sm:inline">Paramètres</span>
          </Button>
          
          <Button 
            variant="default"
            size="sm"
            onClick={handleLogout}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Déconnexion
          </Button>
        </motion.div>
      </div>

      {/* Team overview card */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-200 dark:border-purple-900/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Vue d'ensemble de l'équipe</h2>
                <p className="text-muted-foreground mt-1">
                  {teamSummary.memberCount} collaborateurs • Climat émotionnel: {teamSummary.averageMood}
                  {teamSummary.trendDirection === "up" ? " ↗" : teamSummary.trendDirection === "down" ? " ↘" : ""}
                </p>
              </div>
              
              <Button className="bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-100 dark:border-purple-800"
                onClick={() => navigate('/b2b/admin/teams')}
              >
                Voir les détails
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Main features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminFeatureCard
          title="Équipes"
          description="Gérer, suivre et analyser les groupes de collaborateurs"
          icon={Users}
          action={() => navigate('/b2b/admin/teams')}
          buttonText="Gérer les équipes"
          variant="primary"
        />
        
        <AdminFeatureCard
          title="Rapports"
          description="Statistiques, tendances et analyses avancées"
          icon={FileBarChart}
          action={() => navigate('/b2b/admin/reports')}
          buttonText="Consulter les rapports"
          variant="secondary"
        />
        
        <AdminFeatureCard
          title="Événements"
          description="Planifier et organiser des activités bien-être"
          icon={Calendar}
          action={() => navigate('/b2b/admin/events')}
          buttonText="Gérer les événements"
          variant="primary"
        />

        <AdminFeatureCard
          title="Journal collectif"
          description="Suivi des journaux émotionnels anonymisés"
          icon={TrendingUp}
          action={() => navigate('/b2b/admin/journal')}
          buttonText="Explorer les données"
          variant="accent"
        />

        <AdminFeatureCard
          title="Optimisation"
          description="Recommandations et améliorations suggérées"
          icon={BarChart3}
          action={() => navigate('/b2b/admin/optimisation')}
          buttonText="Découvrir les insights"
          variant="secondary"
        />

        <AdminFeatureCard
          title="Cocon social"
          description="Initiatives d'entraide et support collaboratif"
          icon={HeartHandshake}
          action={() => navigate('/b2b/admin/social-cocon')}
          buttonText="Voir les cocoons"
          variant="muted"
        />
      </div>
      
      <motion.div variants={itemVariants} className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-purple-600" />
              Alertes et notifications
            </CardTitle>
            <CardDescription>Événements nécessitant votre attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-md">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Équipe Marketing : 3 collaborateurs présentent une tendance émotionnelle négative sur 2 semaines
              </p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-md">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                L'utilisation des outils de bien-être a diminué de 20% dans l'équipe Développement
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-purple-200 dark:border-purple-800/50" 
            >
              Voir toutes les alertes
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Événements à venir
            </CardTitle>
            <CardDescription>Activités bien-être planifiées</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-md">
                <div>
                  <p className="font-medium">Atelier Gestion du stress</p>
                  <p className="text-xs text-muted-foreground">Lundi 25 Mai • 14:00 • 12 inscrits</p>
                </div>
                <Button variant="ghost" size="sm">Détails</Button>
              </li>
              <li className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-md">
                <div>
                  <p className="font-medium">Séance collective de méditation</p>
                  <p className="text-xs text-muted-foreground">Mercredi 27 Mai • 09:30 • 8 inscrits</p>
                </div>
                <Button variant="ghost" size="sm">Détails</Button>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-purple-200 dark:border-purple-800/50" 
              onClick={() => navigate('/b2b/admin/events')}
            >
              Gérer les événements
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Footer info */}
      <motion.div variants={itemVariants} className="mt-8 p-4 bg-purple-50/50 dark:bg-slate-800/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Vous êtes connecté en tant qu'<strong>Administrateur</strong> avec le compte: {user?.email || 'admin@exemple.fr'}
        </p>
      </motion.div>
    </motion.div>
  );
};

// Reusable card component for admin features
interface AdminFeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  buttonText: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'muted';
}

const AdminFeatureCard: React.FC<AdminFeatureCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  action, 
  buttonText,
  variant = 'primary' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          iconBg: 'bg-purple-100 dark:bg-purple-900/30',
          iconColor: 'text-purple-600 dark:text-purple-400',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'secondary':
        return {
          iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          button: 'bg-indigo-600 hover:bg-indigo-700'
        };
      case 'accent':
        return {
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'muted':
        return {
          iconBg: 'bg-gray-100 dark:bg-gray-800',
          iconColor: 'text-gray-600 dark:text-gray-400',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow border-opacity-50">
        <CardHeader>
          <div className="flex items-start">
            <div className={`rounded-full p-2 mr-3 ${styles.iconBg}`}>
              <Icon className={`h-5 w-5 ${styles.iconColor}`} />
            </div>
            <div>
              <CardTitle className="text-lg font-medium">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="mt-auto pt-0">
          <Button className={`w-full text-white ${styles.button}`} onClick={action}>
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default B2BAdminDashboard;
