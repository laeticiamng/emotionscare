import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';

// Define the PredictionRecommendation type if it's not defined elsewhere
interface PredictionRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  confidence?: number; // Make confidence optional
}

const BrandingManager: React.FC = () => {
  // Use the branding context correctly
  const context = useBranding();
  
  // If you need branding, isLoading, and error properties from context
  // they should be accessed from context directly
  const { branding, isLoading, error } = context || { 
    branding: null, 
    isLoading: false, 
    error: null 
  };

  if (isLoading) {
    return <p>Loading branding...</p>;
  }

  if (error) {
    return <p>Error loading branding: {error}</p>;
  }

  if (!branding) {
    return <p>No branding available.</p>;
  }

  return (
    <div className="branding-container">
      <h1>{branding.appName}</h1>
      <p>{branding.tagline}</p>
      {branding.logoUrl && (
        <img src={branding.logoUrl} alt="Logo" style={{ maxWidth: '100px' }} />
      )}
      {branding.primaryColor && (
        <style>
          {`
            .branding-container {
              color: ${branding.primaryColor};
            }
          `}
        </style>
      )}
    </div>
  );
};

export default BrandingManager;
