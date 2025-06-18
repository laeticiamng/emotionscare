
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import B2CAuthLayout from '@/components/auth/B2CAuthLayout';

const B2BUserRegisterPage: React.FC = () => {
  const handleToggleMode = () => {
    window.location.href = '/b2b/user/login';
  };

  return (
    <B2CAuthLayout>
      <RegisterForm onToggleMode={handleToggleMode} />
    </B2CAuthLayout>
  );
};

export default B2BUserRegisterPage;
