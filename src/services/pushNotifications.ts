
export const usePushNotifications = () => {
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Push notification permission:', permission);
      return permission === 'granted';
    }
    return false;
  };

  return {
    requestPermission,
  };
};
