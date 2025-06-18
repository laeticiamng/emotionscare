
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import B2BPremiumAuthLayout from '@/components/auth/B2BPremiumAuthLayout';

const B2BUserRegisterPage: React.FC = () => {
  return (
    <B2BPremiumAuthLayout>
      <RegisterForm userType="b2b_user" />
    </B2BPremiumAuthLayout>
  );
};

export default B2BUserRegisterPage;
