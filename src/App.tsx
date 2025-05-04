
import './lib/setupTestUser';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import { AnimatePresence, motion } from "framer-motion";

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
import VRSessionPage from "./pages/VRSessionPage";
import GamificationPage from "./pages/GamificationPage";
import NotImplementedPage from "./pages/NotImplementedPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Animation wrapper for routes
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// AnimatedRoutes component to add page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/login" element={
          <PageTransition><LoginPage /></PageTransition>
        } />
        
        {/* Protected routes inside layout */}
        <Route element={<Layout />}>
          <Route path="/onboarding" element={<PageTransition><OnboardingPage /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
          
          {/* Scan routes */}
          <Route path="/scan" element={<PageTransition><ScanPage /></PageTransition>} />
          <Route path="/scan/:userId" element={<PageTransition><ScanDetailPage /></PageTransition>} />
          
          {/* Journal routes */}
          <Route path="/journal" element={<PageTransition><JournalPage /></PageTransition>} />
          <Route path="/journal/new" element={<PageTransition><JournalNewPage /></PageTransition>} />
          <Route path="/journal/:entryId" element={<PageTransition><JournalEntryPage /></PageTransition>} />
          
          {/* Community routes */}
          <Route path="/community" element={<PageTransition><CommunityFeed /></PageTransition>} />
          <Route path="/community/groups" element={<PageTransition><GroupList /></PageTransition>} />
          <Route path="/community/buddy" element={<PageTransition><BuddyPage /></PageTransition>} />
          
          {/* VR Route */}
          <Route path="/vr" element={<PageTransition><VRSessionPage /></PageTransition>} />
          
          {/* Gamification Route */}
          <Route path="/gamification" element={<PageTransition><GamificationPage /></PageTransition>} />
          
          {/* Not implemented routes */}
          <Route path="/library" element={<PageTransition><NotImplementedPage /></PageTransition>} />
          <Route path="/reports" element={<PageTransition><NotImplementedPage /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><NotImplementedPage /></PageTransition>} />
          
          {/* Redirect root to dashboard if authenticated, login otherwise */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
        
        {/* Catch all for 404 */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
