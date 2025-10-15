import React from 'react';
import { ComingSoon } from '@/components/coming-soon/ComingSoon';
import { Calendar } from 'lucide-react';

/**
 * Page Coming Soon pour le module Calendrier
 */
export const CalendarComingSoon: React.FC = () => {
  return (
    <ComingSoon
      moduleName="Calendrier"
      description="Organisez vos séances, suivez vos rendez-vous et planifiez vos objectifs bien-être"
      icon={<Calendar className="h-16 w-16 text-primary" />}
      features={[
        'Vue calendrier complète (jour, semaine, mois)',
        'Planification des séances de méditation, respiration, etc.',
        'Rappels automatiques personnalisables',
        'Synchronisation avec calendriers externes',
        'Suivi des habitudes et streaks',
        'Statistiques de régularité',
      ]}
      estimatedRelease="Q2 2025"
      notifyEnabled
    />
  );
};

export default CalendarComingSoon;
