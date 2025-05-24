
// Re-export all types from their respective files
export * from './audio';
export * from './music';
export * from './support';

// Navigation types
export interface NavigationPath {
  landing: '/';
  home: '/home';
  meditation: '/meditation';
  b2c: {
    login: '/b2c/login';
    register: '/b2c/register';
    dashboard: '/b2c/dashboard';
  };
  b2b: {
    selection: '/b2b/selection';
    user: {
      login: '/b2b/user/login';
      dashboard: '/b2b/user/dashboard';
    };
    admin: {
      login: '/b2b/admin/login';
      dashboard: '/b2b/admin/dashboard';
    };
  };
}

// Common UI types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Error handling types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}
