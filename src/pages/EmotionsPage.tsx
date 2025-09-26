import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Camera } from 'lucide-react';

export default function EmotionsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection automatique vers la nouvelle page de scan après un délai
    const timer = setTimeout(() => {
      navigate('/app/scan', { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center space-y-6 p-8">
        <div className="animate-bounce">
          <Camera className="h-16 w-16 mx-auto text-blue-600 mb-4" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">Page déplacée</h1>
          <p className="text-gray-600">
            La page Émotions a été intégrée dans notre nouveau module de scan émotionnel.
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Redirection en cours...</span>
          </div>
        </div>
      </div>
    </div>
  );
}