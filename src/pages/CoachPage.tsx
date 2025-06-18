
import React from 'react';
import CoachChatContainer from '@/components/coach/CoachChatContainer';

const CoachPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Coach IA</h1>
      <CoachChatContainer />
    </div>
  );
};

export default CoachPage;
