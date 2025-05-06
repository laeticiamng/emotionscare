
import React from 'react';
import Layout from '@/components/Layout';

const SettingsPage: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Paramètres du compte</h1>
      <p>Gérez vos préférences et informations de profil.</p>
    </Layout>
  );
};

export default SettingsPage;
