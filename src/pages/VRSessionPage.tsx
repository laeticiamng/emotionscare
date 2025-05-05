
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
    selectedTemplate, 
    recentSessions, 
    templates, 
    heartRate,
    handleSelectTemplate,
    handleStartSession, 
    handleCompleteSession
  } = useVRSession(id);

  // View states
  const [view, setView] = useState<'selection' | 'detail' | 'session'>('selection');
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [activeTemplate, setActiveTemplate] = useState(selectedTemplate);
  const [completedSession, setCompletedSession] = useState<any>(null);

  useEffect(() => {
    // If we have an ID but no activeTemplate yet, set to detail view
    if (id) {
      const matchingTemplate = templates.find(t => t.template_id === id);
      if (matchingTemplate) {
        setActiveTemplate(matchingTemplate);
        setView('detail');
        return;
      }
    }

    // If we have a session, show session view
    if (currentSession) {
      setView('session');
      return;
    }

    // Default to selection
    setView('selection');
  }, [id, templates, currentSession]);

  const startVRSession = () => {
    if (activeTemplate) {
      handleStartSession();
      setCurrentSession({
        id: `session-${Date.now()}`,
        template_id: activeTemplate.template_id,
        started_at: new Date().toISOString()
      });
      setView('session');
    }
  };
  
  const completeVRSession = async () => {
    await handleCompleteSession();
    setCompletedSession(currentSession);
    setCurrentSession(null);
    navigate('/vr-sessions');
  };

  const handleNavigateBack = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <VRPageHeader onNavigateBack={handleNavigateBack} />

      {view === 'session' && activeTemplate && (
        <VRActiveSession
          template={activeTemplate} 
          onComplete={completeVRSession} 
        />
      )}

      {view === 'detail' && activeTemplate && (
        <VRTemplateDetailView 
          template={activeTemplate} 
          heartRate={heartRate.before}
          onStartSession={startVRSession}
          onBack={() => {
            navigate('/vr-sessions');
          }}
          recentSessions={recentSessions}
        />
      )}

      {view === 'selection' && (
        <VRSelectionView
          templates={templates}
          onSelectTemplate={(template) => {
            navigate(`/vr-sessions/${template.template_id}`);
          }}
        />
      )}

      {/* Back button - show on all views except selection */}
      {view !== 'selection' && (
        <div className="mt-8">
          <Button variant="ghost" onClick={() => navigate('/vr-sessions')} className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Retour à la sélection
          </Button>
        </div>
      )}
    </div>
  );
};

export default VRSessionPage;
