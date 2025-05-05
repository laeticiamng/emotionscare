
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VRSessionTemplate, VRSession, Emotion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ChatInterface } from '@/components/chat/ChatInterface';
import VRTemplateGrid from '@/components/vr/VRTemplateGrid';
import VRSessionHistory from '@/components/vr/VRSessionHistory';
import { useVRSession } from '@/hooks/useVRSession';

const VRSessionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const recommendedTemplate = location.state?.recommendedTemplate as VRSessionTemplate | undefined;
  
  const { 
    selectedTemplate,
    isSessionActive,
    recentSessions,
    heartRate,
    handleSelectTemplate,
    handleStartSession,
    handleCompleteSession,
    templates
  } = useVRSession(user?.id, recommendedTemplate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <VRPageHeader onNavigateBack={() => navigate('/dashboard')} />
      
      {/* Content */}
      {isSessionActive ? (
        // Active Session View
        <VRActiveSession
          template={selectedTemplate!}
          onCompleteSession={handleCompleteSession}
        />
      ) : selectedTemplate ? (
        // Template Details View
        <VRTemplateDetailView 
          template={selectedTemplate} 
          heartRate={heartRate.before} 
          onStartSession={handleStartSession}
          onBack={() => handleSelectTemplate(null)}
          recentSessions={recentSessions}
        />
      ) : (
        // Template Selection View
        <VRSelectionView 
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
        />
      )}
    </div>
  );
};

export default VRSessionPage;
