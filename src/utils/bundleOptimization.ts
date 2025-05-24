
/**
 * Utilitaires pour l'optimisation du bundle et tree-shaking
 */

// Dynamic imports pour les bibliothèques lourdes
export const loadChartJS = () => import('chart.js');
export const loadReactChartJS = () => import('react-chartjs-2');
export const loadLottie = () => import('lottie-react');
export const loadThree = () => import('three');
export const loadFramerMotion = () => import('framer-motion');

// Preload des chunks critiques
export const preloadCriticalChunks = () => {
  // Preload des composants dashboard les plus utilisés
  import('@/pages/b2c/dashboard/B2CDashboardPage');
  import('@/components/dashboard/DashboardContent');
  import('@/components/layout/MainLayout');
};

// Lazy load conditionnel basé sur les features
export const loadVRComponents = () => {
  return Promise.all([
    import('@/components/vr/VRTemplateGrid'),
    import('@/components/vr/VRSessionView'),
    import('@/components/vr/VRMusicIntegration')
  ]);
};

export const loadMusicComponents = () => {
  return Promise.all([
    import('@/components/music/MusicPlayer'),
    import('@/components/music/EmotionBasedMusicRecommendation')
  ]);
};

export const loadAnalyticsComponents = () => {
  return Promise.all([
    import('@/components/dashboard/charts/LineChart'),
    import('@/components/dashboard/charts/EmotionPieChart'),
    import('@/components/dashboard/charts/WeeklyActivityChart')
  ]);
};

// Code splitting intelligent par role
export const loadRoleSpecificComponents = (role: string) => {
  switch (role) {
    case 'b2c':
      return import('@/components/dashboard/b2c');
    case 'b2b_admin':
      return import('@/components/dashboard/admin/AdminDashboard');
    case 'b2b_user'::
      return import('@/components/dashboard/UserDashboard');
    default:
      return Promise.resolve();
  }
};
