
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { NotificationFrequency, NotificationType, NotificationTone } from '@/types/notification';

const NotificationPreferences = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  // Default preferences if user has none
  const defaultPreferences = {
    type: 'all' as NotificationType,
    frequency: 'immediate' as NotificationFrequency,
    tone: 'supportive' as NotificationTone,
    emailEnabled: true,
    pushEnabled: true,
    soundEnabled: true
  };
  
  // Get existing preferences or use defaults
  const userNotifPrefs = user?.preferences?.notifications || {};
  
  // State for the form
  const [preferences, setPreferences] = useState({
    ...defaultPreferences,
    ...userNotifPrefs
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Update user preferences
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          notifications: preferences
        }
      };
      
      await updateUser(updatedUser);
      
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences de notification ont été enregistrées."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
        <CardDescription>Configurez comment et quand vous souhaitez être notifié</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Types de notifications</h3>
              <RadioGroup 
                value={preferences.type} 
                onValueChange={(value) => setPreferences({...preferences, type: value as NotificationType})}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">Toutes les notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="important" id="important" />
                  <Label htmlFor="important">Uniquement les notifications importantes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">Aucune notification</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Fréquence des notifications</h3>
              <Select 
                value={preferences.frequency} 
                onValueChange={(value) => setPreferences({...preferences, frequency: value as NotificationFrequency})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immédiatement</SelectItem>
                  <SelectItem value="daily">Résumé quotidien</SelectItem>
                  <SelectItem value="weekly">Résumé hebdomadaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Ton des notifications</h3>
              <Select 
                value={preferences.tone} 
                onValueChange={(value) => setPreferences({...preferences, tone: value as NotificationTone})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un ton" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professionnel</SelectItem>
                  <SelectItem value="casual">Décontracté</SelectItem>
                  <SelectItem value="supportive">Bienveillant</SelectItem>
                  <SelectItem value="minimal">Minimaliste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-medium mb-3">Canaux de notification</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Notifications par email</Label>
                <Switch 
                  id="email-notifications" 
                  checked={preferences.emailEnabled}
                  onCheckedChange={(checked) => setPreferences({...preferences, emailEnabled: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Notifications push</Label>
                <Switch 
                  id="push-notifications" 
                  checked={preferences.pushEnabled}
                  onCheckedChange={(checked) => setPreferences({...preferences, pushEnabled: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-notifications">Sons de notification</Label>
                <Switch 
                  id="sound-notifications" 
                  checked={preferences.soundEnabled}
                  onCheckedChange={(checked) => setPreferences({...preferences, soundEnabled: checked})}
                />
              </div>
            </div>
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer les préférences"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
