import React from 'react';
import { AlertTriangle, Compass, HelpCircle, Home } from 'lucide-react';
import HttpErrorLayout from '@/components/error/HttpErrorLayout';

interface UnifiedErrorPageProps {
  errorCode?: number;
  title?: string;
  description?: string;
  variant?: 'simple' | 'enhanced' | 'accessible';
}

const DEFAULT_TITLES: Record<number, string> = {
  401: 'Authentification requise',
  403: 'Accès interdit',
  404: 'Page introuvable',
  500: 'Erreur interne du serveur',
};

const DEFAULT_DESCRIPTIONS: Record<number, string> = {
  401: "Vous devez être connecté pour poursuivre votre parcours émotionnel.",
  403: "Cette ressource est protégée. Vérifiez vos autorisations ou contactez votre administrateur.",
  404: "La page que vous cherchez n'existe plus ou a été déplacée. Explorons d'autres espaces inspirants.",
  500: "Un imprévu technique est survenu. Nos équipes ont été alertées pour corriger l'incident.",
};

const UnifiedErrorPage: React.FC<UnifiedErrorPageProps> = ({
  errorCode = 404,
  title,
  description,
}) => {
  const resolvedTitle = title ?? DEFAULT_TITLES[errorCode] ?? 'Une erreur est survenue';
  const resolvedDescription =
    description ?? DEFAULT_DESCRIPTIONS[errorCode] ?? "Nous n'avons pas pu afficher cette page. Réessayez plus tard.";

  return (
    <HttpErrorLayout
      statusCode={errorCode}
      title={resolvedTitle}
      description={resolvedDescription}
      icon={AlertTriangle}
      actions={[
        { label: "Retour à l'accueil", to: '/', icon: Home },
        { label: 'Ouvrir le centre d\'aide', to: '/help', icon: HelpCircle, variant: 'outline' },
        { label: 'Explorer le Dashboard', to: '/app/home', icon: Compass, variant: 'ghost' },
      ]}
      suggestions={[
        {
          label: 'Scanner émotionnel',
          href: '/app/scan',
          description: 'Analysez votre humeur et vos besoins actuels.',
        },
        {
          label: 'Journal intelligent',
          href: '/app/journal',
          description: 'Consignez vos ressentis pour suivre votre progression.',
        },
        {
          label: 'Musique adaptative',
          href: '/app/music',
          description: 'Laissez la musique guider votre équilibre émotionnel.',
        },
        {
          label: 'Explorateur de modules',
          href: '/navigation',
          description: 'Parcourez l\'ensemble des expériences disponibles.',
        },
      ]}
      supportText="Toujours perdu(e) ? Appuyez-vous sur le centre d'aide ou contactez notre équipe support."
    />
  );
};

export default UnifiedErrorPage;
