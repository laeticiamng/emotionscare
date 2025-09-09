import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import './App.css';

// Import des contexts
import AuthContextProvider from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SecurityProvider } from './components/security/SecurityProvider';

// Import des pages
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import NotFoundPage from './pages/NotFoundPage';
import Point20Page from './pages/Point20Page';
import GeneralPage from './pages/GeneralPage';
import PrivacyPage from './pages/PrivacyPage';
import DashboardPage from './pages/DashboardPage';
import JournalPage from './pages/JournalPage';
import MusicPage from './pages/MusicPage';
import EmotionsPage from './pages/EmotionsPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import CalendarPage from './pages/CalendarPage';
import HelpPage from './pages/HelpPage';

// Import des composants layout
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <AuthContextProvider>
            <UserModeProvider>
              <SecurityProvider>
                <Router>
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                          <SidebarTrigger className="-ml-1" />
                          <div className="font-semibold text-lg">EmotionsCare</div>
                        </header>
                        <main className="flex-1 p-4">
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/test" element={<TestPage />} />
                            <Route path="/point20" element={<Point20Page />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/journal" element={<JournalPage />} />
                            <Route path="/emotions" element={<EmotionsPage />} />
                            <Route path="/music" element={<MusicPage />} />
                            <Route path="/messages" element={<MessagesPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path="/settings" element={<GeneralPage />} />
                            <Route path="/privacy" element={<PrivacyPage />} />
                            <Route path="/help" element={<HelpPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                          </Routes>
                        </main>
                      </SidebarInset>
                    </div>
                  </SidebarProvider>
                  <Toaster />
                  <Sonner />
                </Router>
              </SecurityProvider>
            </UserModeProvider>
          </AuthContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;