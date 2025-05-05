import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockVRTemplatesData } from '@/data/mockVRTemplates';
import type { VRSessionTemplate, VRSession, Emotion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import VRTemplateGrid from '@/components/vr/VRTemplateGrid';
import VRTemplateDetail from '@/components/vr/VRTemplateDetail';
import VRSessionWithMusic from '@/components/vr/VRSessionWithMusic';
import VRSessionHistory from '@/components/vr/VRSessionHistory';
import { supabase } from '@/lib/supabase-client';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { extractYoutubeID } from '@/utils/vrUtils';
import { createVRSession } from '@/lib/vrService';
import { useAuth } from '@/contexts/AuthContext';

const VRSessionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const recommendedTemplate = location.state?.recommendedTemplate as VRSessionTemplate | undefined;
  const [selectedTemplate, setSelectedTemplate] = useState<VRSessionTemplate | null>(recommendedTemplate || null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [heartRate, setHeartRate] = useState({ before: 82, after: null as number | null });
  const [recentSessions, setRecentSessions] = useState<VRSession[]>([]);
  const [templates, setTemplates] = useState<VRSessionTemplate[]>([]);
  const [latestEmotion, setLatestEmotion] = useState<Emotion | null>(null);
  
  // Load templates with progress tracking
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // In a real app, we would fetch from Supabase
        // For now, we'll enhance the mock data with completion rates
        const enhancedTemplates = mockVRTemplatesData.map(template => {
          // Get random completion rate for demo purposes
          const completionRate = Math.floor(Math.random() * 100);
          return {
            ...template,
            completion_rate: completionRate,
            is_audio_only: template.template_id === '3' || template.template_id === '4', 
            audio_url: template.audio_url || 
              (template.template_id === '3' || template.template_id === '4' ? 
              'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-sound-1821.mp3' : undefined)
          };
        });
        
        setTemplates(enhancedTemplates);
        
        // If we have a recommended template from state navigation, find and select it
        if (recommendedTemplate) {
          const matchingTemplate = enhancedTemplates.find(
            t => t.template_id === recommendedTemplate.template_id
          );
          if (matchingTemplate) {
            setSelectedTemplate(matchingTemplate);
            setSessionTimeRemaining(matchingTemplate.duration);
            setHeartRate({ before: Math.floor(75 + Math.random() * 15), after: null });
          }
        }
        
        // Load recent sessions
        if (user) {
          loadUserSessions(user.id);
        }
      } catch (error) {
        console.error('Error loading VR templates:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les sessions VR.",
          variant: "destructive"
        });
      }
    };
    
    loadTemplates();
  }, [toast, recommendedTemplate, user]);

  // Load user's recent VR sessions
  const loadUserSessions = async (userId: string) => {
    try {
      // In a real app, this would fetch from Supabase
      // For now we'll use mock data
      const mockSessions: VRSession[] = [
        {
          id: 'session-1',
          user_id: userId,
          template_id: '1',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          duration: 5,
          duration_seconds: 300,
          completed: true,
          location_url: mockVRTemplates[0].preview_url,
          heart_rate_before: 84,
          heart_rate_after: 72,
          is_audio_only: false
        },
        {
          id: 'session-2',
          user_id: userId,
          template_id: '2',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 7,
          duration_seconds: 420,
          completed: true,
          location_url: mockVRTemplates[1].preview_url,
          heart_rate_before: 88,
          heart_rate_after: 75,
          is_audio_only: false
        }
      ];
      
      setRecentSessions(mockSessions);
    } catch (error) {
      console.error('Error loading user VR sessions:', error);
    }
  };

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
      title: "Session démarrée",
      description: `Profitez de votre session de ${selectedTemplate.duration} minutes.`,
    });
    
    setIsSessionActive(true);
    
    // For demo purposes only - in production this would be template.duration * 60 * 1000
    if (!selectedTemplate.is_audio_only) {
      setTimeout(() => {
        handleCompleteSession();
      }, 30000); // 30 seconds for demo 
    }
  };
  
  // Handle session completion
  const handleCompleteSession = async () => {
    if (!selectedTemplate || !user) return;
    
    // Simulate heart rate decrease after relaxation
    const afterHeartRate = Math.max(60, heartRate.before - Math.floor(5 + Math.random() * 10));
    setHeartRate({ ...heartRate, after: afterHeartRate });
    
    // Create a new session record
    try {
      // In a real app, we would save to Supabase using createVRSession
      console.log('Creating VR session:', {
        user_id: user.id,
        duration_seconds: selectedTemplate.duration * 60,
        location_url: selectedTemplate.preview_url,
        hr_before: heartRate.before,
        hr_after: afterHeartRate
      });
      
      const newSession: VRSession = {
        id: `session-${Date.now()}`,
        user_id: user.id,
        template_id: selectedTemplate.template_id,
        date: new Date().toISOString(),
        duration: selectedTemplate.duration,
        duration_seconds: selectedTemplate.duration * 60,
        completed: true,
        location_url: selectedTemplate.preview_url,
        heart_rate_before: heartRate.before,
        heart_rate_after: afterHeartRate,
        is_audio_only: selectedTemplate.is_audio_only || false
      };
      
      // Update recent sessions
      setRecentSessions([newSession, ...recentSessions]);
      
      // Update template completion rate (in a real app, this would be calculated server-side)
      setTemplates(prev => 
        prev.map(t => 
          t.template_id === selectedTemplate.template_id 
            ? { 
                ...t, 
                completion_rate: t.completion_rate ? Math.min(t.completion_rate + 10, 100) : 10 
              } 
            : t
        )
      );
      
      setIsSessionActive(false);
      
      toast({
        title: "Session terminée",
        description: `Votre rythme cardiaque a diminué de ${heartRate.before - afterHeartRate} bpm.`,
      });
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la session.",
        variant: "destructive"
      });
      setIsSessionActive(false);
    }
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
        <VRSessionWithMusic
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
        <div className="space-y-6">
          <VRTemplateGrid
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
          />
          
          {/* Assistant Chat Interface */}
          <ChatInterface />
        </div>
      )}
    </div>
  );
};

export default VRSessionPage;
