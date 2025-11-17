import { useState } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicalDisclaimerDialog, useMedicalDisclaimer } from '@/components/medical/MedicalDisclaimerDialog';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { CoachDashboard } from '@/components/coach/CoachDashboard';
import { CoachConversationManager } from '@/components/coach/CoachConversationManager';
import { CoachSettingsPanel } from '@/components/coach/CoachSettingsPanel';
import { CoachEmotionTracker } from '@/components/coach/CoachEmotionTracker';
import { CoachQuickActions } from '@/components/coach/CoachQuickActions';
import { CoachView } from '@/modules/coach/CoachView';
import {
  LayoutDashboard,
  MessageCircle,
  TrendingUp,
  Zap,
  Settings,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'chat',
    label: 'Coach en direct',
    icon: <MessageCircle className="w-5 h-5" />,
    description: 'Discutez en temps réel',
  },
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: <LayoutDashboard className="w-5 h-5" />,
    description: 'Vue globale du bien-être',
  },
  {
    id: 'emotions',
    label: 'Suivi émotionnel',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Analyse vos émotions',
  },
  {
    id: 'conversations',
    label: 'Mes conversations',
    icon: <MessageCircle className="w-5 h-5" />,
    description: 'Historique & partage',
  },
  {
    id: 'quick-actions',
    label: 'Actions rapides',
    icon: <Zap className="w-5 h-5" />,
    description: 'Templates & raccourcis',
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: <Settings className="w-5 h-5" />,
    description: 'Personnalisation',
  },
];

const CoachEnhancedPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  usePageSEO({
    title: 'Coach IA Émotionnel - Plateforme Complète',
    description: 'Accédez à votre coach IA, tableau de bord de bien-être, suivi émotionnel et plus encore.',
    keywords: 'coach IA, bien-être, suivi émotionnel, intelligence émotionnelle',
  });

  const {
    showDisclaimer,
    isAccepted,
    handleAccept,
    handleDecline,
  } = useMedicalDisclaimer('ai_coach_enhanced');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <CoachView initialMode="b2c" />;
      case 'dashboard':
        return <CoachDashboard />;
      case 'emotions':
        return <CoachEmotionTracker />;
      case 'conversations':
        return <CoachConversationManager />;
      case 'quick-actions':
        return <CoachQuickActions />;
      case 'settings':
        return <CoachSettingsPanel />;
      default:
        return <CoachDashboard />;
    }
  };

  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950" data-testid="page-root">
      <MedicalDisclaimerDialog
        open={showDisclaimer}
        onAccept={handleAccept}
        onDecline={handleDecline}
        feature="ai_coach_enhanced"
      />

      {isAccepted && (
        <ConsentGate>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar navigation */}
            <aside
              className={`${
                sidebarOpen ? 'w-64' : 'w-0'
              } bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto transition-all duration-300 hidden md:block`}
            >
              <div className="p-6 space-y-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">
                  EmotionsCare Coach
                </h2>

                <nav className="space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full px-4 py-3 rounded-lg transition-all text-left group ${
                        activeTab === item.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-sm">{item.label}</p>
                          <p className="text-xs opacity-75">{item.description}</p>
                        </div>
                        {activeTab === item.id && (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Footer info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white dark:from-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    💡 Pro Tip
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-200">
                    Utilisez les actions rapides pour lancer des conversations plus vite.
                  </p>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col overflow-hidden">
              {/* Top bar */}
              <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    {sidebarOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                      {activeItem?.label}
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {activeItem?.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    ℹ️ Aide
                  </Button>
                  <Button size="sm">
                    📧 Feedback
                  </Button>
                </div>
              </header>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 max-w-7xl mx-auto">
                  {renderContent()}
                </div>
              </div>
            </main>
          </div>
        </ConsentGate>
      )}
    </div>
  );
};

export default CoachEnhancedPage;
