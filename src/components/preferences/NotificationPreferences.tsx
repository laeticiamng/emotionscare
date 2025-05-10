
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { motion } from 'framer-motion';

const NotificationPreferences = () => {
  const { toast } = useToast();
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Handle saving notification settings
  const saveSettings = () => {
    toast({
      title: "Paramètres des notifications mis à jour",
      description: "Vos préférences de notification ont été enregistrées avec succès."
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
        className="space-y-3"
      >
        <h3 className="text-lg font-medium">Canaux de notification</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
            </div>
            <Switch
              checked={preferences.notifications?.email || false}
              onCheckedChange={(checked) => updatePreferences({ 
                notifications: { ...preferences.notifications, email: checked } 
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications push</p>
              <p className="text-sm text-muted-foreground">Recevoir des notifications dans le navigateur</p>
            </div>
            <Switch
              checked={preferences.notifications?.push || false}
              onCheckedChange={(checked) => updatePreferences({ 
                notifications: { ...preferences.notifications, push: checked } 
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS</p>
              <p className="text-sm text-muted-foreground">Recevoir des notifications importantes par SMS</p>
            </div>
            <Switch
              checked={preferences.notifications?.sms || false}
              onCheckedChange={(checked) => updatePreferences({ 
                notifications: { ...preferences.notifications, sms: checked } 
              })}
            />
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 pt-4 border-t"
      >
        <h3 className="text-lg font-medium">Style de communication</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all ${
              preferences.notificationTone === 'minimalist' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => updatePreferences({ notificationTone: 'minimalist' })}
          >
            <div className="font-medium mb-1">Minimaliste</div>
            <p className="text-sm text-muted-foreground">Juste une icône et une indication succincte</p>
          </div>
          
          <div 
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all ${
              preferences.notificationTone === 'poetic' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => updatePreferences({ notificationTone: 'poetic' })}
          >
            <div className="font-medium mb-1">Poétique</div>
            <p className="text-sm text-muted-foreground">"Un moment de silence intérieur t'attend ici."</p>
          </div>
          
          <div 
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all ${
              preferences.notificationTone === 'directive' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => updatePreferences({ notificationTone: 'directive' })}
          >
            <div className="font-medium mb-1">Directif doux</div>
            <p className="text-sm text-muted-foreground">"C'est l'heure de ta pause."</p>
          </div>
          
          <div 
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all ${
              preferences.notificationTone === 'silent' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => updatePreferences({ notificationTone: 'silent' })}
          >
            <div className="font-medium mb-1">Silence émotionnel</div>
            <p className="text-sm text-muted-foreground">Mode "ne pas déranger" émotionnel</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 pt-4 border-t"
      >
        <h3 className="text-lg font-medium">Fréquence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all ${
              preferences.notificationFrequency === 'daily' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => updatePreferences({ notificationFrequency: 'daily' })}
          >
            <div className="font-medium mb-1">Quotidienne</div>
            <p className="text-sm text-muted-foreground">Chaque jour à l'heure que vous préférez</p>
          </div>
          
          <div 
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all ${
              preferences.notificationFrequency === 'weekly' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => updatePreferences({ notificationFrequency: 'weekly' })}
          >
            <div className="font-medium mb-1">Hebdomadaire</div>
            <p className="text-sm text-muted-foreground">En début de semaine, avec un résumé</p>
          </div>
          
          <div 
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all ${
              preferences.notificationFrequency === 'flexible' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => updatePreferences({ notificationFrequency: 'flexible' })}
          >
            <div className="font-medium mb-1">Adaptative</div>
            <p className="text-sm text-muted-foreground">En fonction de vos habitudes et besoins</p>
          </div>
          
          <div 
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all ${
              preferences.notificationFrequency === 'none' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => updatePreferences({ notificationFrequency: 'none' })}
          >
            <div className="font-medium mb-1">Aucune</div>
            <p className="text-sm text-muted-foreground">Désactiver tous les rappels récurrents</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3 pt-4 border-t"
      >
        <h3 className="text-lg font-medium">Timing</h3>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Heure de rappel préférée</label>
          <Input
            type="time"
            value={preferences.reminder_time || "09:00"}
            onChange={(e) => updatePreferences({ reminder_time: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Cette heure sera utilisée pour vos rappels quotidiens et notifications importantes
          </p>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button onClick={saveSettings} className="w-full">
          Enregistrer les préférences
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default NotificationPreferences;
