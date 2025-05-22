
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Home, BookOpen, Music, Headphones, Video, Settings, User, MessageCircle,
  Heart, Eye, LineChart, Layout, Trophy, Glasses, Users, FileText, Bell
} from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';

interface MenuSection {
  title: string;
  description: string;
  items: MenuItem[];
}

interface MenuItem {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  requiresAuth?: boolean;
  b2cOnly?: boolean;
  b2bOnly?: boolean;
}

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  const { isAuthenticated } = useAuth();

  const menuSections: MenuSection[] = [
    {
      title: "Fonctionnalités principales",
      description: "Accédez aux fonctionnalités essentielles de l'application",
      items: [
        {
          title: "Accueil",
          description: "Retour à la page d'accueil",
          icon: Home,
          path: "/"
        },
        {
          title: "Tableau de bord",
          description: "Votre tableau de bord personnalisé",
          icon: Layout,
          path: "/dashboard",
          requiresAuth: true
        },
        {
          title: "Scan émotionnel",
          description: "Analysez votre état émotionnel actuel",
          icon: Eye,
          path: "/scan",
          requiresAuth: true
        },
        {
          title: "Journal",
          description: "Gérez votre journal émotionnel",
          icon: BookOpen,
          path: "/journal",
          requiresAuth: true
        },
        {
          title: "Coach IA",
          description: "Interagissez avec votre coach personnel",
          icon: MessageCircle,
          path: "/coach",
          requiresAuth: true
        }
      ]
    },
    {
      title: "Thérapies et bien-être",
      description: "Découvrez nos outils thérapeutiques",
      items: [
        {
          title: "Musicothérapie",
          description: "Explorez les bienfaits de la musique",
          icon: Music,
          path: "/music",
          requiresAuth: true
        },
        {
          title: "Audiothérapie",
          description: "Écoutez des sessions guidées",
          icon: Headphones,
          path: "/audio",
          requiresAuth: true
        },
        {
          title: "Vidéothérapie",
          description: "Visionnez des contenus thérapeutiques",
          icon: Video,
          path: "/video",
          requiresAuth: true
        },
        {
          title: "Réalité virtuelle",
          description: "Immersion en réalité virtuelle",
          icon: Glasses,
          path: "/vr",
          requiresAuth: true
        },
        {
          title: "Social Cocoon",
          description: "Connectez-vous avec la communauté",
          icon: Heart,
          path: "/social",
          requiresAuth: true
        }
      ]
    },
    {
      title: "Profil et paramètres",
      description: "Gérez votre compte et vos préférences",
      items: [
        {
          title: "Profil",
          description: "Consultez et modifiez votre profil",
          icon: User,
          path: "/profile",
          requiresAuth: true
        },
        {
          title: "Préférences",
          description: "Personnalisez votre expérience",
          icon: Settings,
          path: "/preferences",
          requiresAuth: true
        },
        {
          title: "Notifications",
          description: "Gérez vos alertes et notifications",
          icon: Bell,
          path: "/notifications",
          requiresAuth: true
        },
        {
          title: "Progression",
          description: "Visualisez votre parcours et vos statistiques",
          icon: LineChart,
          path: "/progress",
          requiresAuth: true
        },
        {
          title: "Gamification",
          description: "Découvrez vos défis et récompenses",
          icon: Trophy,
          path: "/gamification",
          requiresAuth: true
        }
      ]
    },
    {
      title: "B2B et entreprise",
      description: "Fonctionnalités pour les entreprises",
      items: [
        {
          title: "Équipes",
          description: "Gérez votre équipe",
          icon: Users,
          path: "/teams",
          requiresAuth: true,
          b2bOnly: true
        },
        {
          title: "Événements",
          description: "Planifiez des sessions bien-être collectives",
          icon: FileText,
          path: "/events",
          requiresAuth: true,
          b2bOnly: true
        }
      ]
    }
  ];

  // Filtrer les éléments du menu en fonction de l'authentification et du mode utilisateur
  const filterMenuItems = (items: MenuItem[]) => {
    return items.filter(item => {
      if (item.requiresAuth && !isAuthenticated) return false;
      if (item.b2cOnly && (userMode === 'b2b_user' || userMode === 'b2b_admin')) return false;
      if (item.b2bOnly && userMode !== 'b2b_user' && userMode !== 'b2b_admin') return false;
      return true;
    });
  };

  return (
    <Shell>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Menu principal</h1>
        <p className="text-muted-foreground mb-8">
          Explorez toutes les fonctionnalités disponibles dans notre application.
        </p>

        <div className="space-y-8">
          {menuSections.map((section) => {
            const filteredItems = filterMenuItems(section.items);
            if (filteredItems.length === 0) return null;
            
            return (
              <div key={section.title}>
                <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                <p className="text-muted-foreground mb-4">{section.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <Card 
                      key={item.title}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(item.path)}
                    >
                      <CardHeader className="flex flex-row items-center space-x-2">
                        <div className="p-2 rounded-md bg-primary/10">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
};

export default MenuPage;
