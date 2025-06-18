
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import B2BPremiumAuthLayout from '@/components/auth/B2BPremiumAuthLayout';

const B2BUserLoginPage: React.FC = () => {
  return (
    <B2BPremiumAuthLayout>
      <LoginForm userType="b2b_user" />
    </B2BPremiumAuthLayout>
  );
};

export default B2BUserLoginPage;
