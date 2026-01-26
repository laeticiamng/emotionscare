import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import EnhancedHeader from './enhanced-header';
import EnhancedFooter from './enhanced-footer';
import CommandMenu from './command-menu';
import NotificationToast from './notification-toast';
import { FloatingActionButton } from './enhanced-user-experience';
import { Download, Share2, Settings, HelpCircle } from 'lucide-react';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

const EnhancedShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [notifications, setNotifications] = React.useState<ToastNotification[]>([]);
  
  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const addNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // Floating Actions Configuration
  const floatingActions = [
    {
      icon: Download,
      label: 'Télécharger',
      onClick: () => addNotification({ type: 'info', title: 'Téléchargement', message: 'Fonctionnalité à venir' })
    },
    {
      icon: Share2,
      label: 'Partager',
      onClick: () => addNotification({ type: 'success', title: 'Partagé', message: 'Lien copié dans le presse-papier' })
    },
    {
      icon: Settings,
      label: 'Paramètres',
      onClick: () => window.location.href = '/preferences'
    },
    {
      icon: HelpCircle,
      label: 'Aide',
      onClick: () => addNotification({ type: 'info', title: 'Aide', message: 'Centre d\'aide ouvert' })
    }
  ];
  
  // Exemple d'ajout de notification au montage
  React.useEffect(() => {
    setTimeout(() => {
      addNotification({
        type: 'success',
        title: 'Bienvenue !',
        message: 'Interface utilisateur premium activée',
        duration: 3000
      });
    }, 1000);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <EnhancedHeader 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showProgress={true}
        scrollProgress={scrollProgress}
      />
      
      <motion.main 
        className="flex-1 pt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <CommandMenu />
          </div>
          <Outlet />
        </div>
      </motion.main>
      
      <EnhancedFooter />
      
      <NotificationToast 
        notifications={notifications}
        onRemove={removeNotification}
      />
      
      <FloatingActionButton actions={floatingActions} />
    </div>
  );
};

export default EnhancedShell;
