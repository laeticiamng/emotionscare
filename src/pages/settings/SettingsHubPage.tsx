/**
 * SettingsHubPage - Page centrale regroupant tous les paramètres
 * Route: /settings
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Bell,
  Shield,
  Lock,
  Globe,
  Accessibility,
  LayoutDashboard,
  ChevronRight,
} from 'lucide-react';
import PageRoot from '@/components/common/PageRoot';

interface SettingsLink {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

const settingsLinks: SettingsLink[] = [
  {
    title: 'Paramètres généraux',
    description: 'Apparence, thème, préférences globales et personnalisation de l\'application.',
    href: '/settings/general',
    icon: Settings,
    color: 'text-blue-500',
  },
  {
    title: 'Tableau de bord',
    description: 'Profil utilisateur, abonnement et préférences du tableau de bord.',
    href: '/dashboard/settings',
    icon: LayoutDashboard,
    color: 'text-indigo-500',
  },
  {
    title: 'Notifications',
    description: 'Gérez les notifications par email, push et les rappels quotidiens.',
    href: '/settings/notifications',
    icon: Bell,
    color: 'text-amber-500',
  },
  {
    title: 'Confidentialité et données',
    description: 'Consentements RGPD, export de données et gestion de la vie privée.',
    href: '/settings/privacy',
    icon: Shield,
    color: 'text-green-500',
  },
  {
    title: 'Sécurité du compte',
    description: 'Mot de passe, authentification à deux facteurs et sessions actives.',
    href: '/settings/security',
    icon: Lock,
    color: 'text-red-500',
  },
  {
    title: 'Langue',
    description: 'Choisissez la langue d\'affichage de l\'application.',
    href: '/settings/language',
    icon: Globe,
    color: 'text-purple-500',
  },
  {
    title: 'Accessibilité',
    description: 'Contraste, taille du texte, mode daltonien et espacement des lignes.',
    href: '/settings/accessibility',
    icon: Accessibility,
    color: 'text-teal-500',
  },
];

const SettingsHubPage: React.FC = () => {
  return (
    <PageRoot>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground mt-2">
            Configurez et personnalisez votre expérience EmotionsCare
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {settingsLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href} className="group">
                <Card className="h-full transition-shadow hover:shadow-md group-hover:border-primary/30">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className="rounded-lg bg-muted p-2.5">
                      <Icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{item.title}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm">
                        {item.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </PageRoot>
  );
};

export default SettingsHubPage;
