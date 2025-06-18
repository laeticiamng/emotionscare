
import React from 'react';
import CoachChatContainer from '@/components/coach/CoachChatContainer';

const CoachChatPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <CoachChatContainer />
      </div>
    </div>
  );
};

export default CoachChatPage;
