import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AssessmentWrapper } from './components/assess/AssessmentWrapper';
import { HomePage } from './components/HomePage';

const queryClient = new QueryClient();

function App() {
  const [currentView, setCurrentView] = React.useState<'home' | 'assessment'>('home');
  const [selectedInstrument, setSelectedInstrument] = React.useState<'WHO5' | 'STAI6' | 'SAM' | 'SUDS' | 'PANAS10' | 'PSS10'>('WHO5');

  const handleStartAssessment = (instrument: typeof selectedInstrument) => {
    setSelectedInstrument(instrument);
    setCurrentView('assessment');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        {currentView === 'home' ? (
          <HomePage onStartAssessment={handleStartAssessment} />
        ) : (
          <div className="container mx-auto p-4">
            <button 
              onClick={handleBackToHome}
              className="mb-4 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
            >
              ← Retour à l'accueil
            </button>
            <AssessmentWrapper 
              instrument={selectedInstrument}
              onComplete={(result: any) => {
                console.log('Assessment completed:', result);
                setCurrentView('home');
              }}
            />
          </div>
        )}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;