
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { pushNotificationService } from '@/lib/notifications/pushNotifications';

interface NotificationPermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted?: () => void;
}

const NotificationPermissionDialog: React.FC<NotificationPermissionDialogProps> = ({
  isOpen,
  onClose,
  onPermissionGranted,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const granted = await pushNotificationService.requestPermission();
      if (granted && onPermissionGranted) {
        onPermissionGranted();
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Activer les notifications
          </DialogTitle>
          <DialogDescription>
            Autorisez les notifications pour recevoir des alertes importantes, 
            des rappels et des mises à jour sur votre bien-être émotionnel.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-4 py-4">
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">Notifications push</h4>
            <p className="text-sm text-muted-foreground">
              Recevez des notifications même quand l'application est fermée
            </p>
          </div>
          <Bell className="h-8 w-8 text-primary" />
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <BellOff className="h-4 w-4" />
            Plus tard
          </Button>
          <Button
            onClick={handleRequestPermission}
            disabled={isRequesting}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            {isRequesting ? 'Activation...' : 'Activer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPermissionDialog;
