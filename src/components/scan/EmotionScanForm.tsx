
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import AnalysisDialog from './AnalysisDialog';
import FormHeader from './form/FormHeader';
import QuickModeForm from './form/QuickModeForm';
import StandardModeForm from './form/StandardModeForm';
import EmotionScanAnalysisResult from './form/EmotionScanAnalysisResult';
import useEmotionScanFormState from './form/useEmotionScanFormState';

export interface EmotionScanFormProps {
  onScanSaved: () => void;
  onClose?: () => void;
  onSaveComplete?: () => void; // Added for ScanPage.tsx compatibility
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ 
  onScanSaved, 
  onClose, 
  onSaveComplete 
}) => {
  const { user } = useAuth();
  
  const {
    activeTab,
    setActiveTab,
    emojis,
    setEmojis,
    text,
    audioUrl,
    setAudioUrl,
    analyzing,
    setAnalyzing,
    isConfidential,
    setIsConfidential,
    shareWithCoach,
    setShareWithCoach,
    charCount,
    analysisResult,
    quickMode,
    setQuickMode,
    skipDay,
    setSkipDay,
    MAX_CHARS,
    handleEmojiClick,
    handleTextChange,
    handleSubmit,
    handleCorrection
  } = useEmotionScanFormState(onScanSaved, onSaveComplete, user?.id);

  return (
    <div className="space-y-6">
      <FormHeader 
        quickMode={quickMode}
        setQuickMode={setQuickMode}
        skipDay={skipDay}
        setSkipDay={setSkipDay}
        onClose={onClose}
      />

      {analysisResult ? (
        <EmotionScanAnalysisResult 
          analysisResult={analysisResult}
          onCorrection={handleCorrection}
        />
      ) : (
        <>
          {quickMode ? (
            <QuickModeForm 
              emojis={emojis}
              onEmojiClick={handleEmojiClick}
              onClear={() => setEmojis('')}
            />
          ) : (
            <StandardModeForm 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              text={text}
              charCount={charCount}
              maxChars={MAX_CHARS}
              emojis={emojis}
              audioUrl={audioUrl}
              onTextChange={handleTextChange}
              onEmojiClick={handleEmojiClick}
              onClearEmojis={() => setEmojis('')}
              setAudioUrl={setAudioUrl}
              isConfidential={isConfidential}
              setIsConfidential={setIsConfidential}
              shareWithCoach={shareWithCoach}
              setShareWithCoach={setShareWithCoach}
              onSubmit={handleSubmit}
              analyzing={analyzing}
              onClose={onClose}
            />
          )}
        </>
      )}

      <AnalysisDialog 
        open={analyzing} 
        onOpenChange={(open) => !open && setAnalyzing(false)} 
      />
    </div>
  );
};

export default EmotionScanForm;
