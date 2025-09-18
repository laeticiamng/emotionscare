import React from 'react';
import { ArrowLeft, Home, ShieldAlert } from 'lucide-react';
import HttpErrorLayout from '@/components/error/HttpErrorLayout';

const ForbiddenPage: React.FC = () => {
  return (
    <HttpErrorLayout
      statusCode={403}
      title="Accès interdit"
      description="Vous n'avez pas les autorisations suffisantes pour consulter cette ressource."
      icon={ShieldAlert}
      actions={[
        { label: 'Retour au tableau de bord', to: '/app/home', icon: Home },
        { label: 'Page précédente', onClick: () => window.history.back(), icon: ArrowLeft, variant: 'outline' },
      ]}
      suggestions={[
        {
          label: 'Centre d\'aide',
          href: '/help',
          description: 'Découvrir comment demander un accès supplémentaire.',
        },
        {
          label: 'Contact support',
          href: '/contact',
          description: 'Notre équipe peut vérifier vos permissions.',
        },
        {
          label: 'Politique de sécurité',
          href: '/privacy',
          description: 'Comprendre la gestion des accès sur EmotionsCare.',
        },
        {
          label: 'Portail administrateur',
          href: '/b2b/admin/dashboard',
          description: 'Réservé aux responsables habilités.',
        },
      ]}
      supportText="Besoin d'un niveau d'accès supérieur ? Contactez votre administrateur ou notre support sécurité."
    />
  );
};

export default ForbiddenPage;
