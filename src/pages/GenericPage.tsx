
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GenericPageProps {
  title: string;
  description: string;
}

const GenericPage: React.FC<GenericPageProps> = ({ title, description }) => {
  const location = useLocation();

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{description}</p>
          <p className="text-sm text-muted-foreground">
            Route actuelle: {location.pathname}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Pages B2C
export const B2CJournalPage = () => (
  <GenericPage title="Journal" description="Tenez un journal de vos émotions et pensées" />
);

export const B2CScanPage = () => (
  <GenericPage title="Scan Émotionnel" description="Analysez votre état émotionnel" />
);

export const B2CMusicPage = () => (
  <GenericPage title="Musique" description="Écoutez de la musique adaptée à votre humeur" />
);

export const B2CCoachPage = () => (
  <GenericPage title="Coach" description="Discutez avec votre coach virtuel" />
);

export const B2CVRPage = () => (
  <GenericPage title="Réalité Virtuelle" description="Expériences immersives de bien-être" />
);

export const B2CPreferencesPage = () => (
  <GenericPage title="Préférences" description="Configurez vos préférences" />
);

export const B2CSettingsPage = () => (
  <GenericPage title="Paramètres" description="Gérez vos paramètres de compte" />
);

export const B2CCoconPage = () => (
  <GenericPage title="Cocon" description="Votre espace de détente personnel" />
);

export const B2CSocialCoconPage = () => (
  <GenericPage title="Cocon Social" description="Partagez avec la communauté" />
);

export const B2CGamificationPage = () => (
  <GenericPage title="Gamification" description="Défis et récompenses de bien-être" />
);

// Pages B2B User
export const B2BUserJournalPage = () => (
  <GenericPage title="Journal Professionnel" description="Journal de votre bien-être au travail" />
);

export const B2BUserScanPage = () => (
  <GenericPage title="Scan Émotionnel" description="Analysez votre état au travail" />
);

export const B2BUserMusicPage = () => (
  <GenericPage title="Musique" description="Musique pour la productivité" />
);

export const B2BUserCoachPage = () => (
  <GenericPage title="Coach" description="Coach pour le bien-être professionnel" />
);

export const B2BUserVRPage = () => (
  <GenericPage title="VR Entreprise" description="Expériences VR en entreprise" />
);

export const B2BUserPreferencesPage = () => (
  <GenericPage title="Préférences" description="Préférences professionnelles" />
);

export const B2BUserSettingsPage = () => (
  <GenericPage title="Paramètres" description="Paramètres de compte professionnel" />
);

export const B2BUserCoconPage = () => (
  <GenericPage title="Cocon" description="Espace de détente en entreprise" />
);

export const B2BUserSocialCoconPage = () => (
  <GenericPage title="Cocon Social" description="Communauté d'entreprise" />
);

export const B2BUserGamificationPage = () => (
  <GenericPage title="Défis Équipe" description="Défis de bien-être en équipe" />
);

// Pages B2B Admin
export const B2BAdminJournalPage = () => (
  <GenericPage title="Journaux Équipe" description="Aperçu des journaux d'équipe" />
);

export const B2BAdminScanPage = () => (
  <GenericPage title="Analyse Équipe" description="Analyse émotionnelle des équipes" />
);

export const B2BAdminMusicPage = () => (
  <GenericPage title="Playlists Équipe" description="Gestion des playlists d'équipe" />
);

export const B2BAdminTeamsPage = () => (
  <GenericPage title="Gestion des Équipes" description="Organisez et gérez vos équipes" />
);

export const B2BAdminReportsPage = () => (
  <GenericPage title="Rapports" description="Rapports détaillés de bien-être" />
);

export const B2BAdminEventsPage = () => (
  <GenericPage title="Événements" description="Organisez des événements de bien-être" />
);

export const B2BAdminSocialCoconPage = () => (
  <GenericPage title="Cocon Organisation" description="Gestion du cocon organisationnel" />
);

export const B2BAdminOptimisationPage = () => (
  <GenericPage title="Optimisation" description="Optimisez le bien-être organisationnel" />
);

export const B2BAdminSettingsPage = () => (
  <GenericPage title="Paramètres Admin" description="Configuration de l'organisation" />
);

export default GenericPage;
