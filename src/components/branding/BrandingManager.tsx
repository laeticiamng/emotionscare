import React, { useState, useEffect } from 'react';
import { useBranding } from '@/hooks/useBranding';
import PredictiveInsightToast from '@/components/predictive/PredictiveInsightToast';
import { usePredictiveIntelligence } from '@/hooks/usePredictiveIntelligence';

// Need to augment the PredictionRecommendation type to include confidence
interface PredictionRecommendation {
  title: string;
  description: string;
  actionUrl?: string;
  actionLabel?: string;
  confidence: number; // Add confidence property
  category?: string;
  priority: number;
  type?: 'activity' | 'content' | 'insight';
}

const BrandingManager: React.FC = () => {
  const { branding, isLoading, error } = useBranding();
  const [showBrandingToast, setShowBrandingToast] = useState(false);
  
  useEffect(() => {
    if (branding && !isLoading) {
      // Show branding toast after a delay
      const timer = setTimeout(() => {
        setShowBrandingToast(true);
      }, 3000);
      
      // Clear timeout if component unmounts or branding changes
      return () => clearTimeout(timer);
    }
  }, [branding, isLoading]);

  // Predictive intelligence for notifications
  const { recommendations } = usePredictiveIntelligence();
  const [showPredictiveToast, setShowPredictiveToast] = useState(false);
  
  // Show predictive toast when recommendations change
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      const timer = setTimeout(() => {
        setShowPredictiveToast(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [recommendations]);
  
  return (
    <>
      {/* Branding toast */}
      {showBrandingToast && branding && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-card rounded-md shadow-lg p-4">
            <h2 className="text-lg font-semibold">{branding.title}</h2>
            <p className="text-sm text-muted-foreground">{branding.description}</p>
            <button 
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              onClick={() => setShowBrandingToast(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      
      {/* Predictive insights toast */}
      {showPredictiveToast && recommendations && recommendations.length > 0 && (
        <PredictiveInsightToast 
          recommendation={{
            ...recommendations[0],
            confidence: recommendations[0].confidence || 0.8  // Ensure confidence exists
          }}
          onClose={() => setShowPredictiveToast(false)}
        />
      )}
    </>
  );
};

export default BrandingManager;
