
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockVRTemplates } from '@/data/mockData';
import type { VRSessionTemplate, VRSession } from '@/types';
import { useToast } from '@/hooks/use-toast';
import VRTemplateGrid from '@/components/vr/VRTemplateGrid';
import VRTemplateDetail from '@/components/vr/VRTemplateDetail';
import VRSessionView from '@/components/vr/VRSessionView';
import VRSessionHistory from '@/components/vr/VRSessionHistory';

const VRSessionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<VRSessionTemplate | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [heartRate, setHeartRate] = useState({ before: 82, after: null as number | null });
  const [recentSessions, setRecentSessions] = useState<VRSession[]>([]);
  
  // Load templates from mock data
  const availableTemplates = mockVRTemplates;

  // Handle template selection
  const handleSelectTemplate = (template: VRSessionTemplate) => {
    setSelectedTemplate(template);
    setSessionTimeRemaining(template.duration);
    // Reset heart rate tracking
    setHeartRate({ before: Math.floor(75 + Math.random() * 15), after: null });
  };

  // Handle session start
  const handleStartSession = () => {
    if (!selectedTemplate) return;
    
    toast({
      title: "Session VR démarrée",
      description: `Profitez de votre session de ${selectedTemplate.duration} minutes.`,
    });
    
    setIsSessionActive(true);
    
    // Simulate session completion after duration
    setTimeout(() => {
      handleCompleteSession();
    }, 5000); // Shortened for demo purposes (normally would be template.duration * 60 * 1000)
  };
  
  // Handle session completion
  const handleCompleteSession = () => {
    if (!selectedTemplate) return;
    
    // Simulate heart rate decrease after relaxation
    const afterHeartRate = Math.max(60, heartRate.before - Math.floor(5 + Math.random() * 10));
    setHeartRate({ ...heartRate, after: afterHeartRate });
    
    // Create a new session record
    const newSession: VRSession = {
      id: `session-${Date.now()}`,
      user_id: 'current-user',
      date: new Date().toISOString(),
      duration_seconds: selectedTemplate.duration * 60,
      location_url: selectedTemplate.preview_url,
      heart_rate_before: heartRate.before,
      heart_rate_after: afterHeartRate
    };
    
    // Update recent sessions
    setRecentSessions([newSession, ...recentSessions]);
    
    setIsSessionActive(false);
    
    toast({
      title: "Session VR terminée",
      description: `Votre rythme cardiaque a diminué de ${heartRate.before - afterHeartRate} bpm.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Micro-pauses VR</h1>
          <p className="text-muted-foreground">
            Accordez-vous un moment de détente immersive
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
        </Button>
      </div>
      
      {/* Content */}
      {isSessionActive ? (
        /* Active Session View */
        <VRSessionView
          template={selectedTemplate!}
          onCompleteSession={handleCompleteSession}
        />
      ) : selectedTemplate ? (
        /* Template Details View */
        <div className="space-y-6">
          <VRTemplateDetail
            template={selectedTemplate}
            heartRate={heartRate.before}
            onStartSession={handleStartSession}
            onBack={() => setSelectedTemplate(null)}
          />
          
          <VRSessionHistory sessions={recentSessions} />
        </div>
      ) : (
        /* Template Selection View */
        <VRTemplateGrid
          templates={availableTemplates}
          onSelectTemplate={handleSelectTemplate}
        />
      )}
    </div>
  );
};

export default VRSessionPage;
