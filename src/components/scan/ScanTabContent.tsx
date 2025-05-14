
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EmotionScanForm from './EmotionScanForm';

const ScanTabContent: React.FC<{ onScanSaved?: () => void, onClose?: () => void }> = ({ 
  onScanSaved, 
  onClose 
}) => {
  const { user } = useAuth(); // Import and use the Auth context to get the user

  return (
    <div className="w-full max-w-4xl mx-auto">
      <EmotionScanForm 
        userId={user?.id} 
        onScanSaved={onScanSaved} 
        onClose={onClose} 
      />
    </div>
  );
};

export default ScanTabContent;
