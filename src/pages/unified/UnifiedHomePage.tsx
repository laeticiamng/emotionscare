import React from 'react';

const UnifiedHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to EmotionsCare
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Your emotional wellness platform for a balanced life
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/50 dark:bg-white/5 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2">Emotion Scan</h3>
            <p className="text-muted-foreground">Analyze your emotions with our AI-powered scanner</p>
          </div>
          
          <div className="bg-white/50 dark:bg-white/5 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2">Music Therapy</h3>
            <p className="text-muted-foreground">Discover personalized music to enhance your mood</p>
          </div>
          
          <div className="bg-white/50 dark:bg-white/5 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2">Journal</h3>
            <p className="text-muted-foreground">Track your emotional journey with our smart journal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedHomePage;