
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const B2BAdminLoginPage: React.FC = () => {
  const handleToggleMode = () => {
    // Les admins n'ont pas de page d'inscription - redirection vers sélection
    window.location.href = '/b2b/selection';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            Administration RH
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Accès administrateur sécurisé
          </p>
        </div>
        <LoginForm onToggleMode={handleToggleMode} />
      </div>
    </div>
  );
};

export default B2BAdminLoginPage;
