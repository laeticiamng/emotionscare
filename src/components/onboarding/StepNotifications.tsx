import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, Clock, Heart, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface StepNotificationsProps {
  onNext: () => void;
  onBack: () => void;
}

export const StepNotifications: React.FC<StepNotificationsProps> = ({ onNext, onBack }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          toast.success('Notifications activées ✨');
          
          // Analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'onboarding.push.granted');
          }
        } else {
          toast.info('Notifications désactivées. Tu peux les activer plus tard dans les réglages.');
          
          // Analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'onboarding.push.denied');
          }
        }
      } else {
        toast.error('Les notifications ne sont pas supportées sur cet appareil.');
      }
    } catch (error) {
      console.error('Erreur demande notifications:', error);
      toast.error('Erreur lors de l\'activation des notifications.');
    }
    
    setIsRequesting(false);
  };

  const notificationTypes = [
    {
      icon: Clock,
      title: 'Rappels wellness',
      description: 'Petits rappels pour tes exercices quotidiens'
    },
    {
      icon: Heart,
      title: 'Suivi émotionnel',
      description: 'Comment tu te sens aujourd\'hui ?'
    },
    {
      icon: Zap,
      title: 'Insights personnalisés',
      description: 'Découvertes basées sur tes patterns'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <p className="text-muted-foreground">
          Reçois des rappels et insights personnalisés pour maximiser ton bien-être.
        </p>
      </div>

      <div className="grid gap-4">
        {notificationTypes.map((type, index) => {
          const Icon = type.icon;
          return (
            <Card key={index} className="border-l-4 border-l-primary/20">
              <CardContent className="flex items-center gap-4 pt-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            {notificationsEnabled ? 'Notifications activées' : 'Activer les notifications'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!notificationsEnabled ? (
            <Button 
              onClick={handleEnableNotifications}
              disabled={isRequesting}
              className="w-full"
            >
              {isRequesting ? 'Activation...' : 'Activer'}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              ✨ Parfait ! Tu recevras des notifications utiles pour ton bien-être.
            </p>
          )}
          
          <p className="text-xs text-muted-foreground">
            Tu peux modifier ces réglages à tout moment dans les paramètres.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Précédent
        </Button>
        <Button onClick={onNext}>
          {notificationsEnabled ? 'Suivant' : 'Passer'}
        </Button>
      </div>
    </div>
  );
};