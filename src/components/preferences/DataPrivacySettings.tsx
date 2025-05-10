
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { motion } from 'framer-motion';

const DataPrivacySettings = () => {
  const { toast } = useToast();
  const { preferences, updatePreferences } = useUserPreferences();

  // Save settings
  const saveSettings = () => {
    toast({
      title: "Paramètres de confidentialité mis à jour",
      description: "Vos préférences de confidentialité ont été enregistrées."
    });
  };

  // Reset emotional fingerprint
  const resetEmotionalProfile = () => {
    toast({
      title: "Empreinte émotionnelle réinitialisée",
      description: "L'analyse IA recommencera à partir de zéro, mais vos données existantes sont conservées.",
      variant: "destructive"
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <h3 className="text-lg font-medium">Confidentialité des données</h3>
        <p className="text-sm text-muted-foreground">
          Contrôlez comment vos données émotionnelles sont traitées et utilisées
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium">Mode incognito</p>
            <p className="text-sm text-muted-foreground">
              Les données ne sont pas enregistrées durant la session
            </p>
          </div>
          <Switch
            checked={preferences.incognitoMode || false}
            onCheckedChange={(checked) => updatePreferences({ incognitoMode: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium">Verrouiller les journaux</p>
            <p className="text-sm text-muted-foreground">
              Protéger les entrées de journal avec un mot de passe
            </p>
          </div>
          <Switch
            checked={preferences.lockJournals || false}
            onCheckedChange={(checked) => updatePreferences({ lockJournals: checked })}
          />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-medium">Analyse IA</h3>
        
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium">Pause IA</p>
            <p className="text-sm text-muted-foreground">
              Suspendre temporairement l'analyse émotionnelle
            </p>
          </div>
          <Switch />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3 border-t pt-6"
      >
        <h3 className="text-lg font-medium">Gestion des données</h3>
        
        <div className="grid gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div>
              <p className="font-medium">Format d'exportation</p>
              <p className="text-sm text-muted-foreground">
                Choisissez le format pour télécharger vos données
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={preferences.dataExport === 'pdf' ? "default" : "outline"}
                size="sm"
                onClick={() => updatePreferences({ dataExport: 'pdf' })}
              >
                PDF
              </Button>
              <Button 
                variant={preferences.dataExport === 'json' ? "default" : "outline"}
                size="sm"
                onClick={() => updatePreferences({ dataExport: 'json' })}
              >
                JSON
              </Button>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            Télécharger mes données
          </Button>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-3 border-t pt-6"
      >
        <h3 className="text-lg font-medium">Réinitialisation de l'empreinte émotionnelle</h3>
        <p className="text-sm text-muted-foreground">
          Cette action réinitialise uniquement la façon dont l'IA vous comprend, sans supprimer vos données.
        </p>
        
        <Button 
          variant="outline" 
          className="border-destructive text-destructive hover:bg-destructive/10"
          onClick={resetEmotionalProfile}
        >
          Réinitialiser mon empreinte émotionnelle
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button onClick={saveSettings} className="w-full">
          Enregistrer les préférences
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DataPrivacySettings;
