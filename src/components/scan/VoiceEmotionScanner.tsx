
import React from 'react';
import { VoiceEmotionScannerProps, EmotionResult } from '@/types';

export const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ 
  onResult,
  autoStart = false,
  duration = 30
}) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(duration);
  
  const startRecording = () => {
    setIsRecording(true);
    setTimeLeft(duration);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    
    // Create mock result
    const mockResult: EmotionResult = {
      emotion: 'calm',
      score: 0.75,
      confidence: 0.8,
      timestamp: new Date().toISOString(),
      transcript: "This is a sample transcript from voice analysis",
      feedback: "Your voice indicates a calm and composed emotional state"
    };
    
    if (onResult) {
      onResult(mockResult);
    }
  };
  
  React.useEffect(() => {
    if (autoStart) {
      startRecording();
    }
  }, [autoStart]);
  
  React.useEffect(() => {
    let timer: number;
    
    if (isRecording && timeLeft > 0) {
      timer = window.setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRecording && timeLeft === 0) {
      stopRecording();
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isRecording, timeLeft]);
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-3">Voice Emotion Scanner</h3>
      
      <div className="space-y-4">
        {isRecording ? (
          <div className="text-center">
            <div className="inline-block w-16 h-16 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-red-500"></div>
            </div>
            <p className="mt-2 text-sm font-medium">Recording... {timeLeft}s</p>
            <button 
              onClick={stopRecording}
              className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Stop
            </button>
          </div>
        ) : (
          <button
            onClick={startRecording}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            Start Voice Analysis
          </button>
        )}
        
        <p className="text-sm text-gray-500">
          Speak clearly for {duration} seconds to analyze your emotional state through voice patterns
        </p>
      </div>
    </div>
  );
};

export default VoiceEmotionScanner;
