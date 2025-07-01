
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import PremiumButton from '@/components/ui/PremiumButton';
import { 
  Scan, 
  Music, 
  MessageSquare, 
  Gamepad2, 
  Users, 
  HeartHandshake,
  Zap,
  Video,
  Settings,
  BarChart3
} from 'lucide-react';

interface ActionButtonData {
  label: string;
  icon: React.ReactNode;
  path: string;
  variant?: "primary" | "secondary" | "accent" | "ghost";
  roles?: string[];
}

const UnifiedActionButtons: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();

  const getActionButtons = (): ActionButtonData[] => {
    const baseActions: ActionButtonData[] = [
      {
        label: 'Scan Émotionnel',
        icon: <Scan className="h-5 w-5" />,
        path: '/scan',
        variant: 'primary'
      },
      {
        label: 'Musique Thérapeutique',
        icon: <Music className="h-5 w-5" />,
        path: '/music',
        variant: 'secondary'
      },
      {
        label: 'Coach IA',
        icon: <MessageSquare className="h-5 w-5" />,
        path: '/coach',
        variant: 'accent'
      },
      {
        label: 'Expérience VR',
        icon: <Video className="h-5 w-5" />,
        path: '/vr',
        variant: 'ghost'
      }
    ];

    if (userMode === 'b2c') {
      return [
        ...baseActions,
        {
          label: 'Gamification',
          icon: <Gamepad2 className="h-5 w-5" />,
          path: '/gamification',
          variant: 'primary'
        },
        {
          label: 'Social Cocon',
          icon: <HeartHandshake className="h-5 w-5" />,
          path: '/social-cocon',
          variant: 'secondary'
        }
      ];
    }

    if (userMode === 'b2b_user') {
      return [
        ...baseActions,
        {
          label: 'Social Cocon',
          icon: <HeartHandshake className="h-5 w-5" />,
          path: '/social-cocon',
          variant: 'secondary'
        },
        {
          label: 'Gamification',
          icon: <Gamepad2 className="h-5 w-5" />,
          path: '/gamification',
          variant: 'accent'
        }
      ];
    }

    if (userMode === 'b2b_admin') {
      return [
        ...baseActions,
        {
          label: 'Gestion Équipes',
          icon: <Users className="h-5 w-5" />,
          path: '/teams',
          variant: 'primary'
        },
        {
          label: 'Rapports',
          icon: <BarChart3 className="h-5 w-5" />,
          path: '/reports',
          variant: 'secondary'
        },
        {
          label: 'Optimisation',
          icon: <Zap className="h-5 w-5" />,
          path: '/optimisation',
          variant: 'accent'
        }
      ];
    }

    return baseActions;
  };

  const actionButtons = getActionButtons();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {actionButtons.map((action, index) => (
        <motion.div
          key={action.path}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <PremiumButton asChild variant={action.variant} className="w-full h-16 justify-start">
            <Link to={action.path} className="flex items-center gap-3">
              {action.icon}
              <span className="font-semibold">{action.label}</span>
            </Link>
          </PremiumButton>
        </motion.div>
      ))}
    </div>
  );
};

export default UnifiedActionButtons;
