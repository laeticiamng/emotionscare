
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { PremiumAdminHeader } from './PremiumAdminHeader';
import { EmotionalClimateAnalytics } from './EmotionalClimateAnalytics';
import { SocialCocoonDashboard } from './SocialCocoonDashboard';
import { GamificationInsights } from './GamificationInsights';
import { HumanValueReportSection } from './HumanValueReportSection';
import { PremiumDashVideoSection } from './PremiumDashVideoSection';
import { RhSelfCare } from './RhSelfCare';
import { AdminPresentationMode } from './AdminPresentationMode';
import useSound from '@/hooks/useSound';
import type { User } from '@/types';

interface AdminPremiumInterfaceProps {
  user: User | null;
}

// Premium interface sound effects
const sounds = {
  uiClick: '/sounds/ui-click-soft.mp3',
  notification: '/sounds/notification-gentle.mp3',
  success: '/sounds/success-chime.mp3',
  ambientLoop: '/sounds/ambient-calm.mp3'
};

const AdminPremiumInterface: React.FC<AdminPremiumInterfaceProps> = ({ user }) => {
  const { theme } = useTheme();
  const [zenMode, setZenMode] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [isSoundEnabled, setSoundEnabled] = useState(false);
  const [visualStyle, setVisualStyle] = useState<'minimal' | 'artistic'>('minimal');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [rhInteractionCount, setRhInteractionCount] = useState(0);
  const [showSelfCarePrompt, setShowSelfCarePrompt] = useState(false);
  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);
  
  const { play: playClick } = useSound(sounds.uiClick);
  const { play: playNotification } = useSound(sounds.notification);
  const { play: playSuccess } = useSound(sounds.success);

  useEffect(() => {
    if (isSoundEnabled) {
      ambientSoundRef.current = new Audio(sounds.ambientLoop);
      ambientSoundRef.current.volume = 0.1;
      ambientSoundRef.current.loop = true;
      ambientSoundRef.current.play().catch(e => console.log('Audio autoplay prevented:', e));
      
      return () => {
        if (ambientSoundRef.current) {
          ambientSoundRef.current.pause();
          ambientSoundRef.current = null;
        }
      };
    }
  }, [isSoundEnabled]);

  // Track RH interaction and suggest self-care
  useEffect(() => {
    if (rhInteractionCount > 8 && !showSelfCarePrompt) {
      setShowSelfCarePrompt(true);
      if (isSoundEnabled) playNotification();
      
      // Auto-hide prompt after 30 seconds
      const timer = setTimeout(() => {
        setShowSelfCarePrompt(false);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [rhInteractionCount, isSoundEnabled, playNotification, showSelfCarePrompt]);

  const handleSectionClick = (section: string) => {
    if (isSoundEnabled) playClick();
    setActiveSection(section === activeSection ? null : section);
    setRhInteractionCount(prev => prev + 1);
  };

  const handleZenModeToggle = () => {
    if (isSoundEnabled) playClick();
    setZenMode(!zenMode);
    
    // When turning on zen mode, we should enable ambient sound
    if (!zenMode && !isSoundEnabled) {
      setSoundEnabled(true);
    }
  };

  const handlePresentationModeToggle = () => {
    if (isSoundEnabled) playSuccess();
    setPresentationMode(!presentationMode);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen ${zenMode ? 'zen-mode' : ''}`}
    >
      {/* Dynamic Background - changes based on collective emotional state */}
      <div 
        className={`fixed inset-0 transition-all duration-1000 ease-in-out z-0 
          ${theme === 'dark' ? 'premium-gradient-dark' : 'premium-gradient-light'} 
          ${zenMode ? 'zen-background' : ''}`}
      >
        {visualStyle === 'artistic' && (
          <div className="absolute inset-0 bg-cover bg-center opacity-10"
               style={{ backgroundImage: "url('/images/abstract-emotion-landscape.svg')" }} />
        )}
      </div>
      
      {presentationMode ? (
        <AdminPresentationMode 
          onExit={handlePresentationModeToggle} 
          playSound={isSoundEnabled ? playClick : undefined}
        />
      ) : (
        <div className="relative z-10">
          <PremiumAdminHeader 
            user={user}
            zenMode={zenMode}
            onZenModeToggle={handleZenModeToggle}
            isSoundEnabled={isSoundEnabled}
            onSoundToggle={() => setSoundEnabled(!isSoundEnabled)}
            visualStyle={visualStyle}
            onVisualStyleToggle={() => setVisualStyle(visualStyle === 'minimal' ? 'artistic' : 'minimal')}
            onPresentationMode={handlePresentationModeToggle}
            playSound={isSoundEnabled ? playClick : undefined}
          />
          
          <main className={`premium-layout py-6 ${zenMode ? 'zen-content' : ''}`}>
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div 
                className="lg:col-span-2"
                layout
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <EmotionalClimateAnalytics 
                  isActive={activeSection === 'emotional-climate'} 
                  onClick={() => handleSectionClick('emotional-climate')}
                  visualStyle={visualStyle}
                  zenMode={zenMode}
                />
              </motion.div>
              
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
              >
                <SocialCocoonDashboard 
                  isActive={activeSection === 'social-cocoon'} 
                  onClick={() => handleSectionClick('social-cocoon')}
                  visualStyle={visualStyle}
                  zenMode={zenMode}
                />
              </motion.div>
              
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
              >
                <GamificationInsights 
                  isActive={activeSection === 'gamification'} 
                  onClick={() => handleSectionClick('gamification')}
                  visualStyle={visualStyle}
                  zenMode={zenMode}
                />
              </motion.div>
              
              <motion.div 
                className="lg:col-span-2"
                layout
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
              >
                <HumanValueReportSection 
                  isActive={activeSection === 'human-value'} 
                  onClick={() => handleSectionClick('human-value')}
                  visualStyle={visualStyle}
                  zenMode={zenMode}
                />
              </motion.div>
              
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
              >
                <PremiumDashVideoSection 
                  isActive={activeSection === 'dash-video'} 
                  onClick={() => handleSectionClick('dash-video')}
                  visualStyle={visualStyle}
                  zenMode={zenMode}
                  playSound={isSoundEnabled ? playSuccess : undefined}
                />
              </motion.div>
            </div>
            
            {/* RH Self-Care Prompt */}
            <AnimatePresence>
              {showSelfCarePrompt && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="fixed bottom-8 right-8 max-w-md"
                >
                  <RhSelfCare 
                    onClose={() => setShowSelfCarePrompt(false)} 
                    playSound={isSoundEnabled ? playNotification : undefined}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      )}
      
      {/* Zen Mode Overlay */}
      {zenMode && (
        <div className="fixed inset-0 bg-black/10 dark:bg-white/5 pointer-events-none z-5"></div>
      )}
    </motion.div>
  );
};

export default AdminPremiumInterface;
