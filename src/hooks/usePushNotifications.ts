
import { useState, useEffect } from 'react';
import { pushNotificationService } from '@/lib/notifications/pushNotifications';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  useEffect(() => {
    setIsSupported(pushNotificationService.isNotificationSupported());
    setPermission(pushNotificationService.getPermissionStatus());
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    const granted = await pushNotificationService.requestPermission();
    setPermission(pushNotificationService.getPermissionStatus());
    return granted;
  };

  const showNotification = async (title: string, options?: NotificationOptions) => {
    await pushNotificationService.showNotification(title, options);
  };

  const promptForPermission = () => {
    if (permission === 'default') {
      setShowPermissionDialog(true);
    }
  };

  return {
    isSupported,
    permission,
    showPermissionDialog,
    setShowPermissionDialog,
    requestPermission,
    showNotification,
    promptForPermission,
  };
};
