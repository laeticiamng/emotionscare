
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Users, Award, Music, Clock,
  Calendar, FileBarChart, Presentation, Menu, X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { User } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

// Premium components
import PremiumAdminHeader from './PremiumAdminHeader';
import EmotionalClimateAnalytics from './EmotionalClimateAnalytics';
import SocialMetricsCard from './SocialMetricsCard';
import GamificationCard from './GamificationCard';
import ReportGenerator from './ReportGenerator';
import EmotionalTeamView from './EmotionalTeamView';
import PresentationMode from './PresentationMode';
import RhSelfCare from './RhSelfCare';

// Type definitions
interface AdminPremiumProps {
  user: User;
  isExpanded?: boolean;
}

const AdminPremiumInterface: React.FC<AdminPremiumProps> = ({ 
  user,
  isExpanded = true
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [presentationMode, setPresentationMode] = useState(false);

  // Sidebar menu items
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'users', label: 'Utilisateurs', icon: <Users className="h-4 w-4" /> },
    { id: 'culture', label: 'Culture & Engagement', icon: <Award className="h-4 w-4" /> },
    { id: 'bien-etre', label: 'Bien-être', icon: <Music className="h-4 w-4" /> },
    { id: 'activity', label: 'Activité', icon: <Clock className="h-4 w-4" /> },
    { id: 'planification', label: 'Planification', icon: <Calendar className="h-4 w-4" /> },
    { id: 'rapports', label: 'Rapports', icon: <FileBarChart className="h-4 w-4" /> },
    { id: 'presentation', label: 'Présentation', icon: <Presentation className="h-4 w-4" /> },
  ];

  // Toggle presentation mode
  const togglePresentationMode = () => {
    setPresentationMode(!presentationMode);
  };

  // Render mobile sidebar
  const renderSidebar = () => (
    <div className="h-full p-4 w-64 bg-background border-r">
      <div className="flex flex-col h-full">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab(item.id);
                if (!isDesktop) setSidebarOpen(false);
              }}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </div>
        
        {/* Self-care section at bottom */}
        <div className="mt-auto pt-4 border-t">
          <RhSelfCare />
        </div>
      </div>
    </div>
  );

  // If in presentation mode, show presentation component
  if (presentationMode) {
    return (
      <PresentationMode 
        onExit={togglePresentationMode} 
        data={{ 
          emotionalTrend: [
            { date: '2023-05-01', value: 65 },
            { date: '2023-05-15', value: 72 },
            { date: '2023-05-30', value: 68 },
            { date: '2023-06-15', value: 75 },
            { date: '2023-06-30', value: 81 },
            { date: '2023-07-15', value: 78 },
          ],
          teamMetrics: {
            engagementScore: 78,
            participationRate: 82,
            wellbeingIndex: 74
          }
        }} 
      />
    );
  }

  // Main application interface
  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Premium admin header */}
      <PremiumAdminHeader 
        user={user}
        onPresentationMode={togglePresentationMode}
      />

      {/* Main content with sidebar */}
      <div className="container mx-auto px-4 mt-6">
        <div className="lg:hidden flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {menuItems.find(item => item.id === activeTab)?.label || 'Administration'}
          </h1>
          
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              {renderSidebar()}
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop view with persistent sidebar */}
        <div className="flex gap-6">
          {/* Sidebar for desktop */}
          {isDesktop && (
            <aside className="hidden lg:block w-64 shrink-0">
              {renderSidebar()}
            </aside>
          )}

          {/* Main content area */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {activeTab === 'dashboard' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <EmotionalClimateAnalytics />
                    </div>
                    <SocialMetricsCard />
                    <GamificationCard />
                  </div>
                )}

                {activeTab === 'rapports' && (
                  <ReportGenerator />
                )}

                {activeTab === 'users' && (
                  <EmotionalTeamView />
                )}

                {activeTab === 'presentation' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Mode présentation</CardTitle>
                      <CardDescription>
                        Présentez les données émotionnelles de votre équipe dans un format optimisé pour les réunions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={togglePresentationMode}>
                        <Presentation className="mr-2 h-4 w-4" />
                        Lancer la présentation
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {(activeTab === 'culture' || activeTab === 'bien-etre' || 
                  activeTab === 'activity' || activeTab === 'planification') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Module {menuItems.find(item => item.id === activeTab)?.label}</CardTitle>
                      <CardDescription>
                        Cette section est en cours de développement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
                        <p className="text-muted-foreground">Fonctionnalité premium à venir</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPremiumInterface;
