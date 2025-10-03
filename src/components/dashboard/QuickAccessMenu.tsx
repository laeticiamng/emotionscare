// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { Music, HeartPulse, LineChart, Users, Book, Scan, Video } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

const QuickAccessMenu: React.FC = () => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  const [loading, setLoading] = React.useState<string | null>(null);
  
  const handleAction = async (action: string, path?: string) => {
    setLoading(action);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (path) {
        navigate(path);
      } else {
        toast.success(`Action "${action}" exécutée avec succès`);
      }
    } catch (error) {
      logger.error(`Erreur lors de l'action ${action}:`, error);
      toast.error(`Erreur lors de l'exécution de l'action "${action}"`);
    } finally {
      setLoading(null);
    }
  };
  
  // Définir les actions disponibles en fonction du mode utilisateur
  const getMenuItems = () => {
    const baseItems = [
      {
        id: 'scan',
        label: 'Scan',
        icon: <Scan className="h-4 w-4 mr-2" />,
        path: `/${userMode}/scan`,
      },
      {
        id: 'vr',
        label: 'VR',
        icon: <Video className="h-4 w-4 mr-2" />,
        path: `/${userMode}/vr`,
      },
    ];
    
    if (userMode === 'b2c') {
      return [
        ...baseItems,
        {
          id: 'music',
          label: 'Musique',
          icon: <Music className="h-4 w-4 mr-2" />,
          action: 'Lancer la musique thérapeutique',
        },
        {
          id: 'journal',
          label: 'Journal',
          icon: <Book className="h-4 w-4 mr-2" />,
          action: 'Ouvrir le journal émotionnel',
        },
      ];
    } else if (userMode === 'b2b_user') {
      return [
        ...baseItems,
        {
          id: 'team',
          label: 'Équipe',
          icon: <Users className="h-4 w-4 mr-2" />,
          action: 'Afficher mon équipe',
        },
        {
          id: 'wellbeing',
          label: 'Bien-être',
          icon: <HeartPulse className="h-4 w-4 mr-2" />,
          action: 'Accéder aux ressources de bien-être',
        },
      ];
    } else {
      return [
        ...baseItems,
        {
          id: 'analytics',
          label: 'Analyses',
          icon: <LineChart className="h-4 w-4 mr-2" />,
          action: 'Voir les analyses',
        },
        {
          id: 'users',
          label: 'Utilisateurs',
          icon: <Users className="h-4 w-4 mr-2" />,
          action: 'Gérer les utilisateurs',
        },
      ];
    }
  };
  
  const menuItems = getMenuItems();
  
  return (
    <div className="flex flex-wrap gap-2">
      {menuItems.map(item => (
        <Button
          key={item.id}
          variant="outline"
          size="sm"
          onClick={() => item.path ? handleAction(item.id, item.path) : handleAction(item.action || item.id)}
          disabled={loading === item.id}
        >
          {item.icon}
          {loading === item.id ? 'Chargement...' : item.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickAccessMenu;
