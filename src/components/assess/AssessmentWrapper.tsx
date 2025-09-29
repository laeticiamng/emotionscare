import React, { useState } from 'react';
import type { InstrumentCode } from '@/lib/assess/types';
import { AssessForm } from './AssessForm';
import { startAssess, submitAssess } from '@/lib/assess/client';
import { computeLevel, scoreToJson } from '@/lib/assess/scoring';

interface AssessmentWrapperProps {
  instrument: InstrumentCode;
  onComplete: (result: any) => void;
}

export const AssessmentWrapper: React.FC<AssessmentWrapperProps> = ({ 
  instrument, 
  onComplete 
}) => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    initializeAssessment();
  }, [instrument]);

  const initializeAssessment = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock session data for development
      const mockSession = {
        session_id: `mock-${Date.now()}`,
        items: generateMockItems(instrument),
        expiry_ts: Date.now() + 30 * 60 * 1000 // 30 minutes
      };
      
      setSession(mockSession);
    } catch (err) {
      setError('Impossible de démarrer l\'évaluation');
      console.error('Assessment initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockItems = (instrument: InstrumentCode) => {
    const items: any = {
      WHO5: [
        { id: '1', prompt: 'Je me suis senti(e) gai(e) et de bonne humeur', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Je me suis senti(e) calme et détendu(e)', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Je me suis senti(e) énergique et vigoureux(se)', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Je me suis réveillé(e) en me sentant frais/fraîche et dispos(e)', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Ma vie quotidienne a été remplie de choses qui m\'intéressent', type: 'scale', min: 0, max: 5 }
      ],
      STAI6: [
        { id: '1', prompt: 'Je me sens calme', type: 'scale', min: 1, max: 4 },
        { id: '2', prompt: 'Je me sens en sécurité', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Je suis tendu(e)', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Je me sens surmené(e)', type: 'scale', min: 1, max: 4 },
        { id: '5', prompt: 'Je me sens à l\'aise', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Je me sens bouleversé(e)', type: 'scale', min: 1, max: 4 }
      ],
      SAM: [
        { id: '1', prompt: 'Comment vous sentez-vous en ce moment ?', type: 'scale', min: 1, max: 9 }
      ],
      SUDS: [
        { id: '1', prompt: 'Quel est votre niveau d\'inconfort actuel ?', type: 'scale', min: 0, max: 10 }
      ],
      PANAS10: [
        { id: '1', prompt: 'Intéressé(e)', type: 'scale', min: 1, max: 5 },
        { id: '2', prompt: 'En détresse', type: 'scale', min: 1, max: 5 },
        { id: '3', prompt: 'Excité(e)', type: 'scale', min: 1, max: 5 },
        { id: '4', prompt: 'Contrarié(e)', type: 'scale', min: 1, max: 5 },
        { id: '5', prompt: 'Fort(e)', type: 'scale', min: 1, max: 5 },
        { id: '6', prompt: 'Coupable', type: 'scale', min: 1, max: 5 },
        { id: '7', prompt: 'Effrayé(e)', type: 'scale', min: 1, max: 5 },
        { id: '8', prompt: 'Hostile', type: 'scale', min: 1, max: 5 },
        { id: '9', prompt: 'Enthousiaste', type: 'scale', min: 1, max: 5 },
        { id: '10', prompt: 'Fier/fière', type: 'scale', min: 1, max: 5 }
      ],
      PSS10: [
        { id: '1', prompt: 'Au cours du dernier mois, combien de fois avez-vous été dérangé(e) par quelque chose qui est arrivé de façon inattendue ?', type: 'scale', min: 0, max: 4 },
        { id: '2', prompt: 'Au cours du dernier mois, combien de fois avez-vous senti que vous étiez incapable de contrôler les choses importantes de votre vie ?', type: 'scale', min: 0, max: 4 },
        { id: '3', prompt: 'Au cours du dernier mois, combien de fois vous êtes-vous senti(e) nerveux(se) et stressé(e) ?', type: 'scale', min: 0, max: 4 },
        { id: '4', prompt: 'Au cours du dernier mois, combien de fois avez-vous traité avec succès les petits problèmes irritants de la vie ?', type: 'scale', min: 0, max: 4 },
        { id: '5', prompt: 'Au cours du dernier mois, combien de fois avez-vous senti que vous faisiez face de manière efficace aux changements importants qui se produisaient dans votre vie ?', type: 'scale', min: 0, max: 4 },
        { id: '6', prompt: 'Au cours du dernier mois, combien de fois avez-vous été confiant(e) dans votre capacité à gérer vos problèmes personnels ?', type: 'scale', min: 0, max: 4 },
        { id: '7', prompt: 'Au cours du dernier mois, combien de fois avez-vous senti que les choses allaient dans votre sens ?', type: 'scale', min: 0, max: 4 },
        { id: '8', prompt: 'Au cours du dernier mois, combien de fois avez-vous trouvé que vous ne pouviez pas faire face à toutes les choses que vous deviez faire ?', type: 'scale', min: 0, max: 4 },
        { id: '9', prompt: 'Au cours du dernier mois, combien de fois avez-vous été capable de contrôler les irritations dans votre vie ?', type: 'scale', min: 0, max: 4 },
        { id: '10', prompt: 'Au cours du dernier mois, combien de fois avez-vous senti que vous dominiez la situation ?', type: 'scale', min: 0, max: 4 }
      ]
    };
    
    return items[instrument] || [];
  };

  const handleSubmit = async (responses: Record<string, number>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate level using validated scientific thresholds
      const level = computeLevel(instrument, responses);
      const result = scoreToJson(instrument, level);
      
      onComplete({
        ...result,
        responses,
        session_id: session?.session_id
      });
    } catch (err) {
      setError('Erreur lors de la soumission');
      console.error('Assessment submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'évaluation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={initializeAssessment}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Initialisation de l'évaluation...</p>
      </div>
    );
  }

  return (
    <AssessForm
      items={session.items}
      onSubmit={handleSubmit}
      instrument={instrument}
    />
  );
};