
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserModeSelector } from '@/components/ui/user-mode-selector';

const UserModeButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <UserModeSelector 
      className="mr-2"
      minimal
    />
  );
};

export default UserModeButton;
