import React from 'react';
import SocialCocoonTab from '@/components/dashboard/admin/tabs/SocialCocoonTab';

const B2BAdminSocialCocon: React.FC = () => {
  const mockData = {
    totalPosts: 128,
    moderationRate: 5,
    topHashtags: [
      { tag: '#bienetre', count: 42 },
      { tag: '#entraide', count: 36 },
      { tag: '#motivation', count: 31 }
    ]
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Modération SocialCocon</h1>
      <SocialCocoonTab socialCocoonData={mockData} />
    </div>
  );
};

export default B2BAdminSocialCocon;
