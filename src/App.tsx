
import React from "react";

function App() {
  console.log('App rendering, React available:', !!React);
  console.log('React hooks available:', { 
    useState: !!React.useState, 
    useContext: !!React.useContext 
  });
  
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">EmotionsCare</h1>
          <p className="text-muted-foreground">Application is loading...</p>
          <div className="mt-4 text-sm text-gray-500">
            React Status: {React ? 'Available' : 'Not Available'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
