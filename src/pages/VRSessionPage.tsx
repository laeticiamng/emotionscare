
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVRSession } from '@/hooks/useVRSession';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import VRActiveSession from '@/components/vr/VRActiveSession';
import VRTemplateDetailView from '@/components/vr/VRTemplateDetailView';
import VRSelectionView from '@/components/vr/VRSelectionView';
import VRPageHeader from '@/components/vr/VRPageHeader';

const VRSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    templates, 
    session, 
    activeTemplate, 
    completedSession, 
    handleStartSession, 
    handleCompleteSession
  } = useVRSession(id);

  // View states
  const [view, setView] = useState<'selection' | 'detail' | 'session'>('selection');

  useEffect(() => {
    // If we have an ID but no activeTemplate yet, set to detail view
    if (id && !activeTemplate) {
      setView('detail');
      return;
    }

    // If we have a session, show session view
    if (session) {
      setView('session');
      return;
    }

    // Default to selection
    setView('selection');
  }, [id, activeTemplate, session]);
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <VRPageHeader />

      {view === 'session' && session && (
        <VRActiveSession
          session={session}
          template={activeTemplate!}
          onComplete={handleCompleteSession} 
        />
      )}

      {view === 'detail' && activeTemplate && (
        <VRTemplateDetailView 
          template={activeTemplate} 
          onStart={() => handleStartSession(activeTemplate.template_id)} 
          onBack={() => {
            navigate('/vr');
          }}
        />
      )}

      {view === 'selection' && (
        <VRSelectionView
          templates={templates}
          completedSession={completedSession}
          onSelectTemplate={(template) => {
            navigate(`/vr/${template.template_id}`);
          }}
        />
      )}

      {/* Back button - show on all views except selection */}
      {view !== 'selection' && (
        <div className="mt-8">
          <Button variant="ghost" onClick={() => navigate('/vr')} className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Retour à la sélection
          </Button>
        </div>
      )}
    </div>
  );
};

export default VRSessionPage;
