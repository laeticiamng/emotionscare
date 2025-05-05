
import React from 'react';
import { Cog, HelpCircle } from 'lucide-react';
import NavItem from './NavItem';
import { useLocation } from 'react-router-dom';

const FooterLinks: React.FC = () => {
  const { pathname } = useLocation();
  
  return (
    <>
      <NavItem
        icon={<Cog className="h-6 w-6" />}
        label="Paramètres"
        to="/settings"
        active={pathname === '/settings'}
      />
      <NavItem
        icon={<HelpCircle className="h-6 w-6" />}
        label="Aide"
        to="/help"
        active={pathname === '/help'}
      />
    </>
  );
};

export default FooterLinks;
