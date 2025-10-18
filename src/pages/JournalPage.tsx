import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { JournalSidebar } from '@/components/journal/JournalSidebar';
import { useJournalComposer } from '@/modules/journal/useJournalComposer';
import { JournalComposer } from '@/modules/journal';
import type { SanitizedNote } from '@/modules/journal/types';

// Pages lazy loaded
import { JournalNotesPage } from './journal/JournalNotesPage';
import { JournalFavoritesPage } from './journal/JournalFavoritesPage';
import { JournalSearchPage } from './journal/JournalSearchPage';
import { JournalAnalyticsPage } from './journal/JournalAnalyticsPage';
import { JournalActivityPage } from './journal/JournalActivityPage';
import { JournalGoalsPage } from './journal/JournalGoalsPage';
import { JournalArchivePage } from './journal/JournalArchivePage';
import JournalSettingsPage from './journal/JournalSettingsPage';

/**
 * Page principale du module Journal
 * Intègre tous les composants avec navigation sidebar
 */
export function JournalPage() {
  const [notes, setNotes] = useState<SanitizedNote[]>([]);
  const composer = useJournalComposer();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <JournalSidebar basePath="/journal" />

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col">
          {/* Header avec trigger */}
          <header className="h-14 border-b bg-background flex items-center px-4">
            <SidebarTrigger />
            <h1 className="ml-4 text-lg font-semibold">Mon Journal</h1>
          </header>

          {/* Contenu des routes */}
          <main className="flex-1 overflow-auto">
            <Routes>
              {/* Route d'écriture (défaut) */}
              <Route
                index
                element={
                  <div className="container max-w-4xl mx-auto p-6">
                    <JournalComposer composer={composer} />
                  </div>
                }
              />

              {/* Routes des différentes sections */}
              <Route path="notes" element={<JournalNotesPage notes={notes} />} />
              <Route path="favorites" element={<JournalFavoritesPage notes={notes} />} />
              <Route path="search" element={<JournalSearchPage notes={notes} />} />
              <Route path="analytics" element={<JournalAnalyticsPage notes={notes} />} />
              <Route path="activity" element={<JournalActivityPage notes={notes} />} />
              <Route path="goals" element={<JournalGoalsPage notes={notes} />} />
              <Route path="archive" element={<JournalArchivePage notes={notes} />} />
              <Route path="settings" element={<JournalSettingsPage notes={notes} />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/journal" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
