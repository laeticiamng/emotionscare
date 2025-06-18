
import React from 'react';
import PreferencesForm from '@/components/preferences/PreferencesForm';

const PreferencesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Préférences Utilisateur</h1>
      <PreferencesForm />
    </div>
  );
};

export default PreferencesPage;
