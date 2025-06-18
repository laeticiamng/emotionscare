import { createBrowserRouter } from "react-router-dom";
import Shell from "@/Shell";
import Home from "@/pages/Home";
import Scan from "@/pages/Scan";
import Journal from "@/pages/Journal";
import Dashboard from "@/pages/Dashboard";
import Coach from "@/pages/Coach";
import Music from "@/pages/Music";
import VR from "@/pages/VR";
import Breath from "@/pages/Breath";
import Community from "@/pages/Community";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import B2BUserDashboard from "@/pages/b2b/B2BUserDashboard";
import B2BAdminDashboard from "@/pages/b2b/B2BAdminDashboard";
import B2BAdminUserManagement from "@/pages/b2b/B2BAdminUserManagement";
import B2BAdminSettings from "@/pages/b2b/B2BAdminSettings";
import B2BAdminAnalytics from "@/pages/b2b/B2BAdminAnalytics";
import B2BAdminAccessLogs from "@/pages/b2b/B2BAdminAccessLogs";
import B2BAdminVRManagement from "@/pages/b2b/B2BAdminVRManagement";
import B2BAdminEmotionAnalytics from "@/pages/b2b/B2BAdminEmotionAnalytics";
import B2BAdminScanManagement from "@/pages/b2b/B2BAdminScanManagement";
import B2BAdminJournalManagement from "@/pages/b2b/B2BAdminJournalManagement";
import B2BAdminMusicManagement from "@/pages/b2b/B2BAdminMusicManagement";
import B2BAdminCoachManagement from "@/pages/b2b/B2BAdminCoachManagement";
import B2BAdminBreathManagement from "@/pages/b2b/B2BAdminBreathManagement";
import B2BAdminCommunityManagement from "@/pages/b2b/B2BAdminCommunityManagement";
import B2BAdminNotificationManagement from "@/pages/b2b/B2BAdminNotificationManagement";
import B2BAdminBadgeManagement from "@/pages/b2b/B2BAdminBadgeManagement";
import B2BAdminChallengeManagement from "@/pages/b2b/B2BAdminChallengeManagement";
import B2BAdminReportManagement from "@/pages/b2b/B2BAdminReportManagement";
import B2BAdminPreferencesManagement from "@/pages/b2b/B2BAdminPreferencesManagement";
import B2BAdminThemeManagement from "@/pages/b2b/B2BAdminThemeManagement";
import B2BAdminUserModeManagement from "@/pages/b2b/B2BAdminUserModeManagement";
import B2BAdminSegmentManagement from "@/pages/b2b/B2BAdminSegmentManagement";
import B2BAdminOrchestrationManagement from "@/pages/b2b/B2BAdminOrchestrationManagement";
import B2BAdminSupportManagement from "@/pages/b2b/B2BAdminSupportManagement";
import B2BAdminBillingManagement from "@/pages/b2b/B2BAdminBillingManagement";
import B2BAdminAccessLogDetail from "@/pages/b2b/B2BAdminAccessLogDetail";
import EnhancedShell from "@/components/ui/enhanced-shell";
import Point20Dashboard from '@/pages/Point20Dashboard';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/b2c/scan",
        element: (
          <RoleProtectedRoute allowedRoles={['b2c']}>
            <Scan />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2c/journal",
        element: (
          <RoleProtectedRoute allowedRoles={['b2c']}>
            <Journal />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2c/dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={['b2c']}>
            <Dashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2c/coach",
        element: (
          <RoleProtectedRoute allowedRoles={['b2c']}>
            <Coach />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2c/music",
        element: (
          <RoleProtectedRoute allowedRoles={['b2c']}>
            <Music />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2c/vr",
        element: (
          <RoleProtectedRoute allowedRoles={['b2c']}>
            <VR />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2c/breath",
        element: (
          <RoleProtectedRoute allowedRoles={['b2c']}>
            <Breath />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2c/community",
        element: (
          <RoleProtectedRoute allowedRoles={['b2c']}>
            <Community />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2c/settings",
        element: (
          <RoleProtectedRoute allowedRoles={['b2c']}>
            <Settings />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2b/user/dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={['b2b_user']}>
            <B2BUserDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2b/user/scan",
        element: (
          <RoleProtectedRoute allowedRoles={['b2b_user']}>
            <Scan />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2b/user/journal",
        element: (
          <RoleProtectedRoute allowedRoles={['b2b_user']}>
            <Journal />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2b/user/coach",
        element: (
          <RoleProtectedRoute allowedRoles={['b2b_user']}>
            <Coach />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2b/user/music",
        element: (
          <RoleProtectedRoute allowedRoles={['b2b_user']}>
            <Music />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2b/user/vr",
        element: (
          <RoleProtectedRoute allowedRoles={['b2b_user']}>
            <VR />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2b/user/breath",
        element: (
          <RoleProtectedRoute allowedRoles={['b2b_user']}>
            <Breath />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2b/user/community",
        element: (
          <RoleProtectedRoute allowedRoles={['b2b_user']}>
            <Community />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2b/admin/dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={['b2b_admin']}>
            <B2BAdminDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/b2b/admin/user-management",
        element: <B2BAdminUserManagement />,
      },
      {
        path: "/b2b/admin/settings",
        element: <B2BAdminSettings />,
      },
      {
        path: "/b2b/admin/analytics",
        element: <B2BAdminAnalytics />,
      },
      {
        path: "/b2b/admin/access-logs",
        element: <B2BAdminAccessLogs />,
      },
	  {
        path: "/b2b/admin/access-logs/:logId",
        element: <B2BAdminAccessLogDetail />,
      },
      {
        path: "/b2b/admin/vr-management",
        element: <B2BAdminVRManagement />,
      },
      {
        path: "/b2b/admin/emotion-analytics",
        element: <B2BAdminEmotionAnalytics />,
      },
      {
        path: "/b2b/admin/scan-management",
        element: <B2BAdminScanManagement />,
      },
      {
        path: "/b2b/admin/journal-management",
        element: <B2BAdminJournalManagement />,
      },
      {
        path: "/b2b/admin/music-management",
        element: <B2BAdminMusicManagement />,
      },
      {
        path: "/b2b/admin/coach-management",
        element: <B2BAdminCoachManagement />,
      },
      {
        path: "/b2b/admin/breath-management",
        element: <B2BAdminBreathManagement />,
      },
      {
        path: "/b2b/admin/community-management",
        element: <B2BAdminCommunityManagement />,
      },
      {
        path: "/b2b/admin/notification-management",
        element: <B2BAdminNotificationManagement />,
      },
      {
        path: "/b2b/admin/badge-management",
        element: <B2BAdminBadgeManagement />,
      },
      {
        path: "/b2b/admin/challenge-management",
        element: <B2BAdminChallengeManagement />,
      },
      {
        path: "/b2b/admin/report-management",
        element: <B2BAdminReportManagement />,
      },
      {
        path: "/b2b/admin/preferences-management",
        element: <B2BAdminPreferencesManagement />,
      },
      {
        path: "/b2b/admin/theme-management",
        element: <B2BAdminThemeManagement />,
      },
      {
        path: "/b2b/admin/user-mode-management",
        element: <B2BAdminUserModeManagement />,
      },
      {
        path: "/b2b/admin/segment-management",
        element: <B2BAdminSegmentManagement />,
      },
      {
        path: "/b2b/admin/orchestration-management",
        element: <B2BAdminOrchestrationManagement />,
      },
      {
        path: "/b2b/admin/support-management",
        element: <B2BAdminSupportManagement />,
      },
      {
        path: "/b2b/admin/billing-management",
        element: <B2BAdminBillingManagement />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/enhanced",
    element: <EnhancedShell />,
    children: [
      {
        path: "/enhanced/home",
        element: <Home />,
      },
      {
        path: "/enhanced/scan",
        element: <Scan />,
      },
    ]
  },
  {
    path: '/point20',
    element: <Point20Dashboard />
  }
]);
