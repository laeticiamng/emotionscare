// @ts-nocheck
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Bell, 
  HelpCircle, 
  Shield, 
  Palette, 
  Globe,
  ChevronRight
} from 'lucide-react';
import { useRouter } from '@/hooks/router';

const SETTING_LINKS = [
  {
    key: 'profile',
    icon: User,
    title: 'Profil',
    description: 'Nom, langue, thème, accessibilité',
    path: '/settings/profile',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    key: 'notifications',
    icon: Bell,
    title: 'Notifications',
    description: 'Rappels, push, e-mail, heures calmes',
    path: '/settings/notifications',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    key: 'accessibility',
    icon: Palette,
    title: 'Accessibilité',
    description: 'Contraste, mouvement, taille police',
    path: '/settings/accessibility',
    color: 'text-green-600 bg-green-100'
  },
  {
    key: 'language',
    icon: Globe,
    title: 'Langue & région',
    description: 'Français, English, timezone',
    path: '/settings/language',
    color: 'text-orange-600 bg-orange-100'
  },
  {
    key: 'security',
    icon: Shield,
    title: 'Sécurité',
    description: 'Mot de passe, 2FA, sessions actives',
    path: '/settings/security',
    color: 'text-red-600 bg-red-100'
  },
  {
    key: 'help',
    icon: HelpCircle,
    title: 'Aide & support',
    description: 'FAQ, contact, documentation',
    path: '/help',
    color: 'text-gray-600 bg-gray-100'
  }
];

/**
 * Grille de liens vers les autres sections des réglages
 */
export const LinksGrid: React.FC = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {SETTING_LINKS.map(link => {
        const Icon = link.icon;
        
        return (
          <Card 
            key={link.key}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(link.path)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${link.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1">
                    {link.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {link.description}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};