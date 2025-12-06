// @ts-nocheck

/**
 * 🚀 MIGRATED TO ROUTERV2 - Phase 2 Complete
 * All hardcoded links replaced with typed Routes.xxx() helpers
 * TICKET: FE/BE-Router-Cleanup-02
 */

import React from 'react';
import { Cog, HelpCircle } from 'lucide-react';
import NavItem from './NavItem';
import { useLocation } from 'react-router-dom';
import { routes } from '@/routerV2';

const FooterLinks: React.FC = () => {
  const { pathname } = useLocation();
  
  return (
    <>
      <NavItem
        icon={<Cog className="h-6 w-6" />}
        label="Paramètres"
        to={routes.b2c.settings()}
        active={pathname === routes.b2c.settings()}
      />
      <NavItem
        icon={<HelpCircle className="h-6 w-6" />}
        label="Aide"
        to={routes.public.help()}
        active={pathname === routes.public.help()}
      />
    </>
  );
};

export default FooterLinks;
