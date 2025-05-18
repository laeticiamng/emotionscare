
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Music, 
  MessageSquare, 
  Glasses, 
  TrendingUp, 
  Bell, 
  Calendar,
  Heart,
  UserCircle
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

const B2BUserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Show welcome toast only on first mount
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('hasShownWelcomeToast');
    
    if (!hasShownWelcome && user) {
      toast({
        title: `Bienvenue ${user.name || 'collaborateur'}`,
        description: "Votre espace professionnel EmotionsCare est prêt.",
      });
      sessionStorage.setItem('hasShownWelcomeToast', 'true');
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
      description: "À bientôt dans votre espace EmotionsCare."
    });
    
    navigate('/');
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
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Tableau de bord Collaborateur
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue dans votre espace personnel de bien-être au travail
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
                title: "Notifications consultées",
                description: "Vous êtes à jour de toutes vos notifications."
              });
            }}
            className="flex items-center gap-1 border-blue-200 dark:border-blue-800"
          >
            <Bell className="h-4 w-4 text-blue-600" />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate('/b2b/user/preferences')}
            className="flex items-center gap-1 border-blue-200 dark:border-blue-800"
          >
            <UserCircle className="h-4 w-4 text-blue-600" />
            <span className="hidden sm:inline">Profil</span>
          </Button>
          
          <Button 
            variant="default"
            size="sm"
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Déconnexion
          </Button>
        </motion.div>
      </div>

      {/* Welcome summary card */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-900/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Bonne matinée, {user?.name || 'Collaborateur'}</h2>
                <p className="text-muted-foreground mt-1">Votre journée commence bien. Comment vous sentez-vous?</p>
              </div>
              
              <Button className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-100 dark:border-blue-800"
                onClick={() => navigate('/b2b/user/scan')}
              >
                Faire un scan émotionnel
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Main features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MainFeatureCard
          title="Journal professionnel"
          description="Notez vos émotions et votre bien-être au travail"
          icon={BookOpen}
          action={() => navigate('/b2b/user/journal')}
          buttonText="Ouvrir mon journal"
          variant="primary"
        />
        
        <MainFeatureCard
          title="Musicothérapie"
          description="Prenez une pause musicale pour vous ressourcer"
          icon={Music}
          action={() => navigate('/b2b/user/music')}
          buttonText="Écouter de la musique"
          variant="secondary"
        />
        
        <MainFeatureCard
          title="Coach professionnel"
          description="Discutez avec votre coach IA pour améliorer votre bien-être"
          icon={MessageSquare}
          action={() => navigate('/b2b/user/coach')}
          buttonText="Parler à mon coach"
          variant="primary"
        />

        <MainFeatureCard
          title="Réalité virtuelle"
          description="Séances immersives de méditation et de détente"
          icon={Glasses}
          action={() => navigate('/b2b/user/vr')}
          buttonText="Explorer les sessions VR"
          variant="accent"
        />

        <MainFeatureCard
          title="Événements bien-être"
          description="Calendrier des activités et ateliers collectifs"
          icon={Calendar}
          action={() => {
            toast({
              title: "Calendrier des événements",
              description: "Cette fonctionnalité sera bientôt disponible."
            });
          }}
          buttonText="Voir le programme"
          variant="muted"
        />

        <MainFeatureCard
          title="Espace cocon"
          description="Soutien et partage entre collaborateurs"
          icon={Heart}
          action={() => navigate('/b2b/user/cocon')}
          buttonText="Rejoindre le cocon"
          variant="secondary"
        />
      </div>
      
      <motion.div variants={itemVariants} className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Votre progression
            </CardTitle>
            <CardDescription>Suivez l'évolution de votre bien-être au travail</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-12 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Graphique de progression (bientôt disponible)</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-blue-200 dark:border-blue-800/50" 
              onClick={() => navigate('/optimisation')}
            >
              Voir mes statistiques détaillées
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Footer info */}
      <motion.div variants={itemVariants} className="mt-8 p-4 bg-blue-50/50 dark:bg-slate-800/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Vous êtes connecté en tant que <strong>Collaborateur</strong> avec le compte: {user?.email || 'utilisateur@exemple.fr'}
        </p>
      </motion.div>
    </motion.div>
  );
};

// Reusable card component for main features
interface MainFeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  buttonText: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'muted';
}

const MainFeatureCard: React.FC<MainFeatureCardProps> = ({ 
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
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'secondary':
        return {
          iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          button: 'bg-indigo-600 hover:bg-indigo-700'
        };
      case 'accent':
        return {
          iconBg: 'bg-purple-100 dark:bg-purple-900/30',
          iconColor: 'text-purple-600 dark:text-purple-400',
          button: 'bg-purple-600 hover:bg-purple-700'
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

export default B2BUserDashboard;
