
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
    journal?: string;
    scan?: string;
    music?: string;
    coach?: string;
    vr?: string;
    teams?: string;
    reports?: string;
    events?: string;
    settings?: string;
    gamification?: string;
    cocon?: string;
    preferences?: string;
  };
  b2bUser: {
    home: string;
    login: string;
    dashboard: string;
    journal?: string;
    scan?: string;
    music?: string;
    coach?: string;
    vr?: string;
    teams?: string;
    reports?: string;
    events?: string;
    settings?: string;
    gamification?: string;
    cocon?: string;
    preferences?: string;
  };
  b2bAdmin: {
    home: string;
    login: string;
    dashboard: string;
    journal?: string;
    scan?: string;
    music?: string;
    coach?: string;
    vr?: string;
    teams?: string;
    reports?: string;
    events?: string;
    settings?: string;
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
    dashboard: '/b2c/dashboard',
    journal: '/b2c/journal',
    scan: '/b2c/scan',
    music: '/b2c/music',
    coach: '/b2c/coach',
    vr: '/b2c/vr',
    settings: '/b2c/settings',
    gamification: '/b2c/gamification',
    cocon: '/b2c/cocon',
    preferences: '/b2c/preferences'
  },
  b2bUser: {
    home: '/b2b/user',
    login: '/b2b/user/login',
    dashboard: '/b2b/user/dashboard',
    journal: '/b2b/user/journal',
    scan: '/b2b/user/scan',
    music: '/b2b/user/music',
    coach: '/b2b/user/coach',
    vr: '/b2b/user/vr',
    teams: '/b2b/user/teams',
    settings: '/b2b/user/settings',
    gamification: '/b2b/user/gamification',
    cocon: '/b2b/user/cocon',
    preferences: '/b2b/user/preferences'
  },
  b2bAdmin: {
    home: '/b2b/admin',
    login: '/b2b/admin/login',
    dashboard: '/b2b/admin/dashboard',
    journal: '/b2b/admin/journal',
    scan: '/b2b/admin/scan',
    music: '/b2b/admin/music',
    coach: '/b2b/admin/coach',
    vr: '/b2b/admin/vr',
    teams: '/b2b/admin/teams',
    reports: '/b2b/admin/reports',
    events: '/b2b/admin/events',
    settings: '/b2b/admin/settings'
  },
  common: {
    home: '/',
    b2bSelection: '/b2b/selection',
    unauthorized: '/unauthorized',
    notFound: '/not-found'
  }
};
