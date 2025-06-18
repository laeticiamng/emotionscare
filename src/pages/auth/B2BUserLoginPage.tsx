
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const B2BUserLoginPage: React.FC = () => {
  const handleToggleMode = () => {
    // Navigation vers la page d'inscription B2B User
    window.location.href = '/b2b/user/register';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Espace Collaborateur
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connectez-vous à votre espace professionnel
          </p>
        </div>
        <LoginForm onToggleMode={handleToggleMode} />
      </div>
    </div>
  );
};

export default B2BUserLoginPage;
