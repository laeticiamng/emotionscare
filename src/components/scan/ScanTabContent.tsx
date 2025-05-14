
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EmotionScanForm from './EmotionScanForm';

const ScanTabContent: React.FC<{ onScanSaved?: () => void, onClose?: () => void }> = ({ 
  onScanSaved, 
  onClose 
}) => {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-4xl mx-auto">
      {user && (
        <EmotionScanForm 
          userId={user.id} 
          onScanSaved={onScanSaved} 
          onClose={onClose} 
        />
      )}
    </div>
  );
};

export default ScanTabContent;
