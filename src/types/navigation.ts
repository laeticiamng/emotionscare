
// ROUTES UNIFIÉES - UN SEUL CHEMIN PAR FONCTIONNALITÉ
export const ROUTES = {
  b2c: {
    login: '/b2c/login',
    register: '/b2c/register',
    dashboard: '/b2c/dashboard',
  },
  b2bUser: {
    login: '/b2b/user/login',
    register: '/b2b/user/register',
    dashboard: '/b2b/user/dashboard',
  },
  b2bAdmin: {
    login: '/b2b/admin/login',
    dashboard: '/b2b/admin/dashboard',
    teams: '/teams',
    reports: '/reports',
    events: '/events',
    optimisation: '/optimisation',
  },
  common: {
    home: '/',
    chooseMode: '/choose-mode',
    b2bSelection: '/b2b/selection',
    // FONCTIONNALITÉS COMMUNES - CHEMINS UNIQUES
    scan: '/scan',
    music: '/music',
    coach: '/coach',
    coachChat: '/coach-chat',
    journal: '/journal',
    vr: '/vr',
    settings: '/settings',
    preferences: '/preferences',
    gamification: '/gamification',
    socialCocon: '/social-cocon',
  }
};

export interface NavItem {
  title: string;
  href: string;
  icon?: any;
  external?: boolean;
  disabled?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
