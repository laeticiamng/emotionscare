
import React from 'react';
import { Lock, Plus } from 'lucide-react';
import NavItem from './NavItem';

const GuestMenu: React.FC = () => {
  return (
    <>
      <NavItem 
        icon={<Lock className="h-6 w-6" />} 
        label="Se connecter" 
        to="/login" 
      />
      <NavItem 
        icon={<Plus className="h-6 w-6" />} 
        label="S'inscrire" 
        to="/register" 
      />
    </>
  );
};

export default GuestMenu;
