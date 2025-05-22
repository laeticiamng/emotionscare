
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath, getUserModeLabel } from '@/utils/userModeHelpers';
import { toast } from 'sonner';

const ModeSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { userMode, changeUserMode } = useUserMode();

  const modes = [
    {
      id: 'b2c',
      title: 'Particulier',
      description: 'Accès aux fonctionnalités personnelles pour votre bien-être émotionnel',
      icon: <User className="h-6 w-6" />,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300'
    },
    {
      id: 'b2b_user',
      title: 'Collaborateur',
      description: 'Accès aux fonctionnalités d\'équipe et aux outils collaboratifs',
      icon: <Building2 className="h-6 w-6" />,
      color: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-300'
    },
    {
      id: 'b2b_admin',
      title: 'Administrateur',
      description: 'Gestion complète de l\'organisation et des utilisateurs',
      icon: <ShieldCheck className="h-6 w-6" />,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300'
    }
  ];

  const handleModeSelect = (mode: string) => {
    changeUserMode(mode as any);
    
    toast.success(`Mode ${getUserModeLabel(mode as any)} activé`, {
      description: "Redirection vers le tableau de bord..."
    });
    
    // Redirection vers le tableau de bord correspondant
    setTimeout(() => {
      navigate(getModeDashboardPath(mode as any));
    }, 1000);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold mb-4">Changer de mode</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Sélectionnez le mode d'accès qui correspond à votre utilisation d'EmotionsCare
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {modes.map((mode, index) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={cn(
              "h-full overflow-hidden hover:shadow-md transition-shadow",
              userMode === mode.id && "ring-2 ring-primary"
            )}>
              <CardHeader className={cn("flex flex-row items-center gap-4", mode.color)}>
                <div className="p-2 rounded-full bg-background/80 backdrop-blur">
                  {mode.icon}
                </div>
                <div>
                  <CardTitle>{mode.title}</CardTitle>
                  {userMode === mode.id && (
                    <span className="text-xs font-medium">Mode actuel</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription className="text-base min-h-[60px]">
                  {mode.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleModeSelect(mode.id)}
                  variant={userMode === mode.id ? "default" : "outline"}
                  className="w-full"
                >
                  {userMode === mode.id ? 'Mode actif' : 'Sélectionner'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-10 text-center"
      >
        <Button 
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          Retour à la page précédente
        </Button>
      </motion.div>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default ModeSwitcher;
