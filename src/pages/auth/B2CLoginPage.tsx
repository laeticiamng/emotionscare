
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import B2CAuthLayout from '@/components/auth/B2CAuthLayout';

const B2CLoginPage: React.FC = () => {
  return (
    <B2CAuthLayout>
      <LoginForm userType="b2c" />
    </B2CAuthLayout>
  );
};

export default B2CLoginPage;
