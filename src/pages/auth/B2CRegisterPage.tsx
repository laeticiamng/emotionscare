
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import B2CAuthLayout from '@/components/auth/B2CAuthLayout';

const B2CRegisterPage: React.FC = () => {
  return (
    <B2CAuthLayout>
      <RegisterForm userType="b2c" />
    </B2CAuthLayout>
  );
};

export default B2CRegisterPage;
