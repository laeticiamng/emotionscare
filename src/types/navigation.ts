
export const ROUTES = {
  b2c: {
    login: '/b2c/login',
    register: '/b2c/register',
    resetPassword: '/b2c/reset-password',
    dashboard: '/b2c/dashboard',
    onboarding: '/b2c/onboarding',
    journal: '/b2c/journal',
    music: '/b2c/music',
    scan: '/b2c/scan',
    coach: '/b2c/coach',
    vr: '/b2c/vr',
    gamification: '/b2c/gamification',
    social: '/b2c/social',
    settings: '/b2c/settings',
  },
  b2bUser: {
    login: '/b2b/user/login',
    register: '/b2b/user/register',
    dashboard: '/b2b/user/dashboard',
    journal: '/b2b/user/journal',
    music: '/b2b/user/music',
    scan: '/b2b/user/scan',
    coach: '/b2b/user/coach',
    vr: '/b2b/user/vr',
    teamChallenges: '/b2b/user/team-challenges',
    social: '/b2b/user/social',
    cocon: '/b2b/user/cocon',
    gamification: '/b2b/user/gamification',
    settings: '/b2b/user/settings',
  },
  b2bAdmin: {
    login: '/b2b/admin/login',
    dashboard: '/b2b/admin/dashboard',
    users: '/b2b/admin/users',
    teams: '/b2b/admin/teams',
    reports: '/b2b/admin/reports',
    events: '/b2b/admin/events',
    analytics: '/b2b/admin/analytics',
    resources: '/b2b/admin/resources',
    extensions: '/b2b/admin/extensions',
    optimisation: '/b2b/admin/optimisation',
    journal: '/b2b/admin/journal',
    scan: '/b2b/admin/scan',
    music: '/b2b/admin/music',
    settings: '/b2b/admin/settings',
  },
  common: {
    home: '/',
    chooseMode: '/choose-mode',
    b2bSelection: '/b2b/selection',
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings',
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
