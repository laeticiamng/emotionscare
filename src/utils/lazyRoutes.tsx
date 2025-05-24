
import React, { lazy } from 'react';

// Lazy load components for better performance
export const ImmersiveHome = lazy(() => 
  import('@/components/home/ImmersiveHome').then(module => ({ 
    default: module.ImmersiveHome 
  }))
);

export const MeditationPage = lazy(() => 
  import('@/pages/MeditationPage').then(module => ({ 
    default: module.default 
  }))
);

export const DashboardPage = lazy(() => 
  import('@/pages/DashboardPage').then(module => ({ 
    default: module.default 
  }))
);

export const CoachPage = lazy(() => 
  import('@/pages/CoachPage').then(module => ({ 
    default: module.default 
  }))
);

export const MusicPage = lazy(() => 
  import('@/pages/MusicPage').then(module => ({ 
    default: module.default 
  }))
);

export const JournalPage = lazy(() => 
  import('@/pages/JournalPage').then(module => ({ 
    default: module.default 
  }))
);

export const SettingsPage = lazy(() => 
  import('@/pages/SettingsPage').then(module => ({ 
    default: module.default 
  }))
);

export const LoginPage = lazy(() => 
  import('@/pages/auth/LoginPage').then(module => ({ 
    default: module.default 
  }))
);

export const RegisterPage = lazy(() => 
  import('@/pages/auth/RegisterPage').then(module => ({ 
    default: module.default 
  }))
);
