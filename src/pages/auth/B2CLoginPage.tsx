
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import B2CAuthLayout from '@/components/auth/B2CAuthLayout';

const B2CLoginPage: React.FC = () => {
  const handleToggleMode = () => {
    // Navigation vers la page d'inscription B2C
    window.location.href = '/b2c/register';
  };

  return (
    <B2CAuthLayout>
      <LoginForm onToggleMode={handleToggleMode} />
    </B2CAuthLayout>
  );
};

export default B2CLoginPage;
