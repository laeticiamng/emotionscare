
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Control, Controller } from 'react-hook-form';
import { UserPreferences } from '@/types/preferences';
import { motion } from 'framer-motion';
import { Shield, Info, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

export interface DataPrivacyProps {
  className?: string;
  onToggleDataSharing?: (enabled: boolean) => void;
  onToggleAnonymizedData?: (enabled: boolean) => void;
  isDataSharingEnabled?: boolean;
  isAnonymizedDataEnabled?: boolean;
  control?: Control<UserPreferences, any>;
  isLoading?: boolean;
  onSave?: () => void;
}

const DataPrivacySettings: React.FC<DataPrivacyProps> = ({
  className = '',
  onToggleDataSharing,
  onToggleAnonymizedData,
  isDataSharingEnabled = false,
  isAnonymizedDataEnabled = true,
  control,
  isLoading = false,
  onSave,
}) => {
  const { toast } = useToast();

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handleToggle = (handler?: (enabled: boolean) => void, value?: boolean) => {
    if (handler) {
      handler(!value);
      
      // Show feedback toast
      toast({
        title: value ? "Option désactivée" : "Option activée",
        description: `La préférence a été mise à jour avec succès`,
        variant: "success",
      });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    toast({
      title: "Préférences enregistrées",
      description: "Vos paramètres de confidentialité ont été enregistrés.",
      variant: "success",
    });
  };

  // If control is provided, use react-hook-form Controller
  if (control) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <Card className={className}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Confidentialité des données
            </CardTitle>
            <CardDescription>
              Gérez la manière dont vos données sont utilisées et partagées
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <motion.div 
              className="flex items-center justify-between"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Label htmlFor="data-sharing">Partager les données d'utilisation</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 ml-2 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Nous utilisons ces données de manière anonyme pour améliorer l'application.
                          Aucune information personnelle identifiable n'est partagée.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  Nous aide à améliorer votre expérience et nos services
                </p>
              </div>
              <Controller
                name="shareData"
                control={control}
                render={({ field }) => (
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Switch
                      id="data-sharing"
                      checked={Boolean(field.value)}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        toast({
                          title: checked ? "Partage de données activé" : "Partage de données désactivé",
                          description: `Votre préférence a été mise à jour avec succès`,
                          variant: "success",
                        });
                      }}
                      disabled={isLoading}
                    />
                  </motion.div>
                )}
              />
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Label htmlFor="anonymized-data">Anonymiser les données</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 ml-2 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Lorsque cette option est activée, toutes les informations personnelles sont 
                          retirées avant traitement ou stockage.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  Protège votre identité dans les rapports et analyses
                </p>
              </div>
              <Controller
                name="anonymizedData"
                control={control}
                render={({ field }) => (
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Switch
                      id="anonymized-data"
                      checked={Boolean(field.value)}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        toast({
                          title: checked ? "Anonymisation activée" : "Anonymisation désactivée",
                          description: `Votre préférence a été mise à jour avec succès`,
                          variant: "success",
                        });
                      }}
                      disabled={isLoading}
                    />
                  </motion.div>
                )}
              />
            </motion.div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex items-center text-sm text-muted-foreground w-full">
              <Lock className="h-3 w-3 mr-1" />
              Toutes vos préférences sont protégées et peuvent être modifiées à tout moment
            </div>
          </CardFooter>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="pt-4"
          >
            <Button onClick={handleSave} className="w-full">
              Enregistrer les préférences
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    );
  }
  
  // Otherwise use the standard mode with direct props
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Confidentialité des données
          </CardTitle>
          <CardDescription>
            Gérez la manière dont vos données sont utilisées et partagées
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <motion.div 
            className="flex items-center justify-between"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Label htmlFor="data-sharing">Partager les données d'utilisation</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 ml-2 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Nous utilisons ces données de manière anonyme pour améliorer l'application.
                        Aucune information personnelle identifiable n'est partagée.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">
                Nous aide à améliorer votre expérience et nos services
              </p>
            </div>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Switch
                id="data-sharing"
                checked={isDataSharingEnabled}
                onCheckedChange={() => handleToggle(onToggleDataSharing, isDataSharingEnabled)}
                disabled={isLoading}
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-between"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Label htmlFor="anonymized-data">Anonymiser les données</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 ml-2 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Lorsque cette option est activée, toutes les informations personnelles sont 
                        retirées avant traitement ou stockage.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">
                Protège votre identité dans les rapports et analyses
              </p>
            </div>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Switch
                id="anonymized-data"
                checked={isAnonymizedDataEnabled}
                onCheckedChange={() => handleToggle(onToggleAnonymizedData, isAnonymizedDataEnabled)}
                disabled={isLoading}
              />
            </motion.div>
          </motion.div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex items-center text-sm text-muted-foreground w-full">
            <Lock className="h-3 w-3 mr-1" />
            Toutes vos préférences sont protégées et peuvent être modifiées à tout moment
          </div>
        </CardFooter>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="pt-4"
        >
          <Button onClick={handleSave} className="w-full">
            Enregistrer les préférences
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default DataPrivacySettings;
