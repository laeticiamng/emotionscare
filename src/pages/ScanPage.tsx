
import React from 'react';
import { useScanPage } from '@/hooks/useScanPage';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import EmotionHistory from '@/components/scan/EmotionHistory';
import TeamOverview from '@/components/scan/TeamOverview';

const ScanPage = () => {
  const { users, loading, history, handleScanSaved } = useScanPage();

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Scan émotionnel</h1>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Personal scan form */}
          <EmotionScanForm onScanSaved={handleScanSaved} />
          
          {/* History */}
          <EmotionHistory history={history} />
          
          {/* Team overview */}
          <TeamOverview users={users} />
        </>
      )}
    </div>
  );
};

export default ScanPage;
