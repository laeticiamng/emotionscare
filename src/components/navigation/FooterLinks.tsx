
/**
 * 🚀 MIGRATED TO ROUTERV2 - Phase 2 Complete
 * All hardcoded links replaced with typed Routes.xxx() helpers
 * TICKET: FE/BE-Router-Cleanup-02
 */

import React from 'react';
import { Cog, HelpCircle } from 'lucide-react';
import NavItem from './NavItem';
import { useLocation } from 'react-router-dom';
import { Routes } from '@/routerV2';

const FooterLinks: React.FC = () => {
  const { pathname } = useLocation();
  
  return (
    <>
      <NavItem
        icon={<Cog className="h-6 w-6" />}
        label="Paramètres"
        to={Routes.settingsGeneral()}
        active={pathname === Routes.settingsGeneral()}
      />
      <NavItem
        icon={<HelpCircle className="h-6 w-6" />}
        label="Aide"
        to={Routes.help()}
        active={pathname === Routes.help()}
      />
    </>
  );
};

export default FooterLinks;
