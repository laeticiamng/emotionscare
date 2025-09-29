
import { useState } from 'react';

const useWhisper = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    setIsTranscribing(true);
    setError(null);

    try {
      // Simulation de transcription audio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTranscription = "Transcription audio simulée";
      return mockTranscription;
    } catch (err) {
      setError('Erreur lors de la transcription');
      throw err;
    } finally {
      setIsTranscribing(false);
    }
  };

  return {
    transcribeAudio,
    isTranscribing,
    error
  };
};

export default useWhisper;
