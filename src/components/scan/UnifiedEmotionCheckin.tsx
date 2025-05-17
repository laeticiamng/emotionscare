
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import LiveVoiceScanner from './LiveVoiceScanner';

interface UnifiedEmotionCheckinProps {
  onResult?: (result: EmotionResult) => void;
  onBack?: () => void;
}

const UnifiedEmotionCheckin: React.FC<UnifiedEmotionCheckinProps> = ({
  onResult,
  onBack
}) => {
  const [activeMethod, setActiveMethod] = useState<'voice' | 'text' | 'click' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  
  const handleMethodSelect = (method: 'voice' | 'text' | 'click') => {
    setActiveMethod(method);
    setIsScanning(method === 'voice');
    setScanResult(null);
  };
  
  const handleScanResult = (result: EmotionResult) => {
    setScanResult(result);
    setIsScanning(false);
    if (onResult) {
      onResult(result);
    }
  };
  
  const handleBackToMethods = () => {
    setActiveMethod(null);
    setScanResult(null);
    setIsScanning(false);
  };
  
  const renderMethodSelection = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Select your preferred method to check in with your emotions.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-primary" onClick={() => handleMethodSelect('voice')}>
          <CardContent className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-12 w-12 text-primary" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
              </svg>
            </div>
            <h3 className="font-semibold">Voice Analysis</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Speak about your day and we'll analyze your emotional tone
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-primary" onClick={() => handleMethodSelect('text')}>
          <CardContent className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-12 w-12 text-primary" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20" />
              </svg>
            </div>
            <h3 className="font-semibold">Text Analysis</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Write about your feelings and we'll analyze your emotions
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-primary" onClick={() => handleMethodSelect('click')}>
          <CardContent className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-12 w-12 text-primary" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,17.5C14.33,17.5 16.3,16.04 17.11,14H6.89C7.7,16.04 9.67,17.5 12,17.5M8.5,11A1.5,1.5 0 0,0 10,9.5A1.5,1.5 0 0,0 8.5,8A1.5,1.5 0 0,0 7,9.5A1.5,1.5 0 0,0 8.5,11M15.5,11A1.5,1.5 0 0,0 17,9.5A1.5,1.5 0 0,0 15.5,8A1.5,1.5 0 0,0 14,9.5A1.5,1.5 0 0,0 15.5,11M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
            </div>
            <h3 className="font-semibold">Quick Selection</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Simply click on the emotion you're currently feeling
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Emotional Check-In</span>
          {activeMethod && (
            <Button variant="ghost" size="sm" onClick={handleBackToMethods}>
              Change Method
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!activeMethod && renderMethodSelection()}
        
        {activeMethod === 'voice' && (
          <div className="space-y-4">
            {isScanning ? (
              <LiveVoiceScanner 
                onScanComplete={handleScanResult} 
                autoStart={true} 
                scanDuration={30} 
              />
            ) : (
              <Button onClick={() => setIsScanning(true)}>
                Start Voice Analysis
              </Button>
            )}
          </div>
        )}
        
        {/* Text and Click methods would go here */}
      </CardContent>
    </Card>
  );
};

export default UnifiedEmotionCheckin;
