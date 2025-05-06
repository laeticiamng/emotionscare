
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PersonalActivityLogs from '@/components/account/PersonalActivityLogs';

const PersonalActivityPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">Accès restreint</h2>
        <p>Veuillez vous connecter pour accéder à votre historique d'activité personnel.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold mb-8">Mon historique d'activité</h1>
      <PersonalActivityLogs />
    </div>
  );
};

export default PersonalActivityPage;
