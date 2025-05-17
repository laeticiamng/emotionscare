
import { ReactNode } from 'react';

export interface NavigationItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  children?: NavigationItem[];
}

export interface RoutePath {
  path: string;
  label: string;
}

export interface RouteConfig {
  b2c: {
    home: string;
    login: string;
    register: string;
    dashboard: string;
  };
  b2bUser: {
    home: string;
    login: string;
    dashboard: string;
  };
  b2bAdmin: {
    home: string;
    login: string;
    dashboard: string;
  };
  common: {
    home: string;
    b2bSelection: string;
    unauthorized: string;
    notFound: string;
  };
}

export const ROUTES: RouteConfig = {
  b2c: {
    home: '/b2c',
    login: '/b2c/login',
    register: '/b2c/register',
    dashboard: '/b2c/dashboard'
  },
  b2bUser: {
    home: '/b2b/user',
    login: '/b2b/user/login',
    dashboard: '/b2b/user/dashboard'
  },
  b2bAdmin: {
    home: '/b2b/admin',
    login: '/b2b/admin/login',
    dashboard: '/b2b/admin/dashboard'
  },
  common: {
    home: '/',
    b2bSelection: '/b2b/selection',
    unauthorized: '/unauthorized',
    notFound: '/not-found'
  }
};
