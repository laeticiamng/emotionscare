
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
    journal: string;
    music: string;
    scan: string;
    coach: string;
    vr: string;
    gamification: string;
    preferences: string;
    cocon: string;
  };
  b2bUser: {
    home: string;
    login: string;
    register: string;
    dashboard: string;
    journal: string;
    music: string;
    scan: string;
    coach: string;
    vr: string;
    gamification: string;
    preferences: string;
    cocon: string;
  };
  b2bAdmin: {
    home: string;
    login: string;
    dashboard: string;
    teams: string;
    reports: string;
    events: string;
    settings: string;
  };
  common: {
    home: string;
    b2bSelection: string;
    unauthorized: string;
  };
}

export const ROUTES: RouteConfig = {
  b2c: {
    home: '/b2c',
    login: '/b2c/login',
    register: '/b2c/register',
    dashboard: '/b2c/dashboard',
    journal: '/b2c/journal',
    music: '/b2c/music',
    scan: '/b2c/scan',
    coach: '/b2c/coach',
    vr: '/b2c/vr',
    gamification: '/b2c/gamification',
    preferences: '/b2c/preferences',
    cocon: '/b2c/cocon'
  },
  b2bUser: {
    home: '/b2b/user',
    login: '/b2b/user/login',
    register: '/b2b/user/register',
    dashboard: '/b2b/user/dashboard',
    journal: '/b2b/user/journal',
    music: '/b2b/user/music',
    scan: '/b2b/user/scan',
    coach: '/b2b/user/coach',
    vr: '/b2b/user/vr',
    gamification: '/b2b/user/gamification',
    preferences: '/b2b/user/preferences',
    cocon: '/b2b/user/cocon'
  },
  b2bAdmin: {
    home: '/b2b/admin',
    login: '/b2b/admin/login',
    dashboard: '/b2b/admin/dashboard',
    teams: '/b2b/admin/teams',
    reports: '/b2b/admin/reports',
    events: '/b2b/admin/events',
    settings: '/b2b/admin/settings'
  },
  common: {
    home: '/',
    b2bSelection: '/b2b/selection',
    unauthorized: '/unauthorized'
  }
};
