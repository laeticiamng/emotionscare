
import React from 'react';
import { LiveVoiceScannerProps, EmotionResult } from '@/types';

export const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({ 
  onResult, 
  autoStart = false,
  duration = 30 
}) => {
  const handleScan = () => {
    // Mock implementation - in a real app this would record and analyze voice
    const mockResult: EmotionResult = {
      emotion: 'happy',
      score: 0.85,
      confidence: 0.9,
      timestamp: new Date().toISOString(),
      transcript: "This is a simulated voice transcript",
      feedback: "You sound happy and positive"
    };
    
    if (onResult) {
      onResult(mockResult);
    }
  };

  React.useEffect(() => {
    if (autoStart) {
      // Auto start the scanner if requested
      const timer = setTimeout(handleScan, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Voice Emotion Scanner</h3>
      <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <button
          onClick={handleScan}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Start Voice Scan
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Speak clearly for {duration} seconds to analyze your emotional state
      </div>
    </div>
  );
};

export default LiveVoiceScanner;
