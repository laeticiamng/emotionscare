
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";

// Pages
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import ScanPage from "./pages/ScanPage";
import ScanDetailPage from "./pages/ScanDetailPage";
import JournalPage from "./pages/JournalPage";
import JournalNewPage from "./pages/JournalNewPage";
import JournalEntryPage from "./pages/JournalEntryPage";
import CommunityFeed from "./pages/CommunityFeed";
import GroupList from "./pages/GroupList";
import BuddyPage from "./pages/BuddyPage";
import NotImplementedPage from "./pages/NotImplementedPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app we would check if the user is authenticated using the auth context
  // For now, we'll just render the children
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes inside layout */}
            <Route element={<Layout />}>
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              
              {/* Scan routes */}
              <Route path="/scan" element={<ProtectedRoute><ScanPage /></ProtectedRoute>} />
              <Route path="/scan/:userId" element={<ProtectedRoute><ScanDetailPage /></ProtectedRoute>} />
              
              {/* Journal routes */}
              <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
              <Route path="/journal/new" element={<ProtectedRoute><JournalNewPage /></ProtectedRoute>} />
              <Route path="/journal/:entryId" element={<ProtectedRoute><JournalEntryPage /></ProtectedRoute>} />
              
              {/* Community routes */}
              <Route path="/community" element={<ProtectedRoute><CommunityFeed /></ProtectedRoute>} />
              <Route path="/community/groups" element={<ProtectedRoute><GroupList /></ProtectedRoute>} />
              <Route path="/community/buddy" element={<ProtectedRoute><BuddyPage /></ProtectedRoute>} />
              
              {/* Not implemented routes */}
              <Route path="/vr" element={<ProtectedRoute><NotImplementedPage /></ProtectedRoute>} />
              <Route path="/library" element={<ProtectedRoute><NotImplementedPage /></ProtectedRoute>} />
              <Route path="/gamification" element={<ProtectedRoute><NotImplementedPage /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><NotImplementedPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><NotImplementedPage /></ProtectedRoute>} />
              
              {/* Redirect root to dashboard if authenticated, login otherwise */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
            
            {/* Catch all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
