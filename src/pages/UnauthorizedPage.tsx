import React from 'react';
import { Home, Lock, LogIn, Shield } from 'lucide-react';
import HttpErrorLayout from '@/components/error/HttpErrorLayout';

const UnauthorizedPage: React.FC = () => {
  return (
    <HttpErrorLayout
      statusCode={401}
      title="Authentification requise"
      description="Vous devez être connecté pour accéder à cette zone sécurisée de la plateforme."
      icon={Lock}
      actions={[
        { label: 'Se connecter', to: '/login', icon: LogIn },
        { label: "Créer un compte", to: '/signup', icon: Shield, variant: 'secondary' },
        { label: "Retour à l'accueil", to: '/', icon: Home, variant: 'outline' },
      ]}
      suggestions={[
        {
          label: 'Mot de passe oublié',
          href: '/reset-password',
          description: 'Récupérez l\'accès à votre espace personnel.',
        },
        {
          label: 'Centre d\'aide',
          href: '/help',
          description: 'Consultez les questions fréquentes et tutoriels.',
        },
        {
          label: 'Contact support',
          href: '/contact',
          description: 'Notre équipe peut vous aider à activer votre compte.',
        },
        {
          label: 'Espace entreprise',
          href: '/entreprise',
          description: 'Accès B2B pour les organisations et équipes.',
        },
      ]}
      supportText="Besoin d'un accompagnement ? Notre équipe support est disponible 7j/7 pour sécuriser votre accès."
    />
  );
};

export default UnauthorizedPage;
